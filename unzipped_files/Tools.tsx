// src/pages/Tools.tsx
// ═══════════════════════════════════════════════════════════
// Coinvestopedia — Tools & Calculators Page
// All formulas corrected. Full dark mode. Responsive layout.
// Recharts charts with mode-aware colors.
// ═══════════════════════════════════════════════════════════

import { useState, useMemo, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, ReferenceLine,
} from 'recharts';
import { PageMeta, toolsPageSchema } from '../components/PageMeta';
import { useChartColors } from '../hooks/useChartColors';
import {
  calcROI, calcDCA, calcSharpe, calcPositionSize,
  calcCompoundInterest, calcBreakEven, calcPnL,
  formatCurrency, formatPercent, formatNumber,
  type ROIResult, type DCAResult, type SharpeResult,
  type PositionSizeResult, type CompoundResult,
} from '../lib/calculators';

// ── Shared Input Component ──────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: string;
  hint?: string;
}

function InputField({ label, value, onChange, prefix, suffix, step = '0.01', min = '0', hint }: InputFieldProps) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        {prefix && <span className="input-affix prefix">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          step={step}
          min={min}
          className="cv-input"
        />
        {suffix && <span className="input-affix suffix">{suffix}</span>}
      </div>
      {hint && <p className="input-hint">{hint}</p>}
    </div>
  );
}

// ── Result Row Component ────────────────────────────────────

function ResultRow({ label, value, highlight, profit, loss }: {
  label: string; value: string;
  highlight?: boolean; profit?: boolean; loss?: boolean;
}) {
  return (
    <div className={`result-row ${highlight ? 'highlight' : ''}`}>
      <span className="result-label">{label}</span>
      <span className={`result-value ${profit ? 'profit' : loss ? 'loss' : ''}`}>
        {value}
      </span>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────

function StatCard({ label, value, sub, profit, loss }: {
  label: string; value: string; sub?: string; profit?: boolean; loss?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${profit ? 'profit' : loss ? 'loss' : ''}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

// ── Tool Card Wrapper ───────────────────────────────────────

function ToolCard({ id, title, icon, badge, children }: {
  id: string; title: string; icon: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="tool-card" id={id}>
      <div className="tool-header">
        <span className="tool-icon">{icon}</span>
        <div>
          <h2 className="tool-title">{title}</h2>
          {badge && <span className="tool-badge">{badge}</span>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── ROI Calculator ──────────────────────────────────────────

function ROICalculator() {
  const chart = useChartColors();
  const [initial, setInitial] = useState('10000');
  const [final, setFinal] = useState('15000');
  const [months, setMonths] = useState('12');

  const result = useMemo((): ROIResult | null => {
    const i = parseFloat(initial), f = parseFloat(final), m = parseFloat(months);
    if (!i || !m || i <= 0 || m <= 0) return null;
    try { return calcROI(i, f || 0, m); } catch { return null; }
  }, [initial, final, months]);

  return (
    <ToolCard id="roi" title="ROI Calculator" icon="📈" badge="CAGR included">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Initial Investment" value={initial} onChange={setInitial} prefix="$" step="100" />
          <InputField label="Final Value" value={final} onChange={setFinal} prefix="$" step="100" />
          <InputField label="Time Period" value={months} onChange={setMonths} suffix="months" step="1" min="1" />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard label="Total ROI" value={formatPercent(result.roi)} profit={result.roi >= 0} loss={result.roi < 0} />
              <StatCard label="CAGR" value={formatPercent(result.cagr)} sub="Compound Annual" profit={result.cagr >= 0} loss={result.cagr < 0} />
              <StatCard label="Annualized" value={formatPercent(result.annualizedROI)} sub="Simple Annual" profit={result.annualizedROI >= 0} loss={result.annualizedROI < 0} />
              <StatCard label="Absolute Profit" value={formatCurrency(result.absoluteProfit)} profit={result.absoluteProfit >= 0} loss={result.absoluteProfit < 0} />
            </div>
            <div className="results-list">
              <ResultRow label="Investment Period" value={`${result.years.toFixed(2)} years (${months} months)`} />
              <ResultRow label="Total Return Multiple" value={`${(parseFloat(final) / parseFloat(initial)).toFixed(3)}×`} />
              <ResultRow label="CAGR vs S&P 500 avg (10.5%)" value={result.cagr > 10.5 ? `+${(result.cagr - 10.5).toFixed(2)}% above` : `${(result.cagr - 10.5).toFixed(2)}% below`} highlight />
            </div>
            <div className="affiliate-cta">
              <span>Ready to invest?</span>
              <a href="https://coinbase.com/join" target="_blank" rel="noopener noreferrer sponsored" className="cta-btn">
                Trade on Coinbase →
              </a>
              <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer sponsored" className="cta-btn secondary">
                Chart on TradingView →
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── DCA Calculator ──────────────────────────────────────────

function DCACalculator() {
  const chart = useChartColors();
  const [amount, setAmount] = useState('500');
  const [months, setMonths] = useState('24');
  const [startPrice, setStartPrice] = useState('40000');
  const [endPrice, setEndPrice] = useState('65000');

  const result = useMemo((): DCAResult | null => {
    const a = parseFloat(amount), m = parseFloat(months);
    const s = parseFloat(startPrice), e = parseFloat(endPrice);
    if (!a || !m || !s || !e || a <= 0 || m <= 0 || s <= 0 || e <= 0) return null;
    try { return calcDCA(a, m, s, e); } catch { return null; }
  }, [amount, months, startPrice, endPrice]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.monthlyData.map(d => ({
      month: `M${d.month}`,
      invested: d.totalInvested,
      value: d.portfolioValue,
      profit: d.profit,
    }));
  }, [result]);

  return (
    <ToolCard id="dca" title="DCA Simulator" icon="🔄" badge="Dollar Cost Averaging">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Monthly Investment" value={amount} onChange={setAmount} prefix="$" step="50" hint="Amount invested each month" />
          <InputField label="Duration" value={months} onChange={setMonths} suffix="months" step="1" min="1" />
          <InputField label="Entry Price" value={startPrice} onChange={setStartPrice} prefix="$" step="100" hint="Price at month 1" />
          <InputField label="Current / Exit Price" value={endPrice} onChange={setEndPrice} prefix="$" step="100" hint="Price today" />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard label="Total Invested" value={formatCurrency(result.totalInvested)} />
              <StatCard label="Portfolio Value" value={formatCurrency(result.currentValue)} profit={result.totalProfit >= 0} loss={result.totalProfit < 0} />
              <StatCard label="Total Profit" value={formatCurrency(result.totalProfit)} profit={result.totalProfit >= 0} loss={result.totalProfit < 0} />
              <StatCard label="ROI" value={formatPercent(result.roi)} sub={`${formatPercent(result.annualizedReturn)} annualized`} profit={result.roi >= 0} loss={result.roi < 0} />
            </div>
            <div className="results-list">
              <ResultRow label="Weighted Avg. Cost (true)" value={formatCurrency(result.weightedAvgCost)} highlight />
              <ResultRow label="Total Units Acquired" value={formatNumber(result.totalUnits, 8)} />
              <ResultRow label="Exit Price vs. Avg. Cost" value={formatPercent(((parseFloat(endPrice) - result.weightedAvgCost) / result.weightedAvgCost) * 100)} profit={parseFloat(endPrice) >= result.weightedAvgCost} loss={parseFloat(endPrice) < result.weightedAvgCost} />
              <ResultRow label="Annualized Return (CAGR)" value={formatPercent(result.annualizedReturn)} profit={result.annualizedReturn >= 0} loss={result.annualizedReturn < 0} />
            </div>
            {chartData.length > 0 && (
              <div className="chart-container">
                <h3 className="chart-title">Portfolio growth over time</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chart.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chart.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chart.secondary} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={chart.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: chart.tick, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      interval={Math.floor(chartData.length / 6)}
                    />
                    <YAxis
                      tick={{ fill: chart.tick, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip contentStyle={chart.tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    <Area type="monotone" dataKey="invested" stroke={chart.secondary} fill="url(#investedGrad)" strokeWidth={1.5} name="Invested" />
                    <Area type="monotone" dataKey="value" stroke={chart.primary} fill="url(#valueGrad)" strokeWidth={2} name="Portfolio Value" activeDot={chart.activeDot} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="affiliate-cta">
              <span>Set up automated DCA:</span>
              <a href="https://coinbase.com/join" target="_blank" rel="noopener noreferrer sponsored" className="cta-btn">
                Coinbase Recurring Buy →
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── Sharpe Ratio Calculator ─────────────────────────────────

function SharpeCalculator() {
  const [avgReturn, setAvgReturn] = useState('3.5');
  const [stdDev, setStdDev] = useState('8.2');
  const [riskFree, setRiskFree] = useState('5.25');
  const [maxDD, setMaxDD] = useState('35');

  const result = useMemo((): SharpeResult | null => {
    const r = parseFloat(avgReturn), s = parseFloat(stdDev), rf = parseFloat(riskFree);
    if (isNaN(r) || isNaN(s) || s <= 0) return null;
    try { return calcSharpe(r, s, rf || 0, parseFloat(maxDD) || 0); } catch { return null; }
  }, [avgReturn, stdDev, riskFree, maxDD]);

  const ratingColor: Record<string, string> = {
    'Poor': 'loss', 'Acceptable': '', 'Good': '', 'Very Good': 'profit', 'Exceptional': 'profit',
  };

  return (
    <ToolCard id="sharpe" title="Sharpe & Sortino Ratio" icon="⚖️" badge="Risk-adjusted returns">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Avg Monthly Return" value={avgReturn} onChange={setAvgReturn} suffix="%" hint="Your portfolio's average monthly return" />
          <InputField label="Monthly Std. Deviation" value={stdDev} onChange={setStdDev} suffix="%" hint="Volatility of monthly returns" />
          <InputField label="Risk-Free Rate (Annual)" value={riskFree} onChange={setRiskFree} suffix="%" hint="US 10yr Treasury or Fed Funds rate" />
          <InputField label="Max Drawdown" value={maxDD} onChange={setMaxDD} suffix="%" hint="Largest peak-to-trough loss %" />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard
                label="Sharpe Ratio"
                value={result.sharpeRatio.toFixed(3)}
                sub={result.rating}
                profit={result.sharpeRatio >= 1}
                loss={result.sharpeRatio < 0}
              />
              <StatCard label="Sortino Ratio" value={result.sortinoRatio.toFixed(3)} sub="Downside only" profit={result.sortinoRatio >= 1} loss={result.sortinoRatio < 0} />
              <StatCard label="Calmar Ratio" value={result.calmarRatio > 0 ? result.calmarRatio.toFixed(3) : 'N/A'} sub="Return / Max DD" profit={result.calmarRatio >= 1} />
              <StatCard label="Monthly Excess" value={`${result.excessReturn.toFixed(3)}%`} sub="Above risk-free" profit={result.excessReturn >= 0} loss={result.excessReturn < 0} />
            </div>
            <div className="results-list">
              <ResultRow label="Annualization Factor" value="√12 applied (monthly → annual)" />
              <ResultRow label="Rating" value={result.rating} profit={result.sharpeRatio >= 2} loss={result.sharpeRatio < 0} highlight />
              <ResultRow label="Interpretation" value={result.sharpeRatio >= 2 ? 'Excellent risk-adjusted performance' : result.sharpeRatio >= 1 ? 'Above average — acceptable for crypto' : 'Consider reducing volatility or improving returns'} />
            </div>
            <div className="info-box">
              <strong>Note:</strong> Sharpe Ratio &gt;1 is acceptable, &gt;2 is very good, &gt;3 is exceptional.
              Sortino Ratio is often more meaningful for crypto as it only penalizes downside volatility.
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── Position Size / Kelly Criterion ────────────────────────

function PositionSizeCalculator() {
  const [portfolio, setPortfolio] = useState('50000');
  const [winRate, setWinRate] = useState('55');
  const [avgWin, setAvgWin] = useState('3');
  const [avgLoss, setAvgLoss] = useState('2');

  const result = useMemo((): PositionSizeResult | null => {
    const p = parseFloat(portfolio), wr = parseFloat(winRate);
    const w = parseFloat(avgWin), l = parseFloat(avgLoss);
    if (!p || !wr || !w || !l || l <= 0) return null;
    try { return calcPositionSize(p, wr, w, l); } catch { return null; }
  }, [portfolio, winRate, avgWin, avgLoss]);

  return (
    <ToolCard id="position" title="Position Size Calculator" icon="🎯" badge="Kelly Criterion">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Portfolio Size" value={portfolio} onChange={setPortfolio} prefix="$" step="1000" />
          <InputField label="Win Rate" value={winRate} onChange={setWinRate} suffix="%" step="1" min="0" />
          <InputField label="Avg Win" value={avgWin} onChange={setAvgWin} suffix="%" hint="Average winning trade %" />
          <InputField label="Avg Loss" value={avgLoss} onChange={setAvgLoss} suffix="%" hint="Average losing trade % (positive)" />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard label="Recommended Size" value={formatCurrency(result.halfPositionSize)} sub="Half-Kelly (safe)" profit={result.halfKellyFraction > 0} loss={result.halfKellyFraction <= 0} />
              <StatCard label="Half-Kelly %" value={`${(result.halfKellyFraction * 100).toFixed(2)}%`} sub="of portfolio" profit={result.halfKellyFraction > 0} />
              <StatCard label="Risk/Reward" value={`${result.riskRewardRatio.toFixed(2)}:1`} profit={result.riskRewardRatio >= 1.5} loss={result.riskRewardRatio < 1} />
              <StatCard label="Expected Value" value={`${result.expectedValue > 0 ? '+' : ''}${result.expectedValue.toFixed(3)}%`} sub="per $1 risked" profit={result.expectedValue > 0} loss={result.expectedValue < 0} />
            </div>
            <div className="results-list">
              <ResultRow label="Full Kelly (raw)" value={`${(result.kellyFraction * 100).toFixed(2)}%`} />
              <ResultRow label="Safe Kelly (clamped ≥ 0)" value={`${(result.safeKellyFraction * 100).toFixed(2)}%`} />
              <ResultRow label="Half-Kelly (recommended)" value={formatCurrency(result.halfPositionSize)} highlight profit={result.halfPositionSize > 0} />
              <ResultRow label="Break-even Win Rate" value={`${result.breakEvenWinRate.toFixed(2)}%`} />
              <ResultRow label="Your Win Rate vs. Break-even" value={`${(parseFloat(winRate) - result.breakEvenWinRate).toFixed(2)}% ${parseFloat(winRate) >= result.breakEvenWinRate ? 'edge' : 'deficit'}`} profit={parseFloat(winRate) >= result.breakEvenWinRate} loss={parseFloat(winRate) < result.breakEvenWinRate} />
            </div>
            {result.kellyFraction < 0 && (
              <div className="warning-box">
                ⚠️ Negative Kelly: your expected value is negative at these win rate / R:R parameters. Do not trade this setup.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── Compound Interest Calculator ────────────────────────────

function CompoundCalculator() {
  const chart = useChartColors();
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('20');
  const [compounds, setCompounds] = useState('12');
  const [contribution, setContribution] = useState('200');

  const result = useMemo((): CompoundResult | null => {
    const p = parseFloat(principal), r = parseFloat(rate);
    const y = parseFloat(years), n = parseFloat(compounds), c = parseFloat(contribution) || 0;
    if (!p || !r || !y || !n || p <= 0 || y <= 0) return null;
    try { return calcCompoundInterest(p, r, Math.floor(y), Math.floor(n), c); } catch { return null; }
  }, [principal, rate, years, compounds, contribution]);

  return (
    <ToolCard id="compound" title="Compound Interest" icon="📊" badge="With contributions">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Principal" value={principal} onChange={setPrincipal} prefix="$" step="1000" />
          <InputField label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" step="0.1" />
          <InputField label="Time Period" value={years} onChange={setYears} suffix="years" step="1" min="1" />
          <InputField label="Compounding Frequency" value={compounds} onChange={setCompounds} suffix="/yr" step="1" min="1" hint="12=monthly, 365=daily, 1=annual" />
          <InputField label="Monthly Contribution" value={contribution} onChange={setContribution} prefix="$" step="50" hint="Optional regular deposits" />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard label="Future Value" value={formatCurrency(result.futureValue)} profit />
              <StatCard label="Total Contributed" value={formatCurrency(result.totalContributions)} />
              <StatCard label="Interest Earned" value={formatCurrency(result.totalInterest)} profit />
              <StatCard label="Effective Annual Rate" value={`${result.effectiveAnnualRate.toFixed(4)}%`} sub="Actual compounded rate" />
            </div>
            {result.data.length > 0 && (
              <div className="chart-container">
                <h3 className="chart-title">Growth breakdown by year</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={result.data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: chart.tick, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} interval={Math.floor(result.data.length / 8)} />
                    <YAxis tick={{ fill: chart.tick, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={chart.tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="contributions" fill={chart.secondary} name="Contributions" stackId="a" radius={[0,0,0,0]} />
                    <Bar dataKey="interest" fill={chart.primary} name="Interest" stackId="a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── P&L Calculator ──────────────────────────────────────────

function PnLCalculator() {
  const [entry, setEntry] = useState('42000');
  const [exit, setExit] = useState('65000');
  const [qty, setQty] = useState('0.5');
  const [fee, setFee] = useState('0.1');
  const [leverage, setLeverage] = useState('1');

  const result = useMemo(() => {
    const e = parseFloat(entry), x = parseFloat(exit);
    const q = parseFloat(qty), f = parseFloat(fee) || 0;
    const lev = parseFloat(leverage) || 1;
    if (!e || !x || !q || e <= 0 || q <= 0) return null;
    try { return calcPnL(e, x, q, f, lev); } catch { return null; }
  }, [entry, exit, qty, fee, leverage]);

  return (
    <ToolCard id="pnl" title="Profit & Loss Calculator" icon="💰" badge="With fees & leverage">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Entry Price" value={entry} onChange={setEntry} prefix="$" step="100" />
          <InputField label="Exit Price" value={exit} onChange={setExit} prefix="$" step="100" />
          <InputField label="Quantity" value={qty} onChange={setQty} step="0.001" hint="Amount of asset" />
          <InputField label="Trading Fee" value={fee} onChange={setFee} suffix="%" step="0.01" hint="Per-trade fee %" />
          <InputField label="Leverage" value={leverage} onChange={setLeverage} suffix="×" step="1" min="1" hint="1 = no leverage (spot)" />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard label="P&L" value={formatCurrency(result.pnl)} profit={result.pnl >= 0} loss={result.pnl < 0} />
              <StatCard label="Return" value={formatPercent(result.pnlPct)} profit={result.pnlPct >= 0} loss={result.pnlPct < 0} />
              <StatCard label="After Fees" value={formatCurrency(result.netAfterFees)} profit={result.netAfterFees >= 0} loss={result.netAfterFees < 0} />
              <StatCard label="Fees Paid" value={formatCurrency(result.fees)} loss />
            </div>
            {result.leveragedPnl !== undefined && (
              <div className="results-list">
                <ResultRow label={`Leveraged P&L (${leverage}×)`} value={formatCurrency(result.leveragedPnl)} profit={result.leveragedPnl >= 0} loss={result.leveragedPnl < 0} highlight />
                {result.liquidationPrice && (
                  <ResultRow label="Liquidation Price (Long)" value={formatCurrency(result.liquidationPrice)} loss />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── Break-even Calculator ───────────────────────────────────

function BreakEvenCalculator() {
  const [entryPrice, setEntryPrice] = useState('42000');
  const [quantity, setQuantity] = useState('1');
  const [feeRate, setFeeRate] = useState('0.1');
  const [otherCosts, setOtherCosts] = useState('0');

  const result = useMemo(() => {
    const e = parseFloat(entryPrice), q = parseFloat(quantity);
    const f = parseFloat(feeRate) || 0, o = parseFloat(otherCosts) || 0;
    if (!e || !q || e <= 0 || q <= 0) return null;
    try { return calcBreakEven(e, q, f, o); } catch { return null; }
  }, [entryPrice, quantity, feeRate, otherCosts]);

  return (
    <ToolCard id="breakeven" title="Break-even Calculator" icon="⚡" badge="Fees included">
      <div className="tool-body">
        <div className="inputs-grid">
          <InputField label="Entry Price" value={entryPrice} onChange={setEntryPrice} prefix="$" step="100" />
          <InputField label="Quantity" value={quantity} onChange={setQuantity} step="0.001" />
          <InputField label="Trading Fee" value={feeRate} onChange={setFeeRate} suffix="%" step="0.01" hint="Buy + sell fees both counted" />
          <InputField label="Other Costs" value={otherCosts} onChange={setOtherCosts} prefix="$" step="10" hint="Spread, slippage, gas, etc." />
        </div>
        {result && (
          <div className="results-section">
            <div className="stats-grid-4">
              <StatCard label="Break-even Price" value={formatCurrency(result.breakEvenPrice)} />
              <StatCard label="Price Move Needed" value={formatPercent(result.percentageChange)} loss={result.percentageChange > 0} />
              <StatCard label="Total Fees" value={formatCurrency(result.feesTotal)} loss />
              <StatCard label="Net Cost" value={formatCurrency((parseFloat(entryPrice) * parseFloat(quantity)) + result.feesTotal)} />
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ── Main Tools Page ─────────────────────────────────────────

const TOOLS = [
  { id: 'roi', label: 'ROI', icon: '📈' },
  { id: 'dca', label: 'DCA', icon: '🔄' },
  { id: 'sharpe', label: 'Sharpe', icon: '⚖️' },
  { id: 'position', label: 'Position Size', icon: '🎯' },
  { id: 'compound', label: 'Compound', icon: '📊' },
  { id: 'pnl', label: 'P&L', icon: '💰' },
  { id: 'breakeven', label: 'Break-even', icon: '⚡' },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState('roi');

  const scrollTo = useCallback((id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <PageMeta
        title="Free Crypto & Investment Calculators"
        description="Institutional-grade financial calculators: ROI (with CAGR), DCA simulator, Sharpe & Sortino ratio, Kelly Criterion position sizing, compound interest, P&L, and break-even price. Free and accurate."
        canonical="/tools"
        keywords="crypto calculator, DCA calculator, ROI calculator, Sharpe ratio calculator, position sizing, compound interest, Bitcoin DCA, crypto profit calculator"
        structuredData={toolsPageSchema}
      />

      <div className="tools-page">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Calculators & Tools</h1>
          <p className="page-subtitle">
            Institutional-grade formulas. All calculations run locally — your data never leaves your browser.
          </p>
        </div>

        {/* Tool Navigation */}
        <nav className="tools-nav" aria-label="Calculator navigation">
          {TOOLS.map(t => (
            <button
              key={t.id}
              className={`tools-nav-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => scrollTo(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Calculators Stack */}
        <div className="tools-stack">
          <ROICalculator />
          <DCACalculator />
          <SharpeCalculator />
          <PositionSizeCalculator />
          <CompoundCalculator />
          <PnLCalculator />
          <BreakEvenCalculator />
        </div>

        {/* Bottom CTA */}
        <div className="tools-footer-cta">
          <h2>Take your analysis further</h2>
          <p>Upgrade to Pro for portfolio tracking, AI market analysis, custom alerts, and API access.</p>
          <div className="cta-row">
            <button className="cta-btn primary large">Start Pro Free Trial →</button>
            <a href="https://coinbase.com/join" target="_blank" rel="noopener noreferrer sponsored" className="cta-btn large">
              Open Coinbase Account →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .tools-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }
        .page-header {
          margin-bottom: 2rem;
        }
        .page-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 700;
          color: var(--cv-text);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }
        .page-subtitle {
          font-size: 15px;
          color: var(--cv-text-secondary);
          line-height: 1.6;
        }
        /* Tool Nav */
        .tools-nav {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          padding: 10px;
          background: var(--cv-bg-secondary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--cv-border);
        }
        .tools-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-lg);
          border: 1px solid transparent;
          background: none;
          color: var(--cv-text-secondary);
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-body);
          cursor: pointer;
          transition: var(--transition-base);
          white-space: nowrap;
        }
        .tools-nav-btn:hover {
          background: var(--cv-bg-card);
          color: var(--cv-text);
          border-color: var(--cv-border-md);
        }
        .tools-nav-btn.active {
          background: var(--cv-bg-card);
          color: var(--cv-primary);
          border-color: var(--cv-border-md);
          box-shadow: var(--shadow-sm);
        }
        /* Tool Card */
        .tools-stack { display: flex; flex-direction: column; gap: 1.5rem; }
        .tool-card {
          background: var(--cv-bg-card);
          border: 1px solid var(--cv-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: var(--transition-base);
        }
        .tool-card:hover { border-color: var(--cv-border-md); }
        .tool-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--cv-border);
          background: var(--cv-bg-secondary);
        }
        .tool-icon { font-size: 22px; }
        .tool-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--cv-text);
        }
        .tool-badge {
          display: inline-block;
          font-size: 11px;
          color: var(--cv-primary);
          background: var(--cv-primary-subtle);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: 500;
          margin-top: 2px;
        }
        .tool-body { padding: 1.5rem; }
        /* Inputs */
        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .input-group { display: flex; flex-direction: column; gap: 5px; }
        .input-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--cv-text-secondary);
          letter-spacing: 0.02em;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid var(--cv-border-md);
          border-radius: var(--radius-md);
          background: var(--cv-bg-input);
          overflow: hidden;
          transition: var(--transition-fast);
        }
        .input-wrapper:focus-within {
          border-color: var(--cv-border-focus);
          box-shadow: 0 0 0 3px rgba(0,87,255,0.1);
        }
        .input-affix {
          padding: 0 10px;
          font-size: 13px;
          color: var(--cv-text-muted);
          background: var(--cv-bg-secondary);
          border-right: 1px solid var(--cv-border);
          height: 38px;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .input-affix.suffix { border-right: none; border-left: 1px solid var(--cv-border); }
        .cv-input {
          flex: 1;
          min-width: 0;
          padding: 0 10px;
          height: 38px;
          border: none;
          background: transparent;
          color: var(--cv-text);
          font-size: 14px;
          font-family: var(--font-mono);
          font-weight: 500;
          outline: none;
        }
        .cv-input::-webkit-inner-spin-button,
        .cv-input::-webkit-outer-spin-button { -webkit-appearance: none; }
        .input-hint { font-size: 11px; color: var(--cv-text-muted); line-height: 1.4; }
        /* Results */
        .results-section { display: flex; flex-direction: column; gap: 1rem; }
        .stats-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
          gap: 8px;
        }
        .stat-card {
          background: var(--cv-bg-secondary);
          border: 1px solid var(--cv-border);
          border-radius: var(--radius-md);
          padding: 12px 14px;
        }
        .stat-label { font-size: 11px; color: var(--cv-text-muted); font-weight: 500; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
        .stat-value { font-size: 20px; font-weight: 600; font-family: var(--font-mono); color: var(--cv-text); line-height: 1.2; }
        .stat-value.profit { color: var(--cv-text-profit); }
        .stat-value.loss { color: var(--cv-text-loss); }
        .stat-sub { font-size: 11px; color: var(--cv-text-muted); margin-top: 3px; }
        .results-list {
          border: 1px solid var(--cv-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          font-size: 13px;
          border-bottom: 1px solid var(--cv-border);
          gap: 12px;
        }
        .result-row:last-child { border-bottom: none; }
        .result-row.highlight { background: var(--cv-primary-subtle); }
        .result-label { color: var(--cv-text-secondary); flex-shrink: 0; }
        .result-value { font-family: var(--font-mono); font-weight: 500; color: var(--cv-text); text-align: right; }
        .result-value.profit { color: var(--cv-text-profit); }
        .result-value.loss { color: var(--cv-text-loss); }
        /* Chart */
        .chart-container { margin-top: 0.5rem; }
        .chart-title { font-size: 13px; font-weight: 500; color: var(--cv-text-secondary); margin-bottom: 12px; }
        /* Info / Warning boxes */
        .info-box {
          padding: 12px 14px;
          background: var(--cv-bg-secondary);
          border-left: 3px solid var(--cv-primary);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          font-size: 13px;
          color: var(--cv-text-secondary);
          line-height: 1.5;
        }
        .warning-box {
          padding: 12px 14px;
          background: rgba(255,68,68,0.06);
          border-left: 3px solid var(--cv-danger);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          font-size: 13px;
          color: var(--cv-text-loss);
          line-height: 1.5;
        }
        /* Affiliate CTAs */
        .affiliate-cta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 12px 14px;
          background: var(--cv-bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--cv-border);
          font-size: 13px;
          color: var(--cv-text-secondary);
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: var(--transition-fast);
          border: 1px solid var(--cv-border-md);
          background: var(--cv-bg-card);
          color: var(--cv-text);
          font-family: var(--font-body);
        }
        .cta-btn:hover { background: var(--cv-bg-hover); border-color: var(--cv-primary); color: var(--cv-primary); }
        .cta-btn.primary { background: var(--cv-primary); color: #fff; border-color: var(--cv-primary); }
        .cta-btn.primary:hover { background: var(--cv-primary-hover); }
        .cta-btn.secondary { opacity: 0.8; }
        .cta-btn.large { padding: 11px 24px; font-size: 15px; border-radius: var(--radius-lg); }
        /* Footer CTA */
        .tools-footer-cta {
          margin-top: 3rem;
          padding: 2.5rem;
          text-align: center;
          background: var(--cv-bg-secondary);
          border: 1px solid var(--cv-border);
          border-radius: var(--radius-xl);
        }
        .tools-footer-cta h2 {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .tools-footer-cta p { color: var(--cv-text-secondary); margin-bottom: 1.5rem; font-size: 15px; }
        .cta-row { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .tools-page { padding: 1rem 1rem 3rem; }
          .tool-body { padding: 1rem; }
          .inputs-grid { grid-template-columns: 1fr; }
          .stats-grid-4 { grid-template-columns: 1fr 1fr; }
          .tools-footer-cta { padding: 1.5rem; }
        }
      `}</style>
    </>
  );
}
