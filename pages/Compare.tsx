import React, { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import Table, { Column } from '../components/Table';
import { Check, X, TrendingUp, BarChart3, Shield, Sparkles, ArrowLeftRight, Trophy, AlertTriangle, Scale, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Card } from '../components/Card';
import { Select } from '../components/Select';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

export const Compare: React.FC = () => {
  const [assetA, setAssetA] = useState<string | number>('btc');
  const [assetB, setAssetB] = useState<string | number>('gold');

  const rows = useMemo(() => [
    { metric: 'Market Capitalization', bitcoin: '$1.4T', gold: '$15.8T' },
    { metric: 'Daily Trading Volume', bitcoin: '$45B', gold: '$130B' },
    { metric: '5-Year Return', bitcoin: '+285%', gold: '+48%' },
    { metric: 'Volatility (30d)', bitcoin: '18.2%', gold: '8.4%' },
    { metric: 'Correlation to S&P 500', bitcoin: '0.42', gold: '0.15' },
    { metric: 'Storage Cost', bitcoin: 'Digital Wallet (Free)', gold: 'Vault/Insurance (0.5%/yr)' },
    { metric: 'Portability', bitcoin: 'Global, Instant', gold: 'Heavy, Slow, Requires Security' },
    { metric: 'Liquidity', bitcoin: <div className="inline-flex justify-center items-center gap-2"><Check size={14} className="text-primary" /><span className="text-sm">24/7 Global</span></div>, gold: <div className="inline-flex justify-center items-center gap-2"><span className="text-sm">Market Hours</span></div> },
    { metric: 'Scarcity', bitcoin: 'Fixed (21M Cap)', gold: 'Inflationary (~2%/yr)' },
  ], []);

  const columns = useMemo<Column<any>[]>(() => [
    { key: 'metric', label: 'Investment Metric', width: '40%' },
    { key: 'bitcoin', label: 'Bitcoin (BTC)', align: 'center', width: '30%', render: (val) => <span className="font-bold text-lg">{val}</span> },
    { key: 'gold', label: 'Gold (XAU)', align: 'center', width: '30%', render: (val) => <span className="font-medium text-text-muted">{val}</span> },
  ], []);

  const chartData = [
    { year: '2020', btc: 100, gold: 100 },
    { year: '2021', btc: 305, gold: 112 },
    { year: '2022', btc: 180, gold: 115 },
    { year: '2023', btc: 250, gold: 128 },
    { year: '2024', btc: 450, gold: 142 },
    { year: '2025', btc: 580, gold: 148 },
  ];

  const volumeData = [
    { name: 'Volume ($B)', btc: 45, gold: 130 },
  ];

  const assetOptions = [
    { value: 'btc', label: 'Bitcoin (BTC)', icon: <span className="text-[#F7931A]">₿</span> },
    { value: 'eth', label: 'Ethereum (ETH)', icon: <span className="text-[#627EEA]">Ξ</span> },
    { value: 'sol', label: 'Solana (SOL)', icon: <span className="text-[#14F195]">◎</span> },
  ];

  const comparisonOptions = [
    { value: 'gold', label: 'Gold (XAU)', icon: <span className="text-[#FFD700]">G</span> },
    { value: 'sp500', label: 'S&P 500', icon: <span className="text-green-500">📈</span> },
    { value: 're', label: 'Real Estate', icon: <span className="text-blue-500">🏠</span> },
  ];

  return (
    <div className="animate-fade-in space-y-12 lg:space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        
        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
                <Scale size={16} className="flex-shrink-0" />
                <span>Asset Comparison Tool</span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Compare Assets <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Side-by-Side</span>
              </h1>
              
              <p className="text-lg text-text-muted mb-8">
                Analyze risk, return, and correlation metrics to build a balanced portfolio. Institutional-grade data at your fingertips.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                 <Button>
                    Start New Comparison
                 </Button>
                 <Button variant="secondary" icon={<Shield size={18} />}>
                    Methodology
                 </Button>
              </div>
            </div>

            {/* Comparison Selector Card */}
            <div className="lg:w-1/2 w-full">
               <div className="leather-card rounded-2xl p-6 lg:p-8 relative !overflow-visible">
                  <div className="flex flex-col gap-4">
                     <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <div className="min-w-0">
                           <label className="text-xs text-text-muted font-bold uppercase mb-2 block">Asset A</label>
                           <Select 
                              options={assetOptions} 
                              value={assetA} 
                              onChange={setAssetA}
                              size="lg"
                           />
                        </div>
                        <div className="flex items-center justify-center pt-6 flex-shrink-0">
                           <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
                              <ArrowLeftRight size={18} />
                           </div>
                        </div>
                        <div className="min-w-0">
                           <label className="text-xs text-text-muted font-bold uppercase mb-2 block">Asset B</label>
                           <Select 
                              options={comparisonOptions} 
                              value={assetB} 
                              onChange={setAssetB}
                              size="lg"
                           />
                        </div>
                     </div>
                     <Button className="w-full mt-2" size="lg">Analyze Difference</Button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <section>
         {/* Sticky Header for Mobile */}
         <div className="sticky top-[72px] z-30 flex items-center justify-between mb-8 bg-background/90 backdrop-blur-md py-4 border-b border-border shadow-sm lg:relative lg:top-0 lg:bg-transparent lg:py-0 lg:border-none lg:shadow-none lg:backdrop-blur-none">
            <h2 className="text-xl lg:text-2xl font-bold">Performance Analysis</h2>
            <div className="flex items-center gap-2 text-xs lg:text-sm text-text-muted font-semibold bg-surface/80 px-3 py-1.5 rounded-full border border-border">
               <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> BTC
               <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] ml-3 shadow-[0_0_8px_rgba(255,215,0,0.5)]"></span> Gold
            </div>
         </div>

         {/* Grid Layout: Top row has Chart and Verdict. Bottom row has Table. */}
         <div className="flex flex-col gap-8">
            
            {/* Top Row: Chart (2/3) + Verdict (1/3) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               
               {/* Chart Card */}
               <div className="xl:col-span-2">
                  <Card className="p-6 h-full flex flex-col">
                     <div className="flex items-center justify-between mb-6">
                        <div>
                           <h3 className="text-lg font-bold">Cumulative Return (5Y)</h3>
                           <p className="text-sm text-text-muted">Normalized Performance (Base 100)</p>
                        </div>
                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                           BTC Outperformed by 237%
                        </div>
                     </div>
                     
                     <div className="flex-grow w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={chartData}>
                              <defs>
                                 <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                 </linearGradient>
                                 <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                              <XAxis dataKey="year" stroke="#52525B" tick={{fill: '#71717A', fontSize: 12}} tickLine={false} axisLine={false} />
                              <YAxis stroke="#52525B" tick={{fill: '#71717A', fontSize: 12}} tickLine={false} axisLine={false} />
                              <Tooltip 
                                 contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#F4F4F5' }}
                                 itemStyle={{ color: '#F4F4F5' }}
                              />
                              <Area type="monotone" dataKey="btc" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorBtc)" name="Bitcoin" />
                              <Area type="monotone" dataKey="gold" stroke="#FFD700" strokeWidth={2} fillOpacity={1} fill="url(#colorGold)" name="Gold" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </Card>
               </div>

               {/* Verdict Sidebar */}
               <div className="xl:col-span-1 flex flex-col gap-8">
                  <div className="relative overflow-hidden rounded-xl p-[2px] bg-gradient-to-br from-primary/50 via-border to-background shadow-lg shadow-primary/5 flex-grow group">
                     {/* Premium Certificate Pattern */}
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTYsIDE4NSwgMTI5LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>
                     
                     <div className="leather-card h-full rounded-[10px] p-6 flex flex-col bg-surface/95 backdrop-blur-sm relative z-10 border-none transition-colors duration-300">
                        <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg text-primary shadow-inner">
                                 <Trophy size={24} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-xl leading-tight text-text">The Verdict</h3>
                                 <span className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-1">
                                    <Sparkles size={10} /> Certified Analysis
                                 </span>
                              </div>
                           </div>
                        </div>
                        <p className="text-base text-text-muted mb-6 leading-relaxed relative">
                           <span className="absolute -left-3 -top-3 text-4xl text-primary/10 font-serif leading-none">"</span>
                           <strong className="text-text">Bitcoin</strong> remains the superior asset for growth-focused portfolios, offering asymmetric upside despite higher volatility.
                        </p>
                        <p className="text-base text-text-muted leading-relaxed relative flex-grow">
                           <strong className="text-text">Gold</strong> continues to serve as a reliable hedge against currency debasement but lacks the network effects of digital assets.
                        </p>
                        <div className="pt-6 mt-6 border-t border-border/50">
                           <Button variant="secondary" className="w-full justify-center gap-2 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
                              <Share2 size={16} /> Share Comparison
                           </Button>
                        </div>
                     </div>
                  </div>

                  <Card className="p-6">
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ArrowLeftRight /> Daily Volume</h3>
                     <div className="h-[200px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={volumeData}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                             <XAxis dataKey="name" stroke="#52525B" tick={{fill: '#71717A', fontSize: 12}} />
                             <YAxis stroke="#52525B" tick={{fill: '#71717A', fontSize: 12}} />
                             <Tooltip 
                                cursor={{fill: '#27272A', opacity: 0.4}}
                                contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#F4F4F5' }}
                             />
                             <Legend />
                             <Bar dataKey="btc" fill="#10B981" name="Bitcoin" radius={[4, 4, 0, 0]} barSize={40} />
                             <Bar dataKey="gold" fill="#FFD700" name="Gold" radius={[4, 4, 0, 0]} barSize={40} />
                          </BarChart>
                       </ResponsiveContainer>
                     </div>
                  </Card>
               </div>
            </div>

            {/* Middle Row: Full Width Table */}
            <div className="leather-card rounded-xl overflow-hidden">
               <div className="p-4 border-b border-border bg-surface/50">
                   <h3 className="font-bold text-lg">Detailed Metrics Comparison</h3>
               </div>
               <Table data={rows} columns={columns} className="w-full" />
            </div>

            {/* Bottom Row: Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="p-6 h-full">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                     <ThumbsUp size={20} />
                     <span className="font-bold text-lg">Bitcoin Advantages</span>
                  </div>
                  <ul className="space-y-3 text-text-muted">
                     <li className="flex items-start gap-3">
                        <Check size={16} className="mt-1 text-primary flex-shrink-0" />
                        <span>Portable & Divisible: Sends anywhere instantly.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <Check size={16} className="mt-1 text-primary flex-shrink-0" />
                        <span>Fixed Supply: Mathematically capped at 21M.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <Check size={16} className="mt-1 text-primary flex-shrink-0" />
                        <span>Global Liquidity: Trades 24/7/365 worldwide.</span>
                     </li>
                  </ul>
               </Card>
               
               <Card className="p-6 h-full">
                  <div className="flex items-center gap-2 mb-4 text-red-400">
                     <AlertTriangle size={20} />
                     <span className="font-bold text-lg">Bitcoin Risks</span>
                  </div>
                  <ul className="space-y-3 text-text-muted">
                     <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                        <span>Short-term Volatility: Can experience 30%+ drawdowns.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                        <span>Regulatory Uncertainty: Evolving legal frameworks.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                        <span>Technical Barrier: Self-custody requires learning curve.</span>
                     </li>
                  </ul>
               </Card>
            </div>
        </div>
      </section>

      {/* More Comparisons */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold">Popular Comparisons</h2>
           <Button variant="ghost">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
               title: 'DeFi vs Banking', 
               icon: <div className="text-2xl">🏦</div>, 
               desc: 'Yield farming protocols vs traditional high-yield savings accounts.',
               badge: 'Yield'
            },
            { 
               title: 'Ethereum vs Solana', 
               icon: <div className="text-2xl">⚡</div>, 
               desc: 'Layer 1 wars: Security and decentralization vs speed and cost.',
               badge: 'Tech'
            },
            { 
               title: 'NFTs vs Fine Art', 
               icon: <div className="text-2xl">🎨</div>, 
               desc: 'Digital collectibles liquidity vs physical art market exclusivity.',
               badge: 'Alts'
            },
          ].map((item, i) => (
            <div key={i} className="group leather-card rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform">
                   {item.icon}
                 </div>
                 <span className="px-2 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {item.badge}
                 </span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-text-muted text-sm mb-4 line-clamp-2">{item.desc}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                 READ ANALYSIS
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section>
        <NewsletterSignup />
      </section>

      {/* Disclaimer */}
      <div className="leather-card rounded-xl p-6 text-center border-t border-primary/10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield size={20} className="text-text-muted flex-shrink-0" />
          <h3 className="text-base font-bold text-text-muted">Research Disclaimer</h3>
        </div>
        <p className="text-text-muted/60 text-xs max-w-3xl mx-auto">
          The information provided in this comparison tool is for educational purposes only and should not be considered financial advice. 
          Crypto assets are highly volatile. Past performance of any asset (digital or physical) is not indicative of future results.
        </p>
      </div>
    </div>
  );
};