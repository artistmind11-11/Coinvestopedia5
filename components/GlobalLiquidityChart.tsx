import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar } from 'recharts';

export const GlobalLiquidityChart: React.FC = () => {
  // Generate some complex-looking mock data that visually simulates
  // moving averages and volume/price bars
  const data = useMemo(() => {
    let base = 100;
    return Array.from({ length: 40 }).map((_, i) => {
      // Create a downward trending baseline
      base -= Math.random() * 2;
      return {
        ma1: base,
        ma2: base + 2,
        ma3: base + 5,
        ma4: base + 8,
        candleOpen: base + 1,
        // Bar height representing volume or candle bodies
        candleClose: Math.random() * 15 + 5,
      };
    });
  }, []);

  return (
    <div className="relative w-full h-[300px] lg:h-full lg:aspect-square bg-[#0a0a0c] rounded-2xl border border-white/5 overflow-hidden flex flex-col group">
       <div className="flex-1 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pt-8 pl-4 pr-12 pb-16">
         <ResponsiveContainer width="100%" height="100%">
           <ComposedChart data={data}>
              {/* Faint trend lines mimicking EMAs */}
              <Line type="monotone" dataKey="ma1" stroke="#ffffff" strokeOpacity={0.6} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ma2" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ma3" stroke="#ffffff" strokeOpacity={0.15} strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ma4" stroke="#ffffff" strokeOpacity={0.07} strokeWidth={1} dot={false} isAnimationActive={false} />
              
              {/* Vertical bars mimicking footprint/volume */}
              <Bar dataKey="candleClose" fill="#ffffff" fillOpacity={0.2} barSize={4} isAnimationActive={false} />
           </ComposedChart>
         </ResponsiveContainer>
       </div>
       
       <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent">
          <div className="text-base md:text-xl font-bold text-white mb-3 font-heading tracking-wide">
             Global Liquidity Index
          </div>
          <div className="h-2 md:h-2.5 w-[85%] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#10B981] w-[75%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
          </div>
       </div>
    </div>
  );
};
