import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';

export const DCACalculator: React.FC = () => {
  const [amount, setAmount] = useState('200');
  const [freq, setFreq] = useState('monthly');
  const [years, setYears] = useState('3');
  const [annualReturn, setAnnualReturn] = useState('30');

  const result = useMemo(() => {
    const A = parseFloat(amount) || 0;
    const Y = parseFloat(years) || 0;
    const r_annual = (parseFloat(annualReturn) || 0) / 100;

    const periodsPerYear: Record<string, number> = { daily: 365, weekly: 52, monthly: 12 };
    const ppy = periodsPerYear[freq];
    const n = Math.round(ppy * Y);
    const r = r_annual / ppy; // rate per period

    let fv = 0;
    if (r === 0) {
      fv = A * n;
    } else {
      fv = A * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }

    const totalInvested = A * n;
    const profit = fv - totalInvested;
    const roi = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    // Build monthly data points for chart
    const chartData: { period: string; invested: number; value: number }[] = [];
    const months = Math.round(Y * 12);
    for (let m = 0; m <= months; m++) {
      const periodsElapsed = Math.round((m / 12) * ppy);
      let v = 0;
      if (r === 0) {
        v = A * periodsElapsed;
      } else {
        v = A * (((Math.pow(1 + r, periodsElapsed) - 1) / r) * (1 + r));
      }
      const inv = A * periodsElapsed;
      if (m % Math.max(1, Math.floor(months / 12)) === 0 || m === months) {
        chartData.push({
          period: m === 0 ? 'Start' : `Y${(m / 12).toFixed(m % 12 === 0 ? 0 : 1)}`,
          invested: Math.round(inv),
          value: Math.round(v),
        });
      }
    }

    return { fv, totalInvested, profit, roi, n, chartData };
  }, [amount, freq, years, annualReturn]);

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Inputs */}
      <Card>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <DollarSign size={20} className="text-primary" /> DCA Strategy Parameters
        </h3>
        <div className="space-y-5">
          <InputField label="Invest per period" value={amount} onChange={setAmount} prefix="$" min={1} step={10} helpText="Amount you invest each period" />
          <InputField label="Frequency" value={freq} onChange={setFreq} options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]} />
          <InputField label="Investment horizon" value={years} onChange={setYears} suffix="yrs" min={0.5} max={30} step={0.5} helpText="How long you plan to invest" />
          <InputField label="Expected annual return" value={annualReturn} onChange={setAnnualReturn} suffix="%" min={1} max={500} step={1} helpText="Historical BTC avg ≈ 60–80% / S&P 500 ≈ 10–12%" />
        </div>
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-xs text-text-muted font-medium">
            <span className="text-primary font-bold">DCA reduces average cost</span> by spreading purchases over time, lowering the impact of market volatility.
          </p>
        </div>
      </Card>

      {/* Results */}
      <Card variant="featured" className="flex flex-col">
        <h3 className="text-xl font-bold mb-6">Projected Portfolio Value</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <ResultMetric label="Final Value" value={fmtUSD(result.fv)} large positive />
          <ResultMetric label="Total Invested" value={fmtUSD(result.totalInvested)} neutral />
          <ResultMetric label="Total Profit" value={fmtUSD(result.profit)} positive={result.profit >= 0} negative={result.profit < 0} />
          <ResultMetric label="Return on Investment" value={fmtPct(result.roi)} positive={result.roi >= 0} negative={result.roi < 0} />
        </div>
        <p className="text-xs text-text-muted mb-4 opacity-75">{result.n} total purchases over {years} years</p>
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#a1a1aa' }} stroke="#3f3f46" />
              <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} stroke="#3f3f46" />
              <Tooltip labelStyle={{ color: '#a1a1aa' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#f4f4f5' }}
                itemStyle={{ color: '#fff' }}
                formatter={(v: number) => fmtUSD(v)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="invested" name="Total Invested" stroke="#71717a" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
