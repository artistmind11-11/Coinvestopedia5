import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Table, { Column } from '../components/Table';
import {
  Search, Sparkles, ExternalLink, X, Tag, Edit2, Save, Filter,
  Copy, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Activity, Globe, Zap, Eye, Clock, BarChart2,
  ChevronRight, Info, Target, Shield, Flame
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { analyzeAssetMovement, InsightResult } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { PulseIcon } from '../components/AnimatedIcons';
import { fetchWhaleAlerts, fetchMempoolTxs } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhaleTx {
  id: string;
  time: string;
  amount: string;
  assetCode: string;
  value: string;
  valueNumeric: number;
  amountNumeric: number;
  from: string;
  to: string;
  type: 'inflow' | 'outflow' | 'transfer';
}

// ─── Mock Data Generation ─────────────────────────────────────────────────────

const generateEthAddress = () => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * 16)];
  return addr;
};

const generateAllTransactions = (count: number): WhaleTx[] => {
  const assets = ['BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC', 'ADA', 'AVAX'];
  const knownExchanges = ['KuCoin Hot Wallet', 'Coinbase 2', 'Kraken 4', 'OKX Cold Storage', 'Huobi 3', 'Binance 8', 'Bybit Hot Wallet'];
  const rawAddresses = Array.from({ length: 20 }, generateEthAddress);
  const allEntities = [...knownExchanges, ...rawAddresses];

  return Array.from({ length: count }).map((_, i) => {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amountVal = Math.floor(Math.random() * 10000) + 100;
    const valueNum = amountVal * (Math.random() * 1000 + 10);
    const from = allEntities[Math.floor(Math.random() * allEntities.length)];
    let to = allEntities[Math.floor(Math.random() * allEntities.length)];
    while (from === to) to = allEntities[Math.floor(Math.random() * allEntities.length)];

    const isFromExchange = knownExchanges.includes(from);
    const isToExchange = knownExchanges.includes(to);
    const type: 'inflow' | 'outflow' | 'transfer' = !isFromExchange && isToExchange ? 'inflow' : isFromExchange && !isToExchange ? 'outflow' : 'transfer';

    return {
      id: `tx-${i}`,
      time: `${Math.floor(Math.random() * 59) + 1}m ago`,
      amount: `${amountVal.toLocaleString()} ${asset}`,
      assetCode: asset,
      value: `$${(valueNum / 1e6).toFixed(1)}M`,
      valueNumeric: valueNum,
      amountNumeric: amountVal,
      from,
      to,
      type,
    };
  });
};

const ALL_MOCK_TRANSACTIONS = generateAllTransactions(150);

// ─── Flow Chart Data ──────────────────────────────────────────────────────────

const flowData = [
  { time: '00:00', inflow: 120, outflow: 80 },
  { time: '03:00', inflow: 95, outflow: 110 },
  { time: '06:00', inflow: 150, outflow: 90 },
  { time: '09:00', inflow: 180, outflow: 120 },
  { time: '12:00', inflow: 140, outflow: 200 },
  { time: '15:00', inflow: 220, outflow: 150 },
  { time: '18:00', inflow: 250, outflow: 180 },
  { time: '21:00', inflow: 300, outflow: 210 },
];

const assetFlowData = [
  { asset: 'BTC', inflow: 450, outflow: 320, color: '#F7931A' },
  { asset: 'ETH', inflow: 280, outflow: 390, color: '#627EEA' },
  { asset: 'SOL', inflow: 190, outflow: 120, color: '#14F195' },
  { asset: 'USDT', inflow: 310, outflow: 280, color: '#26A17B' },
  { asset: 'XRP', inflow: 140, outflow: 100, color: '#00AAE4' },
];

// ─── Ad Unit Component ────────────────────────────────────────────────────────

const AdBanner: React.FC<{ variant?: 'leaderboard' | 'rectangle' | 'sidebar' }> = ({ variant = 'rectangle' }) => {
  const partners = [
    { name: 'KuCoin', offer: 'Up to 700 USDT Welcome Bonus', color: '#24AE8F', bg: 'from-[#051813] to-[#0d3028]', cta: 'Claim Bonus' },
    { name: 'Bybit', offer: 'Trade Perps with 0.01% Maker Fee', color: '#F7A600', bg: 'from-[#1a1200] to-[#2d1e00]', cta: 'Start Trading' },
    { name: 'Ledger', offer: 'Secure Your Assets. Hardware Wallet.', color: '#4B5563', bg: 'from-[#0f0f0f] to-[#1c1c1c]', cta: 'Get Ledger' },
  ];
  const p = partners[Math.floor(Math.random() * partners.length)];

  if (variant === 'leaderboard') {
    return (
      <div className={`w-full h-[90px] rounded-xl bg-gradient-to-r ${p.bg} border border-white/10 flex items-center justify-between px-8 relative overflow-hidden`}>
        <span className="absolute top-2 right-3 text-[9px] text-white/30 font-bold uppercase tracking-widest">Sponsored</span>
        <div>
          <div className="text-white font-black text-lg">{p.name}</div>
          <div className="text-white/60 text-sm">{p.offer}</div>
        </div>
        <a href="#" className="px-5 py-2 rounded-lg text-sm font-bold text-white border border-white/20 hover:border-white/50 transition-colors" style={{ color: p.color, borderColor: p.color + '40' }}>
          {p.cta} <ArrowUpRight size={14} className="inline" />
        </a>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-xl bg-gradient-to-br ${p.bg} border border-white/10 p-5 relative overflow-hidden`}>
      <span className="absolute top-2 right-3 text-[9px] text-white/30 font-bold uppercase tracking-widest">Ad</span>
      <div className="text-white font-black text-xl mb-1">{p.name}</div>
      <div className="text-white/60 text-xs mb-4">{p.offer}</div>
      <a href="#" className="block text-center py-2.5 rounded-lg text-xs font-bold transition-all" style={{ backgroundColor: p.color, color: '#000' }}>
        {p.cta}
      </a>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  direction?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}> = ({ label, value, sub, direction = 'neutral', icon }) => {
  const colorClass = direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-red-400' : 'text-primary';
  return (
    <div className="leather-card rounded-xl p-4 lg:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{label}</span>
        <div className={`p-1.5 rounded-lg bg-current/10 ${colorClass}`} style={{ backgroundColor: 'transparent' }}>
          {icon}
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold font-mono ${colorClass}`}>{value}</div>
        <div className="text-xs text-text-muted mt-0.5">{sub}</div>
      </div>
    </div>
  );
};

// ─── Address Cell ─────────────────────────────────────────────────────────────

const AddressCell: React.FC<{ address: string; labels: Record<string, string>; onCopy: (a: string) => void }> = ({ address, labels, onCopy }) => {
  const label = labels[address];
  const isRaw = address.startsWith('0x');
  const short = isRaw ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;

  return (
    <div className="flex flex-col">
      {label && (
        <span className="font-bold text-primary text-xs flex items-center gap-1">
          <Tag size={9} /> {label}
        </span>
      )}
      <div className="flex items-center gap-1 group/addr">
        <span className={`text-xs ${label ? 'text-text-muted' : 'font-mono text-text-muted'}`}>{short}</span>
        {isRaw && (
          <button onClick={(e) => { e.stopPropagation(); onCopy(address); }}
            className="opacity-0 group-hover/addr:opacity-100 text-text-muted hover:text-primary transition-all p-0.5">
            <Copy size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Exchange Flow Breakdown ──────────────────────────────────────────────────

const ExchangeFlowChart: React.FC = () => (
  <div className="leather-card rounded-xl p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-sm">Asset Flow Breakdown</h3>
      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">24h</span>
    </div>
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={assetFlowData} layout="vertical" margin={{ left: 10, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 9, fill: '#71717a' }} stroke="#3f3f46" tickFormatter={v => `$${v}M`} />
          <YAxis dataKey="asset" type="category" tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 700 }} stroke="none" width={35} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#171717', 
              borderColor: '#2a2a2a', 
              color: '#f4f4f5', 
              borderRadius: '10px', 
              border: '1px solid #2a2a2a',
              padding: '10px 14px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              fontSize: '13px',
              fontWeight: 600,
            }}
            cursor={{ fill: '#3f3f46', fillOpacity: 0.15 }}
            formatter={(v: number, name: string) => [`$${v}M`, name === 'inflow' ? 'To Exchange' : 'From Exchange']}
            labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#f4f4f5', fontWeight: 700 }}
          />
          <Bar dataKey="inflow" fill="#ef4444" fillOpacity={0.7} radius={[0, 3, 3, 0]} barSize={10} name="inflow" />
          <Bar dataKey="outflow" fill="#10b981" fillOpacity={0.7} radius={[0, 3, 3, 0]} barSize={10} name="outflow" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center gap-6 mt-2 text-[10px] font-bold text-text-muted">
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400/70 inline-block" /> To Exchange (Sell signal)</div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400/70 inline-block" /> From Exchange (Accumulation)</div>
    </div>
  </div>
);

// ─── Alert Feed ───────────────────────────────────────────────────────────────

const AlertFeed: React.FC = () => {
  const alerts = [
    { icon: <ArrowDownRight size={15} />, color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/10', text: 'Binance received $42M ETH inflow — potential selling pressure', time: '3m ago' },
    { icon: <ArrowUpRight size={15} />, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10', text: 'Unknown whale withdrew 1,200 BTC from Coinbase', time: '11m ago' },
    { icon: <Flame size={15} />, color: 'text-primary', bg: 'bg-primary/5 border-primary/10', text: 'SOL volume surge detected on Bybit — volatility expected', time: '28m ago' },
    { icon: <Target size={15} />, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10', text: 'Large buy order filled for 5,000 SOL at $138.45', time: '45m ago' },
    { icon: <Shield size={15} />, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10', text: 'Multi-sig wallet security change: Binance cold storage root key rotation', time: '1h ago' },
  ];

  return (
    <div className="leather-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Smart Alerts
        </h3>
        <div className="flex items-center gap-1.5">
          <PulseIcon />
          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Live Monitor</span>
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div key={i} className="group flex items-start gap-4 p-4 rounded-xl bg-surface/30 border border-border/40 hover:border-primary/30 hover:bg-surface/50 transition-all duration-300">
            <div className={`p-2.5 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-110 ${a.color} ${a.bg}`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-medium text-text leading-relaxed group-hover:text-primary-light transition-colors">{a.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock size={10} className="text-text-muted" />
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{a.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Ad slot inside alert feed */}
      <div className="mt-6 pt-6 border-t border-border/40">
        <AdBanner variant="rectangle" />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const WhaleTracker: React.FC = () => {
  const { addToast } = useAppContext();
  const [tableData, setTableData] = useState<WhaleTx[]>([]);
  const [fullDataset, setFullDataset] = useState<WhaleTx[]>(ALL_MOCK_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 15 });
  const [selectedTx, setSelectedTx] = useState<WhaleTx | null>(null);
  const [analysis, setAnalysis] = useState<InsightResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [walletLabels, setWalletLabels] = useState<Record<string, string>>({});
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inflow' | 'outflow' | 'transfer'>('all');

  const [activeView, setActiveView] = useState<'table' | 'alerts'>('table');

  // Load data
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [whaleAlerts] = await Promise.all([fetchWhaleAlerts(), fetchMempoolTxs()]);
        if (whaleAlerts?.length > 0) {
          const transformed = whaleAlerts.map((tx: any) => {
            const from = tx.from?.owner || tx.from?.address || 'Unknown';
            const to = tx.to?.owner || tx.to?.address || 'Unknown';
            const type: 'inflow' | 'outflow' | 'transfer' =
              tx.to?.owner_type === 'exchange' && tx.from?.owner_type !== 'exchange' ? 'inflow' :
              tx.from?.owner_type === 'exchange' && tx.to?.owner_type !== 'exchange' ? 'outflow' : 'transfer';
            return {
              id: tx.id || tx.hash,
              time: new Date(tx.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              amount: `${tx.amount.toLocaleString()} ${tx.symbol.toUpperCase()}`,
              assetCode: tx.symbol.toUpperCase(),
              value: tx.amount_usd ? `$${(tx.amount_usd / 1e6).toFixed(1)}M` : 'N/A',
              valueNumeric: tx.amount_usd || 0,
              amountNumeric: tx.amount,
              from, to, type,
            };
          });
          setFullDataset(transformed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Filter
  const filteredData = useMemo(() => {
    let data = fullDataset;
    if (typeFilter !== 'all') data = data.filter(tx => tx.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(tx =>
        tx.from.toLowerCase().includes(q) ||
        tx.to.toLowerCase().includes(q) ||
        tx.assetCode.toLowerCase().includes(q) ||
        (walletLabels[tx.from] || '').toLowerCase().includes(q) ||
        (walletLabels[tx.to] || '').toLowerCase().includes(q)
      );
    }
    return data;
  }, [fullDataset, typeFilter, searchQuery, walletLabels]);

  // Paginate
  useEffect(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    setTableData(filteredData.slice(start, start + pagination.pageSize));
  }, [pagination, filteredData]);

  // AI analysis on select
  useEffect(() => {
    if (!selectedTx) { setAnalysis(null); setEditingAddress(null); return; }
    const run = async () => {
      setIsAnalyzing(true);
      setAnalysis(null);
      const r = await analyzeAssetMovement(
        selectedTx.assetCode, selectedTx.type, selectedTx.value,
        walletLabels[selectedTx.from] || selectedTx.from,
        walletLabels[selectedTx.to] || selectedTx.to,
      );
      setAnalysis(r);
      setIsAnalyzing(false);
    };
    run();
  }, [selectedTx]);

  const copyAddress = useCallback((addr: string) => {
    navigator.clipboard.writeText(addr);
    addToast('Address copied to clipboard', 'success');
  }, [addToast]);

  const saveLabel = (address: string) => {
    if (tempLabel.trim()) setWalletLabels(prev => ({ ...prev, [address]: tempLabel.trim() }));
    else { const n = { ...walletLabels }; delete n[address]; setWalletLabels(n); }
    setEditingAddress(null);
  };

  // Metrics
  const netFlow = useMemo(() => {
    const inflows = fullDataset.filter(t => t.type === 'inflow').reduce((s, t) => s + t.valueNumeric, 0);
    const outflows = fullDataset.filter(t => t.type === 'outflow').reduce((s, t) => s + t.valueNumeric, 0);
    return { inflows, outflows, net: outflows - inflows };
  }, [fullDataset]);

  const columns: Column<WhaleTx>[] = [
    { key: 'time', label: 'Time', width: '8%', render: (v) => <span className="text-xs text-text-muted font-mono">{v}</span> },
    { key: 'amount', label: 'Asset / Amount', width: '18%', render: (_, item) => (
      <div>
        <span className="font-bold text-sm">{item.assetCode}</span>
        <span className="text-xs text-text-muted ml-1.5">{item.amount.split(' ')[0]}</span>
      </div>
    )},
    { key: 'valueNumeric', label: 'USD Value', width: '12%', sortable: true, align: 'right', render: (_, item) => (
      <span className="font-mono font-bold text-sm">{item.value}</span>
    )},
    { key: 'from', label: 'From', width: '22%', render: (v) => <AddressCell address={v} labels={walletLabels} onCopy={copyAddress} /> },
    { key: 'to', label: 'To', width: '22%', render: (v) => <AddressCell address={v} labels={walletLabels} onCopy={copyAddress} /> },
    { key: 'type', label: 'Signal', width: '10%', render: (v: string) => (
      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
        v === 'inflow' ? 'bg-red-500/10 text-red-400' :
        v === 'outflow' ? 'bg-emerald-500/10 text-emerald-400' :
        'bg-text-muted/10 text-text-muted'
      }`}>
        {v === 'inflow' ? <ArrowDownRight size={10} /> : v === 'outflow' ? <ArrowUpRight size={10} /> : null}
        {v}
      </span>
    )},
    { key: 'id', label: '', width: '8%', isAction: true, render: (_, item) => (
      <button onClick={(e) => { e.stopPropagation(); setSelectedTx(item); }}
        className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all">
        Analyze
      </button>
    )},
  ];

  return (
    <div className="animate-fade-in space-y-6 pb-12">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 lg:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <PulseIcon /> Live Monitoring
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Whale Radar 🐋</h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed mb-6">
            Real-time tracking of large-scale institutional wallet movements across Bitcoin, Ethereum, and major alt networks.
            Exchange inflows signal selling pressure. Outflows signal accumulation.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-text-muted text-xs font-bold">6,000+ wallets tracked</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-xs font-bold text-text-muted">
              <Globe size={13} className="text-primary" /> 15 blockchains
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-xs font-bold text-text-muted">
              <Clock size={13} className="text-primary" /> Updated every 60s
            </div>
          </div>
        </div>
      </div>

      {/* ── Ad Leaderboard ── */}
      <AdBanner variant="leaderboard" />

      {/* ── Stat Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="24h Exchange Inflows" value="$1.2B" sub="Potential sell pressure" direction="down" icon={<ArrowDownRight size={16} />} />
        <StatCard label="24h Exchange Outflows" value="$850M" sub="Accumulation signal" direction="up" icon={<ArrowUpRight size={16} />} />
        <StatCard label="Net Flow" value="+$350M" sub="Outflows dominating" direction="up" icon={<TrendingUp size={16} />} />
        <StatCard label="Active Whale Wallets" value="2,847" sub="Last 24 hours" direction="neutral" icon={<Activity size={16} />} />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Flow Velocity */}
        <div className="lg:col-span-2 leather-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Exchange Flow Velocity (24h)</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> To Exchange</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> From Exchange</div>
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#71717a' }} stroke="#3f3f46" />
                <YAxis tick={{ fontSize: 10, fill: '#71717a' }} stroke="#3f3f46" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    borderColor: '#2a2a2a', 
                    color: '#f4f4f5', 
                    borderRadius: '10px', 
                    border: '1px solid #2a2a2a',
                    padding: '10px 14px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                  cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                  formatter={(v: number, name: string) => [`$${v}M`, name === 'inflow' ? 'To Exchange' : 'From Exchange']}
                  labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                  itemStyle={{ color: '#f4f4f5', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#EF4444" fill="url(#inflowGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="outflow" stroke="#10B981" fill="url(#outflowGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Breakdown */}
        <ExchangeFlowChart />
      </div>

      {/* ── What This Data Means ── */}
      <div className="leather-card rounded-xl p-5 border-l-4 border-l-primary/50">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm mb-1">How to read whale flows</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-text">Exchange inflows</strong> (wallet → exchange) indicate intent to sell — large inflows often precede price drops.
              <strong className="text-text"> Exchange outflows</strong> (exchange → wallet) signal accumulation — whales moving to cold storage tend to be bullish.
              <strong className="text-text"> Transfers</strong> between exchanges or wallets may indicate OTC deals, arbitrage, or portfolio restructuring.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Data View (Toggled) ── */}
      <div className="space-y-4">
        <div className="flex bg-surface border border-border rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveView('table')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeView === 'table' ? 'bg-primary text-background' : 'text-text-muted hover:text-text'}`}
          >
            <BarChart2 size={16} /> Transactions
          </button>
          <button
            onClick={() => setActiveView('alerts')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeView === 'alerts' ? 'bg-primary text-background' : 'text-text-muted hover:text-text'}`}
          >
            <Activity size={16} /> Smart Alerts
          </button>
        </div>

        {activeView === 'table' ? (
          <div className="leather-card rounded-xl overflow-hidden animate-fade-in">
            {/* Table header */}
            <div className="p-4 border-b border-border bg-background/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm">Recent Large Transactions</h3>
                <div className="flex items-center gap-1.5">
                  <PulseIcon />
                  <span className="text-[10px] text-primary font-bold uppercase">Live</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search address, asset..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="w-full sm:w-52 bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                {/* Type filter */}
                <div className="flex bg-surface border border-border rounded-lg p-0.5">
                  {(['all', 'inflow', 'outflow', 'transfer'] as const).map(f => (
                    <button key={f} onClick={() => { setTypeFilter(f); setPagination(p => ({ ...p, page: 1 })); }}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${typeFilter === f ? 'bg-primary text-background' : 'text-text-muted hover:text-text'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Table
              data={tableData}
              loading={isLoading}
              columns={columns}
              ariaLabel="Whale transactions table"
              pagination={{
                defaultPageSize: 15,
                pageSizeOptions: [15, 30, 50],
                totalItems: filteredData.length,
                onPageChange: (page, pageSize) => setPagination({ page, pageSize }),
              }}
              onRowClick={setSelectedTx}
              striped
              hoverable
              emptyState={{ title: 'No transactions match', description: 'Try adjusting your search or filter criteria.' }}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <AlertFeed />
          </div>
        )}
      </div>

      {/* ── Mid-page Ad ── */}
      <AdBanner variant="leaderboard" />

      {/* ── Educational Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: <BarChart2 size={20} className="text-primary" />,
            title: 'Exchange Net Position',
            body: 'When cumulative outflows exceed inflows over a sustained period, it historically precedes price appreciation. Bitcoin\'s exchange reserves are currently at a 5-year low.',
          },
          {
            icon: <Eye size={20} className="text-primary" />,
            title: 'Dormant Wallet Activity',
            body: 'Wallets inactive for 1+ years suddenly moving coins can signal long-term holder sentiment shifts. These are tracked separately as high-conviction signals.',
          },
          {
            icon: <Zap size={20} className="text-primary" />,
            title: 'Miner Outflows',
            body: 'Miners selling into exchanges suggests operational pressure or profit-taking. Sustained miner accumulation is a classic bull market precursor.',
          },
        ].map((card, i) => (
          <div key={i} className="leather-card rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="p-2.5 bg-primary/10 rounded-lg w-fit mb-4">{card.icon}</div>
            <h4 className="font-bold text-sm mb-2">{card.title}</h4>
            <p className="text-xs text-text-muted leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>

      {/* ── Transaction Analysis Modal ── */}
      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Deep-Dive" size="lg">
        {selectedTx && (
          <div className="space-y-5">
            {/* From / To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['from', 'to'] as const).map(dir => {
                const address = selectedTx[dir];
                const label = walletLabels[address];
                const isRaw = address.startsWith('0x');
                const isEditing = editingAddress === address;
                return (
                  <div key={dir} className="p-4 bg-surface border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase text-text-muted tracking-widest">{dir === 'from' ? '↑ From' : '↓ To'}</span>
                      {isRaw && (
                        <button onClick={() => { setEditingAddress(address); setTempLabel(label || ''); }}
                          className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline">
                          <Edit2 size={9} /> {label ? 'Edit' : 'Label'}
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2 items-center">
                        <input autoFocus value={tempLabel} onChange={e => setTempLabel(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveLabel(address)}
                          className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                          placeholder="e.g. Jump Trading" />
                        <button onClick={() => saveLabel(address)} className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary hover:text-background transition-colors"><Save size={14} /></button>
                        <button onClick={() => setEditingAddress(null)} className="p-1.5 text-text-muted hover:text-text"><X size={14} /></button>
                      </div>
                    ) : (
                      <div>
                        {label && <div className="font-bold text-primary text-sm flex items-center gap-1 mb-0.5"><Tag size={11} /> {label}</div>}
                        <div className={`break-all flex items-center gap-1.5 ${label ? 'text-text-muted text-xs' : 'text-text text-xs font-mono'}`}>
                          {address}
                          {isRaw && <Copy size={11} className="cursor-pointer flex-shrink-0 hover:text-primary text-text-muted" onClick={() => copyAddress(address)} />}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tx Details */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-xl border border-border">
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Amount</p>
                <p className="font-bold font-mono text-lg">{selectedTx.amount}</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-[10px] text-text-muted uppercase font-bold mb-1">USD Value</p>
                <p className="font-bold text-primary text-lg">{selectedTx.value}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Signal</p>
                <span className={`text-sm font-bold uppercase ${selectedTx.type === 'inflow' ? 'text-red-400' : selectedTx.type === 'outflow' ? 'text-emerald-400' : 'text-text-muted'}`}>
                  {selectedTx.type}
                </span>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="font-bold text-sm">AI Movement Analysis</h3>
              </div>
              {isAnalyzing ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map(i => <div key={i} className="h-4 bg-white/10 rounded w-full last:w-4/6" />)}
                </div>
              ) : analysis ? (
                <div>
                  <p className="text-sm text-text-muted leading-relaxed">{analysis.text}</p>
                  {analysis.sources?.length ? (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Sources</p>
                      {analysis.sources.slice(0, 3).map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline mb-1">
                          <ExternalLink size={10} /> {s.title}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-xs text-red-400">Analysis unavailable. Check network connection or API configuration.</p>
              )}
            </div>

            <Button isFullWidth onClick={() => setSelectedTx(null)} variant="secondary">Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};