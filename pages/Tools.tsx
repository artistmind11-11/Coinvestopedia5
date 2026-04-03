import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { 
  Calculator, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Percent,
  ArrowLeft, Lock, BarChart3, PieChart, Activity, Search, Shield,
  LineChart, Sparkles, Globe, Target
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AdUnit } from '../components/AdUnit';
import { AffiliateCTA } from '../components/AffiliateCTA';
import { LeaderboardAd } from '../components/LeaderboardAd';
import { NativeSponsoredCard } from '../components/NativeSponsoredCard';
// Existing Tools
import { DCACalculator } from '../components/tools/Tier3/DCACalculator';
import { ROICalculator } from '../components/tools/Tier3/ROICalculator';
import { ILCalculator } from '../components/tools/Tier3/ILCalculator';
import { TaxEstimator } from '../components/tools/Tier4/TaxEstimator';
import { AssetSimulator } from '../components/tools/Tier1/AssetSimulator';
import { RebalancingCalculator } from '../components/tools/Tier1/RebalancingCalculator';
import { DrawdownAnalyzer } from '../components/tools/Tier2/DrawdownAnalyzer';
import { BetaAlphaCalculator } from '../components/tools/Tier2/BetaAlphaCalculator';
import { OnChainValuation } from '../components/tools/Tier3/OnChainValuation';
import { FixedIncomeCalculator } from '../components/tools/Tier4/FixedIncomeCalculator';
import { DividendScreener } from '../components/tools/Tier4/DividendScreener';
import { InflationAdjusted } from '../components/tools/Tier4/InflationAdjusted';
import { MonteCarloSimulator } from '../components/tools/Tier5/MonteCarloSimulator';
import { RiskAdjustedReturns } from '../components/tools/Tier5/RiskAdjustedReturns';
import { MacroRegimeIndicator } from '../components/tools/Tier5/MacroRegimeIndicator';
import { FearGreedComposite } from '../components/tools/Tier5/FearGreedComposite';

// Tool Registry
export type ToolTier = 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4' | 'Tier 5';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: ToolTier;
  category: string;
  component: React.FC | null; // null means under construction
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // Tier 1
  { id: 'allocation-sim', name: 'Asset Allocation Simulator', description: 'Backtest portfolio allocations across crypto and traditional assets.', icon: <PieChart size={18} />, tier: 'Tier 1', category: 'Portfolio Construction', component: AssetSimulator },
  { id: 'rebalancer', name: 'Rebalancing Calculator', description: 'Calculate exact buy/sell orders to restore target portfolio weights.', icon: <Target size={18} />, tier: 'Tier 1', category: 'Portfolio Construction', component: RebalancingCalculator },
  
  // Tier 2
  { id: 'drawdown', name: 'Drawdown Analyzer', description: 'Analyze historical underwater equity curves and recovery durations.', icon: <TrendingDown size={18} />, tier: 'Tier 2', category: 'Risk Analytics', component: DrawdownAnalyzer },
  { id: 'beta-alpha', name: 'Beta & Alpha Calculator', description: 'Measure systematic risk and excess returns relative to benchmarks.', icon: <BarChart3 size={18} />, tier: 'Tier 2', category: 'Risk Analytics', component: BetaAlphaCalculator },
  
  // Tier 3
  { id: 'on-chain-valuation', name: 'Bitcoin On-Chain Valuation', description: 'Fidelity/ARK style models: S2F, MVRV Z-Score, Realized Price.', icon: <Globe size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', component: OnChainValuation },
  { id: 'dca', name: 'DCA Strategy Simulator', description: 'Project portfolio value over time using dollar-cost averaging.', icon: <DollarSign size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', component: DCACalculator },
  { id: 'roi', name: 'ROI & Trade Calculator', description: 'Compute net profit, break-even, and annualized returns with fees.', icon: <TrendingUp size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', component: ROICalculator },
  { id: 'il', name: 'Impermanent Loss', description: 'Calculate LP impermanent loss and break-even thresholds.', icon: <AlertTriangle size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', component: ILCalculator },
  
  // Tier 4
  { id: 'fixed-income', name: 'Fixed Income Yield', description: 'Calculate YTM, Macaulay duration, and convexity for bonds.', icon: <LineChart size={18} />, tier: 'Tier 4', category: 'Traditional Assets', component: FixedIncomeCalculator },
  { id: 'dividend-screen', name: 'Yield & Income Screener', description: 'Rank TradFi dividend yields alongside DeFi stablecoin APYs.', icon: <Search size={18} />, tier: 'Tier 4', category: 'Traditional Assets', component: DividendScreener },
  { id: 'inflation-adj', name: 'Inflation-Adjusted Returns', description: 'Calculate real purchasing power by offsetting nominal CPI inflation.', icon: <Activity size={18} />, tier: 'Tier 4', category: 'Traditional Assets', component: InflationAdjusted },
  { id: 'tax', name: 'US Tax Estimator 2024', description: 'Estimate STCG, LTCG, and NIIT tax liabilities across income brackets.', icon: <Percent size={18} />, tier: 'Tier 4', category: 'Traditional Assets', component: TaxEstimator },
  
  // Tier 5
  { id: 'monte-carlo', name: 'Monte Carlo Simulator', description: '10,000 geometric Brownian motion paths forecasting target probability.', icon: <Sparkles size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', component: MonteCarloSimulator },
  { id: 'risk-adjusted', name: 'Sharpe & Sortino Analyzer', description: 'Comprehensive risk-adjusted return suite evaluating portfolio efficiency.', icon: <Shield size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', component: RiskAdjustedReturns },
  { id: 'macro-regime', name: 'Macro Regime Indicator', description: '4-quadrant Growth/Inflation matrix signaling economic environment shifts.', icon: <Globe size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', component: MacroRegimeIndicator },
  { id: 'fear-greed', name: 'Fear & Greed Index Composite', description: 'Proprietary 0-100 institutional sentiment gauge.', icon: <Activity size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', component: FearGreedComposite },
];

const PlaceholderTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => (
  <div className="flex flex-col items-center justify-center p-16 bg-surface border border-border rounded-xl border-dashed">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
      <Calculator size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-2">Building {tool.name}...</h3>
    <p className="text-text-muted text-center max-w-md">
      This quantitative tool is currently being developed and will be deployed shortly. It is part of the '{tool.category}' suite.
    </p>
  </div>
);

export const Tools: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  // Scroll top on navigate
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeToolId]);

  const activeTool = TOOLS_REGISTRY.find(t => t.id === activeToolId);
  const ActiveComponent = activeTool?.component || null;

  // View: Single Tool
  if (activeTool) {
    return (
      <div className="animate-fade-in pb-12">
        <button
          onClick={() => setActiveToolId(null)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold group mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
             <span className="text-primary">{activeTool.category}</span>
             <span>•</span>
             <span>{activeTool.tier}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-3 flex items-center gap-3">
             <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">{activeTool.icon}</div>
             {activeTool.name}
          </h1>
          <p className="text-text-muted text-lg">{activeTool.description}</p>
        </div>

        {ActiveComponent ? <ActiveComponent /> : <PlaceholderTool tool={activeTool} />}
        
        <div className="mt-12 pt-8 border-t border-border">
          <AffiliateCTA
            partner="CoinLedger"
            text="Need API-tier data for these calculations?"
            ctaLabel="Get Node Access"
            href="#"
            variant="banner"
          />
        </div>
      </div>
    );
  }

  // View: Dashboard Grid
  const categories = Array.from(new Set(TOOLS_REGISTRY.map(t => t.category)));

  return (
    <div className="animate-fade-in pb-16">
      <LeaderboardAd partner="binance" className="mb-4" />
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#09090b] p-8 lg:p-16 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">
            <Calculator size={14} className="animate-pulse" /> Quantitative Decision Support
          </div>
          <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight bg-gradient-to-b from-text to-text-muted bg-clip-text text-transparent">
            Institutional Analytics
          </h1>
          <p className="text-text-muted max-w-2xl text-lg lg:text-xl leading-relaxed font-medium">
            Professional-grade modelling tools and risk analytics. 
            Everything calculates in real-time on your hardware.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {categories.map(category => {
          const catTools = TOOLS_REGISTRY.filter(t => t.category === category);
          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted whitespace-nowrap">
                   {category}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                <span className="text-[10px] font-bold text-text-muted/50 border border-border/50 px-2 py-0.5 rounded uppercase tracking-widest">
                   {catTools.length} Models
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {catTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className="flex flex-col text-left p-6 rounded-2xl border border-border bg-[#111114] hover:border-primary/50 hover:bg-[#16161a] transition-all duration-500 group h-full relative overflow-hidden shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
                  >
                    {/* Top row: Icon + Tier/Status */}
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-xl bg-[#18181b] border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300 shadow-inner">
                         {tool.icon}
                       </div>
                       <div className="flex flex-col items-end gap-1.5">
                         <span className="text-[9px] font-extrabold text-text-muted/40 uppercase tracking-widest">{tool.tier}</span>
                         {tool.component === null && (
                           <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                             Draft
                           </span>
                         )}
                       </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 flex-grow">
                      <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors leading-tight flex items-center gap-1.5">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed whitespace-normal">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Bottom action bar */}
                    <div className="mt-8 flex items-center justify-between pointer-events-none">
                       <span className="text-[10px] font-bold text-text-muted/40 group-hover:text-primary/70 transition-colors uppercase tracking-[0.1em]">Launch Engine</span>
                       <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                          <Calculator size={12} className="text-text-muted/40 group-hover:text-primary transition-colors" />
                       </div>
                    </div>

                    {/* Animated hover border glow */}
                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-2xl pointer-events-none transition-colors duration-500" />
                  </button>
                ))}
                
                {/* Conditionally add Native Sponsored Card to fill empty space */}
                {catTools.length % 2 !== 0 && (
                   <NativeSponsoredCard
                     partner="CoinLedger"
                     title="Automated Tax Reports"
                     description="Connect your exchanges and wallets to generate professional tax reports in minutes."
                     ctaLabel="Start Free Report"
                     href="#"
                   />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
};