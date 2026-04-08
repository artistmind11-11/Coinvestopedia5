import React from 'react';
import { AssetData } from '../../data/assetRegistry';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { AssetIcon } from '../AssetIcon';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ReferenceLine } from 'recharts';

interface PerformancePanelProps {
  assets: AssetData[];
}

// ─── RISK-ADJUSTED METRICS CARDS ──────────────────────────────────────────────

const RiskAdjustedCards: React.FC<{ assets: AssetData[] }> = ({ assets }) => {
  const sortedBySharpe = [...assets].sort((a, b) => b.sharpe90d - a.sharpe90d);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="leather-card rounded-xl p-4 lg:p-6">
      <h3 className="font-bold text-lg mb-1">Risk-Adjusted Metrics</h3>
      <p className="text-sm text-text-muted mb-6">Sharpe ratio, 3Y CAGR, and max drawdown — ranked by risk-adjusted returns.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedBySharpe.map((asset, idx) => (
          <div key={asset.id} className="relative bg-surface border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-surface-alt hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
            {/* Medal badge */}
            {idx < 3 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center text-base z-10">
                {medals[idx]}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <AssetIcon symbol={asset.symbol} size={32} />
              <div className="min-w-0">
                <span className="font-bold text-sm block truncate group-hover:text-primary transition-colors" style={{ color: asset.color }}>{asset.symbol}</span>
                <p className="text-[10px] text-text-muted truncate">{asset.name}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Sharpe (90d)</span>
                <span className={`font-mono font-bold text-sm ${asset.sharpe90d >= 1 ? 'text-emerald-400' : asset.sharpe90d >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {asset.sharpe90d.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">3Y CAGR</span>
                <span className={`font-mono font-bold text-sm ${asset.cagr3y >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {asset.cagr3y > 0 ? '+' : ''}{asset.cagr3y.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Max Drawdown</span>
                <span className="font-mono font-bold text-sm text-red-400">
                  {asset.maxDrawdown.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Rank indicator bar */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-[9px] text-text-muted mb-1">
                <span>RANK</span>
                <span>#{idx + 1} of {sortedBySharpe.length}</span>
              </div>
              <div className="w-full bg-background rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${Math.max(5, 100 - (idx / sortedBySharpe.length) * 100)}%`,
                    backgroundColor: idx === 0 ? '#10B981' : idx === 1 ? '#3B82F6' : idx === 2 ? '#F59E0B' : '#6B7280',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── YTD vs 1Y COMPARISON CHART ───────────────────────────────────────────────

const ReturnComparisonChart: React.FC<{ assets: AssetData[] }> = ({ assets }) => {
  const chartData = assets.map(a => ({
    symbol: a.symbol,
    YTD: a.changeYtd,
    '1Y': a.change1y,
    color: a.color,
  }));

  return (
    <div className="leather-card rounded-xl p-4 lg:p-6">
      <h3 className="font-bold text-lg mb-1">YTD vs 1-Year Returns</h3>
      <p className="text-sm text-text-muted mb-6">Side-by-side comparison of short-term and medium-term performance.</p>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis dataKey="symbol" stroke="#52525B" tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 700 }} />
            <YAxis stroke="#52525B" tick={{ fill: '#71717A', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip itemStyle={{ color: '#e4e4e7' }}
              contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#F4F4F5', borderRadius: '8px' }}
              formatter={(value: number, name: string) => [`${value > 0 ? '+' : ''}${value.toFixed(1)}%`, name]}
              labelStyle={{ color: '#A1A1AA', fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <ReferenceLine y={0} stroke="#52525B" />
            <Bar dataKey="YTD" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="1Y" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export const PerformancePanel: React.FC<PerformancePanelProps> = ({ assets }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <RiskAdjustedCards assets={assets} />
      <ReturnComparisonChart assets={assets} />
    </div>
  );
};
