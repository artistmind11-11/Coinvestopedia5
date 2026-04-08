import React from 'react';
import { AssetData, getCategoryIcon, ASSET_REGISTRY } from '../../data/assetRegistry';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { AssetIcon } from '../AssetIcon';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';

interface OverviewPanelProps {
  assets: AssetData[];
}

// ─── MACRO STRIP ──────────────────────────────────────────────────────────────

const MACRO_KEYS = ['BTC', 'GOLD', 'SPY', 'UST10Y', 'VIX', 'DXY'];

const MacroStrip: React.FC<{ allAssets: Record<string, AssetData> }> = ({ allAssets }) => {
  const macroAssets = MACRO_KEYS.map(k => allAssets[k]).filter(Boolean);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {macroAssets.map(asset => (
        <div key={asset.symbol} className="flex items-center gap-3 px-4 py-2.5 bg-surface rounded-xl border border-border whitespace-nowrap min-w-[155px] hover:border-primary/50 hover:bg-surface-alt hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-default">
          <AssetIcon symbol={asset.symbol} size={24} />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{asset.symbol}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold">
                {asset.symbol === 'UST10Y' ? `${asset.price}%` : asset.symbol === 'VIX' || asset.symbol === 'DXY' ? asset.price.toFixed(1) : `$${asset.price.toLocaleString()}`}
              </span>
              <span className={`flex items-center text-[10px] font-bold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {asset.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="ml-0.5">{Math.abs(asset.change24h).toFixed(2)}%</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── YTD PERFORMANCE BAR CHART ────────────────────────────────────────────────

const YtdBarChart: React.FC<{ assets: AssetData[] }> = ({ assets }) => {
  const sorted = [...assets].sort((a, b) => b.changeYtd - a.changeYtd);
  const chartData = sorted.map(a => ({
    symbol: a.symbol,
    ytd: a.changeYtd,
    color: a.color,
  }));

  return (
    <div className="leather-card rounded-xl p-4 lg:p-6">
      <h3 className="font-bold text-lg mb-1">YTD Performance Ranking</h3>
      <p className="text-sm text-text-muted mb-6">Year-to-date returns across selected assets, ranked best to worst.</p>
      <div style={{ height: Math.max(300, assets.length * 42) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} />
            <XAxis type="number" stroke="#52525B" tick={{ fill: '#71717A', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="symbol" stroke="#52525B" tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 700 }} width={55} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#171717', 
                borderColor: '#2a2a2a', 
                color: '#f4f4f5', 
                borderRadius: '10px', 
                border: '1px solid #2a2a2a',
                padding: '10px 14px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                fontSize: '13px',
                fontWeight: 600,
              }}
              cursor={{ fill: '#3f3f46', fillOpacity: 0.15 }}
              formatter={(value: number) => [`${value > 0 ? '+' : ''}${value.toFixed(1)}%`, 'YTD Return']}
              labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
              itemStyle={{ color: '#f4f4f5', fontWeight: 700 }}
            />
            <ReferenceLine x={0} stroke="#52525B" strokeDasharray="3 3" />
            <Bar dataKey="ytd" radius={[0, 4, 4, 0]} barSize={24}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.ytd >= 0 ? '#10B981' : '#EF4444'} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── SUMMARY TABLE ────────────────────────────────────────────────────────────

const SummaryTable: React.FC<{ assets: AssetData[] }> = ({ assets }) => {
  const [sortField, setSortField] = React.useState<keyof AssetData>('marketCap');
  const [sortDesc, setSortDesc] = React.useState(true);

  const sorted = [...assets].sort((a, b) => {
    const va = a[sortField] as number;
    const vb = b[sortField] as number;
    return sortDesc ? vb - va : va - vb;
  });

  const handleSort = (field: keyof AssetData) => {
    if (sortField === field) setSortDesc(!sortDesc);
    else { setSortField(field); setSortDesc(true); }
  };

  const pctCell = (val: number) => (
    <span className={`font-mono font-bold ${val >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {val > 0 ? '+' : ''}{val.toFixed(1)}%
    </span>
  );

  const SortHeader: React.FC<{ label: string; field: keyof AssetData }> = ({ label, field }) => (
    <th
      className="p-3 text-right text-[10px] uppercase tracking-wider text-text-muted font-bold cursor-pointer hover:text-text transition-colors whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-end gap-1">
        {label}
        <ArrowUpDown size={10} className={sortField === field ? 'text-primary' : 'text-text-muted/30'} />
      </div>
    </th>
  );

  return (
    <div className="leather-card rounded-xl overflow-hidden">
      <div className="p-4 lg:p-6 pb-0">
        <h3 className="font-bold text-lg mb-1">Asset Summary</h3>
        <p className="text-sm text-text-muted mb-4">Full metrics table for all selected assets.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface/50 border-y border-border">
            <tr>
              <th className="p-3 text-left text-[10px] uppercase tracking-wider text-text-muted font-bold sticky left-0 bg-surface z-10 min-w-[140px]">Asset</th>
              <SortHeader label="Price" field="price" />
              <SortHeader label="24h" field="change24h" />
              <SortHeader label="7D" field="change7d" />
              <SortHeader label="YTD" field="changeYtd" />
              <SortHeader label="1Y" field="change1y" />
              <SortHeader label="Mkt Cap" field="marketCap" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sorted.map((asset, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-primary/5 transition-colors group">
                <td className="p-3 sticky left-0 bg-background z-10 border-r border-border/10 group-hover:bg-primary/5 dark:group-hover:bg-[#1a1a1a]">
                  <div className="flex items-center gap-3 min-w-[130px]">
                    <AssetIcon symbol={asset.symbol} size={32} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-text group-hover:text-primary transition-colors">{asset.symbol}</span>
                      </div>
                      <span className="text-[11px] text-text-muted block truncate max-w-[140px]">{asset.name}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-right font-mono font-bold text-sm">
                  {asset.symbol === 'UST10Y' ? `${asset.price}%` : asset.symbol === 'VIX' || asset.symbol === 'DXY' ? asset.price.toFixed(1) : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}`}
                </td>
                <td className="p-3 text-right">{pctCell(asset.change24h)}</td>
                <td className="p-3 text-right">{pctCell(asset.change7d)}</td>
                <td className="p-3 text-right">{pctCell(asset.changeYtd)}</td>
                <td className="p-3 text-right">{pctCell(asset.change1y)}</td>
                <td className="p-3 text-right font-mono text-sm text-text-muted">
                  {asset.marketCap > 0 ? `$${asset.marketCap.toLocaleString()}B` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ assets }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <YtdBarChart assets={assets} />
      <SummaryTable assets={assets} />
    </div>
  );
};
