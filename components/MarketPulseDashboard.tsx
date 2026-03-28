import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Activity, Globe, Eye, LineChart as LineChartIcon, BarChart3, Newspaper } from 'lucide-react';
import { fetchFearAndGreed, generateMarketPulseInsights, fetchSectorPerformance } from '../services/api';
import { 
  TradingViewTimelineNews
} from './TradingViewWidgets';
import { SmartMoneyConfidenceWidget } from './SmartMoneyConfidenceWidget';
import { CryptoNewsFeed } from './CryptoNewsFeed';
import { ARTICLES } from '../pages/Insights';
import { PageRoute } from '../types';
// ─── Sub-Components ───────────────────────────────────────────────────────────

const FearGreedGauge: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchFearAndGreed().then(res => {
      if (res && res.length > 0) setData(res[0]);
    });
  }, []);

  const val = data?.value ? parseInt(data.value) : 50;
  const label = data?.value_classification || 'Neutral';
  const getColor = (v: number) => v < 25 ? '#EF4444' : v < 45 ? '#F59E0B' : v < 55 ? '#6B7280' : v < 75 ? '#10B981' : '#22C55E';
  const color = getColor(val);
  const angle = (val / 100) * 180;

  return (
    <div className="leather-card rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[220px]">
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Fear & Greed Index</p>
      
      {!data ? (
        <div className="animate-pulse flex flex-col items-center justify-center w-full h-full">
           <div className="w-32 h-16 bg-surface/50 rounded-t-full mb-4"></div>
           <div className="w-16 h-8 bg-surface/50 rounded mt-2"></div>
        </div>
      ) : (
        <>
          <div className="relative w-32 h-16 mx-auto mb-2">
            <svg viewBox="0 0 120 60" className="w-full h-full">
              <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" strokeLinecap="round" />
              <path d="M 10 55 A 50 50 0 0 1 35 12" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
              <path d="M 35 12 A 50 50 0 0 1 60 5" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
              <path d="M 60 5 A 50 50 0 0 1 85 12" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
              <path d="M 85 12 A 50 50 0 0 1 110 55" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
              <line
                x1="60" y1="55"
                x2={60 + 40 * Math.cos(Math.PI - (angle * Math.PI / 180))}
                y2={55 - 40 * Math.sin(Math.PI - (angle * Math.PI / 180))}
                stroke={color} strokeWidth="2.5" strokeLinecap="round"
              />
              <circle cx="60" cy="55" r="4" fill={color} />
            </svg>
          </div>
          <p className="text-2xl font-bold font-heading" style={{ color }}>{val}</p>
          <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color }}>{label}</p>
        </>
      )}
    </div>
  );
};


const MarketInsights: React.FC<{ onNavigate?: (route: PageRoute) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (ARTICLES.length === 0 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARTICLES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const article = ARTICLES.length > 0 ? ARTICLES[currentIndex] : null;
  
  const handleArticleClick = () => {
    if (article && onNavigate) {
      window.location.hash = `#${article.id}`;
      onNavigate(PageRoute.INSIGHTS);
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'geopolitics': return 'text-violet-400 bg-violet-400/10 border-violet-400/20';
      case 'regulation': return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'institutions': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'markets': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div 
      className="leather-card rounded-xl p-5 flex flex-col justify-center h-full min-h-[160px] relative overflow-hidden group cursor-pointer border border-transparent hover:border-border/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleArticleClick}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen size={80} />
      </div>
      
      {!article ? (
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-4 bg-surface/50 rounded w-1/3"></div>
          <div className="h-3 bg-surface/50 rounded w-full mt-2"></div>
          <div className="h-3 bg-surface/50 rounded w-5/6"></div>
          <div className="h-3 bg-surface/50 rounded w-4/6"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(article.category)}`}>
              <BookOpen size={14} /> 
              {article.category}
            </span>
            
            {/* Progress dots */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {ARTICLES.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-primary' : 'w-1 bg-border hover:bg-white/30'}`}
                  aria-label={`Go to insight ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h4 className="text-base font-bold text-text mb-1.5 group-hover:text-primary transition-colors">{article.title}</h4>
            <div className="text-sm text-text-muted leading-relaxed line-clamp-3">
              {article.desc}
            </div>
          </div>
          <div className="relative z-10 mt-3 flex items-center justify-between text-[11px] font-medium text-text-muted border-t border-border pt-3">
             <div className="flex items-center gap-1.5">
                <Clock size={12} /> {article.readTime}
             </div>
             <span>{article.date}</span>
          </div>
        </>
      )}
    </div>
  );
};


const SectorPerformanceCard: React.FC = () => {
  const [sectors, setSectors] = useState<any[]>([]);

  useEffect(() => {
    fetchSectorPerformance().then(data => {
      if (data && Array.isArray(data)) {
        // Exclude empty ones
        const validSectors = data.filter(s => s.market_cap > 0 && s.market_cap_change_24h !== null);
        // Show up to 8 as per requested grid layout
        setSectors(validSectors.slice(0, 8));
      }
    });
  }, []);

  return (
    <div className="leather-card rounded-xl p-5 relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Sector Performance (24H)</p>
        <BarChart3 size={16} className="text-text-muted" />
      </div>
      
      {sectors.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 animate-pulse flex-1">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-20 bg-surface/50 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {sectors.map(s => {
            const change = s.market_cap_change_24h || 0;
            const isUp = change >= 0;
            return (
              <div 
                key={s.id} 
                className={`p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all border
                  ${isUp 
                    ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10' 
                    : 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10'}
                `}
              >
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 opacity-80">
                  {s.name.replace(' Ecosystem', '').replace(' Platform', '')}
                </span>
                <span className={`text-lg font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{change.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export const MarketPulseDashboard: React.FC<{ onNavigate?: (route: PageRoute) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl lg:text-3xl font-bold text-text">Market Pulse</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> LIVE
            </span>
          </div>
          <p className="text-text-muted text-sm mt-1">
            Real-time aggregated metrics powered by TradingView.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-text-muted text-[10px]">
          <Clock size={12} />
          Last updated: live
        </div>
      </div>

      {/* Row 2: Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top: Smart Money Confidence (Full Width) */}
        <div className="md:col-span-2">
          <SmartMoneyConfidenceWidget />
        </div>

        {/* Left: Sector Performance (Tall) */}
        <div className="flex flex-col">
          <SectorPerformanceCard />
        </div>

        {/* Right: Fear & Greed + Market Performance (Stacked) */}
        <div className="flex flex-col gap-5">
          <FearGreedGauge />
          <MarketInsights onNavigate={onNavigate} />
        </div>
      </div>

      {/* Row 4: Dual Market Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-[500px] flex flex-col">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Globe size={18} className="text-primary"/> Global Market Timeline</h3>
          <div className="flex-1">
            <TradingViewTimelineNews />
          </div>
        </div>
        <div className="h-[500px] flex flex-col">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Newspaper size={18} className="text-primary"/> Crypto Market Timeline</h3>
          <div className="flex-1 min-h-0">
            <CryptoNewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulseDashboard;
