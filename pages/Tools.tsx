import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import {
  Calculator, DollarSign, Percent, TrendingUp, AlertTriangle,
  Info, CheckCircle, AlertCircle, TrendingDown
} from 'lucide-react';

type CalculatorType = 'dca' | 'roi' | 'il' | 'tax';

// ─── Shared Input Component ───────────────────────────────────────────────────
const InputField: React.FC<{
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; prefix?: string; suffix?: string; helpText?: string;
  min?: number; max?: number; step?: number; options?: { value: string; label: string }[];
}> = ({ label, value, onChange, type = 'number', prefix, suffix, helpText, min, max, step, options }) => (
  <div>
    <label className="block text-sm font-bold text-text-muted mb-1.5">{label}</label>
    {options ? (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg py-3 px-4 text-text focus:border-primary focus:outline-none appearance-none cursor-pointer transition-colors"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min} max={max} step={step}
          className={`w-full bg-background border border-border rounded-lg py-3 text-text focus:border-primary focus:outline-none transition-colors ${prefix ? 'pl-7' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">{suffix}</span>}
      </div>
    )}
    {helpText && <p className="text-xs text-text-muted mt-1 opacity-70">{helpText}</p>}
  </div>
);

// ─── Result Metric ─────────────────────────────────────────────────────────────
const ResultMetric: React.FC<{
  label: string; value: string; sub?: string;
  positive?: boolean; negative?: boolean; large?: boolean; neutral?: boolean;
}> = ({ label, value, sub, positive, negative, large, neutral }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</p>
    <p className={`font-bold ${large ? 'text-3xl lg:text-4xl' : 'text-xl'} ${positive ? 'text-primary' : negative ? 'text-red-400' : neutral ? 'text-text' : 'text-text'}`}>
      {value}
    </p>
    {sub && <p className="text-xs text-text-muted">{sub}</p>}
  </div>
);

// ─── Utility Formatters ────────────────────────────────────────────────────────
const fmt = (n: number, decimals = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtUSD = (n: number) =>
  '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n: number) => (n >= 0 ? '+' : '') + fmt(n) + '%';

// ─────────────────────────────────────────────────────────────────────────────
// 1. DCA CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const DCACalculator: React.FC = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ResultMetric label="Final Value" value={fmtUSD(result.fv)} large positive />
          <ResultMetric label="Total Invested" value={fmtUSD(result.totalInvested)} neutral />
          <ResultMetric label="Total Profit" value={fmtUSD(result.profit)} positive={result.profit >= 0} negative={result.profit < 0} />
          <ResultMetric label="Return on Investment" value={fmtPct(result.roi)} positive={result.roi >= 0} negative={result.roi < 0} />
        </div>
        <p className="text-xs text-text-muted mb-4 opacity-75">{result.n} total purchases over {years} years</p>
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 8 }}
                formatter={(v: number) => fmtUSD(v)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="invested" name="Total Invested" stroke="#6B7280" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#10B981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ROI CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const ROICalculator: React.FC = () => {
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
      { name: 'Net After Fees', value: netExitValue },
    ];

    return { coins, netProfit, roi, annualizedROI, breakEven, totalFees, netExitValue, chartData };
  }, [investment, buyPrice, sellPrice, holdingMonths, feePercent]);

  const isProfit = result.netProfit >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
          <ResultMetric label="Net Profit / Loss" value={(isProfit ? '+' : '-') + fmtUSD(result.netProfit)} large positive={isProfit} negative={!isProfit} />
          <ResultMetric label="Exit Value" value={fmtUSD(result.netExitValue)} neutral />
          <ResultMetric label="ROI" value={fmtPct(result.roi)} positive={isProfit} negative={!isProfit} />
          <ResultMetric label="Annualized ROI" value={fmtPct(result.annualizedROI)} positive={isProfit} negative={!isProfit} sub="Compounded" />
          <ResultMetric label="Total Fees Paid" value={fmtUSD(result.totalFees)} negative />
          <ResultMetric label="Break-Even Price" value={fmtUSD(result.breakEven)} neutral />
        </div>
        <div className="flex-1 min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 8 }}
                formatter={(v: number) => fmtUSD(v)}
              />
              <ReferenceLine y={parseFloat(investment) || 0} stroke="#6B7280" strokeDasharray="4 4" label={{ value: 'Invested', position: 'right', fontSize: 10, fill: '#6B7280' }} />
              <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]}>
                {result.chartData.map((entry, i) => (
                  <Cell key={i} fill={i === 2 && !isProfit ? '#EF4444' : i === 0 ? '#6B7280' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. IMPERMANENT LOSS CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const ILCalculator: React.FC = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
          <div className={`mb-4 p-3 rounded-lg border text-xs flex gap-2 ${isNetPositive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            {isNetPositive ? <CheckCircle size={14} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
            <span>
              {isNetPositive
                ? `Fees cover IL at ${fmt(result.breakEvenDays, 0)} days. You're profitable after that.`
                : `Break-even requires ${fmt(result.breakEvenDays, 0)} days at current APR. You're at ${days} days.`}
            </span>
          </div>
        )}
        <div className="flex-1 min-h-[160px]">
          <p className="text-xs text-text-muted mb-2 font-medium">IL% vs Price Ratio (of Token A)</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.curvePts} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="ratio" tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 8 }}
                formatter={(v: number) => [`${fmt(v, 2)}%`, 'Impermanent Loss']}
              />
              <ReferenceLine y={0} stroke="#6B7280" />
              <Line type="monotone" dataKey="il" stroke="#EF4444" strokeWidth={2} dot={false} />
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. TAX ESTIMATOR (US 2024)
// ─────────────────────────────────────────────────────────────────────────────
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

const TaxEstimator: React.FC = () => {
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

    // Find STCG marginal bracket
    const stBracket = TAX_BRACKETS_2024[f].find(b =>
      incomePlusST > b.min && incomePlusST <= b.max
    );

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
            <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${item.amount > 0 ? 'bg-surface border-border' : 'bg-background border-border/30 opacity-40'}`}>
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
          <div className="flex-1 min-h-[120px] flex items-center justify-center gap-8">
            <PieChart width={120} height={120}>
              <Pie data={result.chartData} innerRadius={35} outerRadius={55} dataKey="value" stroke="none" paddingAngle={3}>
                {result.chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 8 }}
                formatter={(v: number) => fmtUSD(v)}
              />
            </PieChart>
            <div className="flex flex-col gap-2">
              {result.chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-text-muted">{d.name}</span>
                  <span className="font-bold ml-1">{fmtUSD(d.value)}</span>
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>('dca');

  // --- Scroll to Top on Tab Change ---
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const tabs = [
    { id: 'dca' as const, label: 'DCA Calculator', icon: <DollarSign size={15} /> },
    { id: 'roi' as const, label: 'ROI Calculator', icon: <TrendingUp size={15} /> },
    { id: 'il' as const, label: 'Impermanent Loss', icon: <AlertTriangle size={15} /> },
    { id: 'tax' as const, label: 'Tax Estimator', icon: <Percent size={15} /> },
  ];

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Calculator size={13} /> Calculators
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-2">Tools & Calculators</h1>
        <p className="text-text-muted max-w-xl">
          Live-calculating, institutional-grade tools. All results update instantly as you type.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-text-muted hover:bg-surface hover:text-text border border-transparent hover:border-border'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active Calculator */}
      {activeTab === 'dca' && <DCACalculator />}
      {activeTab === 'roi' && <ROICalculator />}
      {activeTab === 'il' && <ILCalculator />}
      {activeTab === 'tax' && <TaxEstimator />}

      {/* Disclaimer */}
      <div className="mt-12 p-4 border border-border rounded-xl text-center text-xs text-text-muted opacity-60 max-w-3xl mx-auto">
        All calculations are for educational and informational purposes only. Not financial or tax advice.
        Projections use simplified models and do not guarantee future results.
      </div>
    </div>
  );
};