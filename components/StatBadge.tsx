import React from 'react';

interface StatBadgeProps {
  number: number | string;
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  trend?: number;
}

const StatBadgeComponent: React.FC<StatBadgeProps> = ({
  number,
  label,
  variant = 'default',
  size = 'md',
  trend
}) => {
  const variants = {
    default: 'bg-surface border-border text-text',
    primary: 'bg-primary/10 border-primary/30 text-primary',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
  };

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center px-4 py-3 rounded-xl border ${variants[variant]} hover:scale-105 transition-transform cursor-default group`}>
      <div className={`font-bold ${sizes[size]} mb-1 group-hover:scale-110 transition-transform`}>
        {number}
      </div>
      <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">{label}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-2 w-full justify-center">
            <svg width="40" height="15" viewBox="0 0 40 15" className="opacity-70 flex-shrink-0" aria-hidden="true">
              <path d={trend > 0 ? "M0,15 L10,8 L20,10 L30,2 L40,5" : "M0,2 L10,5 L20,2 L30,10 L40,12"} fill="none" stroke="currentColor" strokeWidth="2" className={trend > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className={`text-xs font-bold ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
        </div>
      )}
    </div>
  );
};

export const StatBadge = React.memo(StatBadgeComponent);
StatBadge.displayName = 'StatBadge';