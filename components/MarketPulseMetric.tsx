import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface MarketPulseMetricProps {
  label: string;
  value: string;
  trend: number;
  data: number[];
}

export const MarketPulseMetric: React.FC<MarketPulseMetricProps> = ({ label, value, trend, data }) => {
  const isPositive = trend >= 0;
  const colorClass = isPositive ? 'text-[#10B981]' : 'text-amber-500';
  const borderClass = isPositive ? 'border-[#10B981]/20 bg-background hover:bg-[#10B981]/5' : 'border-amber-500/20 bg-background hover:bg-amber-500/5';
  const lineColor = isPositive ? '#10B981' : '#f59e0b';
  
  const chartData = data.map((val, i) => ({ value: val, index: i }));

  return (
    <div className={`p-5 rounded-2xl border ${borderClass} flex flex-col justify-between h-[140px] relative overflow-hidden transition-colors cursor-default`}>
       <div className="z-10 bg-background/50 backdrop-blur-[2px] w-fit pr-4 pb-2 rounded-br-xl">
         <div className={`text-2xl md:text-3xl font-bold font-heading tracking-tight ${colorClass}`}>{value}</div>
         <div className="text-xs font-bold text-text-muted mt-1 uppercase tracking-wider">{label}</div>
       </div>
       
       <div className="absolute inset-x-2 bottom-0 h-12 opacity-80">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={chartData}>
             <Line 
               type="monotone" 
               dataKey="value" 
               stroke={lineColor} 
               strokeWidth={2} 
               dot={false} 
               isAnimationActive={false} 
             />
           </LineChart>
         </ResponsiveContainer>
       </div>

       <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end">
          {isPositive ? <ArrowUp size={14} className={colorClass} strokeWidth={3} /> : <ArrowDown size={14} className={colorClass} strokeWidth={3} />}
          <span className={`text-sm font-bold ${colorClass} mt-0.5`}>
             {isPositive ? '' : ''}{Math.abs(trend)}%
          </span>
       </div>
    </div>
  );
};
