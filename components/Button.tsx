import React, { forwardRef, memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isFullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  'aria-label'?: string;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const variantClasses = {
  primary:
    'bg-primary text-white hover:bg-primary-dark disabled:bg-primary/50 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 focus-visible:ring-4 focus-visible:ring-primary/30',
  secondary:
    'bg-surface border border-border text-text hover:border-primary/50 hover:text-primary disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-primary/20',
  ghost: 'text-text hover:bg-surface disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-primary/20',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-red-500/30',
  success:
    'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-green-500/30',
  warning:
    'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-amber-500/30',
};

const sizeClasses = {
  // Ensure min-target sizes align with accessibility recommendations (44x44px)
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg min-h-[44px] min-w-[44px]',
  md: 'px-6 py-2.5 text-sm font-semibold rounded-lg min-h-[44px] min-w-[44px]',
  lg: 'px-8 py-3 text-base font-semibold rounded-xl min-h-[48px] min-w-[48px]',
  xl: 'px-10 py-4 text-lg font-bold rounded-xl min-h-[56px] min-w-[56px]',
};

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      icon,
      iconPosition = 'left',
      className,
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Dev-time accessibility checks
    if (process.env.NODE_ENV !== 'production') {
      const isIconOnly = !children && !!icon;
      if (isIconOnly && !ariaLabel) {
        // eslint-disable-next-line no-console
        console.warn('Button: icon-only buttons should have an aria-label for accessibility');
      }
    }

    const buttonClasses = cn(
      'inline-flex items-center justify-center gap-2 transition-all duration-200',
      'focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-60',
      'active:scale-95',
      variantClasses[variant],
      sizeClasses[size],
      isFullWidth && 'w-full',
      isLoading && 'relative',
      className
    );

    // Keep decorative icon screen-reader-hidden
    // Fix: cast to ReactElement<any> to allow arbitrary props like aria-hidden
    const safeIconElement = icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { 'aria-hidden': true }) : icon;

    const iconElement = isLoading ? (
      <svg 
        className="animate-spin h-4 w-4" 
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="status"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ) : (
      safeIconElement
    );

    const computedAriaLabel = ariaLabel || (isLoading ? `Loading ${children}` : undefined);

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        aria-label={computedAriaLabel}
        aria-busy={isLoading}
        {...props}
      >
        {/* Overlay spinner while loading */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            {iconElement}
          </span>
        )}

        {/* Screen-reader text, visible content hidden visually when loading */}
        {isLoading && <span className="sr-only">Loading...</span>}

        <span className={cn(isLoading ? 'opacity-0' : '', 'inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap')} aria-hidden={isLoading}>
          {iconElement && iconPosition === 'left' && iconElement}
          {children}
          {iconElement && iconPosition === 'right' && iconElement}
        </span>
      </button>
    );
  }
);

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);