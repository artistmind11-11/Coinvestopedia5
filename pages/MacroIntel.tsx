import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  ArrowLeft, Clock, Globe, TrendingUp, Shield, BarChart3, 
  AlertTriangle, Eye, Database, Layers, Archive as ArchiveIcon, 
  ChevronRight, Lock, Zap, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { fetchMacroIndicators } from '../services/api';
import { AdUnit } from '../components/AdUnit';
import { LeaderboardAd } from '../components/LeaderboardAd';
import { AffiliateCTA } from '../components/AffiliateCTA';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type MacroTab = 'weekly' | 'geopolitical' | 'cross-market' | 'institutional' | 'archive';

interface ReportSection {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

interface MacroReport {
  id: string;
  title: string;
  subtitle: string;
  tab: MacroTab;
  date: string;
  readTime: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  keyMetrics: { label: string; value: string; direction: 'up' | 'down' | 'neutral' }[];
  sections: ReportSection[];
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS: { id: MacroTab; label: string; icon: React.ReactNode; isPro?: boolean }[] = [
  { id: 'weekly', label: 'Weekly Briefing', icon: <Zap size={16} /> },
  { id: 'geopolitical', label: 'Geopolitical Decoder', icon: <Globe size={16} /> },
  { id: 'cross-market', label: 'Cross-Market', icon: <BarChart3 size={16} /> },
  { id: 'institutional', label: 'Institutional Lens', icon: <Eye size={16} /> },
  { id: 'archive', label: 'Archive', icon: <ArchiveIcon size={16} />, isPro: true },
];

// ─── SEED REPORTS ─────────────────────────────────────────────────────────────

const REPORTS: MacroReport[] = [
  {
    id: 'fed-holds-strong-dollar',
    title: 'Fed Holds + Strong Dollar Regime: BTC in a Risk-Off World',
    subtitle: 'How dollar strength historically transmits into crypto market structure, and what the current setup looks like.',
    tab: 'weekly',
    date: 'March 28, 2026',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'DXY', value: '106.4', direction: 'up' },
      { label: 'Fed Rate', value: '5.25%', direction: 'neutral' },
      { label: 'BTC', value: '$67,200', direction: 'down' },
      { label: '10Y Yield', value: '4.32%', direction: 'up' },
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Macro Context',
        content: (
          <>
            <p className="mb-4">The Federal Reserve held rates at 5.25-5.50% for the seventh consecutive meeting, signaling "higher for longer" with no cuts expected until inflation sustainably approaches 2%. Meanwhile, the DXY has surged above 106, its highest level since November 2023.</p>
            <p className="mb-4"><strong>What's driving dollar strength:</strong></p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Rate differentials:</strong> US rates remain significantly above Europe and Japan, attracting global capital into dollar-denominated assets.</li>
              <li><strong>Fiscal expansion:</strong> US government spending continues to elevate growth expectations relative to trading partners.</li>
              <li><strong>Safe-haven demand:</strong> Geopolitical tensions in Europe and the Middle East are driving risk-averse capital into the dollar.</li>
              <li><strong>Energy independence:</strong> US energy exports create structural dollar demand that didn't exist a decade ago.</li>
            </ul>
            <p>Traditional markets: S&P 500 trading at 5,200 (-2.1% this week), Gold at $2,340 (+0.8%), 10Y Treasury yield at 4.32%.</p>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Transmission Analysis',
        content: (
          <>
            <p className="mb-4">Historically, strong dollar regimes create headwinds for crypto through three transmission channels:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 1: Risk Appetite</h4>
                <p className="text-xs text-text-muted">Dollar strength correlates with risk-off sentiment. BTC's 90-day rolling correlation with DXY: <span className="text-red-400 font-bold">-0.72</span> (strong inverse). When DXY rises above 104, BTC has historically underperformed in 78% of 30-day windows.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 2: Liquidity</h4>
                <p className="text-xs text-text-muted">Strong dollar tightens global dollar liquidity. Emerging market investors — a growing crypto cohort — face currency depreciation, reducing fiat→crypto flows. USDT market cap growth has stalled at $110B for 6 weeks.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 3: Opportunity Cost</h4>
                <p className="text-xs text-text-muted">5.25% risk-free rate makes holding non-yielding assets like BTC less attractive to institutional allocators. Treasury ETFs (SHV, BIL) have seen $14B inflows YTD vs. $2.3B for BTC ETFs in same period.</p>
              </div>
            </div>
            <p className="mb-4"><strong>Current lag analysis:</strong> In 2022-2023, BTC's reaction to DXY moves lagged by approximately 2-3 weeks. The current DXY breakout above 106 occurred 8 trading days ago. Based on historical lag patterns, the transmission effect may not fully manifest for another 7-12 trading days.</p>
            <p><strong>Key nuance:</strong> Unlike 2022, the current strong dollar cycle is occurring alongside spot BTC ETF inflows, creating a structural bid that partially offsets the macro headwind. The question is whether ETF demand can absorb the macro-driven selling pressure.</p>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'What Professional Investors Are Watching',
        content: (
          <>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">DXY 107.8 level:</strong>
                  <span className="text-text-muted"> Above this, we enter a regime where the BTC-DXY inverse correlation historically strengthens to -0.85+. This is the "pain threshold" for EM-driven crypto demand.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">CME FedWatch probabilities:</strong>
                  <span className="text-text-muted"> Currently pricing 18% chance of September cut. Any movement toward 30%+ would likely trigger a DXY reversal and crypto-positive regime shift.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">BTC ETF flow vs. DXY strength duration:</strong>
                  <span className="text-text-muted"> Monitoring whether ETF inflows maintain $200M+/week pace during DXY strength. If ETF flows turn negative during dollar rallies, the structural bid thesis weakens.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Gold-BTC relative performance:</strong>
                  <span className="text-text-muted"> Gold outperforming BTC during dollar strength suggests BTC is still trading as a risk asset, not a safe haven. The BTC/Gold ratio is at 28.7, down from 32.1 three weeks ago.</span>
                </div>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'Opportunity Landscape',
        content: (
          <>
            <p className="mb-4">Cross-market dislocations that historically create asymmetric setups during strong dollar regimes:</p>
            <div className="space-y-3">
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-amber-400 mb-1">Stablecoin yield arbitrage</h4>
                <p className="text-sm text-text-muted">When DXY strength pushes EM currencies down, DeFi stablecoin yields often compress to below US treasury rates. When this inverts (DeFi yields &gt; Treasuries), historically it signals late-stage dollar strength.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-amber-400 mb-1">Mining economics compression</h4>
                <p className="text-sm text-text-muted">Strong dollar + range-bound BTC squeezes miners with non-USD costs. Hash ribbons indicator approaching a compression signal — historically a leading indicator of capitulation followed by recovery (4 of last 5 instances).</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-amber-400 mb-1">BTC/ETH ratio divergence</h4>
                <p className="text-sm text-text-muted">In prior strong dollar regimes, BTC dominance rises as capital consolidates into the "safest" crypto. Current BTC.D at 54.2% — approaching levels where altcoin rotation historically begins on dollar weakness.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Risk Matrix',
        content: (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-3 pr-4 font-medium uppercase text-xs">Scenario</th>
                    <th className="py-3 px-4 font-medium uppercase text-xs">Probability</th>
                    <th className="py-3 px-4 font-medium uppercase text-xs">BTC Impact</th>
                    <th className="py-3 pl-4 font-medium uppercase text-xs">Timeframe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium">DXY surge above 108</td>
                    <td className="py-3 px-4 text-amber-400">35%</td>
                    <td className="py-3 px-4 text-red-400">Strongly Negative</td>
                    <td className="py-3 pl-4 text-text-muted">2-4 weeks</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium">DXY range 104-107</td>
                    <td className="py-3 px-4 text-emerald-400">45%</td>
                    <td className="py-3 px-4 text-amber-400">Mildly Negative</td>
                    <td className="py-3 pl-4 text-text-muted">Ongoing</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium">Surprise rate cut signal</td>
                    <td className="py-3 px-4 text-red-400">10%</td>
                    <td className="py-3 px-4 text-emerald-400">Strongly Positive</td>
                    <td className="py-3 pl-4 text-text-muted">Immediate</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium">DXY reversal below 104</td>
                    <td className="py-3 px-4 text-red-400">10%</td>
                    <td className="py-3 px-4 text-emerald-400">Positive</td>
                    <td className="py-3 pl-4 text-text-muted">1-2 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-text-muted"><strong>Thesis invalidation:</strong> If BTC holds above $65,000 despite DXY above 107 for 3+ weeks, it suggests structural demand (ETFs) is overcoming macro headwinds — a fundamentally bullish development.</p>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Data Sources & Confidence',
        content: (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['FRED (Fed Funds, DXY)', 'CME FedWatch', 'CoinGecko (BTC, ETH)', 'Glassnode (Exchange Flows)', 'Alternative.me (F&G)', 'DeFi Llama (TVL)'].map(src => (
                <div key={src} className="flex items-center gap-2 text-xs text-text-muted py-2 px-3 bg-surface rounded-lg border border-border">
                  <Database size={12} className="text-primary flex-shrink-0" />
                  {src}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Confidence Level:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">HIGH</span>
              <span className="text-xs text-text-muted">Based on 6 corroborating data sources and 10+ year historical backtest</span>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'gold-vs-btc-flight-safety',
    title: 'Gold vs Bitcoin in Flight-to-Safety Regimes',
    subtitle: 'When markets panic, which asset actually performs as a haven? A data-driven comparison across crisis episodes.',
    tab: 'cross-market',
    date: 'March 25, 2026',
    readTime: '11 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'Gold', value: '$2,340', direction: 'up' },
      { label: 'BTC', value: '$67,200', direction: 'down' },
      { label: 'VIX', value: '18.4', direction: 'up' },
      { label: 'BTC/Gold', value: '28.7x', direction: 'down' },
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Macro Context',
        content: (
          <>
            <p className="mb-4">Geopolitical risk is elevated across multiple theaters: Middle East escalation, China-Taiwan tensions, and European energy security concerns. The VIX has risen from 13 to 18.4 over two weeks, and gold is testing all-time highs above $2,300.</p>
            <p className="mb-4">The fundamental question: <em>Is Bitcoin a risk asset or a safe-haven asset?</em> The answer, historically, is "it depends on the type of crisis."</p>
            <div className="p-5 bg-surface border border-border rounded-xl mb-4">
              <h4 className="font-bold text-sm mb-3">Historical Crisis Performance (BTC vs Gold, first 30 days)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[450px]">
                  <thead>
                    <tr className="border-b border-border text-text-muted text-xs">
                      <th className="py-2 text-left">Crisis Event</th>
                      <th className="py-2 text-right">Gold</th>
                      <th className="py-2 text-right">BTC</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border/30">
                      <td className="py-2">COVID Crash (Mar 2020)</td>
                      <td className="py-2 text-right text-red-400">-3.4%</td>
                      <td className="py-2 text-right text-red-400">-37.2%</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-2">Ukraine Invasion (Feb 2022)</td>
                      <td className="py-2 text-right text-emerald-400">+8.1%</td>
                      <td className="py-2 text-right text-red-400">-7.3%</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-2">SVB Collapse (Mar 2023)</td>
                      <td className="py-2 text-right text-emerald-400">+9.2%</td>
                      <td className="py-2 text-right text-emerald-400">+42.1%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Middle East Escalation (Oct 2023)</td>
                      <td className="py-2 text-right text-emerald-400">+5.8%</td>
                      <td className="py-2 text-right text-emerald-400">+28.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-sm text-text-muted"><strong>Pattern:</strong> BTC acts as a risk asset during liquidity crises (COVID, broad deleveraging) but as a potential safe haven during banking/monetary crises and geopolitical tensions involving sanctions or capital controls.</p>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Transmission Analysis',
        content: (
          <>
            <p className="mb-4">The gold-to-bitcoin transmission operates through a "tiered safe haven" framework:</p>
            <div className="space-y-3 mb-4">
              <div className="p-4 bg-background border-l-2 border-emerald-400 rounded-r-lg">
                <p className="text-sm"><strong className="text-emerald-400">Tier 1 (0-72 hours):</strong> Capital flows to gold, treasuries, dollar. BTC typically sells off alongside equities as leveraged positions unwind.</p>
              </div>
              <div className="p-4 bg-background border-l-2 border-amber-400 rounded-r-lg">
                <p className="text-sm"><strong className="text-amber-400">Tier 2 (3-14 days):</strong> If crisis involves banking/sovereign risk, BTC narrative shifts to "digital gold." Capital begins flowing from gold into BTC as the crisis narrative matures.</p>
              </div>
              <div className="p-4 bg-background border-l-2 border-primary rounded-r-lg">
                <p className="text-sm"><strong className="text-primary">Tier 3 (14+ days):</strong> Gold and BTC begin moving in correlation. If capital controls or sanctions are involved, BTC outperforms gold due to portability advantage.</p>
              </div>
            </div>
            <p className="text-sm text-text-muted">Current status: We appear to be in a Tier 1 → Tier 2 transition. Gold has rallied 3.2% in 10 days while BTC has declined 4.8%. The BTC/Gold ratio is compressing, which in prior episodes has preceded BTC outperformance.</p>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'What Professional Investors Are Watching',
        content: (
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">BTC/Gold ratio at 25x or below:</strong><span className="text-text-muted"> This level has historically marked the floor of BTC underperformance vs. gold in crisis regimes. A bounce from here would confirm the "digital gold" bid is intact.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">Central bank gold buying data:</strong><span className="text-text-muted"> China and emerging market central banks have been accumulating gold at record pace. If sovereign interest extends to BTC reserves (El Salvador model), the narrative shift accelerates.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">BTC ETF flows during gold rallies:</strong><span className="text-text-muted"> If BTC ETFs see inflows while gold rallies, it suggests institutional investors are treating both as complementary hedges — a major maturation signal.</span></div>
            </li>
          </ul>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'Opportunity Landscape',
        content: (
          <p className="text-text-muted">The most asymmetric position historically has been scaling into BTC during the Tier 1 → Tier 2 transition (gold rallying, BTC stalling/declining). In the last 3 such transitions, BTC went on to outperform gold by an average of 4.3x over the subsequent 90 days. This is not a signal to buy — it's a structural pattern that professional macro allocators track.</p>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Risk Matrix',
        content: (
          <p className="text-text-muted"><strong>Thesis invalidation:</strong> If the crisis deepens into a full liquidity crunch (VIX above 35, credit spreads widening 200bp+), all historical bets are off — BTC would likely sell alongside every other risk asset including gold, as happened briefly during COVID. The safe-haven thesis only holds in moderate stress environments.</p>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Data Sources & Confidence',
        content: (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Confidence Level:</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">MEDIUM</span>
            <span className="text-xs text-text-muted">Limited sample size of comparable crisis episodes</span>
          </div>
        ),
      },
    ],
  },
  {
    id: 'middle-east-capital-flight',
    title: 'Middle East Escalation & Capital Flight Corridors',
    subtitle: 'How regional instability restructures capital flow patterns and what it means for crypto demand in key corridors.',
    tab: 'geopolitical',
    date: 'March 22, 2026',
    readTime: '13 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'Oil', value: '$87.40', direction: 'up' },
      { label: 'Gold', value: '$2,340', direction: 'up' },
      { label: 'USDT P2P₃', value: '+4.2%', direction: 'up' },
      { label: 'BTC Vol', value: '62%', direction: 'up' },
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Macro Context',
        content: (
          <>
            <p className="mb-4">Escalation in the Middle East is creating cascading effects across global markets. Crude oil has surged 12% in three weeks on supply disruption fears. Safe-haven flows are accelerating into gold, Swiss franc, and US treasuries.</p>
            <p className="mb-4"><strong>Key capital flow dynamics:</strong></p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>MENA region stablecoin volumes have increased 340% vs. 30-day average on major P2P platforms.</li>
              <li>USDT is trading at a 4.2% premium to USD on Turkish and Lebanese P2P markets — a classic capital flight signal.</li>
              <li>UAE crypto exchange volumes have doubled, suggesting the region is being used as a capital intermediary.</li>
              <li>Hawala networks are reporting increased BTC settlement requests from conflict-adjacent regions.</li>
            </ul>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Transmission Analysis',
        content: (
          <>
            <p className="mb-4">Geopolitical instability in the Middle East transmits into crypto through three primary corridors:</p>
            <div className="space-y-3 mb-4">
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Corridor 1: Direct capital flight</h4>
                <p className="text-sm text-text-muted">Citizens in affected regions converting local currency to BTC/USDT to preserve wealth. This creates genuine organic demand that is price-insensitive and persistent.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Corridor 2: Oil price → Mining economics</h4>
                <p className="text-sm text-text-muted">Higher oil prices increase energy costs for miners with fossil fuel dependency. This compresses margins for ~35% of the global hashrate, potentially accelerating miner selling pressure.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Corridor 3: Sanctions evasion narrative risk</h4>
                <p className="text-sm text-text-muted">Increased geopolitical tension raises the probability of regulatory crackdowns on crypto as a sanctions circumvention tool. This creates headline risk for the entire sector.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'What Professional Investors Are Watching',
        content: (
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">USDT P2P premiums in MENA:</strong><span className="text-text-muted"> Premiums above 5% historically indicate genuine capital flight (vs. speculative activity). Current 4.2% suggests we're approaching but haven't crossed that threshold.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">Brent crude above $90:</strong><span className="text-text-muted"> This is the level where mining economics begin to materially deteriorate for non-renewable energy miners. Hash rate may begin declining within 2-3 weeks.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">OFAC designations involving crypto:</strong><span className="text-text-muted"> Any new sanctions mentioning cryptocurrency specifically would be a significant negative catalyst. Watching Treasury Department communications closely.</span></div>
            </li>
          </ul>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'Opportunity Landscape',
        content: (
          <p className="text-text-muted">Capital flight episodes historically create sustained, price-insensitive demand for BTC that can persist for months after the initial event. The premium on USDT in affected regions acts as a leading indicator: when premiums contract to below 2%, the organic demand wave has typically peaked. For now, the premium is still expanding.</p>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Risk Matrix',
        content: (
          <p className="text-text-muted"><strong>Thesis invalidation:</strong> A rapid de-escalation would immediately collapse P2P premiums and reverse capital flight demand. Additionally, if oil prices spike above $100 and trigger a global recession response, all risk assets including crypto would likely face significant drawdowns regardless of capital flight demand.</p>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Data Sources & Confidence',
        content: (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Confidence Level:</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">MEDIUM</span>
            <span className="text-xs text-text-muted">P2P premium data from limited sources; regional volume data may undercount</span>
          </div>
        ),
      },
    ],
  },
];


// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const LiveMacroBar: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchMacroIndicators();
      if (result && Array.isArray(result)) {
        setData(result);
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="min-w-[120px] h-12 bg-surface animate-pulse rounded-lg border border-border" />
      ))}
    </div>
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {data.map((item) => (
        <div key={item.symbol} className="flex items-center gap-3 px-4 py-2 bg-surface rounded-xl border border-border whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
              {item.name?.replace('Index', '').trim() || item.symbol}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold">{item.price?.toLocaleString()}</span>
              <span className={`flex items-center text-[10px] font-bold ${item.changesPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.changesPercentage >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {Math.abs(item.changesPercentage).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReportCard: React.FC<{ report: MacroReport; onClick: () => void }> = ({ report, onClick }) => (
  <Card className="flex flex-col group hover:border-primary/40 cursor-pointer h-full transition-all duration-300" onClick={onClick}>
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-surface border border-border text-xs rounded-full font-bold text-text-muted uppercase tracking-widest">
        {TABS.find(t => t.id === report.tab)?.label}
      </span>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase
        ${report.confidenceLevel === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
        ${report.confidenceLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
        ${report.confidenceLevel === 'Low' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
      `}>
        {report.confidenceLevel} Confidence
      </div>
    </div>

    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
      {report.title}
    </h3>

    <p className="text-text-muted text-sm mb-6 flex-grow line-clamp-3">
      {report.subtitle}
    </p>

    {/* Key Metrics */}
    <div className="grid grid-cols-4 gap-2 mb-6">
      {report.keyMetrics.map(m => (
        <div key={m.label} className="text-center p-2 bg-surface rounded-lg border border-border">
          <p className="text-[9px] text-text-muted uppercase font-bold tracking-wider">{m.label}</p>
          <p className={`text-sm font-bold font-mono mt-0.5 ${m.direction === 'up' ? 'text-emerald-400' : m.direction === 'down' ? 'text-red-400' : 'text-text'}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto w-full text-xs font-medium text-text-muted">
      <div className="flex items-center gap-2">
        <Clock size={14} /> {report.readTime}
      </div>
      <span>{report.date}</span>
    </div>
  </Card>
);


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export const MacroIntel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MacroTab>('weekly');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const activeReport = REPORTS.find(r => r.id === activeReportId);

  const filteredReports = activeTab === 'archive'
    ? REPORTS
    : REPORTS.filter(r => r.tab === activeTab);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeReportId]);

  // ── REPORT READER VIEW ──
  if (activeReport) {
    return (
      <div className="animate-fade-in max-w-container mx-auto pb-16">
        <button
          onClick={() => setActiveReportId(null)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold group mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Macro Intel
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Report Header */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                <span className="text-primary">{TABS.find(t => t.id === activeReport.tab)?.label}</span>
                <span>•</span>
                <span>{activeReport.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {activeReport.readTime}</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-4 leading-tight">{activeReport.title}</h1>
              <p className="text-lg text-text-muted leading-relaxed">{activeReport.subtitle}</p>
            </div>

            {/* Key Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 p-4 bg-surface rounded-xl border border-border">
              {activeReport.keyMetrics.map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{m.label}</p>
                  <p className={`text-xl font-bold font-mono mt-1 ${m.direction === 'up' ? 'text-emerald-400' : m.direction === 'down' ? 'text-red-400' : 'text-text'}`}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Report Sections */}
            <div className="space-y-12">
              {activeReport.sections.map((section, idx) => (
                <React.Fragment key={idx}>
                  <section className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    <div className="text-text leading-relaxed text-lg pl-0 md:pl-12">
                      {section.content}
                    </div>
                  </section>
                  
                  {/* Ad after Section 1 */}
                  {idx === 0 && (
                    <div className="py-8 border-y border-border/50 my-12">
                       <div className="flex flex-col items-center gap-4">
                          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Research Sponsor</span>
                          <AdUnit size="leaderboard" partner="binance" />
                       </div>
                    </div>
                  )}

                  {idx > 0 && idx < activeReport.sections.length - 1 && (
                    <div className="border-b border-border my-12" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 pt-12 border-t border-border">
               <AffiliateCTA 
                  partner="TradingView" 
                  text="Chart these signal yourself with pro-level tools." 
                  ctaLabel="Try TradingView Pro" 
                  href="#" 
                  variant="banner" 
               />
            </div>
          </div>

          {/* Sticky Reader Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-8">
               <AdUnit size="medium" partner="ledger" label="Sponsored Content" />
               
               <div className="p-6 bg-surface border border-border rounded-xl">
                  <h4 className="font-bold text-sm mb-4">Related Intelligence</h4>
                  <div className="space-y-4">
                     {REPORTS.filter(r => r.id !== activeReport.id).slice(0, 2).map(r => (
                        <div key={r.id} className="group cursor-pointer" onClick={() => setActiveReportId(r.id)}>
                           <p className="text-[10px] text-primary font-bold uppercase mb-1">{r.date}</p>
                           <h5 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">{r.title}</h5>
                        </div>
                     ))}
                  </div>
               </div>

               <AdUnit size="skyscraper" partner="kucoin" label="Market Liquidity" />
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-background to-surface p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Globe size={22} className="text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold">Macro Intel</h1>
          </div>
          <p className="text-text-muted max-w-2xl leading-relaxed">
            You are a professional investor. Here is what is happening in the world. Here is how it flows through traditional markets into crypto. Here is what questions you should be asking.
          </p>
        </div>
      </div>

      <div className="mt-8 mb-4 flex justify-center">
        <AdUnit size="leaderboard" partner="coinledger" label="Data Sponsor" />
      </div>

      <LiveMacroBar />

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-3 pb-2 scroll-smooth">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl border transition-all duration-300 whitespace-nowrap shrink-0
              ${activeTab === tab.id
                ? 'border-primary/50 text-primary bg-primary/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                : 'border-border text-text-muted hover:text-text hover:bg-surface hover:border-primary/30'
              }`}
          >
            {tab.icon}
            {tab.label}
            {tab.isPro && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-400 font-bold">
                <Lock size={9} /> PRO
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reports Grid with Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => setActiveReportId(report.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Globe size={48} className="mx-auto text-text-muted/30 mb-4" />
              <h3 className="text-lg font-bold text-text-muted mb-2">No reports in this category yet</h3>
              <p className="text-sm text-text-muted/70">Check back soon. New intelligence is published weekly.</p>
            </div>
          )}
        </div>

        {/* List Sidebar Ad */}
        <aside className="hidden xl:flex flex-col gap-6">
          <AdUnit size="medium" partner="kucoin" label="Sponsored Integration" />
          <div className="leather-card p-6 rounded-xl border-dashed border-border flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <ArchiveIcon size={24} />
             </div>
             <h4 className="font-bold text-sm mb-2">Institutional Archive</h4>
             <p className="text-xs text-text-muted mb-4">Access 5+ years of historical macro data and cross-asset correlations.</p>
             <Button variant="secondary" size="sm" isFullWidth>Unlock with Pro</Button>
          </div>
          <AdUnit size="skyscraper" partner="3commas" label="Trading Tools" />
        </aside>
      </div>
    </div>
  );
};

export default MacroIntel;
