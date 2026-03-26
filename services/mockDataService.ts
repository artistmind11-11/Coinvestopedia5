/**
 * Mock Data Service
 * Provides realistic mock data for development and testing
 */

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  icon?: string;
}

export interface Transaction {
  id: string;
  user: string;
  action: 'buy' | 'sell' | 'transfer' | 'stake';
  amount: number;
  asset: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'extreme';
}

export interface MarketData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  etherFlippening: number;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: Date;
  author: string;
  readTime: number;
  image?: string;
}

// Mock Assets Data
export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 42356.78,
    change24h: 3.42,
    marketCap: 835000000000,
    volume24h: 28500000000,
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2345.67,
    change24h: -1.23,
    marketCap: 281000000000,
    volume24h: 15800000000,
  },
  {
    id: '3',
    name: 'Solana',
    symbol: 'SOL',
    price: 145.32,
    change24h: 8.71,
    marketCap: 68000000000,
    volume24h: 3200000000,
  },
  {
    id: '4',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.98,
    change24h: -0.51,
    marketCap: 35000000000,
    volume24h: 1200000000,
  },
  {
    id: '5',
    name: 'Polkadot',
    symbol: 'DOT',
    price: 8.45,
    change24h: 2.15,
    marketCap: 12500000000,
    volume24h: 450000000,
  },
  {
    id: '6',
    name: 'Ripple',
    symbol: 'XRP',
    price: 2.34,
    change24h: 4.82,
    marketCap: 125000000000,
    volume24h: 2800000000,
  },
];

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    user: 'Whale Alert',
    action: 'buy',
    amount: 50000000,
    asset: 'ETH',
    timestamp: new Date(Date.now() - 2 * 60000),
    severity: 'extreme',
  },
  {
    id: '2',
    user: 'Smart Money',
    action: 'sell',
    amount: 30000000,
    asset: 'BTC',
    timestamp: new Date(Date.now() - 5 * 60000),
    severity: 'high',
  },
  {
    id: '3',
    user: 'Institution',
    action: 'stake',
    amount: 20000000,
    asset: 'SOL',
    timestamp: new Date(Date.now() - 8 * 60000),
    severity: 'medium',
  },
  {
    id: '4',
    user: 'Exchange',
    action: 'transfer',
    amount: 15000000,
    asset: 'ADA',
    timestamp: new Date(Date.now() - 12 * 60000),
    severity: 'high',
  },
  {
    id: '5',
    user: 'Treasury',
    action: 'buy',
    amount: 8500000,
    asset: 'DOT',
    timestamp: new Date(Date.now() - 18 * 60000),
    severity: 'medium',
  },
];

// Mock Market Data
export const mockMarketData: MarketData = {
  totalMarketCap: 1450000000000,
  totalVolume24h: 58000000000,
  btcDominance: 57.3,
  etherFlippening: 18.5,
};

// Mock Insights/Articles
export const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Understanding DeFi Protocols: A Complete Guide',
    content:
      'Decentralized Finance (DeFi) is transforming the way we think about financial services. Learn the fundamentals of smart contracts, liquidity pools, and yield farming.',
    category: 'DeFi',
    timestamp: new Date(Date.now() - 2 * 3600000),
    author: 'Sarah Chen',
    readTime: 8,
    image: '📊',
  },
  {
    id: '2',
    title: 'Layer 2 Solutions: Scaling Ethereum for the Future',
    content:
      'Explore how Layer 2 solutions like Arbitrum, Optimism, and zkSync are solving Ethereum scalability challenges while maintaining security.',
    category: 'Layer 2',
    timestamp: new Date(Date.now() - 5 * 3600000),
    author: 'Alex Rodriguez',
    readTime: 10,
    image: '⚡',
  },
  {
    id: '3',
    title: 'Whale Watching: How to Track Smart Money Movements',
    content:
      'Master the art of whale watching and learn how to identify smart money movements in the crypto market using on-chain analysis.',
    category: 'Trading',
    timestamp: new Date(Date.now() - 8 * 3600000),
    author: 'Michael Park',
    readTime: 6,
    image: '🐋',
  },
  {
    id: '4',
    title: 'Risk Management in Crypto Trading',
    content:
      'Develop a robust risk management strategy to protect your portfolio from market volatility and maximize long-term returns.',
    category: 'Trading',
    timestamp: new Date(Date.now() - 12 * 3600000),
    author: 'Emma Johnson',
    readTime: 7,
    image: '🛡️',
  },
  {
    id: '5',
    title: 'The Future of Decentralized Governance',
    content:
      'Explore how DAOs and decentralized governance mechanisms are reshaping decision-making in crypto projects.',
    category: 'Governance',
    timestamp: new Date(Date.now() - 24 * 3600000),
    author: 'David Kumar',
    readTime: 9,
    image: '🏛️',
  },
];

// Mock Search Results
export function searchAssets(query: string): Asset[] {
  if (!query) return mockAssets;
  const lowerQuery = query.toLowerCase();
  return mockAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.symbol.toLowerCase().includes(lowerQuery)
  );
}

// Mock function to simulate API delay
export function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock function to get trending assets
export function getTrendingAssets(limit: number = 5): Asset[] {
  return [...mockAssets]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, limit);
}

// Mock function to get top gainers
export function getTopGainers(): Asset[] {
  return mockAssets.filter((a) => a.change24h > 5).sort((a, b) => b.change24h - a.change24h);
}

// Mock function to get top losers
export function getTopLosers(): Asset[] {
  return mockAssets.filter((a) => a.change24h < -2).sort((a, b) => a.change24h - b.change24h);
}

// Mock function to get volume leaders
export function getVolumeLeaders(limit: number = 5): Asset[] {
  return [...mockAssets]
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, limit);
}

// Mock function to get market insights
export function getMarketInsights(): Insight[] {
  return mockInsights;
}

// Mock function to filter insights by category
export function getInsightsByCategory(category: string): Insight[] {
  if (category === 'all') return mockInsights;
  return mockInsights.filter((insight) => insight.category === category);
}

// Mock function to search insights
export function searchInsights(query: string): Insight[] {
  if (!query) return mockInsights;
  const lowerQuery = query.toLowerCase();
  return mockInsights.filter(
    (insight) =>
      insight.title.toLowerCase().includes(lowerQuery) ||
      insight.content.toLowerCase().includes(lowerQuery) ||
      insight.author.toLowerCase().includes(lowerQuery)
  );
}

// Mock function to get recent transactions
export function getRecentTransactions(limit: number = 10): Transaction[] {
  return mockTransactions.slice(0, limit);
}

// Mock function to get high severity transactions
export function getHighSeverityTransactions(): Transaction[] {
  return mockTransactions.filter((t) => ['high', 'extreme'].includes(t.severity));
}

// Export mock service object
export const mockDataService = {
  getAssets: () => mockAssets,
  searchAssets,
  getTrendingAssets,
  getTopGainers,
  getTopLosers,
  getVolumeLeaders,
  getMarketData: () => mockMarketData,
  getMarketInsights,
  getInsightsByCategory,
  searchInsights,
  getRecentTransactions,
  getHighSeverityTransactions,
  simulateDelay,
};

export default mockDataService;