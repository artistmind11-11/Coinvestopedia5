import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, ArrowUpRight, TrendingUp } from 'lucide-react';

interface YieldAsset {
  id: string;
  name: string;
  ticker: string;
  yield: number;
  category: 'TradFi' | 'DeFi' | 'Real Estate';
  riskScore: number; // 1-10 (1 is lowest risk)
}

const SAMPLE_YIELDS: YieldAsset[] = [
  { id: '1', name: 'US 10Y Treasury', ticker: 'US10Y', yield: 4.2, category: 'TradFi', riskScore: 1 },
  { id: '2', name: 'Realty Income Corp', ticker: 'O', yield: 5.8, category: 'Real Estate', riskScore: 3 },
  { id: '3', name: 'JPMorgan Chase', ticker: 'JPM', yield: 2.3, category: 'TradFi', riskScore: 2 },
  { id: '4', name: 'Aave USDC (Mainnet)', ticker: 'aUSDC', yield: 8.5, category: 'DeFi', riskScore: 6 },
  { id: '5', name: 'Ethena sUSDe', ticker: 'sUSDe', yield: 15.2, category: 'DeFi', riskScore: 8 },
  { id: '6', name: 'Schwab Dividend ETF', ticker: 'SCHD', yield: 3.4, category: 'TradFi', riskScore: 2 },
  { id: '7', name: 'Lido Staked ETH', ticker: 'stETH', yield: 3.2, category: 'DeFi', riskScore: 5 },
  { id: '8', name: 'Altria Group', ticker: 'MO', yield: 8.1, category: 'TradFi', riskScore: 5 },
];

export const DividendScreener: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [investment, setInvestment] = useState('50000');
  const [minYield, setMinYield] = useState('0');

  const filteredAssets = useMemo(() => {
    return SAMPLE_YIELDS
      .filter(a => 
        (a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.ticker.toLowerCase().includes(searchTerm.toLowerCase())) &&
        a.yield >= (parseFloat(minYield) || 0)
      )
      .sort((a, b) => b.yield - a.yield);
  }, [searchTerm, minYield]);

  const stats = useMemo(() => {
    const inv = parseFloat(investment) || 0;
    const avgYield = filteredAssets.length > 0 
      ? filteredAssets.reduce((sum, a) => sum + a.yield, 0) / filteredAssets.length 
      : 0;
    const annualIncome = (inv * avgYield) / 100;
    
    return { avgYield, annualIncome };
  }, [filteredAssets, investment]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Search & Filter Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <InputField 
            label="Search Assets" 
            value={searchTerm} 
            onChange={setSearchTerm} 
            type="text" 
            prefix={<Search size={14} />} 
          />
        </div>
        <div className="md:col-span-1">
          <InputField 
            label="Hypothetical Investment" 
            value={investment} 
            onChange={setInvestment} 
            prefix="$" 
          />
        </div>
        <div className="md:col-span-1">
          <InputField 
            label="Min Yield (%)" 
            value={minYield} 
            onChange={setMinYield} 
            suffix="%" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Results List */}
        <div className="lg:col-span-7">
          <Card className="h-full border border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Yield Rankings
            </h3>
            
            <div className="space-y-3">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="group p-4 bg-background/50 border border-border/50 hover:border-primary/50 rounded-xl transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                      asset.category === 'DeFi' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                      asset.category === 'Real Estate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {asset.ticker.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{asset.name}</h4>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{asset.category} • Risk Score: {asset.riskScore}/10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">{asset.yield.toFixed(2)}%</p>
                    <p className="text-[10px] text-text-muted font-bold">EST. {fmtUSD((parseFloat(investment) || 0) * asset.yield / 100)} / YR</p>
                  </div>
                </div>
              ))}
              
              {filteredAssets.length === 0 && (
                <div className="py-20 text-center opacity-50">
                   <p className="text-sm font-bold">No assets match your criteria.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ResultMetric label="Average Yield" value={`${stats.avgYield.toFixed(2)}%`} positive />
            <ResultMetric label="Est. Annual Income" value={fmtUSD(stats.annualIncome)} positive />
          </div>

          <Card className="flex flex-col h-[350px]">
            <h4 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-6">Yield Comparison</h4>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredAssets.slice(0, 6)} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="ticker" type="category" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" width={50} />
                  <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                    formatter={(v: number) => [`${v}%`, 'Annual Yield']}
                  />
                  <Bar dataKey="yield" radius={[0, 4, 4, 0]} barSize={20}>
                    {filteredAssets.map((entry, index) => (
                      <Cell key={index} fill={entry.category === 'DeFi' ? '#818cf8' : entry.category === 'Real Estate' ? '#fbbf24' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /> TradFi</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-400" /> DeFi</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Real Estate</div>
            </div>
          </Card>

          <div className="p-4 rounded-xl border border-border bg-primary/5">
             <div className="flex items-center gap-2 mb-2 text-primary">
                <ArrowUpRight size={18} />
                <h4 className="font-bold text-sm">Wealth Compounding Tip</h4>
             </div>
             <p className="text-xs text-text-muted leading-relaxed">
               Reinvesting dividends back into the same asset can significantly accelerate balance growth over long horizons through the power of geometric compounding.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
