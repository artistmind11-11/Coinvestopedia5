import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Activity, Info } from 'lucide-react';

export const InflationAdjusted: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState('10000');
  const [years, setYears] = useState('20');
  const [nominalReturn, setNominalReturn] = useState('8');
  const [annualInflation, setAnnualInflation] = useState('3.5');

  const result = useMemo(() => {
    const p = parseFloat(initialAmount) || 10000;
    const y = parseFloat(years) || 20;
    const r = (parseFloat(nominalReturn) || 0) / 100;
    const i = (parseFloat(annualInflation) || 0) / 100;

    const realReturn = ((1 + r) / (1 + i)) - 1;
    
    const chartData = [];
    for (let yr = 0; yr <= y; yr++) {
      const nominalValue = p * Math.pow(1 + r, yr);
      const realValue = p * Math.pow(1 + realReturn, yr);
      const purchasingPowerOfInitial = p / Math.pow(1 + i, yr);

      chartData.push({
        year: `Year ${yr}`,
        nominal: Math.round(nominalValue),
        real: Math.round(realValue),
        purchasingPower: Math.round(purchasingPowerOfInitial)
      });
    }

    const finalNominal = chartData[chartData.length - 1].nominal;
    const finalReal = chartData[chartData.length - 1].real;
    const lostToInflation = finalNominal - finalReal;

    return { 
      realReturn: realReturn * 100, 
      finalNominal, 
      finalReal, 
      lostToInflation,
      chartData 
    };
  }, [initialAmount, years, nominalReturn, annualInflation]);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:col-span-12 gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary"/> Real Return Model
            </h3>
            <div className="space-y-4">
              <InputField label="Initial Principal" value={initialAmount} onChange={setInitialAmount} prefix="$" />
              <InputField label="Duration" value={years} onChange={setYears} suffix="years" max={50} />
              <InputField label="Nominal Return (%)" value={nominalReturn} onChange={setNominalReturn} suffix="%" helpText="Annual ROI (e.g., S&P 500 average is ~10%)" />
              <InputField label="Annual Inflation (%)" value={annualInflation} onChange={setAnnualInflation} suffix="%" helpText="Current CPI or expected long-term average" />
            </div>
            
            <div className="mt-6 p-4 bg-background/50 border border-border rounded-xl">
               <p className="text-[10px] uppercase font-extrabold text-text-muted mb-2 tracking-widest flex items-center gap-1.5">
                  <Activity size={10} /> Calculation logic:
               </p>
               <p className="text-xs text-text-muted italic leading-relaxed">
                 Real Return = ((1 + Nominal) / (1 + Inflation)) - 1
               </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <ResultMetric label="Real Annual Return" value={fmtPct(result.realReturn)} positive={result.realReturn > 0} negative={result.realReturn < 0} />
            <ResultMetric label="Final Nominal Value" value={fmtUSD(result.finalNominal)} neutral />
            <ResultMetric label="Inflation-Adjusted Value" value={fmtUSD(result.finalReal)} positive />
            <ResultMetric label="Lost to Inflation" value={fmtUSD(result.lostToInflation)} negative />
          </div>

          <Card className="flex-1 flex flex-col min-h-[400px]">
            <h4 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-6">Nominal vs Purchasing Power Over Time</h4>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
                  <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="#3f3f46" />
                  <Tooltip itemStyle={{ color: '#e4e4e7' }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 12, boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }}
                    formatter={(v: number) => fmtUSD(v)}
                    labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', marginBottom: 6 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="nominal" 
                    name="Nominal Value (Number Only)" 
                    stroke="#71717a" 
                    fill="#3f3f46" 
                    fillOpacity={0.1} 
                    strokeWidth={2}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="real" 
                    name="Real Purchasing Power (Adjusted)" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.2} 
                    strokeWidth={3}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="purchasingPower" 
                    name="Value of $10,000 Today" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.05} 
                    strokeWidth={1} 
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-[10px] font-bold uppercase tracking-widest">
               <Info size={14} /> Note: This simulation assumes a constant geometric annual rate for both growth and inflation.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
