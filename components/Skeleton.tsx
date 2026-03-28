import React from 'react';
import { cn } from '../utils/helpers';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  key?: React.Key;
}

export const Skeleton = ({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) => {
  const variantClasses = {
    text: 'h-4 rounded w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-zinc-800 animate-shimmer',
        variantClasses[variant],
        className
      )}
      style={{
        width: width && (typeof width === 'number' ? `${width}px` : width),
        height: height && (typeof height === 'number' ? `${height}px` : height),
      }}
    />
  );
};

interface CardSkeletonProps {
  className?: string;
  variant?: 'default' | 'featured' | 'interactive';
  key?: React.Key;
}

export const CardSkeleton = ({ className, variant = 'default' }: CardSkeletonProps) => {
  return (
    <div className={cn('rounded-2xl p-6 bg-zinc-900/50 border border-zinc-800', className)}>
      <div className="space-y-4">
        {/* Icon/Header */}
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={56} height={56} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 pt-4">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </div>

        {/* Progress bar (if featured) */}
        {variant === 'featured' && (
          <div className="pt-4">
            <Skeleton height={6} className="rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton = ({ rows = 5, columns = 4, className }: TableSkeletonProps) => {
  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height={20} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`cell-${rowIdx}-${colIdx}`} variant="text" />
          ))}
        </div>
      ))}
    </div>
  );
};

interface GridSkeletonProps {
  count?: number;
  columns?: number;
  className?: string;
}

export const GridSkeleton = ({ count = 6, columns = 3, className }: GridSkeletonProps) => {
  return (
    <div
      className={cn('grid gap-6', className)}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;