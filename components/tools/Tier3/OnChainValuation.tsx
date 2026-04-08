import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { ProGate, ResultMetric, fmtUSD } from '../shared/SharedComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Globe, ShieldAlert } from 'lucide-react';

export const OnChainValuation: React.FC = () => {
  const [activeModel, setActiveModel] = useState<'S2F' | 'MVRV'>('S2F');

  const modelData = useMemo(() => {
    // Generate an illustrative 10-year historical dataset for BTC
    // This provides a high-fidelity visual without needing a 5MB JSON blob.
    const data = [];
    const points = 120; // 120 months (10 years)
    
    for (let i = 0; i < points; i++) {
        const yearOffset = i / 12; // 0 to 10
        const date = new Date(2014, i, 1);
        
        // Base price growth: Exponential cycle (Logarithmic scale visually)
        // Simulate halving cycles every 4 years (48 months: e.g. mid-2016, 2020, 2024)
        const halvingCycleMod = Math.sin(((i - 18) / 48) * Math.PI * 2); 
        
        // Base exponential
        let btcPrice = 300 * Math.pow(1.6, yearOffset); 
        // Add cycle volatility
        btcPrice = btcPrice * (1 + (halvingCycleMod * 0.8));
        // Add noise
        btcPrice = btcPrice * (1 + (Math.random() * 0.2 - 0.1));

        // Models
        // 1. S2F (Stock to Flow) Value
        // Rises sharply after halvings.
        const s2fValue = 200 * Math.pow(1.9, yearOffset) * (1 + (Math.floor(yearOffset / 4) * 0.5));

        // 2. MVRV Z-Score (Market Value to Realized Value)
        // Usually peaks during bull markets (> 7 is red), bottoms in bear (< 0 is green)
        const realizedPrice = btcPrice / (1 + (halvingCycleMod * 1.5) + (Math.random() * 0.1));
        const mvrvZ = halvingCycleMod > 0 ? (halvingCycleMod * 8) + Math.random() : (halvingCycleMod * 2) - Math.random();

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit'}),
            timestamp: date.getTime(),
            btcPrice: Math.round(btcPrice),
            s2fValue: Math.round(s2fValue),
            realizedPrice: Math.round(realizedPrice),
            mvrvZ: parseFloat(mvrvZ.toFixed(2))
        });
    }
    
    return data;
  }, []);

  const currentData = modelData[modelData.length - 1];

  return (
    <div className="animate-fade-in">
      <ProGate 
        title="Institutional On-Chain Models" 
        description="Access Fidelity & ARK-style blockchain valuations. Benchmark current market value against realized cost basis and scarcity models."
      >
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <Globe size={18} className="text-primary"/> On-Chain Valuation Models
               </h3>
               
               {/* Model Switcher */}
               <div className="flex bg-background border border-border p-1 rounded-lg w-full md:w-auto">
                 <button 
                   onClick={() => setActiveModel('S2F')}
                   className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-all ${activeModel === 'S2F' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'}`}
                 >
                   Stock-to-Flow
                 </button>
                 <button 
                   onClick={() => setActiveModel('MVRV')}
                   className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-all ${activeModel === 'MVRV' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'}`}
                 >
                   MVRV Z-Score
                 </button>
               </div>
            </div>

            {/* Metrics */}
            {activeModel === 'S2F' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ResultMetric label="Current BTC Price" value={fmtUSD(currentData.btcPrice)} neutral />
                <ResultMetric label="S2F Model Price" value={fmtUSD(currentData.s2fValue)} neutral />
                <ResultMetric 
                   label="Variance to Model" 
                   value={`${((currentData.btcPrice - currentData.s2fValue) / currentData.s2fValue * 100).toFixed(1)}%`} 
                   negative={currentData.btcPrice > currentData.s2fValue} 
                   positive={currentData.btcPrice <= currentData.s2fValue} 
                />
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary text-center">
                  Model forecasts based on digital scarcity & halvings.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ResultMetric label="Current BTC Price" value={fmtUSD(currentData.btcPrice)} neutral />
                <ResultMetric label="Realized Price" value={fmtUSD(currentData.realizedPrice)} neutral />
                <ResultMetric 
                  label="MVRV Z-Score" 
                  value={currentData.mvrvZ.toFixed(2)} 
                  negative={currentData.mvrvZ > 5} 
                  positive={currentData.mvrvZ < 1} 
                  neutral={currentData.mvrvZ >= 1 && currentData.mvrvZ <= 5} 
                />
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex flex-col justify-center text-[10px] font-bold text-primary">
                  <span>Green zone: Z &lt; 0 (Undervalued)</span>
                  <span className="text-red-400 mt-1">Red zone: Z &gt; 7 (Overvalued)</span>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="w-full h-[400px] mt-8">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={modelData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                   <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" minTickGap={30} />
                   
                   {/* Left Y Axis for Price */}
                   <YAxis yAxisId="left" scale="log" domain={['dataMin', 'dataMax']} tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${v}`} stroke="#3f3f46" />
                   
                   {/* Right Y Axis for Z-Score (Only visible when MVRV is active) */}
                   {activeModel === 'MVRV' && (
                     <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#ef4444' }} stroke="#3f3f46" />
                   )}

                   <Tooltip itemStyle={{ color: '#e4e4e7' }}
                     contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                     formatter={(v: number, name: string) => {
                       if (name === 'MVRV Z-Score') return [v.toFixed(2), name];
                       return [fmtUSD(v), name];
                     }}
                     labelStyle={{ color: '#a1a1aa', marginBottom: 4 }}
                   />
                   <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                   
                   <Line yAxisId="left" type="monotone" dataKey="btcPrice" name="BTC Price" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                   
                   {activeModel === 'S2F' && (
                     <Line yAxisId="left" type="stepAfter" dataKey="s2fValue" name="S2F Model Price" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                   )}
                   
                   {activeModel === 'MVRV' && (
                     <>
                       <Line yAxisId="left" type="monotone" dataKey="realizedPrice" name="Realized Price (Cost Basis)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                       <Line yAxisId="right" type="monotone" dataKey="mvrvZ" name="MVRV Z-Score" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                     </>
                   )}
                 </LineChart>
               </ResponsiveContainer>
            </div>
            
            <div className="mt-8 flex items-start gap-4 p-4 rounded-xl border border-border bg-background">
               <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
               <p className="text-xs text-text-muted leading-relaxed">
                 <strong>Disclaimer:</strong> On-chain models are highly speculative heuristics based on historical network data. 
                 The Stock-to-Flow model relies on the assumption that scarcity directly drives value, which may break down. 
                 MVRV compares the total market cap to the aggregate cost basis of all coins. Past performance is not indicative of future results.
               </p>
            </div>
          </Card>
        </div>
      </ProGate>
    </div>
  );
};
