import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { InputField, ResultMetric, fmtUSD, fmtPct, fmt } from '../shared/SharedComponents';

export const ILCalculator: React.FC = () => {
  const [liquidity, setLiquidity] = useState('10000');
  const [priceChangeA, setPriceChangeA] = useState('100');
  const [priceChangeB, setPriceChangeB] = useState('0');
  const [feeAPR, setFeeAPR] = useState('20');
  const [days, setDays] = useState('90');

  const result = useMemo(() => {
    const L = parseFloat(liquidity) || 0;
    const pA = 1 + (parseFloat(priceChangeA) || 0) / 100;
    const pB = 1 + (parseFloat(priceChangeB) || 0) / 100;
    const apr = (parseFloat(feeAPR) || 0) / 100;
    const d = parseFloat(days) || 0;

    // Price ratio k = new relative price / old relative price
    const k = pA / pB;
    // IL formula: 2*sqrt(k)/(1+k) - 1
    const ilFactor = (2 * Math.sqrt(k)) / (1 + k) - 1;
    const ilPct = ilFactor * 100;

    // LP position value
    const holdValue = L * (0.5 * pA + 0.5 * pB); // 50/50 pool initial assumption
    const lpValue = holdValue * (1 + ilFactor);
    const ilDollar = lpValue - holdValue;

    // Fee compensation (fees earned while in pool)
    const feesEarned = L * apr * (d / 365);

    // Net position: LP value + fees - hold value
    const netPnL = lpValue + feesEarned - holdValue;
    const breakEvenDays = apr > 0 ? Math.abs(ilDollar) / (L * apr / 365) : Infinity;

    // Generate IL curve across price ratios
    const curvePts: { ratio: string; il: number }[] = [];
    for (let mult = 0.1; mult <= 10; mult += 0.1) {
      const kc = mult;
      const ilc = ((2 * Math.sqrt(kc)) / (1 + kc) - 1) * 100;
      if (mult % 0.5 < 0.01 || Math.abs(mult - parseFloat(priceChangeA) / 100 + 1) < 0.05) {
        curvePts.push({ ratio: `${fmt(mult, 1)}x`, il: parseFloat(fmt(ilc, 2)) });
      }
    }

    return { ilPct, ilDollar, holdValue, lpValue, feesEarned, netPnL, breakEvenDays, curvePts };
  }, [liquidity, priceChangeA, priceChangeB, feeAPR, days]);

  const isNetPositive = result.netPnL >= 0;

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <Card>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <AlertTriangle size={20} className="text-primary" /> Liquidity Pool Details
        </h3>
        <div className="space-y-5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 flex gap-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>Assumes a 50/50 Uniswap v2-style constant-product AMM pool.</span>
          </div>
          <InputField label="Initial liquidity provided" value={liquidity} onChange={setLiquidity} prefix="$" min={1} />
          <InputField label="Token A price change" value={priceChangeA} onChange={setPriceChangeA} suffix="%" helpText="e.g. +100% means price doubled" />
          <InputField label="Token B price change" value={priceChangeB} onChange={setPriceChangeB} suffix="%" helpText="e.g. 0% = stablecoin (USDC)" />
          <InputField label="Pool fee APR" value={feeAPR} onChange={setFeeAPR} suffix="%" min={0} max={500} helpText="Trading fees distributed to LPs (e.g. Uniswap ≈ 15–40%)" />
          <InputField label="Days in pool" value={days} onChange={setDays} suffix="days" min={1} max={3650} helpText="Duration you plan to provide liquidity" />
        </div>
      </Card>

      <Card variant="featured" className="flex flex-col">
        <h3 className="text-xl font-bold mb-6">Impermanent Loss Analysis</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ResultMetric label="Impermanent Loss" value={fmtPct(result.ilPct)} large negative={result.ilPct < 0} neutral={result.ilPct === 0} />
          <ResultMetric label="IL in Dollars" value={fmtUSD(result.ilDollar)} negative={result.ilDollar < 0} neutral={result.ilDollar >= 0} />
          <ResultMetric label="HODL Value" value={fmtUSD(result.holdValue)} neutral />
          <ResultMetric label="LP Position Value" value={fmtUSD(result.lpValue)} positive={result.lpValue >= result.holdValue} negative={result.lpValue < result.holdValue} />
          <ResultMetric label="Fees Earned" value={fmtUSD(result.feesEarned)} positive />
          <ResultMetric label="Net P&L vs Hold" value={(isNetPositive ? '+' : '-') + fmtUSD(Math.abs(result.netPnL))} positive={isNetPositive} negative={!isNetPositive} />
        </div>
        
        {isFinite(result.breakEvenDays) && (
          <div className={`mb-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${isNetPositive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            {isNetPositive ? <CheckCircle size={14} className="flex-shrink-0" /> : <AlertCircle size={14} className="flex-shrink-0" />}
            <span>
              {isNetPositive
                ? `Fees cover IL at ${fmt(result.breakEvenDays, 0)} days. Profitable now.`
                : `Break-even requires ${fmt(result.breakEvenDays, 0)} days at current APR. You're at ${days} days.`}
            </span>
          </div>
        )}

        <div className="flex-1 min-h-[160px]">
          <p className="text-xs text-text-muted mb-2 font-medium">IL% vs Price Ratio (of Token A)</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.curvePts} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="ratio" tick={{ fontSize: 9, fill: '#a1a1aa' }} stroke="#3f3f46" />
              <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => `${v}%`} stroke="#3f3f46" />
              <Tooltip labelStyle={{ color: '#a1a1aa' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#f4f4f5' }}
                itemStyle={{ color: '#fff' }}
                formatter={(v: number) => [`${fmt(v, 2)}%`, 'Impermanent Loss']}
              />
              <ReferenceLine y={0} stroke="#71717a" />
              <Line type="monotone" dataKey="il" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-text-muted mt-3 opacity-60">
          Formula: IL = 2√k/(1+k) − 1, where k = relative price change ratio
        </p>
      </Card>
    </div>
  );
};
