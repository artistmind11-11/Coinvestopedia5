import React from 'react';
import { Card } from '../components/Card';
import { LineChart, BarChart2, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

export const Markets: React.FC = () => {
  const topGainers = [
    { symbol: 'SOL', name: 'Solana', price: '$143.20', change: '+12.4%', volume: '$2.4B' },
    { symbol: 'AVAX', name: 'Avalanche', price: '$35.10', change: '+8.2%', volume: '$840M' },
    { symbol: 'LINK', name: 'Chainlink', price: '$18.45', change: '+5.7%', volume: '$520M' },
    { symbol: 'RNDR', name: 'Render', price: '$7.80', change: '+15.2%', volume: '$310M' },
  ];

  const topLosers = [
    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.12', change: '-4.2%', volume: '$1.1B' },
    { symbol: 'ADA', name: 'Cardano', price: '$0.45', change: '-2.8%', volume: '$450M' },
    { symbol: 'MATIC', name: 'Polygon', price: '$0.88', change: '-1.5%', volume: '$320M' },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-heading text-text mb-2">Market Overview</h1>
          <p className="text-text-muted">Real-time crypto market data, trends, and analytics.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted bg-surface px-3 py-1.5 rounded-lg border border-border">
          <Clock size={16} />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="standard" className="!p-4 bg-background border border-border">
          <div className="text-sm text-text-muted mb-1 flex items-center gap-2"><Activity size={16}/> Global Market Cap</div>
          <div className="text-2xl font-bold text-text mb-1">$2.45T</div>
          <div className="text-sm text-green-400 flex items-center gap-1"><TrendingUp size={14} /> 2.4%</div>
        </Card>
        <Card variant="standard" className="!p-4 bg-background border border-border">
          <div className="text-sm text-text-muted mb-1 flex items-center gap-2"><BarChart2 size={16}/> 24h Volume</div>
          <div className="text-2xl font-bold text-text mb-1">$84.2B</div>
          <div className="text-sm text-red-400 flex items-center gap-1"><TrendingDown size={14} /> 5.1%</div>
        </Card>
        <Card variant="standard" className="!p-4 bg-background border border-border">
          <div className="text-sm text-text-muted mb-1 flex items-center gap-2"><TrendingUp size={16}/> BTC Dominance</div>
          <div className="text-2xl font-bold text-text mb-1">52.4%</div>
          <div className="text-sm text-green-400 flex items-center gap-1"><TrendingUp size={14} /> 0.2%</div>
        </Card>
        <Card variant="standard" className="!p-4 bg-background border border-border">
          <div className="text-sm text-text-muted mb-1 flex items-center gap-2"><Activity size={16}/> ETH Gas</div>
          <div className="text-2xl font-bold text-text mb-1">12 Gwei</div>
          <div className="text-sm text-text-muted flex items-center gap-1">Normal</div>
        </Card>
      </div>

      {/* Market Chart Placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <LineChart size={24} className="text-primary" /> Total Market Cap Chart
          </h2>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
              <button key={tf} className="px-3 py-1 text-xs font-medium rounded-md bg-surface border border-border text-text-muted hover:text-text transition-colors">
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full rounded-lg relative overflow-hidden bg-background/50 border border-white/5 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2130&auto=format&fit=crop" 
              alt="Market trends" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <p className="relative z-10 text-primary font-medium flex items-center gap-2">
              <Activity className="animate-pulse" /> Interactive Chart Available in Pro
            </p>
        </div>
      </Card>

      {/* Gainers and Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-text mb-4 border-b border-border pb-2 flex items-center justify-between">
            Top Gainers (24h)
            <TrendingUp className="text-green-400" size={20} />
          </h2>
          <div className="space-y-4">
            {topGainers.map((coin, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {coin.symbol[0]}
                  </div>
                  <div>
                    <div className="font-bold text-text text-sm">{coin.name}</div>
                    <div className="text-xs text-text-muted">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text text-sm">{coin.price}</div>
                  <div className="text-xs text-green-400">{coin.change}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-text mb-4 border-b border-border pb-2 flex items-center justify-between">
            Top Losers (24h)
            <TrendingDown className="text-red-400" size={20} />
          </h2>
          <div className="space-y-4">
            {topLosers.map((coin, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs">
                    {coin.symbol[0]}
                  </div>
                  <div>
                    <div className="font-bold text-text text-sm">{coin.name}</div>
                    <div className="text-xs text-text-muted">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text text-sm">{coin.price}</div>
                  <div className="text-xs text-red-400">{coin.change}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Markets;
