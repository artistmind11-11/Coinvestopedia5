import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface AffiliateCTAProps {
  partner: string;
  text: string;
  subtext?: string;
  ctaLabel: string;
  href: string;
  variant?: 'banner' | 'card';
  icon?: React.ReactNode;
  className?: string;
}

export const AffiliateCTA: React.FC<AffiliateCTAProps> = ({ 
  partner, text, subtext, ctaLabel, href, variant = 'banner', icon, className = '' 
}) => {
  return (
    <div className={`leather-card border-l-4 border-l-primary p-4 lg:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
        <div className="flex items-start gap-4 flex-1">
            {icon && (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0">
                    {icon}
                </div>
            )}
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Sponsored integration • {partner}</span>
               </div>
               <h4 className="text-base lg:text-lg font-bold text-text mb-1">{text}</h4>
               {subtext && <p className="text-sm text-text-muted">{subtext}</p>}
            </div>
        </div>
        <a 
          href={href} 
          target="_blank" 
          rel="noopener sponsored" 
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-light transition-colors w-full md:w-auto"
        >
           {ctaLabel} <ExternalLink size={16} />
        </a>
    </div>
  );
};
