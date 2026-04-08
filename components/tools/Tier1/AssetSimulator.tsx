import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { PieChart, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { Activity } from 'lucide-react';

const ASSET_CLASSES = [
  { id: 'crypto', name: 'Crypto (BTC/ETH)', color: '#F7931A', expectedReturn: 0.60, volatility: 0.70 },
  { id: 'equities', name: 'US Equities (S&P 500)', color: '#627EEA', expectedReturn: 0.10, volatility: 0.15 },
  { id: 'bonds', name: 'Treasury Bonds', color: '#10B981', expectedReturn: 0.04, volatility: 0.05 },
  { id: 'commodities', name: 'Commodities (Gold)', color: '#F59E0B', expectedReturn: 0.05, volatility: 0.15 },
  { id: 'cash', name: 'Cash equivalents', color: '#6B7280', expectedReturn: 0.02, volatility: 0.00 },
];

export const AssetSimulator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState('100000');
  const [horizonYears, setHorizonYears] = useState('10');
  
  const [weights, setWeights] = useState<Record<string, number>>({
    crypto: 20,
    equities: 50,
    bonds: 20,
    commodities: 5,
    cash: 5
  });

  const handleWeightChange = (id: string, value: string) => {
    setWeights(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const result = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const normalizedWeights = Object.keys(weights).reduce((acc, k) => {
      acc[k] = totalWeight > 0 ? weights[k] / totalWeight : 0;
      return acc;
    }, {} as Record<string, number>);

    // Portfolio metrics
    let portReturn = 0;
    let portVariance = 0; // Simplified assuming 0 correlation for rough simulation

    ASSET_CLASSES.forEach(ac => {
      const w = normalizedWeights[ac.id];
      portReturn += w * ac.expectedReturn;
      portVariance += Math.pow(w * ac.volatility, 2);
    });
    
    const portVol = Math.sqrt(portVariance);
    const sharpe = portVol > 0 ? (portReturn - 0.02) / portVol : 0;

    // Simulate pathways (Deterministic expected + standard deviation bounds)
    const years = parseFloat(horizonYears) || 10;
    const initial = parseFloat(initialInvestment) || 100000;
    
    const simulationData = [];
    const underwaterData = [];
    
    let currentVal = initial;
    let bmrkVal = initial; // Benchmark: 60/40 Equities/Bonds
    const bmrkReturn = (0.6 * 0.10) + (0.4 * 0.04);
    
    let peak = initial;

    for (let y = 0; y <= years; y++) {
      if (y === 0) {
        simulationData.push({ year: `Year 0`, portfolio: initial, benchmark: initial });
        underwaterData.push({ year: `Year 0`, drawdown: 0 });
        continue;
      }
      
      // Add pseudo-random walk normally distributed around mean (using simple approximation)
      // For a deterministic tool visual, we'll just show the expected compounded curve
      // To show drawdown, we inject a synthetic bear market at year 2 and year 7
      
      let annualGrowth = portReturn;
      if (y === 2) annualGrowth = portReturn - (portVol * 1.5); // 1.5 std dev crash
      if (y === 7) annualGrowth = portReturn - (portVol * 1.2); 

      currentVal = currentVal * (1 + annualGrowth);
      bmrkVal = bmrkVal * (1 + bmrkReturn);
      
      if (currentVal > peak) peak = currentVal;
      const drawdown = peak > 0 ? ((currentVal - peak) / peak) * 100 : 0;

      simulationData.push({ 
        year: `Year ${y}`, 
        portfolio: Math.round(currentVal), 
        benchmark: Math.round(bmrkVal) 
      });
      
      underwaterData.push({
        year: `Year ${y}`,
        drawdown: parseFloat(drawdown.toFixed(2))
      });
    }

    const finalValue = simulationData[simulationData.length - 1].portfolio;
    const maxDrawdown = Math.min(...underwaterData.map(d => d.drawdown));

    return { 
      totalWeight,
      normalizedWeights,
      portReturn,
      portVol,
      sharpe,
      finalValue,
      maxDrawdown,
      simulationData,
      underwaterData
    };
  }, [initialInvestment, horizonYears, weights]);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary"/> Simulation Settings
          </h3>
          <div className="space-y-4 mb-6">
             <InputField label="Initial Investment" value={initialInvestment} onChange={setInitialInvestment} prefix="$" />
             <InputField label="Time Horizon" value={horizonYears} onChange={setHorizonYears} suffix="years" max={50} />
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold text-sm text-text-muted">Asset Allocation</h4>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${result.totalWeight === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    Total: {result.totalWeight}%
                 </span>
             </div>
             {ASSET_CLASSES.map(ac => (
               <div key={ac.id}>
                 <div className="flex justify-between text-xs mb-1">
                   <div className="flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ac.color }} />
                     <span>{ac.name}</span>
                   </div>
                   <span className="font-mono text-text-muted">{weights[ac.id] || 0}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" max="100" 
                    value={weights[ac.id] || 0} 
                    onChange={e => handleWeightChange(ac.id, e.target.value)}
                    className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary" 
                 />
               </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
           <ResultMetric label="Projected Value" value={fmtUSD(result.finalValue)} positive />
           <ResultMetric label="Expected CAGR" value={fmtPct(result.portReturn * 100)} neutral />
           <ResultMetric label="Max Drawdown" value={fmtPct(result.maxDrawdown)} negative />
           <ResultMetric label="Sharpe Ratio" value={result.sharpe.toFixed(2)} neutral />
        </div>

        <Card className="flex-1 flex flex-col min-h-[300px]">
           <h3 className="font-bold text-lg mb-2">Growth vs Benchmark (60/40)</h3>
           <p className="text-xs text-text-muted mb-6">Simulated geometric growth including synthesized bear market stress periods.</p>
           
           <div className="flex-1 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={result.simulationData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                 <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
                 <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="#3f3f46" />
                 <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                   formatter={(v: number) => fmtUSD(v)}
                 />
                 <Line type="monotone" dataKey="portfolio" name="Your Portfolio" stroke="#10b981" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="benchmark" name="60/40 Benchmark" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card className="h-[200px] flex flex-col">
           <h3 className="font-bold text-sm mb-4 text-text-muted">Underwater Equity Curve (Drawdowns)</h3>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={result.underwaterData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                 <XAxis dataKey="year" hide />
                 <YAxis hide domain={['dataMin', 0]} />
                 <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                   formatter={(v: number) => [`${v}%`, 'Drawdown']}
                 />
                 <Area type="monotone" dataKey="drawdown" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};
