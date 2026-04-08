import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { InputField, ResultMetric, fmtUSD, fmtPct, fmt } from '../shared/SharedComponents';

export const ROICalculator: React.FC = () => {
  const [investment, setInvestment] = useState('5000');
  const [buyPrice, setBuyPrice] = useState('40000');
  const [sellPrice, setSellPrice] = useState('65000');
  const [holdingMonths, setHoldingMonths] = useState('12');
  const [feePercent, setFeePercent] = useState('0.1');

  const result = useMemo(() => {
    const inv = parseFloat(investment) || 0;
    const bp = parseFloat(buyPrice) || 1;
    const sp = parseFloat(sellPrice) || 0;
    const months = parseFloat(holdingMonths) || 1;
    const fee = (parseFloat(feePercent) || 0) / 100;

    const coins = inv / bp;
    const buyFee = inv * fee;
    const grossExitValue = coins * sp;
    const sellFee = grossExitValue * fee;
    const netExitValue = grossExitValue - sellFee;
    const netProfit = netExitValue - inv - buyFee;
    const roi = inv > 0 ? (netProfit / inv) * 100 : 0;
    const annualizedROI = ((Math.pow(1 + roi / 100, 12 / months) - 1) * 100);
    const breakEven = bp * (1 + fee) / (1 - fee);
    const totalFees = buyFee + sellFee;

    const chartData = [
      { name: 'Cost Basis', value: inv + buyFee },
      { name: 'Gross Exit', value: grossExitValue },
      { name: 'Net Exit', value: netExitValue },
    ];

    return { coins, netProfit, roi, annualizedROI, breakEven, totalFees, netExitValue, chartData };
  }, [investment, buyPrice, sellPrice, holdingMonths, feePercent]);

  const isProfit = result.netProfit >= 0;

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <Card>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" /> Investment Details
        </h3>
        <div className="space-y-5">
          <InputField label="Initial investment" value={investment} onChange={setInvestment} prefix="$" min={1} />
          <InputField label="Buy price (per coin)" value={buyPrice} onChange={setBuyPrice} prefix="$" min={0} helpText="Price at time of purchase" />
          <InputField label="Target sell price (per coin)" value={sellPrice} onChange={setSellPrice} prefix="$" min={0} helpText="Projected or actual sell price" />
          <InputField label="Holding period" value={holdingMonths} onChange={setHoldingMonths} suffix="mo" min={1} max={600} step={1} helpText="Affects annualized return calculation" />
          <InputField label="Trading fee (per trade)" value={feePercent} onChange={setFeePercent} suffix="%" min={0} max={5} step={0.01} helpText="e.g. Binance = 0.1%, Coinbase = 0.6%" />
        </div>
        <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
          <p className="text-xs text-text-muted">
            <span className="font-bold">Coins acquired:</span> {fmt(result.coins, 8)} — Break-even price: <span className="text-primary font-bold">{fmtUSD(result.breakEven)}</span>
          </p>
        </div>
      </Card>

      <Card variant="featured" className="flex flex-col">
        <h3 className="text-xl font-bold mb-6">Return Analysis</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ResultMetric label="Net Profit / Loss" value={(isProfit ? '+' : '-') + fmtUSD(Math.abs(result.netProfit))} large positive={isProfit} negative={!isProfit} />
          <ResultMetric label="Exit Value" value={fmtUSD(result.netExitValue)} neutral />
          <ResultMetric label="Total ROI" value={fmtPct(result.roi)} positive={isProfit} negative={!isProfit} />
          <ResultMetric label="Annualized ROI" value={fmtPct(result.annualizedROI)} positive={isProfit} negative={!isProfit} sub="Compounded" />
          <ResultMetric label="Total Fees Paid" value={fmtUSD(result.totalFees)} negative />
          <ResultMetric label="Break-Even Price" value={fmtUSD(result.breakEven)} neutral />
        </div>
        <div className="flex-1 min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
              <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="#3f3f46" />
              <Tooltip itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#f4f4f5' }}
                cursor={{ fill: '#27272a', opacity: 0.4 }}
                formatter={(v: number) => fmtUSD(v)}
              />
              <ReferenceLine y={parseFloat(investment) || 0} stroke="#71717a" strokeDasharray="4 4" />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {result.chartData.map((entry, i) => (
                  <Cell key={i} fill={i === 2 && !isProfit ? '#ef4444' : i === 0 ? '#71717a' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
