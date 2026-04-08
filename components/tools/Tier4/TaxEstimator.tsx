import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Percent, Info } from 'lucide-react';
import { InputField, ResultMetric, fmtUSD, fmtPct } from '../shared/SharedComponents';

const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
};

const LTCG_BRACKETS_2024 = {
  single: [
    { max: 47025, rate: 0 },
    { max: 518900, rate: 0.15 },
    { max: Infinity, rate: 0.20 },
  ],
  married: [
    { max: 94050, rate: 0 },
    { max: 583750, rate: 0.15 },
    { max: Infinity, rate: 0.20 },
  ],
};

function calcOrdinaryTax(income: number, filing: 'single' | 'married'): number {
  const brackets = TAX_BRACKETS_2024[filing];
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    const taxable = Math.min(income, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

export const TaxEstimator: React.FC = () => {
  const [filing, setFiling] = useState('single');
  const [income, setIncome] = useState('80000');
  const [stcg, setStcg] = useState('15000');
  const [ltcg, setLtcg] = useState('30000');
  const [losses, setLosses] = useState('0');

  const result = useMemo(() => {
    const f = filing as 'single' | 'married';
    const W2 = parseFloat(income) || 0;
    const stGain = Math.max(0, (parseFloat(stcg) || 0) - (parseFloat(losses) || 0));
    const ltGain = parseFloat(ltcg) || 0;
    const remainingLosses = Math.max(0, (parseFloat(losses) || 0) - (parseFloat(stcg) || 0));
    const netLtGain = Math.max(0, ltGain - remainingLosses);

    // Short-term: taxed as ordinary income
    const incomePlusST = W2 + stGain;
    const taxOnIncomeOnly = calcOrdinaryTax(W2, f);
    const taxOnIncomePlusST = calcOrdinaryTax(incomePlusST, f);
    const stTax = taxOnIncomePlusST - taxOnIncomeOnly;

    // Long-term: preferential rates based on total taxable income
    const totalForLTCG = incomePlusST + netLtGain;
    const ltcgBrackets = LTCG_BRACKETS_2024[f];
    const ltcgRate = ltcgBrackets.find(b => totalForLTCG <= b.max)?.rate ?? 0.20;
    const ltTax = netLtGain * ltcgRate;

    // NIIT (3.8%) applies to net investment income above thresholds
    const niitThreshold = f === 'single' ? 200000 : 250000;
    const niitIncome = Math.max(0, totalForLTCG - niitThreshold);
    const niit = niitIncome > 0 ? Math.min(niitIncome, stGain + netLtGain) * 0.038 : 0;

    const totalTax = stTax + ltTax + niit;
    const effectiveRate = (stGain + ltGain) > 0 ? (totalTax / (stGain + netLtGain)) * 100 : 0;

    const stBracket = TAX_BRACKETS_2024[f].find(b => incomePlusST > b.min && incomePlusST <= b.max);

    const breakdown = [
      { label: `Short-Term Gains (${stBracket ? Math.round(stBracket.rate * 100) : 0}% bracket)`, amount: stTax, gain: stGain },
      { label: `Long-Term Gains (${Math.round(ltcgRate * 100)}% preferential rate)`, amount: ltTax, gain: netLtGain },
      { label: 'Net Investment Income Tax (3.8%)', amount: niit, gain: niitIncome > 0 ? Math.min(niitIncome, stGain + netLtGain) : 0 },
    ];

    const chartData = [
      { name: 'STCG Tax', value: Math.round(stTax) },
      { name: 'LTCG Tax', value: Math.round(ltTax) },
      { name: 'NIIT', value: Math.round(niit) },
    ].filter(d => d.value > 0);

    return { stTax, ltTax, niit, totalTax, effectiveRate, breakdown, chartData, ltcgRate, stGain, netLtGain };
  }, [filing, income, stcg, ltcg, losses]);

  const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6'];

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <Card>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Percent size={20} className="text-primary" /> US Crypto Tax Estimator 2024
        </h3>
        <div className="space-y-5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 flex gap-2">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>Educational estimate only. Consult a tax professional for legal advice.</span>
          </div>
          <InputField label="Filing status" value={filing} onChange={setFiling} options={[
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married Filing Jointly' },
          ]} />
          <InputField label="Ordinary income (W2/salary)" value={income} onChange={setIncome} prefix="$" min={0} helpText="Annual taxable income before crypto" />
          <InputField label="Short-term capital gains" value={stcg} onChange={setStcg} prefix="$" helpText="Held < 1 year — taxed as ordinary income" />
          <InputField label="Long-term capital gains" value={ltcg} onChange={setLtcg} prefix="$" helpText="Held > 1 year — preferential 0/15/20% rate" />
          <InputField label="Capital losses (harvested)" value={losses} onChange={setLosses} prefix="$" helpText="Losses offset short-term gains first, then long-term" />
        </div>
      </Card>

      <Card variant="featured" className="flex flex-col">
        <h3 className="text-xl font-bold mb-6">Tax Liability Breakdown</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ResultMetric label="Total Tax Owed" value={fmtUSD(result.totalTax)} large negative />
          <ResultMetric label="Effective Rate" value={fmtPct(result.effectiveRate)} negative />
          <ResultMetric label="Short-Term Tax" value={fmtUSD(result.stTax)} negative />
          <ResultMetric label={`Long-Term Tax (${Math.round(result.ltcgRate * 100)}%)`} value={fmtUSD(result.ltTax)} negative={result.ltTax > 0} neutral={result.ltTax === 0} />
        </div>

        <div className="space-y-2 mb-6">
          {result.breakdown.map((item, i) => (
            <div key={i} className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${item.amount > 0 ? 'bg-surface border-border' : 'bg-background border-border/30 opacity-40'}`}>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-text-muted">{fmtUSD(item.gain)} taxable</p>
              </div>
              <span className={`font-bold ${item.amount > 0 ? 'text-red-400' : 'text-text-muted'}`}>
                {item.amount > 0 ? fmtUSD(item.amount) : 'N/A'}
              </span>
            </div>
          ))}
        </div>

        {result.chartData.length > 0 && (
          <div className="flex-1 min-h-[140px] flex items-center justify-center gap-8 p-4 bg-background/50 rounded-xl border border-border/50">
            <PieChart width={120} height={120}>
              <Pie data={result.chartData} innerRadius={35} outerRadius={55} dataKey="value" stroke="none" paddingAngle={3}>
                {result.chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip labelStyle={{ color: '#a1a1aa' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#f4f4f5' }}
                itemStyle={{ color: '#fff' }}
                formatter={(v: number) => fmtUSD(v)}
              />
            </PieChart>
            <div className="flex flex-col gap-2">
              {result.chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-text-muted">{d.name}</span>
                  <span className="font-bold ml-1 text-text">{fmtUSD(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-text-muted">
          💡 <strong>Tax-loss harvesting tip:</strong> Sell assets at a loss to offset gains. You can carry forward unused losses to future years.
        </div>
      </Card>
    </div>
  );
};
