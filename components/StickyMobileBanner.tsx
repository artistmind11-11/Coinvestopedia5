import React, { useState } from 'react';
import { AdUnit } from './AdUnit';
import { X } from 'lucide-react';

interface StickyMobileBannerProps {
  partner?: string;
}

export const StickyMobileBanner: React.FC<StickyMobileBannerProps> = ({ partner = 'binance' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="relative flex justify-center p-2">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 p-1.5 bg-background border border-border rounded-full text-text-muted hover:text-text z-10"
          aria-label="Close Advertisement"
        >
          <X size={14} />
        </button>
        <AdUnit size="mobile-banner" partner={partner} label="Ad" />
      </div>
    </div>
  );
};
