import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingDown } from 'lucide-react';

export const DrawdownAnalyzer: React.FC = () => {
  const [asset, setAsset] = useState('BTC');
  const [investment, setInvestment] = useState('10000');
  
  const result = useMemo(() => {
    // Generate an illustrative multi-year price path with known macro shocks
    // E.g. 2018 Winter, 2020 COVID, 2022 Bear Market
    const initialPrice = 1000;
    const inv = parseFloat(investment) || 10000;
    const coins = inv / initialPrice;

    // We will generate monthly data points over a 10-year period (120 months)
    const data = [];
    let currentPrice = initialPrice;
    let peakPrice = initialPrice;

    for (let m = 0; m <= 120; m++) {
      // Deterministic pseudo-random generation to simulate a crypto market cycle
      let drift = 0.03; // Normal 3% monthly drift
      
      // Inject macro shocks
      if (m > 12 && m < 24) drift = -0.05; // 2018 bear
      if (m > 36 && m < 48) drift = 0.15; // 2019 bull
      if (m === 48) drift = -0.40; // COVID flash crash
      if (m > 48 && m < 72) drift = 0.08; // 2021 bull
      if (m > 72 && m < 90) drift = -0.06; // 2022 bear
      if (m > 90) drift = 0.05; // Recent recovery

      // Add a bit of noise
      const noise = (Math.sin(m) * 0.08);
      currentPrice = currentPrice * (1 + drift + noise);
      
      if (currentPrice > peakPrice) peakPrice = currentPrice;
      const drawdownPct = ((currentPrice - peakPrice) / peakPrice) * 100;
      
      data.push({
        month: m,
        year: `Year ${(m / 12).toFixed(1)}`,
        price: currentPrice,
        portfolioValue: currentPrice * coins,
        drawdown: parseFloat(drawdownPct.toFixed(2))
      });
    }

    const currentVal = data[data.length - 1].portfolioValue;
    const maxDrawdown = Math.min(...data.map(d => d.drawdown));
    
    // Calculate recovery times (Time spent in drawdown > 10%)
    let monthsInDrawdown = 0;
    let longestDD = 0;
    let currentDDTimer = 0;

    data.forEach(d => {
      if (d.drawdown < -10) {
        monthsInDrawdown++;
        currentDDTimer++;
        if (currentDDTimer > longestDD) longestDD = currentDDTimer;
      } else {
        currentDDTimer = 0;
      }
    });

    return { data, currentVal, maxDrawdown, monthsInDrawdown, longestDD };
  }, [investment, asset]);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-primary"/> Drawdown Analyzer
          </h3>
          <p className="text-xs text-text-muted mb-6">
            Visualize the historical pain tolerance required to hold highly volatile assets.
          </p>
          <div className="space-y-4">
             <InputField label="Asset Symbol" value={asset} onChange={setAsset} />
             <InputField label="Simulated Entry ($)" value={investment} onChange={setInvestment} prefix="$" />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
           <ResultMetric label="Current Value" value={fmtUSD(result.currentVal)} positive={result.currentVal > parseFloat(investment)} negative={result.currentVal < parseFloat(investment)} />
           <ResultMetric label="Max Historical DD" value={fmtPct(result.maxDrawdown)} negative />
           <ResultMetric label="Longest Underwater" value={`${result.longestDD} mo`} neutral />
           <ResultMetric label="% Time in Drawdown" value={fmtPct((result.monthsInDrawdown / 120) * 100)} neutral />
        </div>

        <Card className="flex-1 min-h-[250px] flex flex-col">
           <h3 className="font-bold text-sm mb-4 text-text-muted">Portfolio Value over Simulated Cycle</h3>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={result.data} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                 <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
                 <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="#3f3f46" />
                 <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                   formatter={(v: number) => fmtUSD(v)}
                 />
                 <Area type="monotone" dataKey="portfolioValue" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card className="flex-1 min-h-[200px] flex flex-col">
           <h3 className="font-bold text-sm mb-4 text-text-muted text-red-400">Underwater Curve (Drawdown Depth)</h3>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={result.data} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                 <XAxis dataKey="year" hide />
                 <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `${v}%`} stroke="#3f3f46" domain={['dataMin - 5', 0]} />
                 <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                   formatter={(v: number) => [`${v}%`, 'Drawdown']}
                 />
                 <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={2} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};
