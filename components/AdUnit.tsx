import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Info, ShieldAlert } from 'lucide-react';

export type AdSize = 'medium' | 'large' | 'skyscraper' | 'leaderboard' | 'mobile-banner';
export type AdPartner = 'binance' | 'bybit' | 'ledger' | 'coinledger' | 'glassnode' | 'tradingview' | 'nordvpn';

export interface AdUnitProps {
  size?: AdSize;
  partner?: AdPartner;
  label?: string;
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ 
  size = 'medium', 
  partner = 'binance',
  label = 'Advertisement',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Lazy loading logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1, rootMargin: '100px' });

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Format dimensions based on industry standard ad sizes
  const dimensions = {
    'medium': { w: 300, h: 250, desc: 'Medium Rectangle' },
    'large': { w: 336, h: 280, desc: 'Large Rectangle' },
    'skyscraper': { w: 300, h: 600, desc: 'Half-Page Skyscraper' },
    'leaderboard': { w: 728, h: 90, desc: 'Leaderboard' },
    'mobile-banner': { w: 320, h: 50, desc: 'Mobile Banner' }
  }[size];

  // Map partners to branding colors/names for mockup purposes
  const partnerConfig: Record<AdPartner, { name: string, color: string, url: string }> = {
    'binance': { name: 'Binance', color: '#FCD535', url: '#' },
    'bybit': { name: 'Bybit', color: '#F7A600', url: '#' },
    'ledger': { name: 'Ledger', color: '#000000', url: '#' },
    'coinledger': { name: 'CoinLedger', color: '#00E676', url: '#' },
    'glassnode': { name: 'Glassnode', color: '#1A73E8', url: '#' },
    'tradingview': { name: 'TradingView', color: '#2962FF', url: '#' },
    'nordvpn': { name: 'NordVPN', color: '#0047FF', url: '#' },
  };

  const config = partnerConfig[partner];
  
  const minHeightStyle = { minHeight: `${dimensions.h}px` };
  
  return (
    <div 
      ref={placeholderRef}
      className={`relative flex flex-col items-center my-4 ${className}`}
      style={minHeightStyle}
    >
      <div className="flex items-center gap-2 mb-1 opacity-50 w-full max-w-full justify-start pl-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">
          {label}
        </span>
        <Info size={10} className="text-[#888888]" />
      </div>

      {isVisible ? (
        <a 
          href={config.url}
          target="_blank"
          rel="noopener sponsored"
          className="relative block w-full max-w-full overflow-hidden border border-border/40 rounded-sm bg-[#121215] flex flex-col items-center justify-center group hover:border-[#333333] transition-colors"
          style={{ width: dimensions.w > 720 ? '100%' : `${dimensions.w}px`, height: `${dimensions.h}px`, maxWidth: '100%' }}
        >
          {/* Ad Mockup Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwIi8+CjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiLz4KPC9zdmc+')] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-4">
             <div 
                className="w-[40px] h-[40px] rounded-md mb-3 flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: config.color, color: config.name === 'Binance' || config.name === 'Bybit' ? '#000' : '#fff' }}
             >
                {config.name.charAt(0)}
             </div>
             
             {size !== 'mobile-banner' && size !== 'leaderboard' && (
                 <>
                    <h4 className="text-[#cccccc] font-bold mb-1 tracking-tight">{config.name}</h4>
                    <p className="text-[11px] text-[#888888] font-mono mb-4 w-3/4">
                       Trade anywhere. Secure your crypto.
                    </p>
                    <span className="px-3 py-1.5 border border-[#333333] rounded text-xs font-bold text-[#888888] group-hover:bg-[#222222] transition-colors flex items-center gap-1">
                       Explore <ExternalLink size={10} />
                    </span>
                 </>
             )}
             
             {(size === 'leaderboard' || size === 'mobile-banner') && (
                 <div className="flex items-center gap-3">
                     <h4 className="text-[#cccccc] font-bold text-sm tracking-tight">{config.name}</h4>
                     <span className="text-xs text-primary hidden sm:inline">Learn More &rarr;</span>
                 </div>
             )}
          </div>
          
          <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-[#000000] border border-[#333333] rounded-sm flex items-center gap-1 opacity-40">
             <ShieldAlert size={8} className="text-accent" />
             <span className="text-[8px] font-mono text-[#888888]">{dimensions.w}x{dimensions.h}</span>
          </div>
        </a>
      ) : (
        <div 
          className="w-full bg-[#09090b] border border-dashed border-[#333333] rounded-sm animate-pulse flex items-center justify-center"
          style={{ width: dimensions.w > 720 ? '100%' : `${dimensions.w}px`, height: `${dimensions.h}px`, maxWidth: '100%' }}
        />
      )}
    </div>
  );
};