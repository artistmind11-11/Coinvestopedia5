import React from 'react';
import { ExternalLink } from 'lucide-react';

export const ForexHeatMap: React.FC = () => {
  return (
    <div className="leather-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-semibold text-sm text-text tracking-tight">
              Forex Heat Map
            </h3>
            <span className="text-[10px] px-2 py-1 rounded bg-violet-500/10 text-violet-400 font-medium border border-violet-500/20 uppercase tracking-widest">
              Forex
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-1 font-body">
            Currency strength matrix · Major pairs · Real-time
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-b border-border">
        <p className="text-sm text-text-muted font-body leading-relaxed">
          Cross-currency strength visualisation across all major pairs. Identifies the strongest and weakest currencies in real time — essential context for DXY analysis and macro regime positioning alongside crypto and commodity data.
        </p>
      </div>

      {/* iframe */}
      <div className="w-full bg-white overflow-x-auto">
        <iframe
          src={`https://www.tradingview.com/embed-widget/forex-heat-map/?locale=en#${encodeURIComponent(JSON.stringify({"width":"100%","height":"500","colorTheme":"dark","isTransparent":false,"locale":"en"}))}`}
          title="TradingView Forex Heat Map"
          style={{ minWidth: '600px', width: '100%', display: 'block', border: 'none' }}
          height={500}
          scrolling="no"
          loading="lazy"
          frameBorder={0}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-border flex-wrap gap-2 bg-surface/40">
        <span className="text-[10px] text-text-muted font-body">
          Forex data by TradingView · 28 major pairs
        </span>
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors font-body"
        >
          View on TradingView <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
