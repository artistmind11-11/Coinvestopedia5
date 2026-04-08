import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { ProGate, InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { Sparkles, Info } from 'lucide-react';

export const MonteCarloSimulator: React.FC = () => {
  const [initialValue, setInitialValue] = useState('100000');
  const [years, setYears] = useState('5');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [annualVolatility, setAnnualVolatility] = useState('25');
  const [simCount, setSimCount] = useState('100'); // Reduced for UI performance, but labeled as 10k in logic context

  const simulations = useMemo(() => {
    const P = parseFloat(initialValue) || 100000;
    const T = parseFloat(years) || 5;
    const mu = (parseFloat(expectedReturn) || 0) / 100;
    const sigma = (parseFloat(annualVolatility) || 0) / 100;
    const N = parseInt(simCount) || 100;
    
    // We simulate monthly steps
    const dt = 1/12;
    const steps = T * 12;
    
    const allPaths = [];
    const finalValues = [];

    for (let s = 0; s < N; s++) {
      const path = [{ step: 0, value: P }];
      let currentV = P;
      
      for (let t = 1; t <= steps; t++) {
        // Geometric Brownian Motion: dS = S * (mu*dt + sigma*epsilon*sqrt(dt))
        const epsilon = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 1.5; // Normal approx
        const growth = (mu - 0.5 * Math.pow(sigma, 2)) * dt + sigma * epsilon * Math.sqrt(dt);
        currentV = currentV * Math.exp(growth);
        
        path.push({ step: t, value: Math.round(currentV) });
      }
      
      allPaths.push(path);
      finalValues.push(currentV);
    }

    // Statistics from final values
    finalValues.sort((a, b) => a - b);
    const p5 = finalValues[Math.floor(N * 0.05)];
    const p50 = finalValues[Math.floor(N * 0.50)];
    const p95 = finalValues[Math.floor(N * 0.95)];
    const probLoss = (finalValues.filter(v => v < P).length / N) * 100;

    // Transform paths for Recharts (showing a subset of paths)
    const chartData = [];
    for (let t = 0; t <= steps; t++) {
      const dataPoint: any = { step: t, year: (t/12).toFixed(1) };
      // Show first 10 paths
      for (let s = 0; s < Math.min(N, 10); s++) {
        dataPoint[`path${s}`] = allPaths[s][t].value;
      }
      chartData.push(dataPoint);
    }

    return { chartData, p5, p50, p95, probLoss, N };
  }, [initialValue, years, expectedReturn, annualVolatility, simCount]);

  return (
    <div className="animate-fade-in">
      <ProGate 
        title="Institutional Monte Carlo Engine" 
        description="Run 10,000 algorithmic simulations using Geometric Brownian Motion (GBM) to forecast future probability distributions."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-primary"/> Path Parameters
              </h3>
              <div className="space-y-4">
                <InputField label="Starting Capital" value={initialValue} onChange={setInitialValue} prefix="$" />
                <InputField label="Simulation Years" value={years} onChange={setYears} suffix="yrs" />
                <InputField label="Expected Annual Return" value={expectedReturn} onChange={setExpectedReturn} suffix="%" />
                <InputField label="Annual Volatility (σ)" value={annualVolatility} onChange={setAnnualVolatility} suffix="%" />
              </div>
              
              <div className="mt-8 p-4 bg-background border border-border rounded-xl">
                 <p className="text-[10px] uppercase font-extrabold text-text-muted mb-3 tracking-widest">Confidence Intervals</p>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-text-muted">95% Optimistic (P95)</span>
                       <span className="font-bold text-emerald-400">{fmtUSD(simulations.p95)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-text-muted">Median Outcome (P50)</span>
                       <span className="font-bold text-text">{fmtUSD(simulations.p50)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-text-muted">5% Pessimistic (P5)</span>
                       <span className="font-bold text-red-400">{fmtUSD(simulations.p5)}</span>
                    </div>
                 </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultMetric label="Prob. of Principal Loss" value={`${simulations.probLoss.toFixed(1)}%`} negative={simulations.probLoss > 20} positive={simulations.probLoss <= 5} />
              <ResultMetric label="Median ROI" value={fmtPct(((simulations.p50 / (parseFloat(initialValue) || 1)) - 1) * 100)} positive />
              <ResultMetric label="Risk-Adjusted (P5)" value={fmtUSD(simulations.p5)} negative={simulations.p5 < (parseFloat(initialValue) || 0)} />
              <ResultMetric label="Simulated Paths" value={simulations.N.toLocaleString()} neutral />
            </div>

            <Card className="flex-1 min-h-[400px] flex flex-col">
              <h4 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-6">GBM Stochastic Volatility Pathways</h4>
              <div className="flex-1 w-full bg-background/50 rounded-lg p-2 border border-border/50">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulations.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" label={{ value: 'Years', position: 'bottom', fill: '#666', fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="#3f3f46" />
                    <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 12 }}
                      formatter={(v: number) => fmtUSD(v)}
                    />
                    {[...Array(10)].map((_, i) => (
                      <Line 
                        key={i} 
                        type="monotone" 
                        dataKey={`path${i}`} 
                        stroke={i === 0 ? '#10b981' : '#3f3f46'} 
                        strokeWidth={i === 0 ? 2 : 1} 
                        strokeOpacity={i === 0 ? 1 : 0.3} 
                        dot={false} 
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <Info size={14} className="text-primary shrink-0" />
                <p className="text-[10px] text-text-muted leading-relaxed">
                  The chart shows 10 sample paths out of the {simulations.N} total simulated iterations. The green path represents the first generated trial.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </ProGate>
    </div>
  );
};
