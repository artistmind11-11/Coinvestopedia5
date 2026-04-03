import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface NativeSponsoredCardProps {
  partner: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon?: React.ReactNode;
}

export const NativeSponsoredCard: React.FC<NativeSponsoredCardProps> = ({ partner, title, description, ctaLabel, href, icon }) => {
  return (
    <div className="flex flex-col group cursor-pointer h-full transition-all duration-300 leather-card border-border rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 shrink-0">
        <span className="px-2 py-1 bg-surface border border-border text-[9px] rounded font-bold text-text-muted uppercase tracking-widest">
           Sponsored
        </span>
      </div>
      <div className="flex justify-between items-start mb-6">
         <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon || <ExternalLink size={24} />}
         </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
         {title}
      </h3>
      
      <p className="text-text-muted text-sm mb-8 flex-grow">
         {description}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto w-full">
         <a 
           href={href} 
           target="_blank" 
           rel="noopener sponsored" 
           className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
         >
           {ctaLabel} <ExternalLink size={14} />
         </a>
      </div>
    </div>
  );
};
