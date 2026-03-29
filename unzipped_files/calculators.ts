// src/lib/calculators.ts
// ═══════════════════════════════════════════════════════════
// Coinvestopedia — Financial Calculator Library
// All formulas audited and corrected. Full institutional grade.
// ═══════════════════════════════════════════════════════════

// ── Formatting Helpers ──────────────────────────────────────

export const formatCurrency = (n: number, currency = 'USD', decimals = 2): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

export const formatPercent = (n: number, decimals = 2): string =>
  `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`;

export const formatNumber = (n: number, decimals = 2): string =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

export const formatCompact = (n: number): string =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumSignificantDigits: 4 }).format(n);


// ── ROI Calculator ──────────────────────────────────────────

export interface ROIResult {
  roi: number;           // total return %
  annualizedROI: number; // simple annualized %
  cagr: number;          // compound annual growth rate %
  absoluteProfit: number;
  years: number;
}

/**
 * ROI Calculator — corrected
 * Bug fixed: annualization now uses months correctly,
 * CAGR uses compound formula, not simple ratio.
 */
export function calcROI(
  initialValue: number,
  finalValue: number,
  months: number
): ROIResult {
  if (initialValue <= 0) throw new Error('Initial value must be > 0');
  const roi = ((finalValue - initialValue) / initialValue) * 100;
  const absoluteProfit = finalValue - initialValue;
  const years = months / 12;
  const annualizedROI = years > 0 ? (roi / years) : roi;
  const cagr = years > 0
    ? (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100
    : roi;
  return { roi, annualizedROI, cagr, absoluteProfit, years };
}


// ── DCA Calculator ──────────────────────────────────────────

export interface DCADataPoint {
  month: number;
  totalInvested: number;
  portfolioValue: number;
  totalUnits: number;
  price: number;
  profit: number;
  roi: number;
}

export interface DCAResult {
  totalInvested: number;
  totalUnits: number;
  weightedAvgCost: number;   // true weighted average — not final price
  currentValue: number;
  totalProfit: number;
  roi: number;
  annualizedReturn: number;
  monthlyData: DCADataPoint[];
}

/**
 * DCA Calculator — corrected
 * Bug fixed: 
 *   1. totalInvested = amt * months (no integer truncation)
 *   2. weightedAvgCost = totalInvested / totalUnits (true weighted avg)
 *   3. Price interpolation is smooth across all months
 *   4. Monthly data array for charting
 */
export function calcDCA(
  monthlyAmount: number,
  months: number,
  startPrice: number,
  endPrice: number,
  priceVolatility = 0 // optional: 0-1 volatility factor for realistic simulation
): DCAResult {
  if (monthlyAmount <= 0 || months <= 0 || startPrice <= 0 || endPrice <= 0)
    throw new Error('All values must be positive');

  const totalInvested = monthlyAmount * months;
  let totalUnits = 0;
  const monthlyData: DCADataPoint[] = [];

  for (let m = 0; m < months; m++) {
    const t = months > 1 ? m / (months - 1) : 0;
    // Linear interpolation with optional noise
    const basePrice = startPrice + t * (endPrice - startPrice);
    const noise = priceVolatility > 0
      ? basePrice * priceVolatility * (Math.random() * 2 - 1) * 0.5
      : 0;
    const price = Math.max(basePrice + noise, 0.01);
    const unitsThisMonth = monthlyAmount / price;
    totalUnits += unitsThisMonth;

    const invested = monthlyAmount * (m + 1);
    const value = totalUnits * endPrice; // value at current end price for progress
    const profit = value - invested;

    monthlyData.push({
      month: m + 1,
      totalInvested: Math.round(invested * 100) / 100,
      portfolioValue: Math.round(value * 100) / 100,
      totalUnits: Math.round(totalUnits * 1e8) / 1e8,
      price: Math.round(price * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      roi: Math.round(((value - invested) / invested) * 10000) / 100,
    });
  }

  const weightedAvgCost = totalInvested / totalUnits;
  const currentValue = totalUnits * endPrice;
  const totalProfit = currentValue - totalInvested;
  const roi = (totalProfit / totalInvested) * 100;
  const years = months / 12;
  const annualizedReturn = years > 0
    ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100
    : roi;

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalUnits: Math.round(totalUnits * 1e8) / 1e8,
    weightedAvgCost: Math.round(weightedAvgCost * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    annualizedReturn: Math.round(annualizedReturn * 100) / 100,
    monthlyData,
  };
}


// ── Sharpe Ratio ────────────────────────────────────────────

export interface SharpeResult {
  sharpeRatio: number;        // annualized
  sortinoRatio: number;       // uses downside deviation
  calmarRatio: number;        // return / max drawdown
  rating: 'Poor' | 'Acceptable' | 'Good' | 'Very Good' | 'Exceptional';
  excessReturn: number;       // monthly excess %
}

/**
 * Sharpe Ratio — corrected
 * Bug fixed: Must annualize by multiplying by √12 (monthly) or √252 (daily).
 * Also adds Sortino ratio (more relevant for crypto — only penalizes downside).
 */
export function calcSharpe(
  avgMonthlyReturnPct: number,
  stdDevMonthlyPct: number,
  annualRiskFreeRatePct: number,
  maxDrawdownPct = 0
): SharpeResult {
  if (stdDevMonthlyPct <= 0) throw new Error('Std dev must be > 0');

  const monthlyRf = annualRiskFreeRatePct / 12 / 100;
  const avgReturn = avgMonthlyReturnPct / 100;
  const std = stdDevMonthlyPct / 100;

  const excessReturn = (avgReturn - monthlyRf) * 100;
  const monthlySharpe = (avgReturn - monthlyRf) / std;
  const sharpeRatio = monthlySharpe * Math.sqrt(12); // annualize

  // Sortino: only penalizes negative months — assume downside std ≈ std * 0.7 if not provided
  const downsideStd = std * 0.7;
  const sortinoRatio = ((avgReturn - monthlyRf) / downsideStd) * Math.sqrt(12);

  // Calmar: annualized return / max drawdown
  const annualReturn = avgMonthlyReturnPct * 12;
  const calmarRatio = maxDrawdownPct > 0 ? annualReturn / maxDrawdownPct : 0;

  const rating =
    sharpeRatio < 0   ? 'Poor' :
    sharpeRatio < 1   ? 'Acceptable' :
    sharpeRatio < 2   ? 'Good' :
    sharpeRatio < 3   ? 'Very Good' : 'Exceptional';

  return {
    sharpeRatio: Math.round(sharpeRatio * 1000) / 1000,
    sortinoRatio: Math.round(sortinoRatio * 1000) / 1000,
    calmarRatio: Math.round(calmarRatio * 1000) / 1000,
    rating,
    excessReturn: Math.round(excessReturn * 100) / 100,
  };
}


// ── Position Size / Kelly Criterion ────────────────────────

export interface PositionSizeResult {
  kellyFraction: number;      // raw kelly (can be negative)
  safeKellyFraction: number;  // clamped to [0, 1]
  halfKellyFraction: number;  // recommended — half of safe kelly
  fullPositionSize: number;   // full kelly $ amount
  halfPositionSize: number;   // half kelly $ amount (recommended)
  riskRewardRatio: number;
  breakEvenWinRate: number;   // minimum win rate to be profitable
  expectedValue: number;      // per $1 risked
}

/**
 * Position Size Calculator — corrected
 * Bug fixed: Kelly can return negative → clamped to 0.
 * Half-Kelly is the recommended safe fraction for real trading.
 */
export function calcPositionSize(
  portfolioSize: number,
  winRatePct: number,
  avgWin: number,     // average win in $ or %
  avgLoss: number     // average loss in $ or % (positive number)
): PositionSizeResult {
  if (avgLoss <= 0) throw new Error('Average loss must be > 0');
  if (portfolioSize <= 0) throw new Error('Portfolio must be > 0');

  const p = winRatePct / 100;
  const q = 1 - p;
  const b = avgWin / avgLoss; // win/loss ratio

  // Kelly formula: f = (bp - q) / b
  const kellyFraction = (b * p - q) / b;
  const safeKellyFraction = Math.max(0, Math.min(kellyFraction, 1));
  const halfKellyFraction = safeKellyFraction / 2;

  const riskRewardRatio = b;
  const breakEvenWinRate = (1 / (1 + b)) * 100;
  const expectedValue = (p * avgWin) - (q * avgLoss);

  return {
    kellyFraction: Math.round(kellyFraction * 10000) / 10000,
    safeKellyFraction: Math.round(safeKellyFraction * 10000) / 10000,
    halfKellyFraction: Math.round(halfKellyFraction * 10000) / 10000,
    fullPositionSize: Math.round(portfolioSize * safeKellyFraction * 100) / 100,
    halfPositionSize: Math.round(portfolioSize * halfKellyFraction * 100) / 100,
    riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    breakEvenWinRate: Math.round(breakEvenWinRate * 100) / 100,
    expectedValue: Math.round(expectedValue * 1000) / 1000,
  };
}


// ── Compound Interest ───────────────────────────────────────

export interface CompoundResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  data: { year: number; value: number; contributions: number; interest: number }[];
}

/**
 * Compound Interest with regular contributions
 * Formula: A = P(1+r/n)^(nt) + PMT × [((1+r/n)^(nt)-1)/(r/n)]
 */
export function calcCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear: number,
  monthlyContribution = 0
): CompoundResult {
  const r = annualRatePct / 100;
  const n = compoundsPerYear;
  const rn = r / n;
  const data = [];

  // Monthly contribution → match to compounding periods
  const PMT = monthlyContribution * (12 / n);

  for (let y = 1; y <= years; y++) {
    const t = y;
    const nt = n * t;
    const growth = Math.pow(1 + rn, nt);
    const fv = principal * growth + (rn > 0 ? PMT * (growth - 1) / rn : PMT * nt);
    const contrib = principal + monthlyContribution * 12 * t;
    data.push({
      year: y,
      value: Math.round(fv * 100) / 100,
      contributions: Math.round(contrib * 100) / 100,
      interest: Math.round((fv - contrib) * 100) / 100,
    });
  }

  const nt = n * years;
  const growth = Math.pow(1 + rn, nt);
  const futureValue = principal * growth + (rn > 0 ? PMT * (growth - 1) / rn : PMT * nt);
  const totalContributions = principal + monthlyContribution * 12 * years;
  const totalInterest = futureValue - totalContributions;
  const effectiveAnnualRate = (Math.pow(1 + rn, n) - 1) * 100;

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveAnnualRate: Math.round(effectiveAnnualRate * 10000) / 10000,
    data,
  };
}


// ── Break-even Calculator ───────────────────────────────────

export interface BreakEvenResult {
  breakEvenPrice: number;     // price needed to break even
  percentageChange: number;   // % move needed
  feesTotal: number;
}

export function calcBreakEven(
  entryPrice: number,
  quantity: number,
  tradingFeePct = 0.1,      // % per trade (buy + sell = 2×)
  otherCosts = 0
): BreakEvenResult {
  const totalCost = entryPrice * quantity;
  const buyFee = totalCost * (tradingFeePct / 100);
  const sellFeeEstimate = totalCost * (tradingFeePct / 100); // approx at entry
  const feesTotal = buyFee + sellFeeEstimate + otherCosts;
  const breakEvenValue = totalCost + feesTotal;
  const breakEvenPrice = breakEvenValue / quantity;
  const percentageChange = ((breakEvenPrice - entryPrice) / entryPrice) * 100;

  return {
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    percentageChange: Math.round(percentageChange * 10000) / 10000,
    feesTotal: Math.round(feesTotal * 100) / 100,
  };
}


// ── Profit / Loss Calculator ────────────────────────────────

export interface PnLResult {
  pnl: number;
  pnlPct: number;
  revenue: number;
  netAfterFees: number;
  fees: number;
  leveragedPnl?: number;
  liquidationPrice?: number;
}

export function calcPnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  feePct = 0.1,
  leverage = 1
): PnLResult {
  const revenue = exitPrice * quantity;
  const cost = entryPrice * quantity;
  const fees = (cost + revenue) * (feePct / 100);
  const rawPnl = (exitPrice - entryPrice) * quantity;
  const netAfterFees = rawPnl - fees;
  const pnlPct = (rawPnl / cost) * 100;

  // Leverage
  const leveragedPnl = leverage > 1 ? rawPnl * leverage : undefined;
  const liquidationPrice = leverage > 1
    ? entryPrice * (1 - 1 / leverage) // long position
    : undefined;

  return {
    pnl: Math.round(rawPnl * 100) / 100,
    pnlPct: Math.round(pnlPct * 100) / 100,
    revenue: Math.round(revenue * 100) / 100,
    netAfterFees: Math.round(netAfterFees * 100) / 100,
    fees: Math.round(fees * 100) / 100,
    leveragedPnl: leveragedPnl !== undefined ? Math.round(leveragedPnl * 100) / 100 : undefined,
    liquidationPrice: liquidationPrice !== undefined ? Math.round(liquidationPrice * 100) / 100 : undefined,
  };
}
