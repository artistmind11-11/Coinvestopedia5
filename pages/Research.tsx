import React, { useEffect } from 'react';
import { BookOpen, Clock, ExternalLink } from 'lucide-react';

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
  return (
    <div className="animate-fade-in pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16 mb-12 lg:mb-20 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <BookOpen size={16} />
            <span>On-Chain Intelligence</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Research & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Insights</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Weekly on-chain market analysis powered by Glassnode. Let professional-grade data drive your institutional understanding of market cycles.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted whitespace-nowrap">
            The Week On-Chain
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLASSNODE_ARTICLES.map((article, idx) => (
            <a 
              key={idx} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block h-full"
            >
              <div className="leather-card rounded-xl overflow-hidden h-full flex flex-col transition-colors duration-300 hover:border-primary/50">
                <div className="flex flex-row items-center text-[10px] text-text-muted px-4 pt-4">
                  {article.date} · <Clock size={10} className="inline mx-1" /> {article.readTime}
                </div>
                <h3 className="font-semibold text-sm text-text px-4 pt-1">
                  {article.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed px-4 pt-1 pb-3 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex justify-between items-center px-4 pb-4 border-t border-border pt-3 mt-auto">
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.tags.slice(0, 2).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-medium">
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-medium">
                        +{article.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-primary font-medium">
                    Read more ↗
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 pt-8">
          <a
            href="https://insights.glassnode.com/tag/newsletter/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-text-muted hover:text-primary border border-border hover:border-primary rounded-lg px-4 py-2 transition-colors font-sans mx-auto w-fit mt-4"
          >
            View all editions on Glassnode Insights
            <ExternalLink size={12} />
          </a>
          <p className="text-center text-[10px] text-text-muted pt-2 font-body">
            Research by Glassnode · The Week On-Chain · Published every Tuesday ·{" "}
            <a
              href="https://insights.glassnode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              insights.glassnode.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
