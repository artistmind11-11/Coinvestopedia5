import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChevronUp, ChevronDown, Database, Search } from 'lucide-react';
import { cn } from '../utils/helpers';

export interface Column<T> {
  // Allow a virtual key for action columns or derived values (string allowed)
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  responsiveHide?: 'sm' | 'md' | 'lg';
  // Marks a column as an action column (non-sortable, right aligned by default)
  isAction?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  className?: string;
  emptyState?: {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
  };
  loading?: boolean;
  ariaLabel?: string;
  pagination?: {
    defaultPageSize?: number;
    pageSizeOptions?: number[];
    totalItems?: number;
    onPageChange?: (page: number, pageSize: number) => void;
  } | null;
  renderAfterRow?: (rowIndex: number, item: T) => React.ReactNode;
}

function TableComponent<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  striped = true,
  hoverable = true,
  compact = false,
  className,
  emptyState,
  loading = false,
  ariaLabel,
  pagination = null,
  renderAfterRow,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [sortMessage, setSortMessage] = useState('');
  const [pageMessage, setPageMessage] = useState('');

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    if (!sortKey) return;
    const readableColumn = columns.find(c => c.key === sortKey)?.label || String(sortKey);
    setSortMessage(`Sorted by ${readableColumn}, ${sortOrder === 'asc' ? 'ascending' : 'descending'}`);
  }, [sortKey, sortOrder, columns]);

  let sortedData = [...data];
  if (sortKey) {
    sortedData.sort((a, b) => {
      // Allow virtual keys (useful for numeric keys or derived values)
      const aVal = (a as any)[sortKey as any];
      const bVal = (b as any)[sortKey as any];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const hasPagination = !!pagination;
  const isServerSide = typeof pagination?.totalItems === 'number';
  
  const defaultPageSize = pagination?.defaultPageSize ?? (pagination?.pageSizeOptions && pagination?.pageSizeOptions.length ? pagination.pageSizeOptions[0] : 10);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize || 10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // If page size changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const totalRows = isServerSide ? (pagination?.totalItems || 0) : sortedData.length;
  
  const visibleStart = hasPagination ? (currentPage - 1) * pageSize + 1 : 1;
  const visibleEnd = hasPagination ? Math.min(visibleStart + pageSize - 1, totalRows) : totalRows;
  const totalPages = hasPagination ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;
  
  // Slice data only if client-side pagination
  if (hasPagination && !isServerSide) {
    const start = (currentPage - 1) * pageSize;
    sortedData = sortedData.slice(start, start + pageSize);
  }

  useEffect(() => {
    if (!hasPagination) return;
    setPageMessage(`Showing page ${currentPage} of ${totalPages}`);
  }, [currentPage, pageSize, totalPages, hasPagination]);

  const handlePrevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    pagination?.onPageChange?.(newPage, pageSize);
  };

  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
    pagination?.onPageChange?.(newPage, pageSize);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    // When page size changes, we go back to page 1
    pagination?.onPageChange?.(1, newSize);
  };

  const getResponsiveClass = (column: Column<T>) => {
    if (!column.responsiveHide) return '';
    switch (column.responsiveHide) {
      case 'sm': return 'hidden sm:table-cell';
      case 'md': return 'hidden md:table-cell';
      case 'lg': return 'hidden lg:table-cell';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className={cn('w-full overflow-x-auto rounded-lg border border-border', className)}>
        <div className="animate-pulse">
          <div className="bg-surface h-12 rounded-t-lg"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 border-b border-border bg-surface/50"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className={cn('w-full rounded-lg border border-border bg-surface/50 p-8 text-center', className)}>
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {emptyState?.icon || <Database size={24} className="text-primary" />}
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            {emptyState?.title || 'No data available'}
          </h3>
          <p className="text-text-muted text-sm mb-6">
            {emptyState?.description || 'There is no data to display at the moment.'}
          </p>
          <div className="text-xs text-text-muted">
            Try adjusting your filters or check back later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border', className)} role="table" aria-label={ariaLabel || className || 'Data table'}>
      <div className="min-w-full inline-block align-middle">
        <table className="w-full">
          <thead>
            <tr className="bg-surface border-b border-border">
                {columns.map((column) => {
                  const isActionCol = !!column.isAction;
                  const sortable = !!column.sortable && !isActionCol;
                  return (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider align-middle',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    sortable && 'cursor-pointer hover:text-text select-none',
                    isActionCol && 'text-right',
                    getResponsiveClass(column)
                  )}
                  style={{ width: column.width }}
                  aria-sort={sortKey === column.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  {sortable ? (
                    <button
                      className={cn('flex items-center gap-2 w-full text-left', getResponsiveClass(column))}
                      onClick={() => sortable && handleSort(column.key)}
                      aria-label={`Sort by ${column.label}`}
                      aria-pressed={sortKey === column.key}
                    >
                      <span>{column.label}</span>
                      {column.sortable && sortKey === column.key && (
                        sortOrder === 'asc' ? (
                          <ChevronUp size={16} className="text-primary" aria-label="sorted ascending" />
                        ) : (
                          <ChevronDown size={16} className="text-primary" aria-label="sorted descending" />
                        )
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-2"><span>{column.label}</span></span>
                  )}
                </th>
                );
                })}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr
                  className={cn(
                    'border-b border-border transition-colors min-h-[44px]',
                    striped && rowIndex % 2 === 0 && 'bg-surface/30',
                    hoverable && 'hover:bg-surface/70',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (!onRowClick) return;
                    // Make rows keyboard accessible: Enter or Space
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }}
                  role="row"
                  aria-rowindex={visibleStart + rowIndex}
                >
                  {columns.map((column) => {
                    const isActionCol = !!column.isAction;
                    return (
                      <td
                      key={String(column.key)}
                      className={cn(
                        'px-4 text-sm text-text align-middle',
                        compact ? 'py-2' : 'py-3',
                        column.align === 'center' && 'text-center',
                        (column.align === 'right' || isActionCol) && 'text-right',
                        getResponsiveClass(column)
                      )}
                      style={{ width: column.width }}
                      role="cell"
                    >
                      {column.render
                        ? column.render((item as any)[column.key as any], item)
                        : (isActionCol ? null : (item as any)[column.key as any])}
                      </td>
                    );
                  })}
                </tr>
                {renderAfterRow?.(rowIndex, item)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {/* Announce sorting changes and page changes for screen readers */}
        <div className="sr-only" role="status" aria-live="polite">{sortMessage}</div>
        <div className="sr-only" role="status" aria-live="polite">{pageMessage}</div>
      </div>
      <div className="px-4 py-3 border-t border-border bg-surface/50 text-xs text-text-muted flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {hasPagination ? (
            <span>Showing {visibleStart}-{visibleEnd} of {totalRows}</span>
          ) : (
            <span>Showing {totalRows} {totalRows === 1 ? 'row' : 'rows'}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Scroll horizontally for more columns →</span>
          <span className="sm:hidden">Swipe → for more</span>
        </div>
      </div>

      {/* Pagination controls */}
      {hasPagination && (
        <div className="px-4 py-3 border-t border-border bg-surface/50 text-xs text-text-muted flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={cn('p-2 rounded-md', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface/60')}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-xs">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={cn('p-2 rounded-md', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface/60')}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {pagination?.pageSizeOptions && (
              <label className="flex items-center gap-2 text-xs text-text-muted">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="bg-transparent border border-border rounded px-2 py-1 text-xs"
                  aria-label="Rows per page"
                >
                  {pagination.pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Memoize to avoid unnecessary re-renders when props/data don't change
export const Table = React.memo(TableComponent) as typeof TableComponent;
(Table as any).displayName = 'Table';
export default Table;