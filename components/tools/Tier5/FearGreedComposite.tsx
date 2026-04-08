import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { ProGate, ResultMetric } from '../shared/SharedComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Activity, ShieldAlert, Sparkles } from 'lucide-react';

const SENTIMENT_DRIVERS = [
  { id: 'momentum', name: 'Price Momentum', weight: 25, value: 75 },
  { id: 'volatility', name: 'Volatility (VIX)', weight: 20, value: 30 },
  { id: 'breadth', name: 'Market Breadth', weight: 15, value: 65 },
  { id: 'junk', name: 'Junk Bond Demand', weight: 10, value: 85 },
  { id: 'safe', name: 'Safe Haven Demand', weight: 15, value: 20 },
  { id: 'put-call', name: 'Put/Call Ratio', weight: 15, value: 55 },
];

export const FearGreedComposite: React.FC = () => {
  const [driverValues, setDriverValues] = useState<Record<string, number>>(
    SENTIMENT_DRIVERS.reduce((acc, d) => ({ ...acc, [d.id]: d.value }), {})
  );

  const stats = useMemo(() => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    const chartData = SENTIMENT_DRIVERS.map(d => {
      const val = driverValues[d.id];
      weightedSum += (val * (d.weight / 100));
      totalWeight += (d.weight / 100);
      return { 
        name: d.name, 
        value: val,
        color: val > 60 ? '#10b981' : val < 40 ? '#ef4444' : '#f59e0b'
      };
    });

    const compositeScore = weightedSum;
    
    let label = 'NEUTRAL';
    let color = 'text-text-muted';
    let bg = 'bg-background';
    let border = 'border-border';

    if (compositeScore > 75) { label = 'EXTREME GREED'; color = 'text-emerald-400'; bg = 'bg-emerald-500/10'; border = 'border-emerald-500/20'; }
    else if (compositeScore > 55) { label = 'GREED'; color = 'text-emerald-300'; bg = 'bg-emerald-500/5'; border = 'border-emerald-500/10'; }
    else if (compositeScore < 25) { label = 'EXTREME FEAR'; color = 'text-red-500'; bg = 'bg-red-500/10'; border = 'border-red-500/20'; }
    else if (compositeScore < 45) { label = 'FEAR'; color = 'text-red-300'; bg = 'bg-red-500/5'; border = 'border-red-500/10'; }

    return { compositeScore, label, color, bg, border, chartData };
  }, [driverValues]);

  const handleUpdate = (id: string, val: string) => {
    setDriverValues(prev => ({ ...prev, [id]: parseInt(val) || 0 }));
  };

  return (
    <div className="animate-fade-in">
      <ProGate 
        title="Institutional Sentiment Composite" 
        description="A weighted aggregate of 6 cross-asset sentiment signals including VIX volatility, junk bond demand, and safe-haven rotation."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dashboard Left */}
          <div className="lg:col-span-4 space-y-6">
            <Card className={`transition-all duration-700 p-8 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-inner ${stats.bg} ${stats.border}`}>
               <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                  <Activity size={100} className={stats.color} />
               </div>
               
               <p className="text-xs uppercase font-extrabold text-text-muted tracking-widest mb-4">Sentiment Score</p>
               <h3 className={`text-6xl font-heading font-extrabold mb-2 ${stats.color} drop-shadow-2xl`}>
                  {Math.round(stats.compositeScore)}
               </h3>
               <h4 className={`text-xl font-bold tracking-widest ${stats.color} mb-8`}>{stats.label}</h4>
               
               {/* Custom SVG Gauge */}
               <div className="w-full relative h-[140px] flex items-end justify-center">
                  <svg width="240" height="120" viewBox="0 0 200 100">
                     {/* Outer border */}
                     <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#27272a" strokeWidth="12" strokeLinecap="round" />
                     {/* Active fill */}
                     <path 
                        d="M20,100 A80,80 0 0,1 180,100" 
                        fill="none" 
                        stroke="url(#gauge-gradient)" 
                        strokeWidth="12" 
                        strokeLinecap="round" 
                        strokeDasharray="251" 
                        strokeDashoffset={251 - (251 * (stats.compositeScore / 100))} 
                        className="transition-all duration-1000 ease-out"
                     />
                     <defs>
                        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#ef4444" />
                           <stop offset="50%" stopColor="#f59e0b" />
                           <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                     </defs>
                     {/* Needle */}
                     <g transform={`translate(100, 100) rotate(${(stats.compositeScore / 100) * 180 - 180})`}>
                        <line x1="0" y1="0" x2="-80" y2="0" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="8" fill="white" />
                     </g>
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 text-[10px] text-text-muted font-bold tracking-widest">
                     <span>FEAR</span>
                     <span>GREED</span>
                  </div>
               </div>
            </Card>

            <Card className="p-4 bg-primary/5 border border-primary/20">
               <h5 className="text-[10px] font-extrabold text-primary mb-3 tracking-widest flex items-center gap-1.5 uppercase leading-none">
                  <Sparkles size={12} /> Market Outlook
               </h5>
               <p className="text-xs text-text-muted leading-relaxed">
                  {stats.compositeScore > 75 
                    ? "Sentiment is overheated. Historical data suggests a cooling period or mean-reversion is statistically likely within the next 3 weeks."
                    : stats.compositeScore < 25
                    ? "Extreme fear detected. Historically, this aligns with market capitulation and long-term accumulation opportunities."
                    : "Neutral momentum. The market is consolidating without a strong directional signal from secondary metrics."
                  }
               </p>
            </Card>
          </div>

          {/* Controls Right */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="flex-1">
               <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
                  <ShieldAlert size={18} className="text-primary"/> Signal Weights & Values
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {SENTIMENT_DRIVERS.map(driver => (
                    <div key={driver.id} className="space-y-4 p-4 rounded-xl bg-background/50 border border-border/50 group hover:border-text-muted/50 transition-colors">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-xs font-bold uppercase tracking-widest text-text-muted">{driver.name}</label>
                          <span className={`text-sm font-mono font-bold ${driverValues[driver.id] > 60 ? 'text-emerald-400' : driverValues[driver.id] < 40 ? 'text-red-400' : 'text-text'}`}>
                             {driverValues[driver.id]}
                          </span>
                       </div>
                       <input 
                         type="range" 
                         min="0" max="100" 
                         value={driverValues[driver.id]} 
                         onChange={e => handleUpdate(driver.id, e.target.value)} 
                         className="w-full accent-primary h-1.5 rounded-lg appearance-none cursor-pointer bg-background"
                       />
                       <div className="flex justify-between text-[10px] font-bold text-text-muted/40 uppercase tracking-widest">
                          <span>Fearful</span>
                          <span>Greedy</span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="h-[250px] w-full pt-4 border-t border-border/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData} margin={{ left: 0, right: 30, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#a1a1aa' }} stroke="#3f3f46" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
                      <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }} 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                        formatter={(v: number) => [v, 'Signal Strength']}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {stats.chartData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </Card>
          </div>
        </div>
      </ProGate>
    </div>
  );
};
