
export interface NavItem {
  label: string;
  href: string;
  isPremium?: boolean;
  hasDropdown?: boolean;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  isTrending?: boolean;
}

export interface WhaleTransaction {
  id: string;
  hash: string;
  amount: string;
  asset: string;
  from: string;
  to: string;
  time: string;
  type: 'buy' | 'sell' | 'transfer';
  valueUsd: string;
}

export interface ComparisonData {
  metric: string;
  assetA: string | number | boolean;
  assetB: string | number | boolean;
}

export enum PageRoute {
  HOME = '/',
  WHALE = '/whale-tracker',
  COMPARE = '/compare',
  MACRO_INTEL = '/macro-intel',
  TOOLS = '/tools',
  LEARN = '/learn',
  INSIGHTS = '/insights',
  NEWSLETTER = '/newsletter',
  AUDIT = '/security-audit',
  PRIVACY = '/privacy',
  TERMS = '/terms',
  COOKIES = '/cookies'
}
