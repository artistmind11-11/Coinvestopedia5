import React, { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'featured' | 'interactive';
  className?: string;
  onClick?: () => void;
}

const CardComponent: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  className = '',
  onClick,
}) => {
  const isActionable = !!onClick;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isActionable) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
    [isActionable, onClick]
  );

  if (variant === 'featured') {
    return (
      <div
        className={`group relative overflow-hidden rounded-xl lg:rounded-2xl p-[1px] lg:p-[2px] w-full text-left transition-all duration-300 ${isActionable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:z-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background' : 'cursor-default'} ${className}`}
        onClick={onClick}
        role={isActionable ? 'button' : undefined}
        tabIndex={isActionable ? 0 : undefined}
        onKeyDown={handleKeyDown}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-300 z-0 animate-pulse-slow"></div>

        {/* Inner content with leather finish */}
        <div className="leather-card relative z-10 p-5 lg:p-6 rounded-xl lg:rounded-2xl h-full w-full transition-all duration-300">
          {children}
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    );
  }

  if (variant === 'interactive') {
    return (
      <div
        className={`group relative leather-card rounded-xl lg:rounded-2xl p-5 lg:p-6 text-left transition-all duration-300 w-full ${isActionable ? 'cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 hover:z-10' : ''} ${className}`}
        onClick={onClick}
        role={isActionable ? 'button' : undefined}
        tabIndex={isActionable ? 0 : undefined}
        onKeyDown={handleKeyDown}
      >
        {/* Top accent line that appears on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] lg:h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {children}
      </div>
    );
  }

  // Standard card with leather finish
  return (
    <div
      className={`group relative leather-card rounded-xl lg:rounded-2xl p-5 lg:p-6 text-left transition-all duration-300 w-full ${isActionable ? 'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-2 hover:shadow-xl cursor-pointer hover:z-10' : ''} ${className}`}
      onClick={onClick}
      role={isActionable ? 'button' : undefined}
      tabIndex={isActionable ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

export const Card = React.memo(CardComponent);
Card.displayName = 'Card';

export default Card;