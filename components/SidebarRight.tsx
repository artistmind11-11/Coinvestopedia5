import React, { useState, useEffect } from 'react';
import { AdUnit } from './AdUnit';
import { getMarketInsight, InsightResult } from '../services/geminiService';
import { Sparkles, ArrowUpRight, ExternalLink } from 'lucide-react';

export const SidebarRight: React.FC = () => {
  const [insight, setInsight] = useState<InsightResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoading(true);
      const result = await getMarketInsight('current crypto market');
      setInsight(result);
      setIsLoading(false);
    };
    fetchInsight();
  }, []);

  return (
    <aside className="hidden lg:flex flex-col gap-8 w-[300px] sticky top-[96px] self-start h-fit">
      {/* Ad Unit 1: Sticky/Top */}
      <AdUnit size="medium" partner="kucoin" label="Official Partner" />

      {/* AI Insight Widget */}
      <div className="leather-card rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles size={64} />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-primary" size={20} />
          <h3 className="font-bold text-text">AI Market Pulse</h3>
        </div>
        
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
            <div className="h-4 bg-white/10 rounded w-4/6"></div>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              {insight?.text}
            </p>
            {insight?.sources && insight.sources.length > 0 && (
              <div className="mb-4 pt-3 border-t border-white/5">
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">Sources</p>
                <div className="flex flex-col gap-1">
                  {insight.sources.slice(0, 3).map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary truncate hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={10} />
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              FULL REPORT <ArrowUpRight size={12} />
            </button>
          </>
        )}
      </div>

      {/* Trending List */}
      <div className="leather-card rounded-xl p-6">
        <h3 className="font-bold text-text mb-4 border-b border-white/5 pb-2">Trending Now 🔥</h3>
        <ul className="flex flex-col gap-3">
          {[
            { name: 'Bitcoin', symbol: 'BTC', change: '+2.4%' },
            { name: 'Solana', symbol: 'SOL', change: '+5.8%' },
            { name: 'Pepe', symbol: 'PEPE', change: '+12.1%' }
          ].map((coin, i) => (
            <li key={i} className="flex justify-between items-center text-sm">
              <span className="text-text-muted font-medium"><span className="text-text">{i + 1}.</span> {coin.name}</span>
              <span className="text-primary">{coin.change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ad Unit 4: Sticky Bottom */}
      <div className="sticky top-8">
         <AdUnit size="skyscraper" partner="trezor" label="Security" />
      </div>
    </aside>
  );
};
