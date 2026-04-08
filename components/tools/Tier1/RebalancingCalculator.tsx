import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { Target, Plus, Trash2, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface Holding {
  id: string;
  symbol: string;
  value: number;
  targetWeight: number; // percentage (0-100)
}

export const RebalancingCalculator: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', symbol: 'BTC', value: 50000, targetWeight: 40 },
    { id: '2', symbol: 'ETH', value: 20000, targetWeight: 30 },
    { id: '3', symbol: 'SPY', value: 25000, targetWeight: 20 },
    { id: '4', symbol: 'CASH', value: 5000, targetWeight: 10 },
  ]);

  const addHolding = () => {
    setHoldings([...holdings, { id: Math.random().toString(), symbol: 'NEW', value: 0, targetWeight: 0 }]);
  };

  const updateHolding = (id: string, field: keyof Holding, value: string) => {
    setHoldings(holdings.map(h => {
      if (h.id === id) {
        return { ...h, [field]: field === 'symbol' ? value.toUpperCase() : parseFloat(value) || 0 };
      }
      return h;
    }));
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const result = useMemo(() => {
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const totalTargetWeight = holdings.reduce((sum, h) => sum + h.targetWeight, 0);
    const isWeightValid = Math.abs(totalTargetWeight - 100) < 0.1;

    const analysis = holdings.map(h => {
      const currentWeight = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
      const targetValue = totalValue * (h.targetWeight / 100);
      const deltaValue = targetValue - h.value;
      const drift = currentWeight - h.targetWeight;
      
      return {
        ...h,
        currentWeight,
        targetValue,
        deltaValue,
        drift,
        action: deltaValue > 0 ? 'BUY' : deltaValue < 0 ? 'SELL' : 'HOLD'
      };
    });

    const totalBuySell = analysis.reduce((sum, a) => sum + Math.abs(a.deltaValue), 0) / 2; // dividing by 2 because buys match sells
    
    // Sort by largest drift
    analysis.sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift));

    const pieDataCurrent = analysis.map(h => ({ name: h.symbol, value: h.value }));
    const pieDataTarget = analysis.map(h => ({ name: h.symbol, value: h.targetValue }));

    return { totalValue, totalTargetWeight, isWeightValid, analysis, totalBuySell, pieDataCurrent, pieDataTarget };
  }, [holdings]);

  const COLORS = ['#F7931A', '#627EEA', '#10B981', '#6B7280', '#8B5CF6', '#EF4444', '#F59E0B', '#3B82F6'];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <ResultMetric label="Portfolio Value" value={fmtUSD(result.totalValue)} neutral />
        <ResultMetric label="Target Total" value={`${result.totalTargetWeight.toFixed(1)}%`} positive={result.isWeightValid} negative={!result.isWeightValid} sub={result.isWeightValid ? 'Balanced' : 'Imbalanced'} />
        <ResultMetric label="Value to Trade" value={fmtUSD(result.totalBuySell)} neutral />
        <ResultMetric 
           label="Status" 
           value={result.isWeightValid ? 'Ready' : 'Invalid'} 
           positive={result.isWeightValid} 
           negative={!result.isWeightValid} 
           sub={result.isWeightValid ? 'Weights OK' : 'Fix Weights'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="xl:col-span-8">
          <Card className="h-full border border-border pb-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target size={20} className="text-primary" /> Portfolio Configuration
              </h3>
              <button 
                onClick={addHolding}
                className="flex items-center gap-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={14} /> Add Asset
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-left text-text-muted text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="pb-3 pl-2 w-[20%]">Asset</th>
                    <th className="pb-3 w-[35%]">Current Value ($)</th>
                    <th className="pb-3 text-right pr-4 w-[30%]">Target (%)</th>
                    <th className="pb-3 text-center w-[15%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {holdings.map((h, i) => (
                    <tr key={h.id} className="group">
                      <td className="py-4 pr-2">
                        <input
                          type="text"
                          value={h.symbol}
                          onChange={e => updateHolding(h.id, 'symbol', e.target.value)}
                          className="w-full max-w-[100px] bg-background border border-border rounded-md px-2 py-2 focus:border-primary focus:outline-none font-bold text-center"
                          placeholder="BTC"
                        />
                      </td>
                      <td className="py-4 pr-4">
                         <div className="relative group/input flex-1 min-w-[120px] max-w-[200px]">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">$</span>
                           <input
                             type="number"
                             value={h.value}
                             onChange={e => updateHolding(h.id, 'value', e.target.value)}
                             className="w-full bg-background border border-border rounded-md pl-8 pr-3 py-2 focus:border-primary focus:outline-none transition-all"
                             min={0}
                           />
                         </div>
                      </td>
                      <td className="py-4 pr-4 text-right flex justify-end">
                         <div className="relative inline-block w-full max-w-[140px]">
                           <input
                             type="number"
                             value={h.targetWeight}
                             onChange={e => updateHolding(h.id, 'targetWeight', e.target.value)}
                             className="w-full bg-background border border-border rounded-md pr-8 pl-3 py-2 focus:border-primary focus:outline-none text-right font-mono font-bold"
                             min={0} max={100}
                           />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">%</span>
                         </div>
                      </td>
                      <td className="py-4 pl-4 text-center">
                        <button
                          onClick={() => removeHolding(h.id)}
                          className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Action Orders */}
        <div className="xl:col-span-4">
          <Card variant="featured" className="h-full border border-border flex flex-col p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
               <ArrowRight size={20} className="text-primary" /> Required Trades
            </h3>
            
            {!result.isWeightValid ? (
              <div className="flex flex-col items-center justify-center flex-grow opacity-50 text-center">
                 <Target size={48} className="text-text-muted mb-4" />
                 <p className="text-sm font-bold">Fix target weights first.</p>
                 <p className="text-xs text-text-muted mt-1">Total must equal 100%.</p>
              </div>
            ) : result.totalBuySell === 0 ? (
              <div className="flex flex-col items-center justify-center flex-grow text-emerald-400 text-center">
                 <Target size={48} className="mb-4 opacity-50" />
                 <p className="text-sm font-bold">Portfolio perfectly balanced.</p>
              </div>
            ) : (
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {result.analysis.filter(a => Math.abs(a.deltaValue) > 1).map((a) => (
                  <div key={a.id} className="flex flex-col p-3 rounded-xl bg-background border border-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{a.symbol}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${a.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {a.action}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-text-muted">
                        <p>{a.currentWeight.toFixed(1)}% <ArrowRight size={10} className="inline mx-0.5 opacity-50" /> {a.targetWeight}%</p>
                      </div>
                      <span className={`font-mono font-bold ${a.action === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {fmtUSD(Math.abs(a.deltaValue))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Visualizer Row */}
      {result.isWeightValid && result.totalValue > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h4 className="font-bold text-center text-sm mb-6 text-text-muted uppercase tracking-wider">Current Allocation</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={result.pieDataCurrent} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                    {result.pieDataCurrent.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(v: number) => fmtUSD(v)} 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#f4f4f5' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold text-center text-sm mb-6 text-text-muted uppercase tracking-wider">Target Allocation</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={result.pieDataTarget} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                    {result.pieDataTarget.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(v: number) => fmtUSD(v)} 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#f4f4f5' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
