import React, { memo, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface IconCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'highlight';
  progress?: number;
  className?: string;
  graphic?: React.ReactNode;
}

const IconCardComponent: React.FC<IconCardProps> = ({
  icon,
  title,
  description,
  badge,
  href,
  onClick,
  variant = 'default',
  progress,
  className = '',
  graphic
}) => {
  const handleClick = useCallback(() => {
    if (onClick) onClick();
    if (href) window.location.href = href;
  }, [onClick, href]);
  
  return (
    <div 
      className={`group relative overflow-hidden rounded-xl lg:rounded-2xl p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 lg:hover:-translate-y-2 hover:scale-[1.01] lg:hover:scale-[1.02] h-full flex flex-col focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        variant === 'highlight' 
          ? 'bg-gradient-to-br from-primary/20 to-primary-dark/10 border-2 border-primary/50 hover:border-primary shadow-lg shadow-primary/10 backdrop-blur-sm' 
          : 'leather-card'
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Background glow effect for highlight variant */}
      {variant === 'highlight' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -top-10 -right-10 lg:-top-20 lg:-right-20 w-20 h-20 lg:w-40 lg:h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
        </>
      )}
      
      {/* Custom graphic */}
      {graphic && (
        <div className="absolute inset-0 pointer-events-none">
          {graphic}
        </div>
      )}
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 lg:top-4 lg:right-4 px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-md backdrop-blur-sm animate-pulse-slow z-10">
          {badge}
        </div>
      )}
      
      {/* Icon container */}
        <div className={`relative mb-3 lg:mb-4 w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-300 lg:group-hover:scale-110 lg:group-hover:rotate-3 flex-shrink-0 min-w-[44px] min-h-[44px] ${
        variant === 'highlight' 
          ? 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white shadow-lg shadow-primary/20' 
          : 'bg-[#181818] border border-white/5 text-primary group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20'
      }`}> 
          <div className="w-5 h-5 lg:w-7 lg:h-7 flex items-center justify-center" aria-hidden="true">
            {icon}
          </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col">
        <h3 className="font-bold text-base lg:text-lg text-text mb-1 lg:mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs lg:text-sm text-text-muted leading-relaxed mb-2 lg:mb-3 flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
};

export const IconCard = memo(IconCardComponent);
IconCard.displayName = 'IconCard';