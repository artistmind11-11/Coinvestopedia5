import React, { useState } from 'react';

interface FilterChip {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onFilterChange?: (selected: string[]) => void;
  multiSelect?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ 
  chips, 
  onFilterChange,
  multiSelect = false 
}) => {
  const [selected, setSelected] = useState<string[]>(['all']);

  const handleClick = (id: string) => {
    let newSelected: string[];
    
    if (id === 'all') {
      newSelected = ['all'];
    } else if (multiSelect) {
      newSelected = selected.includes(id)
        ? selected.filter(s => s !== id && s !== 'all')
        : [...selected.filter(s => s !== 'all'), id];
      
      if (newSelected.length === 0) newSelected = ['all'];
    } else {
      newSelected = [id];
    }
    
    setSelected(newSelected);
    onFilterChange?.(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isSelected = selected.includes(chip.id);
        return (
          <button
            key={chip.id}
            onClick={() => handleClick(chip.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isSelected
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'bg-surface border border-border text-text-muted hover:border-primary/50 hover:text-text hover:scale-105'
            }`}
          >
            {chip.label}
            {chip.count !== undefined && (
              <span className={`ml-2 ${isSelected ? 'text-white/70' : 'text-text-muted/70'}`}>
                ({chip.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};