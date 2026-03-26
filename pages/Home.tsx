import React from 'react';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { IconCard } from '../components/IconCard';
import { AdUnit } from '../components/AdUnit';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { VideoTutorial } from '../components/VideoTutorial';
import { FilterChips } from '../components/FilterChips';
import { MarketPulseDashboard } from '../components/MarketPulseDashboard';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { TrendingUp, Activity, Globe, LineChart, Zap, Shield, BookOpen, Calculator, Hash, Sparkles, Flame, Coins, BarChart3, Target, DollarSign } from 'lucide-react';
import { PageRoute } from '../types';
import { TargetIcon } from '../components/AnimatedIcons';

interface HomeProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const handleCardClick = React.useCallback((route?: PageRoute) => {
    if (route) onNavigate?.(route);
  }, [onNavigate]);
  
  const quickAccessCards = [
    {
      icon: <TargetIcon />,
      title: 'Whale Radar',
      description: 'Track large wallet movements in real-time.',
      badge: undefined,
      route: PageRoute.WHALE,
      variant: 'highlight' as const,
      className: 'md:col-span-1',
      graphic: (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-32 h-32 rounded-full border border-emerald-500/30 animate-ping"></div>
          <div className="w-20 h-20 rounded-full border border-emerald-500/50 absolute"></div>
        </div>
      ),
      onClick: () => handleCardClick(PageRoute.WHALE)
    },
    {
      icon: <LineChart size={24} />,
      title: 'Compare Assets',
      description: 'Side-by-side analysis of crypto vs traditional assets',
      route: PageRoute.COMPARE,
      variant: 'default' as const,
      progress: 75
    },
    {
      icon: <Calculator size={24} />,
      title: 'DCA Calculator',
      description: 'Calculate dollar-cost averaging returns with precision',
      route: PageRoute.TOOLS,
      variant: 'default' as const,
      progress: 100
    },
    {
      icon: <Zap size={24} />,
      title: 'Market Pulse',
      description: 'AI-powered sentiment analysis and market indicators',
      variant: 'default' as const,
      progress: 60
    },
    {
      icon: <Shield size={24} />,
      title: 'Security Audit',
      description: 'Verify smart contract safety before investing',
      variant: 'default' as const,
      progress: 45
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Learn Crypto',
      description: 'From basics to advanced trading strategies',
      variant: 'default' as const,
      progress: 90
    }
  ];

  const categories = [
    { id: 'all', label: 'All Assets', count: 1247 },
    { id: 'defi', label: 'DeFi', count: 342 },
    { id: 'layer1', label: 'Layer 1', count: 89 },
    { id: 'rwa', label: 'RWA', count: 67 },
    { id: 'gaming', label: 'Gaming', count: 156 }
  ];



  const featuredComparisons = [
    {
      title: 'Bitcoin vs Gold',
      description: 'Portfolio manager\'s analysis of digital vs physical store of value',
      icon: <Coins size={24} />,
      metrics: [
        { label: 'Volatility (30d)', tooltip: 'Historical 30-day price variation.', valueA: '18.2%', valueB: '8.4%' },
        { label: 'Correlation to S&P', tooltip: 'How closely the asset follows the stock market.', valueA: '0.42', valueB: '0.15' },
        { label: '5Y Return', tooltip: 'Historical return over the last 5 years.', valueA: '+285%', valueB: '+48%' },
      ],
      cta: 'View Full Analysis',
      route: PageRoute.COMPARE
    },
    {
      title: 'DeFi vs Traditional Banking',
      description: 'Risk-adjusted returns comparison for institutional investors',
      icon: <DollarSign size={24} />,
      metrics: [
        { label: 'Avg. APY', tooltip: 'Annual Percentage Yield on deposits.', valueA: '4.8%', valueB: '0.5%' },
        { label: 'Counterparty Risk', tooltip: 'Risk of the other party defaulting.', valueA: 'Smart Contract', valueB: 'Bank Failure' },
        { label: 'Regulatory Status', tooltip: 'Current legal and compliance standing.', valueA: 'Evolving', valueB: 'Established' },
      ],
      cta: 'Compare Now',
      route: PageRoute.COMPARE
    },
    {
      title: 'Ethereum vs AWS',
      description: 'Understanding the business model of decentralized compute',
      icon: <BarChart3 size={24} />,
      metrics: [
        { label: 'Revenue Model', tooltip: 'Primary source of network/business income.', valueA: 'Gas Fees', valueB: 'Subscription' },
        { label: 'Market Position', tooltip: 'Current standing in respective industry.', valueA: 'L1 Leader', valueB: 'Cloud Leader' },
        { label: 'Growth (YoY)', tooltip: 'Year-over-year revenue/usage growth.', valueA: '+32%', valueB: '+28%' },
      ],
      cta: 'Read Analysis',
      route: PageRoute.COMPARE
    },
    {
      title: 'Stablecoins vs SWIFT',
      description: 'The future of cross-border settlements & global payments',
      icon: <Zap size={24} />,
      metrics: [
        { label: 'Settlement Time', tooltip: 'Time taken to finalize a transaction.', valueA: 'Seconds', valueB: '1-5 Days' },
        { label: 'Avg Fee ($10k)', tooltip: 'Cost to transfer $10,000 internationally.', valueA: '< $1', valueB: '$30-50' },
        { label: 'Availability', tooltip: 'Operating hours of the settlement network.', valueA: '24/7/365', valueB: 'Bank Hours' },
      ],
      cta: 'Explore Future',
      route: PageRoute.COMPARE
    },
  ];

  return (
    <div className="animate-fade-in space-y-12 lg:space-y-20">
      <Hero />
      
      {/* Featured Comparisons Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">Featured Comparisons</h2>
            <p className="text-text-muted text-sm lg:text-base">Where Crypto Meets Wall Street - Start Here</p>
          </div>
          <button 
            className="text-primary font-semibold transition-all group text-sm lg:text-base self-start sm:self-auto"
            onClick={() => onNavigate?.(PageRoute.COMPARE)}
          >
            View All Comparisons
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 lg:gap-6">
          {featuredComparisons.map((comparison, i) => (
            <Card 
              key={i} 
              variant="interactive" 
              className="h-full flex flex-col w-full"
              onClick={() => handleCardClick(comparison.route)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                  {comparison.icon}
                </div>
                <h3 className="font-bold text-lg leading-tight break-words">{comparison.title}</h3>
              </div>
              
              <p className="text-text-muted text-sm mb-6 flex-grow break-words">
                {comparison.description}
              </p>

              <div className="space-y-3 mb-6 bg-background/50 p-4 rounded-lg border border-border w-full overflow-hidden">
                 {comparison.metrics.map((m, idx) => (
                   <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0 gap-1 sm:gap-2">
                     <span 
                       className="text-text-muted sm:mr-2 truncate text-left min-w-0 cursor-help border-b border-dotted border-text-muted/50 inline-block self-start sm:self-auto"
                       title={m.tooltip}
                       aria-label={`Metric: ${m.label}. ${m.tooltip}`}
                     >
                       {m.label}
                     </span>
                     <div className="flex items-center sm:justify-end gap-1.5 sm:text-right shrink-0 self-start sm:self-auto ml-2 sm:ml-0">
                        <span className="font-medium text-text">{m.valueA}</span>
                        <span className="text-text-muted text-[10px] px-1">vs</span>
                        <span className="font-medium text-text">{m.valueB}</span>
                     </div>
                   </div>
                 ))}
              </div>

              <div className="flex items-center text-primary text-sm font-bold mt-auto transition-all">
                {comparison.cta}
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Market Pulse Section */}
      <section>
        <MarketPulseDashboard />
      </section>

      {/* Live Feed & Ad */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <LiveActivityFeed />
        <div className="flex flex-col gap-6">
           {/* Passing partner="3commas" for diversity, or remove prop for random */}
           <AdUnit size="large" className="w-full h-full min-h-[250px]" label="Sponsored Partner" partner="3commas" />
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-text">Essential Tools & Guides</h2>
          <FilterChips chips={categories} onFilterChange={(ids) => console.log(ids)} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
           {quickAccessCards.map((card, i) => (
              <IconCard 
                 key={i}
                 {...card}
                 className={card.className}
                 onClick={() => card.route && handleCardClick(card.route)}
              />
           ))}
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <NewsletterSignup />
      </section>
    </div>
  );
};