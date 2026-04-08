import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { ProGate, InputField, ResultMetric, fmtPct } from '../shared/SharedComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, ReferenceLine } from 'recharts';
import { Shield, ShieldCheck, AlertCircle } from 'lucide-react';

export const RiskAdjustedReturns: React.FC = () => {
  const [annualReturn, setAnnualReturn] = useState('25');
  const [riskFreeRate, setRiskFreeRate] = useState('4.2');
  const [standardDeviation, setStandardDeviation] = useState('30');
  const [downsideDeviation, setDownsideDeviation] = useState('18');
  const [maxDrawdown, setMaxDrawdown] = useState('45');

  const stats = useMemo(() => {
    const r = (parseFloat(annualReturn) || 0) / 100;
    const rf = (parseFloat(riskFreeRate) || 0) / 100;
    const sigma = (parseFloat(standardDeviation) || 0) / 100;
    const dSigma = (parseFloat(downsideDeviation) || 0) / 100;
    const mdd = (parseFloat(maxDrawdown) || 0) / 100;

    const sharpe = sigma > 0 ? (r - rf) / sigma : 0;
    const sortino = dSigma > 0 ? (r - rf) / dSigma : 0;
    const calmar = mdd > 0 ? r / mdd : 0;

    const chartData = [
      { name: 'Sharpe', value: parseFloat(sharpe.toFixed(2)), color: '#10b981', desc: 'Return per unit of total risk' },
      { name: 'Sortino', value: parseFloat(sortino.toFixed(2)), color: '#818cf8', desc: 'Return per unit of downside risk' },
      { name: 'Calmar', value: parseFloat(calmar.toFixed(2)), color: '#f59e0b', desc: 'Return vs Maximum Drawdown' },
    ];

    return { sharpe, sortino, calmar, chartData };
  }, [annualReturn, riskFreeRate, standardDeviation, downsideDeviation, maxDrawdown]);

  const getEfficiencyLabel = (val: number) => {
    if (val > 3) return { label: 'Exceptional', color: 'text-emerald-400' };
    if (val > 2) return { label: 'Excellent', color: 'text-emerald-400' };
    if (val > 1) return { label: 'Good', color: 'text-blue-400' };
    return { label: 'Sub-Optimal', color: 'text-amber-400' };
  };

  const efficiency = getEfficiencyLabel(stats.sharpe);

  return (
    <div className="animate-fade-in">
      <ProGate 
        title="Risk-Adjusted Efficiency Suite" 
        description="Calculate professional efficiency metrics used by hedge fund allocators. Is your alpha real or just leveraged beta?"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <Shield size={18} className="text-primary"/> Performance Inputs
              </h3>
              <div className="space-y-4">
                <InputField label="Annualized Return" value={annualReturn} onChange={setAnnualReturn} suffix="%" />
                <InputField label="Risk-Free Rate (rf)" value={riskFreeRate} onChange={setRiskFreeRate} suffix="%" helpText="Usually 10Y Treasury Yield" />
                <InputField label="Annual Volatility (σ)" value={standardDeviation} onChange={setStandardDeviation} suffix="%" helpText="Standard deviation of returns" />
                <InputField label="Downside Deviation" value={downsideDeviation} onChange={setDownsideDeviation} suffix="%" helpText="Standard deviation of negative returns only" />
                <InputField label="Historical Max Drawdown" value={maxDrawdown} onChange={setMaxDrawdown} suffix="%" helpText="Largest peak-to-trough decline" />
              </div>
            </Card>
            
            <div className={`p-4 rounded-xl border border-border bg-background/50 flex flex-col items-center justify-center text-center`}>
               <ShieldCheck size={32} className={`mb-2 ${efficiency.color}`} />
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">Portfolio Efficiency</p>
               <h4 className={`text-xl font-bold font-heading ${efficiency.color}`}>{efficiency.label}</h4>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
               <ResultMetric label="Sharpe Ratio" value={stats.sharpe.toFixed(2)} positive={stats.sharpe > 1} neutral={stats.sharpe <= 1} />
               <ResultMetric label="Sortino Ratio" value={stats.sortino.toFixed(2)} positive={stats.sortino > 1.5} neutral={stats.sortino <= 1.5} />
               <ResultMetric label="Calmar Ratio" value={stats.calmar.toFixed(2)} positive={stats.calmar > 2} neutral={stats.calmar <= 2} />
            </div>

            <Card className="flex-1 flex flex-col h-[400px]">
               <h4 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-8">Efficiency Benchmark Comparison</h4>
               <div className="flex-1 w-full bg-background/50 p-6 rounded-2xl border border-border/50">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                     <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
                     <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#f4f4f5' }} stroke="none" width={80} />
                     <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }} 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 12 }}
                        formatter={(v: number, name: string, props: any) => [v, props.payload.desc]}
                     />
                     <ReferenceLine x={1} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Min. Standard', fill: '#ef4444', fontSize: 10 }} />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={35}>
                       {stats.chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="mt-8 flex gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20 items-start">
                  <AlertCircle size={18} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-text-muted leading-relaxed">
                     <strong>Sharpe</strong> measures total risk. <strong>Sortino</strong> focuses on downside pain. <strong>Calmar</strong> looks at historical peak stress. 
                     An institutional investor usually looks for all three to be above 1.5 for a high-quality strategy.
                  </p>
               </div>
            </Card>
          </div>
        </div>
      </ProGate>
    </div>
  );
};
