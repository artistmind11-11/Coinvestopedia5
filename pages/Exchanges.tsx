import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  Shield, ChevronDown, ChevronUp, ExternalLink, AlertTriangle, Check, X as XIcon,
  DollarSign, Globe, Server, Clock, Info, ArrowRight, BarChart2, Layers, Scale,
  Star, CheckCircle, MinusCircle, Trophy, Building, Droplets, TrendingDown, Repeat, Lock, Coins
} from 'lucide-react';
import {
  EXCHANGES, BEST_FOR_CARDS, FAQ_DATA, AFFILIATE_BANNERS, REGIONS,
  ExchangeProfile, Grade, CustodyModel, PoRStatus
} from '../data/exchanges';
import { ExchangeCard } from '../components/exchanges/ExchangeCard';
import { AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { PulseIcon } from '../components/AnimatedIcons';

// Custom dimension colors for charts matching default Coinvestopedia palette
const ICON_MAP: Record<string, React.FC<any>> = {
  Trophy, Building, Droplets, TrendingDown, Shield, Globe, Repeat, Lock, Coins
};

// ─── Utility helpers ──────────────────────────────────────────────

const getScoreColorHex = (score: number) => {
  if (score >= 85) return '#10b981'; // emerald-500
  if (score >= 70) return '#94a3b8'; // slate-400
  if (score >= 50) return '#f87171'; // red-400
  return '#ef4444'; // red-500
};

const getRankColorHex = (index: number, total: number) => {
  if (total <= 1) return '#10b981';
  const pct = index / (total - 1);
  if (pct <= 0.33) return '#10b981'; // Green for top 3rd
  if (pct <= 0.66) return '#94a3b8'; // Grey for middle 3rd
  return '#ef4444'; // Red for bottom 3rd
};

const gradeColor = (g: Grade) => {
  switch (g) {
    case 'INSTITUTIONAL': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'PROFESSIONAL': return 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20';
    case 'ACTIVE_TRADER': return 'bg-slate-400/10 text-slate-400 border border-slate-400/20';
  }
};

const gradeLabel = (g: Grade) => g.replace('_', ' ');

const scoreColor = (s: number) => {
  if (s >= 85) return 'text-emerald-400';
  if (s >= 70) return 'text-slate-400';
  return 'text-red-400';
};

const scoreBarColor = (s: number) => {
  if (s >= 85) return 'bg-emerald-500';
  if (s >= 70) return 'bg-slate-400';
  return 'bg-red-500';
};

const regStatusIcon = (s: string) => {
  switch (s) {
    case 'LICENSED': return <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">🟢 Licensed</span>;
    case 'REGISTERED': return <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold">⚪ Registered</span>;
    case 'RESTRICTED': return <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold">🔴 Restricted</span>;
    default: return <span className="inline-flex items-center gap-1 text-text-muted text-xs font-bold">⚫ N/A</span>;
  }
};

const formatCurrency = (n: number) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

// ─── Section: Header ──────────────────────────────────────────────

const PageHeader: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="leather-card relative overflow-hidden rounded-2xl p-8 lg:p-12 mb-8 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-6">
          <PulseIcon /> ClearRate™
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
          Exchange Intelligence
        </h1>
        
        <p className="text-lg text-text-muted max-w-3xl mb-4 leading-relaxed">
          10 exchanges. 7 scoring dimensions. Zero editorial bias.
        </p>
        <p className="text-sm text-text-muted max-w-3xl mb-10 leading-relaxed opacity-80">
          Every exchange rating you've read was written to drive clicks. ClearRate™ is different — a quantitative
          scoring model built on the same due diligence framework institutional allocators use before onboarding
          a new prime broker.
        </p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: '10', label: 'Exchanges Scored' },
            { value: '7', label: 'Weighted Dimensions' },
            { value: '$2.3T+', label: 'Combined 30D Volume' },
            { value: 'Monthly', label: 'Updated' },
          ].map((m, i) => (
            <div key={i} className="p-4 bg-background/40 border border-border rounded-xl text-center backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="text-xl md:text-2xl font-bold text-primary mb-1">{m.value}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{m.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => scrollTo('compare-tool')}>
            Compare Exchanges
          </Button>
          <Button variant="secondary" onClick={() => scrollTo('exchange-profiles')}>
            View Top Ranked
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Section: Methodology ─────────────────────────────────────────

const MethodologySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dimensions = [
    { name: 'Regulatory Compliance', short: 'Regulatory', weight: '25%', icon: <Scale size={16} />, sources: 'NYDFS, FCA, MAS, VARA, SEC filings, VASP registrations' },
    { name: 'Liquidity Depth', short: 'Liquidity', weight: '20%', icon: <Layers size={16} />, sources: 'Order book depth at 1%, 2%, 5% slippage; 30D spot + derivatives volume' },
    { name: 'Fee Structure', short: 'Fees', weight: '20%', icon: <DollarSign size={16} />, sources: 'Maker/taker at 5 volume tiers; withdrawal fees; spread analysis' },
    { name: 'Custody & Security', short: 'Custody', weight: '15%', icon: <Shield size={16} />, sources: 'Cold storage %, insurance coverage, audit history, PoR publication' },
    { name: 'Asset Coverage', short: 'Assets', weight: '10%', icon: <Layers size={16} />, sources: 'Spot pairs, perpetuals, options, margin, tokenized assets' },
    { name: 'Institutional Infrastructure', short: 'Infrastructure', weight: '5%', icon: <Server size={16} />, sources: 'FIX API, sub-accounts, OTC desk, prime brokerage, custody separation' },
    { name: 'Operational Track Record', short: 'Track Record', weight: '5%', icon: <Clock size={16} />, sources: 'Years operational, downtime incidents, hack history, litigation' },
  ];

  const methodologyRadarData = React.useMemo(() => dimensions.map(d => ({
    subject: d.short,
    weight: parseInt(d.weight),
    fullMark: 25
  })), []);

  const tiers = [
    { range: '90–100', label: 'Institutional Grade', desc: 'Suitable for compliance-constrained mandates.', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { range: '80–89', label: 'Professional Grade', desc: 'Suitable for sophisticated investors with custody controls.', color: 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20' },
    { range: '70–79', label: 'Active Trader Grade', desc: 'Acceptable for discretionary crypto-native strategies.', color: 'bg-slate-400/10 text-slate-400 border border-slate-400/20' },
    { range: '<70', label: 'Heightened Risk', desc: 'Appropriate only with full due diligence and position limits.', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  ];

  return (
    <section id="methodology">
      <Card
        variant="interactive"
        className="w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">How We Score — ClearRate™ Methodology</h2>
              <p className="text-sm text-text-muted">7 weighted dimensions, 100-point institutional scoring model</p>
            </div>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-text-muted transition-transform" /> : <ChevronDown size={20} className="text-text-muted transition-transform" />}
        </div>
      </Card>

      {isOpen && (
        <Card className="mt-3 space-y-8 animate-fade-in p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Scoring dimensions */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Scale size={18} className="text-primary" /> Scoring Model (100-pt Scale)</h3>
              <div className="space-y-3">
                {dimensions.map((d, i) => (
                  <div key={i} className="flex flex-col gap-2.5 p-4 bg-surface rounded-xl border border-border group hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-primary">{d.icon}</span>
                        <span className="font-bold text-sm" style={{ color: getScoreColorHex(parseInt(d.weight) * 4) }}>{d.name}</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-bold rounded flex-shrink-0" style={{ backgroundColor: `${getScoreColorHex(parseInt(d.weight) * 4)}20`, color: getScoreColorHex(parseInt(d.weight) * 4) }}>
                        {d.weight}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted text-left leading-relaxed">{d.sources}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart side */}
            <div className="flex flex-col h-full bg-surface/50 rounded-2xl border border-border overflow-hidden">
               <div className="p-4 border-b border-border bg-background/50 flex justify-between items-center z-10">
                  <h3 className="font-bold text-sm">Dimension Weights Breakdown</h3>
                  <PulseIcon />
               </div>
               <div className="h-[300px] lg:h-full min-h-[300px] w-full relative pl-2 pt-4 flex-1">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none"></div>
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="70%" data={methodologyRadarData}>
                        <PolarGrid stroke="#3A3F4B" strokeDasharray="3 3"/>
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} />
                        <RechartsTooltip 
                           contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#333842', borderRadius: '8px' }}
                           itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Radar name="Weight (%)" dataKey="weight" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Score interpretation */}
          <div>
            <h3 className="text-lg font-bold mb-4">Score Interpretation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tiers.map((t, i) => (
                <div key={i} className={`p-4 rounded-xl leather-card ${t.color}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-black">{t.range}</span>
                    <span className="text-sm font-bold">{t.label}</span>
                  </div>
                  <p className="text-xs opacity-80">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-text-muted italic border-t border-border pt-4">
            ClearRate™ scores reflect publicly available data and editorial analysis. Scores do not constitute investment advice.
            Coinvestopedia may receive referral compensation; commercial relationships do not influence scores.
          </p>
        </Card>
      )}
    </section>
  );
};

// ─── Section: Best For Grid ───────────────────────────────────────

const BestForGrid: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Quick Pick — Best Exchange For…
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BEST_FOR_CARDS.map((card) => {
          const exchange = EXCHANGES.find(e => e.id === card.exchangeId)!;
          return (
            <Card
              key={card.exchangeId}
              variant="interactive"
              className="h-full relative overflow-hidden"
              onClick={() => scrollTo(card.exchangeId)}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] group-hover:bg-primary/20 transition-all duration-300">
                      {(() => {
                        const IconComponent = ICON_MAP[(card as any).iconName] || Trophy;
                        return <IconComponent size={20} strokeWidth={2} />;
                      })()}
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded flex-shrink-0 ${scoreColor(exchange.clearRateScore)} bg-surface border border-border group-hover:border-primary/30 transition-colors`}>
                      {exchange.clearRateScore}/100
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{card.label}</h3>
                  <p className="text-sm text-text-muted mb-4">{exchange.name}</p>
                </div>
                <div className="flex items-center gap-1 text-primary text-[13px] font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300">
                  {card.cta} <ArrowRight size={14} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

// ─── Exchange Profiles Section ────────────────────────────────────

const ExchangeProfilesSection: React.FC = () => {
  return (
    <section id="exchange-profiles" className="space-y-4 scroll-mt-32">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Top 10 Exchange Profiles
      </h2>
      <p className="text-sm text-text-muted mb-4">Ranked by ClearRate™ Score</p>

      {EXCHANGES.map((exchange, index) => (
        <React.Fragment key={exchange.id}>
          <ExchangeCard exchange={exchange} rank={index + 1} />
          {index === 2 && <AffiliateBanner banner={AFFILIATE_BANNERS[0]} />}
          {index === 7 && <AffiliateBanner banner={AFFILIATE_BANNERS[2]} />}
        </React.Fragment>
      ))}
    </section>
  );
};

// ─── Affiliate Banner ─────────────────────────────────────────────

const AffiliateBanner: React.FC<{ banner: typeof AFFILIATE_BANNERS[0] }> = ({ banner }) => (
  <div className="p-6 bg-surface border border-primary/20 rounded-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <h3 className="font-bold text-base mb-1">{banner.title}</h3>
        <p className="text-text-muted text-sm">{banner.body}</p>
      </div>
      <a 
        href={banner.ctaUrl} 
        target="_blank" 
        rel="noopener sponsored"
        className="px-6 py-2.5 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2"
      >
        {banner.cta} <sup className="text-[10px] opacity-70">A</sup>
      </a>
    </div>
  </div>
);

// ─── Section: Comparison Tool ─────────────────────────────────────

const ComparisonTool: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['coinbase', 'kraken', 'binance']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedExchanges = useMemo(() =>
    selected.map(id => EXCHANGES.find(e => e.id === id)!).filter(Boolean),
    [selected]
  );

  const toggleExchange = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const comparisonRows = [
    { label: 'ClearRate™ Score', key: 'clearRateScore', render: (e: ExchangeProfile) => <span className={`font-black text-lg ${scoreColor(e.clearRateScore)}`}>{e.clearRateScore}/100</span> },
    { label: 'Grade', key: 'grade', render: (e: ExchangeProfile) => <span className={`text-xs font-bold px-2 py-1 rounded ${gradeColor(e.grade)}`}>{gradeLabel(e.grade)}</span> },
    { label: 'Licenses', key: 'regulatoryLicenses', render: (e: ExchangeProfile) => <div className="flex flex-wrap gap-1 justify-center">{e.regulatoryLicenses.slice(0, 3).map((l, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-surface border border-border rounded">{l}</span>)}</div> },
    { label: 'Spot Maker', key: 'makerFee', render: (e: ExchangeProfile) => <span className="font-bold">{e.fees.spotMaker < 0 ? `${(e.fees.spotMaker * 100).toFixed(3)}% (rebate)` : `${(e.fees.spotMaker * 100).toFixed(3)}%`}</span> },
    { label: 'Spot Taker', key: 'takerFee', render: (e: ExchangeProfile) => <span className="font-bold">{e.fees.spotTaker < 0 ? `${(e.fees.spotTaker * 100).toFixed(3)}% (rebate)` : `${(e.fees.spotTaker * 100).toFixed(3)}%`}</span> },
    { label: 'Derivatives', key: 'derivatives', render: (e: ExchangeProfile) => <span className="text-sm">{e.derivatives.length > 0 ? e.derivatives.join(', ') : 'None'}</span> },
    { label: 'Custody', key: 'custodyModel', render: (e: ExchangeProfile) => <span className="text-sm font-medium">{e.custodyModel.replace('_', '-')}</span> },
    { label: 'Insurance', key: 'insuranceCoverage', render: (e: ExchangeProfile) => <span className="text-sm font-medium">{e.insuranceCoverage || 'N/A'}</span> },
    { label: 'Proof of Reserves', key: 'proofOfReserves', render: (e: ExchangeProfile) => <span className="text-sm">{e.proofOfReserves === 'FULL_AUDIT' ? '✅ Full' : e.proofOfReserves === 'MERKLE_ATTESTATION' ? '🟡 Partial' : '❌ None'}</span> },
    { label: 'US Eligible', key: 'usPersonsEligible', render: (e: ExchangeProfile) => {
      if (e.usPersonsEligible === true) return <Check size={16} className="text-emerald-400" />;
      if (e.usPersonsEligible === false) return <XIcon size={16} className="text-red-400" />;
      return <span className="text-amber-400 text-xs font-bold">Limited</span>;
    }},
    { label: 'OTC Desk', key: 'otcDesk', render: (e: ExchangeProfile) => e.otcDeskMinimum !== null ? <Check size={16} className="text-emerald-400" /> : <XIcon size={16} className="text-red-400" /> },
    { label: 'FIX API', key: 'fixApi', render: (e: ExchangeProfile) => e.fixApi ? <Check size={16} className="text-emerald-400" /> : <XIcon size={16} className="text-red-400" /> },
    { label: 'Years Operational', key: 'yearsOperational', render: (e: ExchangeProfile) => <span className="font-bold">{e.founded ? new Date().getFullYear() - e.founded : '-'}</span> },
    { label: 'Risk Flags', key: 'riskFlags', render: (e: ExchangeProfile) => (
      <span className={`text-sm font-bold ${e.riskFlags.length === 0 ? 'text-emerald-400' : e.riskFlags.some(f => f.includes('⚠️')) ? 'text-red-400' : 'text-amber-400'}`}>
        {e.riskFlags.length === 0 ? 'None' : `${e.riskFlags.length} active`}
      </span>
    )},
  ];

  const getBestId = (key: string): string | null => {
    if (!selectedExchanges.length) return null;
    switch (key) {
      case 'clearRateScore': return selectedExchanges.reduce((a, b) => a.clearRateScore > b.clearRateScore ? a : b).id;
      case 'takerFee': return selectedExchanges.reduce((a, b) => a.fees.spotTaker < b.fees.spotTaker ? a : b).id;
      case 'makerFee': return selectedExchanges.reduce((a, b) => a.fees.spotMaker < b.fees.spotMaker ? a : b).id;
      case 'yearsOperational': return selectedExchanges.reduce((a, b) => a.founded < b.founded ? a : b).id;
      default: return null;
    }
  };

  return (
    <section id="compare-tool" className="scroll-mt-32">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Side-by-Side Comparison Tool
      </h2>

      {/* Exchange selector */}
      <div className="mb-6 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full leather-card rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${isDropdownOpen ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/5' : 'hover:border-primary/30 hover:bg-primary/5 hover:shadow-md'}`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-muted mr-2">Comparing:</span>
            {selectedExchanges.map(e => (
              <span key={e.id} className="px-3 py-1 bg-surface border border-border text-text font-medium text-xs rounded-lg shadow-sm">
                {e.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-bold">{selected.length}/4</span>
            <ChevronDown size={18} className={`text-text-muted transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl shadow-black/20 z-30 p-2 max-h-64 overflow-y-auto">
            {EXCHANGES.map(e => (
              <button
                key={e.id}
                onClick={() => toggleExchange(e.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm hover:bg-background transition-colors ${
                  selected.includes(e.id) ? 'text-primary' : 'text-text-muted'
                }`}
                disabled={!selected.includes(e.id) && selected.length >= 4}
              >
                <span className="font-medium">{e.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${scoreColor(e.clearRateScore)}`}>{e.clearRateScore}</span>
                  {selected.includes(e.id) && <Check size={16} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison table */}
      <Card className="p-0 overflow-hidden leather-card group">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-text-muted w-40">Dimension</th>
                {selectedExchanges.map(e => (
                  <th key={e.id} className="p-4 text-center">
                    <div className="text-sm font-bold">{e.name}</div>
                    <div className={`text-[10px] font-bold mt-1 ${scoreColor(e.clearRateScore)}`}>{e.clearRateScore}/100</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => {
                const bestId = getBestId(row.key);
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="p-4 text-xs font-bold text-text-muted">{row.label}</td>
                    {selectedExchanges.map(e => (
                      <td key={e.id} className={`p-4 text-center ${bestId === e.id ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-center justify-center gap-1">
                          {row.render(e)}
                          {bestId === e.id && (
                            <span className="ml-1 text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">BEST</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
             <tfoot>
              <tr className="border-t border-border">
                <td className="p-4"></td>
                {selectedExchanges.map(e => (
                  <td key={e.id} className="p-4 text-center">
                    <a 
                      href={e.affiliateUrl} 
                      target="_blank" 
                      rel="noopener sponsored"
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-background font-bold text-xs rounded-lg transition-all border border-primary/20"
                    >
                      Open Account <sup className="text-[8px] opacity-70 ml-0.5">A</sup>
                    </a>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </section>
  );
};

// ─── Section: Fee Calculator ──────────────────────────────────────

const FeeCalculator: React.FC = () => {
  const [volume, setVolume] = useState(1000000);
  const [tradeType, setTradeType] = useState<'spot' | 'perpetuals'>('spot');
  const [selectedIds, setSelectedIds] = useState<string[]>(['coinbase', 'kraken', 'binance', 'okx', 'hyperliquid']);

  const volumeSteps = [10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000];

  const results = useMemo(() => {
    return selectedIds.map(id => {
      const ex = EXCHANGES.find(e => e.id === id);
      if (!ex) return null;
      const monthlyVolume = volume;
      const annualVolume = monthlyVolume * 12;
      const feeRate = tradeType === 'spot' ? ex.fees.spotTaker : ex.fees.perpTaker;
      const annualCost = annualVolume * feeRate;
      return { exchange: ex, annualCost, feeRate };
    }).filter(Boolean) as { exchange: ExchangeProfile; annualCost: number; feeRate: number }[];
  }, [volume, tradeType, selectedIds]);

  const chartData = useMemo(() => {
    return volumeSteps.map(vol => {
      const point: any = { volume: vol, name: formatCurrency(vol) };
      selectedIds.forEach(id => {
        const ex = EXCHANGES.find(e => e.id === id);
        if (ex) {
           point[ex.name] = vol * 12 * (tradeType === 'spot' ? ex.fees.spotTaker : ex.fees.perpTaker);
        }
      });
      return point;
    });
  }, [selectedIds, volumeSteps]);

  const sortedResults = useMemo(() => [...results].sort((a, b) => a.annualCost - b.annualCost), [results]);
  const cheapest = sortedResults[0];
  const mostExpensive = sortedResults[sortedResults.length - 1];

  const toggleCalcExchange = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  return (
    <section id="fee-calculator" className="scroll-mt-32">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Fee Calculator
      </h2>

      <Card className="space-y-6 relative overflow-hidden leather-card border-none">
        <div className="absolute inset-0 bg-surface/80" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 space-y-8">
        {/* Volume slider */}
        <div>
          <label className="text-sm font-bold mb-3 block">Monthly Trading Volume</label>
          <input
            type="range"
            min={0}
            max={volumeSteps.length - 1}
            value={volumeSteps.indexOf(volumeSteps.reduce((prev, curr) => Math.abs(curr - volume) < Math.abs(prev - volume) ? curr : prev))}
            onChange={(e) => setVolume(volumeSteps[parseInt(e.target.value)])}
            className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-text-muted">$10K</span>
            <span className="text-lg font-black text-primary">{formatCurrency(volume)}</span>
            <span className="text-xs text-text-muted">$100M</span>
          </div>
        </div>

        {/* Trade type */}
        <div>
          <label className="text-sm font-bold mb-3 block">Trade Type</label>
          <div className="flex gap-2">
            {(['spot', 'perpetuals'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTradeType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  tradeType === t ? 'bg-primary text-background' : 'bg-surface border border-border text-text-muted hover:text-text hover:border-primary/30'
                }`}
              >
                {t === 'spot' ? 'Spot' : 'Perpetuals'}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange chips */}
        <div>
          <label className="text-sm font-bold mb-3 block">Select Exchanges (max 5)</label>
          <div className="flex flex-wrap gap-2">
            {EXCHANGES.map(e => (
              <button
                key={e.id}
                onClick={() => toggleCalcExchange(e.id)}
                disabled={!selectedIds.includes(e.id) && selectedIds.length >= 5}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedIds.includes(e.id) ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface border border-border text-text-muted hover:text-text hover:border-primary/30'
                } disabled:opacity-30`}
              >
                {e.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {sortedResults.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
               <DollarSign size={16} className="text-primary" /> Annual Fee Cost Estimate
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-3">
                 {sortedResults.map((r, i) => {
                   const savings = mostExpensive ? mostExpensive.annualCost - r.annualCost : 0;
                   const maxCost = mostExpensive?.annualCost || 1;
                   return (
                     <div key={r.exchange.id} className={`p-4 rounded-xl transition-all ${i === 0 ? 'bg-primary/10 border border-primary/30' : 'bg-surface border border-border group-hover:border-primary/20'}`}>
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-3">
                           {i === 0 && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">BEST VALUE</span>}
                           <span className="font-bold text-sm">{r.exchange.name}</span>
                         </div>
                         <div className="text-right">
                           <div className="font-black text-lg">{formatCurrency(r.annualCost)}<span className="text-xs text-text-muted font-normal">/yr</span></div>
                           {savings > 0 && <div className="text-[10px] text-emerald-400 font-bold">Save {formatCurrency(savings)} vs worst</div>}
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>

               {/* Fee AreaChart */}
               <div className="bg-background/80 rounded-xl border border-border p-4 h-[300px]">
                 <h4 className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider text-center">Cost Scaling Over Volume</h4>
                 <div className="w-full h-full pb-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                          {selectedIds.map((id) => {
                             const rankIndex = sortedResults.findIndex(r => r.exchange.id === id);
                             const color = getRankColorHex(rankIndex, selectedIds.length);
                             return (
                               <linearGradient key={`color-${id}`} id={`color-${id}`} x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                                 <stop offset="95%" stopColor={color} stopOpacity={0}/>
                               </linearGradient>
                             );
                          })}
                       </defs>
                       <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                       <RechartsTooltip 
                         contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#333842', borderRadius: '8px' }}
                         itemStyle={{ fontSize: 12, fontWeight: 'bold' }}
                         formatter={(value: number) => [formatCurrency(value), 'Annual Fee']}
                       />
                       {selectedIds.map((id) => {
                          const ex = EXCHANGES.find(e => e.id === id);
                          if (!ex) return null;
                          const rankIndex = sortedResults.findIndex(r => r.exchange.id === id);
                          const color = getRankColorHex(rankIndex, selectedIds.length);
                          return (
                             <Area 
                               key={id} 
                               type="monotone" 
                               dataKey={ex.name} 
                               stroke={color} 
                               fillOpacity={1} 
                               fill={`url(#color-${id})`} 
                               strokeWidth={2}
                             />
                          );
                       })}
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>

            {/* Smart CTA */}
            {cheapest && mostExpensive && cheapest.exchange.id !== mostExpensive.exchange.id && (
              <div className="p-5 bg-primary/10 border border-primary/30 rounded-xl mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  At this volume, <strong className="text-primary font-black">{cheapest.exchange.name}</strong> saves you{' '}
                  <strong className="text-primary font-black">{formatCurrency(mostExpensive.annualCost - cheapest.annualCost)}</strong> annually
                  vs. {mostExpensive.exchange.name}.
                </p>
                <a href={cheapest.exchange.affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                  <Button className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Open Account <sup className="text-[10px] opacity-70 ml-0.5">A</sup>
                    <ExternalLink size={14} className="ml-1" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}
        </div>
      </Card>

      {/* Fee optimization banner */}
      <div className="mt-4">
        <AffiliateBanner banner={AFFILIATE_BANNERS[1]} />
      </div>
    </section>
  );
};

// ─── Section: Regulatory Matrix ───────────────────────────────────

const RegulatoryMatrix: React.FC = () => {
  return (
    <section id="regulatory-matrix" className="scroll-mt-32">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Regulatory Status Matrix
      </h2>

      <Card className="p-0 overflow-hidden leather-card group">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-text-muted">Exchange</th>
                {REGIONS.map(r => (
                  <th key={r} className="p-4 text-center text-xs font-bold uppercase tracking-wider text-text-muted">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXCHANGES.map(e => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-sm">{e.name}</span>
                  </td>
                  {REGIONS.map(r => (
                    <td key={r} className="p-4 text-center">
                      {regStatusIcon(e.regulatoryMap[r])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="p-4 border-t border-border flex flex-wrap gap-4 text-xs text-text-muted">
          <span>🟢 Active regulatory license</span>
          <span>🟡 VASP or equivalent registration</span>
          <span>🔴 Not available or enforcement action</span>
          <span>⚫ Decentralized; no geographic restriction</span>
        </div>
      </Card>
    </section>
  );
};

// ─── Section: FAQ Accordion ───────────────────────────────────────

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-border rounded-sm inline-block"></span>
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {FAQ_DATA.map((faq, i) => (
          <Card key={i} variant="interactive" className="p-0 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-5 flex items-center justify-between text-left group"
            >
              <span className="font-bold text-sm pr-4 group-hover:text-primary transition-colors">{faq.q}</span>
              <ChevronDown size={18} className={`text-text-muted flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 animate-fade-in">
                <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

// ─── Section: Disclaimer ──────────────────────────────────────────

const DisclaimerSection: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section>
      <div className="mt-8 p-4 bg-surface/50 border border-border rounded-xl text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-text-muted font-bold text-sm uppercase tracking-wider">
            <Shield size={14} />
            <span>ClearRate™ Affiliate & Editorial Disclosure</span>
          </div>
          <div className="space-y-3 text-xs text-text-muted leading-relaxed max-w-2xl">
            <p>
              Coinvestopedia operates the ClearRate™ Exchange Intelligence product independently
              of commercial relationships. Scores reflect quantitative analysis of publicly available data
              and are not influenced by affiliate compensation.
            </p>
            <p>
              Coinvestopedia may receive referral fees when users open accounts via links on this
              page. Commercial relationships are disclosed with an <span className="text-primary font-bold">[A]</span> badge.
            </p>
            <p>
              This page is for informational purposes only and does not constitute financial,
              investment, or legal advice. Cryptocurrency trading involves significant risk of loss.
            </p>
            <p className="text-text-muted/60 italic">
              ClearRate™ scores updated monthly. Last updated: {currentDate}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main Page ────────────────────────────────────────────────────

export const Exchanges: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-10 lg:space-y-14 pb-12">
      <PageHeader />
      <MethodologySection />
      <BestForGrid />
      <ExchangeProfilesSection />
      <ComparisonTool />
      <FeeCalculator />
      <RegulatoryMatrix />
      <FAQAccordion />
      <DisclaimerSection />
    </div>
  );
};

export default Exchanges;
