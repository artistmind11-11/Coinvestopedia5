import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/helpers';

interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export const Select = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  size = 'md',
  error,
  disabled,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between bg-input-bg border rounded-lg transition-all duration-200',
            'text-text',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-border hover:border-border/80',
            sizeClasses[size]
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedOption?.icon && selectedOption.icon}
            <span className="whitespace-nowrap truncate">{selectedOption?.label || placeholder}</span>
          </div>
          <ChevronDown
            size={16}
            className={cn(
              'transition-transform duration-200 text-text-muted',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 min-w-full bg-surface border border-border rounded-lg shadow-lg shadow-black/10 z-[100] animate-slide-down overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors',
                  'hover:bg-primary/5 focus:bg-primary/5 focus:outline-none text-text',
                  value === option.value && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                {option.icon && option.icon}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;