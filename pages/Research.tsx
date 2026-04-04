import React, { useEffect } from 'react';
import { BookOpen, Clock, ExternalLink, Shield, Zap, BarChart3, Globe, ArrowUpRight } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';
import { Button } from '../components/Button';
import { PageRoute } from '../types';
import { useAppContext } from '../context/AppContext';

export interface GlassnodeArticle {
  title: string;
  summary: string;
  date: string;
  readTime: string;
  url: string;
  tags: string[];
}

const GLASSNODE_ARTICLES: GlassnodeArticle[] = [
  {
    title: "Awaiting Liquidity",
    summary: "Bitcoin stabilised around ~$70k with ETF flows improving and sell-side pressure easing. Muted spot volume and overhead supply suggest stronger demand is still needed for a durable recovery.",
    date: "Mar 25, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-13-2026/",
    tags: ["ETF Flows", "Liquidity"]
  },
  {
    title: "Supply Cleared, Conviction Pending",
    summary: "Bitcoin rebounded toward ~$74k as ETF inflows and spot demand recover. Shorts crowded with negative funding; easing options stress suggests improving conditions but early conviction only.",
    date: "Mar 18, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-12-2026/",
    tags: ["Funding Rate", "Options"]
  },
  {
    title: "Resilient in the Face of War",
    summary: "Early stabilisation as ETF inflows return and spot demand begins recovering. Negative funding reveals crowded shorts; options volatility eases suggesting reduced immediate downside risk.",
    date: "Mar 11, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-11-2026/",
    tags: ["Spot Demand", "Derivatives"]
  },
  {
    title: "Waiting for Conviction",
    summary: "BTC stuck between $60k–$69k demand zone. Profitability and breadth fading, spot and ETF flows negative, leverage reset. Market stabilising, not yet recovering.",
    date: "Feb 25, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-9-2026/",
    tags: ["Realized Price", "Leverage"]
  },
  {
    title: "Range-Bound Under Pressure",
    summary: "Bitcoin broke below the True Market Mean (~$79k) into a defensive range. Spot and ETF flows weak; options show panic hedging fading but no renewed bullish conviction.",
    date: "Feb 18, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-8-2026/",
    tags: ["True Market Mean", "ETF"]
  },
  {
    title: "Bears In Control",
    summary: "Spot BTC volumes structurally weak with 30D average depressed despite BTC rolling from $98K to $72K. Demand vacuum — sell-side pressure not met by sustained absorption.",
    date: "Feb 4, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-6-2026/",
    tags: ["Spot Volume", "Bear Market"]
  },
  {
    title: "Tariffs and Turmoil",
    summary: "Trump's Liberation Day tariffs sent shockwaves through financial markets. Major macro indexes declined unilaterally. Digital assets saw broad-based contraction across all sectors.",
    date: "Apr 9, 2025",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-15-2025/",
    tags: ["Macro", "Correlation"]
  },
  {
    title: "Price Discovery",
    summary: "Bitcoin reached a new ATH trading as high as $122.6k, putting all BTC investors back in profit. Key on-chain metrics suggest a potential push toward ~$130K before demand exhaustion.",
    date: "Jul 16, 2025",
    readTime: "6 min",
    url: "https://insights.glassnode.com/the-week-onchain-week-29-2025/",
    tags: ["ATH", "NUPL"]
  },
];

export const Research: React.FC = () => {
  const { isProUser } = useAppContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#09090b] p-8 lg:p-16 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">
            <BookOpen size={14} className="animate-pulse" /> Institutional Research
          </div>
          <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight bg-gradient-to-b from-text to-text-muted bg-clip-text text-transparent">
            On-Chain Analytics
          </h1>
          <p className="text-text-muted max-w-2xl text-lg lg:text-xl leading-relaxed font-medium">
            Weekly deep-dives into Bitcoin network health, exchange flows, and institutional accumulation patterns.
          </p>
        </div>
      </div>

       {!isProUser && (
        <div className="mb-12 flex justify-center">
           <AdUnit size="leaderboard" context={{ page: PageRoute.RESEARCH }} label="Exchange Sponsor" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted whitespace-nowrap">
              The Week On-Chain
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLASSNODE_ARTICLES.slice(0, 3).map((article, idx) => (
              <ResearchCard key={idx} article={article} />
            ))}
            
            {!isProUser && (
               <AdUnit size="native" context={{ page: PageRoute.RESEARCH }} label="Sponsor" />
            )}

            {GLASSNODE_ARTICLES.slice(3, 6).map((article, idx) => (
              <ResearchCard key={idx + 3} article={article} />
            ))}

            {!isProUser && (
               <AdUnit size="native" partner="binance" label="Exchange Partner" />
            )}

            {GLASSNODE_ARTICLES.slice(6).map((article, idx) => (
              <ResearchCard key={idx + 6} article={article} />
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 pt-12 border-t border-border mt-12 w-full">
            <div className="text-center space-y-2">
               <h3 className="text-xl font-bold">Deep Dive into On-Chain Data</h3>
               <p className="text-sm text-text-muted">Access professional-grade on-chain intelligence directly from the source.</p>
            </div>
            
            <a
              href="https://glassnode.com/registration/?ref=COINVEST"
              target="_blank"
              rel="nofollow sponsored"
              className="flex items-center gap-3 px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
            >
              Get Glassnode Professional
              <ArrowUpRight size={20} />
            </a>

            <p className="text-center text-[10px] text-text-muted pt-2 font-body max-w-md mx-auto">
              Institutional analysis provided in partnership with Glassnode Insights · The Week On-Chain · Published Weekly · {" "}
              <a
                href="https://insights.glassnode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                glassnode.com
              </a>
            </p>
          </div>
        </div>

        {/* Research Sidebar */}
        {!isProUser && (
           <aside className="hidden xl:block space-y-8">
              <AdUnit size="medium" context={{ page: PageRoute.RESEARCH }} label="Sponsored Content" />
              
              <div className="leather-card p-6 rounded-xl border-dashed border-border">
                 <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    Pro Research
                 </h4>
                 <p className="text-xs text-text-muted mb-6 leading-relaxed">
                    Get access to live dashboards, custom alerts, and historical CSV exports for institutional analysis.
                 </p>
                 <Button isFullWidth size="sm">Upgrade to Pro</Button>
              </div>

              <div className="p-6 bg-surface border border-border rounded-xl">
                 <h4 className="font-bold text-sm mb-4">Market Indicators</h4>
                 <div className="space-y-4">
                    {[
                       { label: 'Market Heating', value: 'Moderate', color: 'text-amber-400' },
                       { label: 'Exchange Reserve', value: 'Decreasing', color: 'text-emerald-400' },
                       { label: 'Miner Balance', value: 'Neutral', color: 'text-text' }
                    ].map(stat => (
                       <div key={stat.label} className="flex justify-between items-center">
                          <span className="text-xs text-text-muted">{stat.label}</span>
                          <span className={`text-xs font-bold ${stat.color}`}>{stat.value}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <AdUnit size="skyscraper" context={{ page: PageRoute.RESEARCH }} label="Liquidity Partner" />
           </aside>
        )}
      </div>
    </div>
  );
};

const ResearchCard: React.FC<{ article: GlassnodeArticle }> = ({ article }) => (
  <a 
    href={article.url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="block h-full group"
  >
    <div className="leather-card rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.05)]">
      <div className="flex flex-row items-center text-[10px] text-text-muted px-4 pt-4">
        {article.date} · <Clock size={10} className="inline mx-1" /> {article.readTime}
      </div>
      <h3 className="font-bold text-base text-text px-4 pt-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed px-4 pt-2 pb-4 flex-grow line-clamp-3">
        {article.summary}
      </p>
      <div className="flex justify-between items-center px-4 pb-4 border-t border-border/50 pt-3 mt-auto">
        <div className="flex items-center gap-2 flex-wrap">
          {article.tags.slice(0, 2).map((tag, tIdx) => (
            <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-bold uppercase tracking-tighter">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-primary font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
          Read Analysis
        </span>
      </div>
    </div>
  </a>
);

export default Research;
