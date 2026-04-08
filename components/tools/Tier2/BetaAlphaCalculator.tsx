import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { InputField, ResultMetric } from '../shared/SharedComponents';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';

export const BetaAlphaCalculator: React.FC = () => {
  const [assetName, setAssetName] = useState('BTC');
  const [benchmarkName, setBenchmarkName] = useState('S&P 500');
  const [volatilityMultiplier, setVolatilityMultiplier] = useState('3'); // Higher = more volatile than benchmark

  const result = useMemo(() => {
    const volMult = parseFloat(volatilityMultiplier) || 3;
    
    // Generate 52 data points (representing weekly returns over 1 year)
    // We create realistic structured scatter data simulating beta
    const points: [number, number][] = [];
    const chartData = [];

    // Synthesize data:
    // If S&P moves X, BTC moves X * (Beta) + Alpha + Noise
    const baseAlpha = 0.005; // 0.5% weekly synthetic alpha
    const baseBeta = volMult;

    for (let i = 0; i < 52; i++) {
        // Benchmark return: roughly normal dist centered at 0.002
        const benchR = ((Math.random() + Math.random() + Math.random() - 1.5) / 1.5) * 0.04;
        
        // Asset return
        const noise = ((Math.random() - 0.5) * 0.06); // 6% random noise window
        const assetR = (benchR * baseBeta) + baseAlpha + noise;

        points.push([benchR, assetR]);
        chartData.push({ x: benchR * 100, y: assetR * 100, label: `Week ${i+1}` });
    }

    // Calculate actual regression using simple-statistics
    const regressionResult = linearRegression(points);
    const lineFn = linearRegressionLine(regressionResult);
    const r2 = rSquared(points, lineFn);
    
    // Convert m and b to Beta and Alpha
    const beta = regressionResult.m; // Slope
    const alpha = regressionResult.b; // Intercept (weekly alpha)
    
    const annualizedAlpha = ((Math.pow(1 + alpha, 52)) - 1) * 100;

    // Generate Regression Line points for the chart
    const xMin = Math.min(...chartData.map(d => d.x)) - 1;
    const xMax = Math.max(...chartData.map(d => d.x)) + 1;
    
    const lineData = [
       { x: xMin, y: lineFn(xMin / 100) * 100 },
       { x: 0, y: lineFn(0) * 100 },
       { x: xMax, y: lineFn(xMax / 100) * 100 }
    ];

    return { beta, annualizedAlpha, r2, chartData, lineData };
  }, [volatilityMultiplier, assetName, benchmarkName]);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary"/> Regression Parameters
          </h3>
          <p className="text-xs text-text-muted mb-6">
             Measure systemic risk (Beta) and idosyncratic excess return (Alpha).
          </p>
          <div className="space-y-4">
             <InputField label="Asset Ticker" value={assetName} onChange={setAssetName} />
             <InputField label="Benchmark Ticker" value={benchmarkName} onChange={setBenchmarkName} />
             <div className="mt-4 p-3 bg-surface border border-border rounded-lg">
                <label className="text-xs font-bold text-text-muted mb-2 block">Synthetic Volatility Core (Testing)</label>
                <input 
                  type="range" min="0.1" max="5" step="0.1" 
                  value={volatilityMultiplier} 
                  onChange={e => setVolatilityMultiplier(e.target.value)}
                  className="w-full accent-primary" 
                />
             </div>
          </div>
          <div className="mt-4 text-xs text-text-muted p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <span className="text-primary font-bold">Beta &#62; 1:</span> More volatile than market. <br/>
            <span className="text-primary font-bold">Alpha &#62; 0:</span> Outperforming expected risk.
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
           <ResultMetric label={`${assetName} Beta`} value={result.beta.toFixed(2)} neutral />
           <ResultMetric label="Annualized Alpha" value={`${result.annualizedAlpha > 0 ? '+' : ''}${result.annualizedAlpha.toFixed(2)}%`} positive={result.annualizedAlpha > 0} negative={result.annualizedAlpha < 0} />
           <ResultMetric label="R-Squared (Fit)" value={result.r2.toFixed(2)} neutral />
        </div>

        <Card className="flex-1 min-h-[400px] flex flex-col">
           <h3 className="font-bold text-lg mb-2">Linear Regression Scatter Model</h3>
           <p className="text-xs text-text-muted mb-4 uppercase tracking-wider font-bold">Y = {result.beta.toFixed(2)}X + {(result.annualizedAlpha/52).toFixed(3)}%</p>
           
           <div className="flex-1 w-full bg-background/50 rounded-lg border border-border/50 p-2">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                 
                 <XAxis 
                   type="number" 
                   dataKey="x" 
                   name={benchmarkName} 
                   unit="%" 
                   tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                   stroke="#3f3f46"
                   label={{ value: `${benchmarkName} Returns (%)`, position: 'bottom', fill: '#a1a1aa', fontSize: 12 }} 
                 />
                 
                 <YAxis 
                   type="number" 
                   dataKey="y" 
                   name={assetName} 
                   unit="%" 
                   tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                   stroke="#3f3f46"
                   label={{ value: `${assetName} Returns (%)`, angle: -90, position: 'left', fill: '#a1a1aa', fontSize: 12 }}
                 />
                 
                 <RechartsTooltip 
                   cursor={{ strokeDasharray: '3 3', stroke: '#71717a' }}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8 }}
                   formatter={(v: number, name: string) => [v.toFixed(2) + '%', name]}
                 />

                 {/* Trendline */}
                 <Line 
                   data={result.lineData} 
                   type="linear" 
                   dataKey="y" 
                   stroke="#10b981" 
                   strokeWidth={2} 
                   dot={false} 
                   activeDot={false} 
                   isAnimationActive={false}
                 />

                 {/* Quadrant lines */}
                 <ReferenceLine x={0} stroke="#71717a" strokeWidth={1} opacity={0.5} />
                 <ReferenceLine y={0} stroke="#71717a" strokeWidth={1} opacity={0.5} />

                 <Scatter name={`${assetName} returns`} data={result.chartData} fill="#f59e0b" shape="circle" fillOpacity={0.6} />
               </ScatterChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};
