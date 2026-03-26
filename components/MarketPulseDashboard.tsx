import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, ArrowUp, ArrowDown, Activity, Zap,
  Globe, BarChart3, DollarSign, Clock, Eye, Flame, ChevronRight,
  BookOpen, LineChart as LineChartIcon
} from 'lucide-react';

// ─── Mock Data Generation Helpers ─────────────────────────────────────────────

const randomWalk = (start: number, len: number, volatility = 2, drift = 0) => {
  let val = start;
  return Array.from({ length: len }).map(() => {
    val += (Math.random() - 0.5 + drift) * volatility;
    return parseFloat(val.toFixed(2));
  });
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const GLOBAL_METRICS = [
  { id: 'mcap', label: 'Total Market Cap', value: '$2.87T', change: 2.4, prev: '$2.80T', sparkData: randomWalk(2800, 24, 30, 0.3) },
  { id: 'vol', label: '24h Volume', value: '$142.6B', change: 18.7, prev: '$120.1B', sparkData: randomWalk(120, 24, 8, 0.5) },
  { id: 'dom', label: 'BTC Dominance', value: '54.2%', change: -0.8, prev: '54.6%', sparkData: randomWalk(54.6, 24, 0.3, -0.02) },
  { id: 'eth', label: 'ETH Gas (Gwei)', value: '12', change: -32.1, prev: '18', sparkData: randomWalk(18, 24, 3, -0.2) },
];

const TRENDING_ASSETS = [
  { name: 'BTC', price: '$97,842', change: 2.4, icon: '₿' },
  { name: 'ETH', price: '$3,456', change: 1.8, icon: 'Ξ' },
  { name: 'SOL', price: '$178.32', change: 5.2, icon: '◎' },
  { name: 'LINK', price: '$18.94', change: -1.3, icon: '⬡' },
  { name: 'AVAX', price: '$42.67', change: 3.7, icon: '🔺' },
  { name: 'MATIC', price: '$0.89', change: -2.1, icon: '⬟' },
  { name: 'DOT', price: '$8.12', change: 0.9, icon: '●' },
  { name: 'ADA', price: '$0.68', change: -0.4, icon: '◇' },
];

const FEAR_GREED = { value: 72, label: 'Greed', yesterday: 65, lastWeek: 58, lastMonth: 45 };

const SECTOR_PERFORMANCE = [
  { sector: 'DeFi', change: 4.2, mcap: '$98B', volume: '$12.4B', topAsset: 'AAVE' },
  { sector: 'Layer 1', change: 2.1, mcap: '$1.2T', volume: '$45B', topAsset: 'ETH' },
  { sector: 'Layer 2', change: 6.8, mcap: '$42B', volume: '$8.2B', topAsset: 'ARB' },
  { sector: 'Gaming', change: -1.4, mcap: '$18B', volume: '$3.1B', topAsset: 'IMX' },
  { sector: 'AI', change: 8.9, mcap: '$32B', volume: '$6.7B', topAsset: 'FET' },
  { sector: 'Meme', change: 12.3, mcap: '$67B', volume: '$18.9B', topAsset: 'PEPE' },
  { sector: 'RWA', change: 3.4, mcap: '$12B', volume: '$1.8B', topAsset: 'ONDO' },
  { sector: 'Privacy', change: -3.2, mcap: '$4.2B', volume: '$890M', topAsset: 'XMR' },
];

const MARKET_EVENTS = [
  { time: '2m ago', event: 'BTC breaks above $97,800 resistance', type: 'bullish' as const },
  { time: '14m ago', event: '$2.4B in options expiring Friday', type: 'neutral' as const },
  { time: '28m ago', event: 'Grayscale ETF sees $340M inflows', type: 'bullish' as const },
  { time: '1h ago', event: 'SEC delays spot ETH ETF decision', type: 'bearish' as const },
  { time: '2h ago', event: 'Whale accumulates 1,200 BTC on dip', type: 'bullish' as const },
];

// Generate 7-day BTC price history for the main chart
const BTC_PRICE_HISTORY = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let price = 94200;
  return Array.from({ length: 168 }).map((_, i) => { // 24 * 7 = 168 hourly points
    price += (Math.random() - 0.46) * 300;
    const vol = Math.random() * 8 + 2;
    return {
      time: `${days[Math.floor(i / 24)]} ${(i % 24).toString().padStart(2, '0')}:00`,
      label: i % 24 === 0 ? days[Math.floor(i / 24)] : '',
      price: parseFloat(price.toFixed(0)),
      volume: parseFloat(vol.toFixed(1)),
      ma7: 0, // Will be filled below
      ma25: 0,
    };
  });
})();
// Fill moving averages
BTC_PRICE_HISTORY.forEach((d, i, arr) => {
  const slice7 = arr.slice(Math.max(0, i - 6), i + 1);
  const slice25 = arr.slice(Math.max(0, i - 24), i + 1);
  d.ma7 = parseFloat((slice7.reduce((s, x) => s + x.price, 0) / slice7.length).toFixed(0));
  d.ma25 = parseFloat((slice25.reduce((s, x) => s + x.price, 0) / slice25.length).toFixed(0));
});


// ─── Sub-Components ───────────────────────────────────────────────────────────

const MetricCard: React.FC<{ metric: typeof GLOBAL_METRICS[0] }> = ({ metric }) => {
  const isUp = metric.change >= 0;
  const accentColor = isUp ? '#10B981' : '#EF4444';
  const chartData = metric.sparkData.map((v, i) => ({ v, i }));

  return (
    <div className="leather-card rounded-xl p-4 relative overflow-hidden group hover:border-primary/30 transition-colors cursor-default">
      <div className="flex items-start justify-between mb-1 relative z-10">
        <div>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{metric.label}</p>
          <p className="text-xl md:text-2xl font-bold font-heading mt-1" style={{ color: accentColor }}>{metric.value}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(metric.change)}%
        </div>
      </div>
      <p className="text-[10px] text-text-muted relative z-10">prev: {metric.prev}</p>
      {/* Sparkline */}
      <div className="h-10 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={accentColor} strokeWidth={1.5} fill={`url(#grad-${metric.id})`} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const FearGreedGauge: React.FC = () => {
  const val = FEAR_GREED.value;
  const getColor = (v: number) => v < 25 ? '#EF4444' : v < 45 ? '#F59E0B' : v < 55 ? '#6B7280' : v < 75 ? '#10B981' : '#22C55E';
  const color = getColor(val);
  // Gauge as a semi-circle using SVG
  const angle = (val / 100) * 180;

  return (
    <div className="leather-card rounded-xl p-5 text-center flex flex-col items-center justify-center">
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Fear & Greed Index</p>
      <div className="relative w-32 h-16 mx-auto mb-2">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          {/* Background arc */}
          <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" strokeLinecap="round" />
          {/* Colored arc sections */}
          <path d="M 10 55 A 50 50 0 0 1 35 12" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
          <path d="M 35 12 A 50 50 0 0 1 60 5" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
          <path d="M 60 5 A 50 50 0 0 1 85 12" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
          <path d="M 85 12 A 50 50 0 0 1 110 55" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" strokeOpacity={0.4} />
          {/* Needle */}
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
      <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color }}>{FEAR_GREED.label}</p>
      <div className="flex gap-4 mt-3 text-[10px] text-text-muted">
        <span>Yesterday: <span className="text-text font-bold">{FEAR_GREED.yesterday}</span></span>
        <span>Last Week: <span className="text-text font-bold">{FEAR_GREED.lastWeek}</span></span>
      </div>
    </div>
  );
};

const SectorHeatmap: React.FC = () => {
  const max = Math.max(...SECTOR_PERFORMANCE.map(s => Math.abs(s.change)));

  return (
    <div className="leather-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Sector Performance (24h)</p>
        <BarChart3 size={14} className="text-text-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SECTOR_PERFORMANCE.map(s => {
          const intensity = Math.abs(s.change) / max;
          const bg = s.change >= 0
            ? `rgba(16,185,129,${0.08 + intensity * 0.25})`
            : `rgba(239,68,68,${0.08 + intensity * 0.25})`;
          const textColor = s.change >= 0 ? '#10B981' : '#EF4444';
          return (
            <div
              key={s.sector}
              className="rounded-lg p-3 flex flex-col items-center justify-center cursor-default hover:scale-[1.03] transition-transform"
              style={{ background: bg }}
              title={`${s.sector}: MCap ${s.mcap}, Vol ${s.volume}, Top: ${s.topAsset}`}
            >
              <p className="text-[11px] font-bold text-text-muted truncate w-full text-center">{s.sector}</p>
              <p className="text-sm md:text-base font-bold mt-1" style={{ color: textColor }}>
                {s.change >= 0 ? '+' : ''}{s.change}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrendingTicker: React.FC = () => (
  <div className="leather-card rounded-xl p-4 overflow-hidden">
    <div className="flex items-center gap-2 mb-3">
      <Flame size={14} className="text-amber-400" />
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Trending Assets</p>
    </div>
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
      {TRENDING_ASSETS.map(a => (
        <div key={a.name} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors">
          <span className="text-base">{a.icon}</span>
          <div>
            <p className="text-xs font-bold text-text">{a.name}</p>
            <p className="text-[10px] text-text-muted">{a.price}</p>
          </div>
          <span className={`text-[11px] font-bold ml-1 ${a.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {a.change >= 0 ? '+' : ''}{a.change}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

const MarketEventsFeed: React.FC = () => (
  <div className="leather-card rounded-xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Zap size={14} className="text-primary" />
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Live Market Events</p>
      <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> LIVE
      </span>
    </div>
    <div className="space-y-3">
      {MARKET_EVENTS.map((e, i) => (
        <div key={i} className="flex items-start gap-3 group cursor-default">
          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
            e.type === 'bullish' ? 'bg-emerald-400' : e.type === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text group-hover:text-primary transition-colors leading-snug">{e.event}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{e.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── TIME RANGE SELECTOR ──────────────────────────────────────────────────────

type TimeRange = '24h' | '7d' | '30d' | '90d';

const PriceChart: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('7d');
  const ranges: TimeRange[] = ['24h', '7d', '30d', '90d'];

  // Slice the chart data based on range
  const chartData = useMemo(() => {
    const sliceMap = { '24h': 24, '7d': 168, '30d': 168, '90d': 168 };
    return BTC_PRICE_HISTORY.slice(-sliceMap[range]);
  }, [range]);

  const minPrice = Math.min(...chartData.map(d => d.price)) - 200;
  const maxPrice = Math.max(...chartData.map(d => d.price)) + 200;
  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const startPrice = chartData[0]?.price || 0;
  const priceChange = ((currentPrice - startPrice) / startPrice * 100);
  const isUp = priceChange >= 0;

  return (
    <div className="leather-card rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Bitcoin Price</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {isUp ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
          <p className="text-2xl font-bold font-heading mt-1">${currentPrice.toLocaleString()}</p>
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase tracking-wider ${
                range === r ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? '#10B981' : '#EF4444'} stopOpacity={0.2} />
                <stop offset="100%" stopColor={isUp ? '#10B981' : '#EF4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(16,185,129,0.3)', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: 'rgba(10,10,14,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = { price: 'Price', ma7: 'MA(7)', ma25: 'MA(25)', volume: 'Vol (B)' };
                return [`$${value.toLocaleString()}`, labels[name] || name];
              }}
            />
            <Area type="monotone" dataKey="price" stroke={isUp ? '#10B981' : '#EF4444'} strokeWidth={2} fill="url(#priceGrad)" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="ma7" stroke="#F59E0B" strokeWidth={1} strokeDasharray="4 2" dot={false} isAnimationActive={false} strokeOpacity={0.5} />
            <Line type="monotone" dataKey="ma25" stroke="#8B5CF6" strokeWidth={1} strokeDasharray="4 2" dot={false} isAnimationActive={false} strokeOpacity={0.5} />
            <Bar dataKey="volume" fill="rgba(16,185,129,0.15)" barSize={3} yAxisId="volume" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-3 text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-emerald-400 rounded inline-block" /> Price</span>
        <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-amber-400 rounded inline-block" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #F59E0B 0 4px, transparent 4px 6px)' }} /> MA(7)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-violet-400 rounded inline-block" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #8B5CF6 0 4px, transparent 4px 6px)' }} /> MA(25)</span>
      </div>
    </div>
  );
};


// ─── MARKET INSIGHTS COMPONENT ──────────────────────────────────────────────

const MARKET_INSIGHTS = [
  { type: 'technical', category: 'Technical Analysis', title: 'RSI Divergence', content: 'A bullish divergence occurs when price makes a lower low, but the RSI makes a higher low. This often precedes a trend reversal.' },
  { type: 'fundamental', category: 'Fundamental News', title: 'Institutional Inflows', content: 'Spot Bitcoin ETFs have witnessed 4 consecutive weeks of net positive inflows, drastically reducing accessible over-the-counter supply.' },
  { type: 'sentiment', category: 'Market Psychology', title: 'Market Sentiment Shifts', content: 'Extreme Fear often correlates with local bottoms, while Extreme Greed historically indicates elevated risk of a localized top.' },
  { type: 'technical', category: 'Technical Analysis', title: 'Moving Average Crossovers', content: 'The "Golden Cross" (50-day moving average crossing above the 200-day) is a lagging but powerful indicator of shifting macroeconomic momentum.' },
  { type: 'fundamental', category: 'On-Chain Data', title: 'Exchange Balances', content: 'Total Bitcoin held on central exchanges has hit a 5-year low, indicating investors prefer self-custody and long-term holding.' }
];

const MarketInsights: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MARKET_INSIGHTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const insight = MARKET_INSIGHTS[currentIndex];
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'technical': return 'text-violet-400 bg-violet-400/10 border-violet-400/20';
      case 'fundamental': return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'sentiment': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'technical': return <LineChartIcon size={14} />;
      case 'fundamental': return <Globe size={14} />;
      case 'sentiment': return <Eye size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="leather-card rounded-xl p-5 flex flex-col justify-center h-full min-h-[140px] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen size={80} />
      </div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(insight.type)}`}>
          {getIcon(insight.type)} 
          {insight.category}
        </span>
        
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {MARKET_INSIGHTS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-primary' : 'w-1 bg-border hover:bg-white/30'}`}
              aria-label={`Go to insight ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-base font-bold text-text mb-1.5">{insight.title}</h4>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
          {insight.content}
        </p>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export const MarketPulseDashboard: React.FC = () => {
  return (
    <div className="space-y-5">
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
            Real-time aggregated metrics from top 50 exchanges. Volume excludes wash trading.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-text-muted text-[10px]">
          <Clock size={12} />
          Last updated: just now
        </div>
      </div>

      {/* Row 1: Trending Ticker */}
      <TrendingTicker />

      {/* Row 2: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {GLOBAL_METRICS.map(m => <MetricCard key={m.id} metric={m} />)}
      </div>

      {/* Row 3: Main Chart + Fear/Greed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <PriceChart />
          <MarketInsights />
        </div>
        <div className="flex flex-col gap-5">
          <FearGreedGauge />
          <SectorHeatmap />
        </div>
      </div>

      {/* Row 4: Market Events */}
      <MarketEventsFeed />
    </div>
  );
};

export default MarketPulseDashboard;
