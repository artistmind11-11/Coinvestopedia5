import React from 'react';
import { AssetData, CORRELATION_MATRIX } from '../../data/assetRegistry';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Target } from 'lucide-react';

interface CorrelationHeatmapProps {
  assets: AssetData[];
}

// ─── FXBLUE STYLE COLOR MAPPING ───────────────────────────────────────────────

const getFxBlueColor = (correlation: number): string => {
  const abs = Math.abs(correlation * 100);
  if (abs < 20) return 'bg-[#408b15]'; // Green (Weak/None)
  if (abs < 50) return 'bg-[#2c71a3]'; // Blue (Low)
  if (abs < 75) return 'bg-[#d95a00]'; // Orange (Moderate)
  return 'bg-[#d7003a]';               // Red (Strong)
};

const formatCorrelation = (correlation: number): string => {
  const val = Math.round(correlation * 100);
  return val > 0 ? `+${val}` : `${val}`;
};

// CSS pattern for the diagonal checkerboard
const CheckerboardPattern = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-20 dark:opacity-10">
    <defs>
      <pattern id="checkerboard" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="currentColor" />
        <rect x="4" y="4" width="4" height="4" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#checkerboard)" className="text-gray-900 dark:text-white" />
  </svg>
);

// ─── RADAR CHART ──────────────────────────────────────────────────────────────

const CorrelationRadar: React.FC<{ assets: AssetData[] }> = ({ assets }) => {
  // Use a fixed set of base assets for the radar overlay
  const baseAssets = ['BTC', 'GOLD', 'SPY'];
  
  const data = assets.map(colAsset => {
    const dataPoint: any = { subject: colAsset.symbol };
    baseAssets.forEach(rowSym => {
      let corr = CORRELATION_MATRIX[rowSym]?.[colAsset.symbol] ?? CORRELATION_MATRIX[colAsset.symbol]?.[rowSym] ?? 0;
      if (rowSym === colAsset.symbol) corr = 1;
      
      // Radar charts require positive values or specific domain mapping
      // We'll normalize [-1, 1] to [0, 100] for visual spread
      dataPoint[rowSym] = Math.max(0, Math.round(((corr + 1) / 2) * 100));
    });
    return dataPoint;
  });

  return (
    <div className="leather-card rounded-xl p-4 lg:p-6 mt-6">
      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
        <Target size={20} className="text-primary" /> Macro Overlay Radar
      </h3>
      <p className="text-sm text-text-muted mb-6">Cross-correlation normalized strength to BTC, Gold, and S&P 500.</p>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#3F3F46" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            <Radar name="Bitcoin (BTC)" dataKey="BTC" stroke="#F7931A" fill="#F7931A" fillOpacity={0.3} />
            <Radar name="Gold (GOLD)" dataKey="GOLD" stroke="#FFD700" fill="#FFD700" fillOpacity={0.3} />
            <Radar name="S&P 500 (SPY)" dataKey="SPY" stroke="#00A859" fill="#00A859" fillOpacity={0.3} />
            
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Tooltip itemStyle={{ color: '#e4e4e7' }} 
              contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px' }}
              labelStyle={{ color: '#F4F4F5', fontWeight: 'bold', marginBottom: '8px' }}
              formatter={(value: number) => [`${value}/100 Score`, 'Relative Correlation']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ assets }) => {
  if (assets.length < 2) return null;

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* ─── MATRIX PANEL ────────────────────────────────────────────────────── */}
      <div className="leather-card rounded-xl p-4 lg:p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
             <h3 className="font-bold text-lg">Correlation Matrix (1Y)</h3>
             <p className="text-sm text-text-muted mt-1">Institutional-grade cross-asset correlation mapping. Values range from -100 to +100.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted bg-surface px-4 py-2 rounded-xl border border-border shrink-0">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#d7003a]"></span> &gt;75</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#d95a00]"></span> 50-74</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2c71a3]"></span> 20-49</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#408b15]"></span> &lt;20</div>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 custom-scrollbar">
           <div className="inline-block min-w-full">
              
              {/* Header Row */}
              <div className="flex">
                 <div className="w-[100px] h-10 shrink-0"></div> {/* Corner */}
                 {assets.map(asset => (
                   <div key={asset.id} 
                        className="w-[85px] h-10 shrink-0 flex items-center justify-center font-bold text-[11px] bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-b border-r border-white dark:border-zinc-900 border-t">
                     {asset.symbol}
                   </div>
                 ))}
              </div>

              {/* Data Rows */}
              {assets.map((yAsset) => (
                <div key={yAsset.id} className="flex">
                   {/* Left Header */}
                   <div className="w-[100px] h-[45px] shrink-0 flex items-center px-4 font-bold text-[11px] bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-b border-r border-l border-white dark:border-zinc-900 sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                     {yAsset.symbol}
                   </div>
                   
                   {/* Cells */}
                   {assets.map((xAsset) => {
                     const isSelf = yAsset.symbol === xAsset.symbol;
                     let correlation = 1;
                     
                     if (!isSelf) {
                       correlation = CORRELATION_MATRIX[yAsset.symbol]?.[xAsset.symbol] ?? CORRELATION_MATRIX[xAsset.symbol]?.[yAsset.symbol] ?? 0;
                     }

                     const bgClass = isSelf ? 'bg-gray-200 dark:bg-zinc-800' : getFxBlueColor(correlation);

                     return (
                       <div 
                         key={`${yAsset.id}-${xAsset.id}`} 
                         className={`w-[85px] h-[45px] shrink-0 border-b border-r border-white dark:border-zinc-900 flex items-center justify-center text-sm font-medium transition-transform hover:scale-105 hover:z-20 hover:shadow-xl relative object-contain text-white ${bgClass}`}
                       >
                         {isSelf ? (
                           <CheckerboardPattern />
                         ) : (
                           <span className="relative z-10">{formatCorrelation(correlation)}</span>
                         )}
                       </div>
                     );
                   })}
                </div>
              ))}
           </div>
        </div>
      </div>

      <CorrelationRadar assets={assets} />

    </div>
  );
};
