export interface ProprietaryMetrics {
  fearAndGreed: number; // 0-100
  sopr: number; // e.g., 0.95 to 1.05
  netFlow: number; // USD value or BTC amount, negative is outflow
  exchangeOutflow: number; // Raw outflow volume
  minerOutflow: number; // 0-1 normalized or raw value
}

/**
 * Calculates a proprietary "Smart Money Confidence" score from 0-100.
 * A score above 70 indicates strong institutional accumulation.
 * A score below 30 indicates institutional distribution.
 */
export const calculateSmartMoneyConfidence = (metrics: ProprietaryMetrics): number => {
  let score = 50; // Neutral baseline

  // 1. Fear & Greed (Contrarian Indicator)
  if (metrics.fearAndGreed < 25) score += 15;
  else if (metrics.fearAndGreed < 45) score += 5;
  else if (metrics.fearAndGreed > 75) score -= 15;
  else if (metrics.fearAndGreed > 60) score -= 5;

  // 2. SOPR (Spent Output Profit Ratio)
  if (metrics.sopr < 0.98) score += 15;
  else if (metrics.sopr >= 0.98 && metrics.sopr <= 1.0) score += 5;
  else if (metrics.sopr > 1.05) score -= 15;
  else if (metrics.sopr > 1.02) score -= 5;

  // 3. Exchange Net Flow & Exchange Outflow specifically
  if (metrics.netFlow < -100000000) score += 15; // >$100M Net Outflow
  else if (metrics.netFlow < -10000000) score += 10;
  else if (metrics.netFlow > 100000000) score -= 20; // >$100M Inflow

  if (metrics.exchangeOutflow > 250000000) score += 15; // Massive gross un-netted outflows = highly bullish 
  else if (metrics.exchangeOutflow > 50000000) score += 5;

  // 4. Miner Outflow 
  if (metrics.minerOutflow < 30) score += 10;
  else if (metrics.minerOutflow > 70) score -= 10;

  // Clamp the score between 0 and 100
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Helper to generate a mocked confidence score when API keys are missing.
 * Generates an initially bullish realistic score to demo the feature.
 */
export const getMockedSmartMoneyConfidence = () => {
  return calculateSmartMoneyConfidence({
    fearAndGreed: 22, // Extreme Fear (Bullish setup)
    sopr: 0.97, // capitulation
    netFlow: -250000000, // Heavy net accumulation
    exchangeOutflow: 300000000, // Massive gross outflows
    minerOutflow: 20 // Miners holding
  });
};
