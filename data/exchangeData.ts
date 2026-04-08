// ClearRate™ Exchange Intelligence — Data Layer
// All affiliate URLs centralized here — never hardcode in components

export type VolumeTier = '$10K' | '$100K' | '$1M' | '$10M' | '$100M';
export type Grade = 'INSTITUTIONAL' | 'PROFESSIONAL' | 'ACTIVE_TRADER';
export type CustodyModel = 'EXCHANGE' | 'THIRD_PARTY' | 'SELF_CUSTODY';
export type ProofOfReserves = 'FULL' | 'PARTIAL' | 'NONE';
export type DerivativeType = 'PERPETUALS' | 'OPTIONS' | 'FUTURES';
export type RegulatoryStatus = 'LICENSED' | 'REGISTERED' | 'RESTRICTED' | 'N/A';

export interface RiskFlag {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface ExchangeProfile {
  id: string;
  rank: number;
  name: string;
  clearRateScore: number;
  grade: Grade;
  bestFor: string;
  bestForEmoji: string;
  bestForLabel: string;
  summary: string;
  regulatoryNote?: string;
  regulatoryLicenses: string[];
  makerFee: string;
  takerFee: string;
  makerFeeNum: number;
  takerFeeNum: number;
  custodyModel: CustodyModel;
  insuranceCoverage: string | null;
  proofOfReserves: ProofOfReserves;
  usPersonsEligible: boolean | 'LIMITED';
  derivatives: DerivativeType[];
  fixApi: boolean;
  otcDesk: boolean;
  yearsOperational: number;
  minInstitutionalDeposit: string | null;
  riskFlags: RiskFlag[];
  pros: string[];
  cons: string[];
  keyMetrics: { label: string; value: string }[];
  affiliateLinks: {
    primary: { label: string; url: string };
    secondary?: { label: string; url: string };
  };
  inlineQuote?: string;
  regulatoryMap: Record<string, RegulatoryStatus>;
}

const UTM = '?utm_source=coinvestopedia&utm_medium=exchange_comparison&utm_campaign=clearrate';

export const EXCHANGE_DATA: ExchangeProfile[] = [
  {
    id: 'coinbase',
    rank: 1,
    name: 'Coinbase Advanced',
    clearRateScore: 91,
    grade: 'INSTITUTIONAL',
    bestFor: 'US Institutional Compliance',
    bestForEmoji: '🏆',
    bestForLabel: 'Best Overall',
    summary: 'The most regulated US crypto exchange. Publicly listed (NASDAQ: COIN), providing audited financials unavailable from any competitor. Gold standard for compliance-constrained institutional mandates.',
    regulatoryLicenses: ['NYDFS BitLicense', 'SEC-registered', 'FinCEN MSB', 'FCA (UK)', 'MAS (Singapore)'],
    makerFee: '0.00%',
    takerFee: '0.05%',
    makerFeeNum: 0,
    takerFeeNum: 0.0005,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$250M',
    proofOfReserves: 'FULL',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 13,
    minInstitutionalDeposit: '$100K',
    riskFlags: [],
    pros: [
      'Only major crypto exchange with publicly audited financials (10-K, 10-Q)',
      'Coinbase Custody Trust Company — qualified custodian status (New York State chartered)',
      'Coinbase Prime offers institutional lending, staking, and agency execution',
      'FDIC pass-through insurance on USD held in account',
      'Cleanest regulatory history of any major US exchange',
    ],
    cons: [
      'Retail interface fees are among the highest in market (up to 1.99%)',
      'Limited derivatives offering vs. OKX/Binance',
      'Asset selection restricted relative to offshore competitors',
      'Geographic restrictions on numerous tokens',
    ],
    keyMetrics: [
      { label: 'Cold Storage', value: '97%+ of assets' },
      { label: 'USD Balances', value: 'FDIC-insured up to $250,000' },
      { label: 'Institutional Product', value: 'Coinbase Prime' },
    ],
    affiliateLinks: {
      primary: { label: 'Open Institutional Account', url: `#${UTM}` },
      secondary: { label: 'Explore Coinbase Prime', url: `#${UTM}` },
    },
    inlineQuote: 'The only exchange whose financials you can verify in an SEC filing.',
    regulatoryMap: {
      US: 'LICENSED', EU: 'REGISTERED', UK: 'LICENSED', UAE: 'REGISTERED', Singapore: 'LICENSED', Australia: 'REGISTERED', Canada: 'REGISTERED',
    },
  },
  {
    id: 'kraken',
    rank: 2,
    name: 'Kraken Pro',
    clearRateScore: 89,
    grade: 'INSTITUTIONAL',
    bestFor: 'Best Security Record',
    bestForEmoji: '🛡️',
    bestForLabel: 'Best Security Record',
    summary: 'Best combination of regulatory standing and competitive professional-grade fees. Wyoming SPDI bank charter grants Kraken institutional legitimacy unavailable to most crypto-native competitors.',
    regulatoryLicenses: ['FinCEN MSB', 'Wyoming SPDI (Kraken Bank)', 'FCA (UK)', 'VASP (EU multiple)'],
    makerFee: '0.00%',
    takerFee: '0.10%',
    makerFeeNum: 0,
    takerFeeNum: 0.001,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'FULL',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 13,
    minInstitutionalDeposit: '$100K',
    riskFlags: [],
    pros: [
      'Wyoming SPDI bank charter = bank-equivalent regulatory standing',
      '10+ year operational history, zero major security incidents',
      'Kraken OTC for institutional block execution',
      'Margin and staking available for qualified institutional accounts',
      'Clean litigation record compared to Binance/Coinbase',
    ],
    cons: [
      'US futures product restricted relative to offshore competitors',
      'Fewer exotic altcoins than Binance or KuCoin',
      'Customer support response times criticized during high-volatility periods',
      'Kraken Pro UI less intuitive than Coinbase Advanced for new institutional users',
    ],
    keyMetrics: [
      { label: 'PoR Auditor', value: 'Armanino (Big 4 adjacent)' },
      { label: 'OTC Desk', value: 'Min $100K trade size' },
      { label: 'Futures', value: 'FCA licensed (UK)' },
    ],
    affiliateLinks: {
      primary: { label: 'Open Kraken Pro Account', url: `#${UTM}` },
      secondary: { label: 'Contact OTC Desk', url: `#${UTM}` },
    },
    inlineQuote: 'The only crypto exchange with a US bank charter.',
    regulatoryMap: {
      US: 'LICENSED', EU: 'REGISTERED', UK: 'LICENSED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'REGISTERED', Canada: 'REGISTERED',
    },
  },
  {
    id: 'gemini',
    rank: 3,
    name: 'Gemini',
    clearRateScore: 86,
    grade: 'INSTITUTIONAL',
    bestFor: 'Best Regulated (US)',
    bestForEmoji: '🏛️',
    bestForLabel: 'Best Regulated (US)',
    summary: "Tightest regulatory profile in the US market alongside Coinbase. SOC 2 Type 2 certified. Built explicitly for institutional custody requirements.",
    regulatoryLicenses: ['NYDFS BitLicense', 'NYDFS Trust Company Charter', 'SOC 2 Type 2'],
    makerFee: '0.00%',
    takerFee: '0.03%',
    makerFeeNum: 0,
    takerFeeNum: 0.0003,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$200M',
    proofOfReserves: 'FULL',
    usPersonsEligible: true,
    derivatives: [],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 10,
    minInstitutionalDeposit: '$500K',
    riskFlags: [{ severity: 'LOW', description: 'Genesis/Earn saga resolved; no ongoing material litigation.' }],
    pros: [
      'Gemini Custody: Qualified custodian, SOC 2 Type 2 certified, segregated customer assets',
      "Coldest storage model of any US regulated exchange",
      'Gemini Clearing: Institutional-grade settlement infrastructure',
      'CCPA and SOX-adjacent compliance standards',
      'Sub-account and reporting infrastructure for institutional clients',
    ],
    cons: [
      'Genesis/Gemini Earn episode (2022–2023) created reputational damage; resolved through bankruptcy proceedings',
      'Limited altcoin selection vs. global competitors',
      'US-centric — limited international expansion',
      'Lower liquidity than Coinbase and Kraken on mid-cap pairs',
    ],
    keyMetrics: [
      { label: 'Cold Storage', value: '100% of customer assets' },
      { label: 'Insurance', value: "$200M crime + Lloyd's of London digital asset" },
      { label: 'PoR Attestation', value: 'Monthly by BPM LLP' },
    ],
    affiliateLinks: {
      primary: { label: 'Open Gemini Institutional Account', url: `#${UTM}` },
      secondary: { label: 'Explore Gemini Custody', url: `#${UTM}` },
    },
    inlineQuote: "Lloyd's of London-underwritten insurance. The institutional standard.",
    regulatoryMap: {
      US: 'LICENSED', EU: 'RESTRICTED', UK: 'REGISTERED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'REGISTERED',
    },
  },
  {
    id: 'binance',
    rank: 4,
    name: 'Binance',
    clearRateScore: 84,
    grade: 'PROFESSIONAL',
    bestFor: 'Deepest Liquidity',
    bestForEmoji: '💱',
    bestForLabel: 'Deepest Liquidity',
    summary: 'Unmatched global liquidity — best execution for large orders across 400+ pairs. Deepest perpetual futures order book globally.',
    regulatoryNote: '⚠️ Binance (global) reached a $4.3B DOJ settlement in November 2023. CZ (founder) served federal sentence. Current CEO Richard Teng overseeing compliance restructuring. US persons must use Binance.US (limited functionality). Institutional allocators should verify internal compliance policy before onboarding.',
    regulatoryLicenses: ['Dubai VARA', 'Bahrain CBB', 'Abu Dhabi FSRA', 'Binance.US (limited US states)'],
    makerFee: '-0.01%',
    takerFee: '0.05%',
    makerFeeNum: -0.0001,
    takerFeeNum: 0.0005,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$1B+ (SAFU)',
    proofOfReserves: 'PARTIAL',
    usPersonsEligible: 'LIMITED',
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES'],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 8,
    minInstitutionalDeposit: null,
    riskFlags: [{ severity: 'HIGH', description: 'DOJ settlement 2023. Verify internal compliance policy before onboarding.' }],
    pros: [
      'Unmatched global liquidity — best execution for large orders across 400+ pairs',
      'Deepest perpetual futures order book globally',
      'BNB fee discount reduces effective costs by 25%',
      'Most comprehensive derivatives suite (USDM, COINM, options)',
      'Institutional API infrastructure (FIX API, sub-accounts, portfolio margin)',
    ],
    cons: [
      'DOJ settlement and regulatory history is a material compliance risk for regulated institutions',
      'Binance.US offers significantly reduced asset selection and liquidity',
      'Not suitable for investment advisers with fiduciary obligations without explicit compliance sign-off',
      'Proof of Reserves methodology challenged by some analysts',
    ],
    keyMetrics: [
      { label: 'SAFU Fund', value: '$1B+ emergency insurance reserve' },
      { label: '30D Spot Volume', value: '~$600B (largest globally, 40%+ market share)' },
      { label: 'BNB Discount', value: '25% fee reduction' },
    ],
    affiliateLinks: {
      primary: { label: 'Trade with Best Global Liquidity', url: `#${UTM}` },
      secondary: { label: 'Get 20% Fee Discount via BNB', url: `#${UTM}` },
    },
    inlineQuote: '40% of global crypto volume. No exchange offers tighter spreads at institutional size.',
    regulatoryMap: {
      US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'REGISTERED', Canada: 'RESTRICTED',
    },
  },
  {
    id: 'bitstamp',
    rank: 5,
    name: 'Bitstamp',
    clearRateScore: 83,
    grade: 'INSTITUTIONAL',
    bestFor: 'Best for Europeans',
    bestForEmoji: '🌍',
    bestForLabel: 'Best for Europeans',
    summary: 'Oldest operational exchange (est. 2011). Deepest European regulatory footprint. 2024 acquisition by Robinhood adds balance sheet credibility and potential US expansion pathway.',
    regulatoryLicenses: ['Luxembourg CSSF', 'FCA (UK)', 'NYDFS BitLicense', 'FinCEN MSB'],
    makerFee: '0.00%',
    takerFee: '0.03%',
    makerFeeNum: 0,
    takerFeeNum: 0.0003,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'PARTIAL',
    usPersonsEligible: true,
    derivatives: [],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 14,
    minInstitutionalDeposit: null,
    riskFlags: [{ severity: 'LOW', description: 'Robinhood parent introduces some regulatory transfer risk.' }],
    pros: [
      '13-year operational track record — longest of any listed exchange',
      'CSSF Luxembourg license provides EU-wide MiCA-ready passportable access',
      'Robinhood acquisition adds regulated US parent company credibility',
      'Institutional API with FIX protocol support',
      'ISO 27001 certified security management',
    ],
    cons: [
      'Limited altcoin selection (focus on major assets only)',
      'Lower liquidity on anything outside BTC, ETH, and major stablecoins',
      'Less competitive derivatives offering — primarily spot-focused',
      'UI/UX dated compared to modern institutional platforms',
    ],
    keyMetrics: [
      { label: 'Operational History', value: '13+ years, zero major security incidents post-2015' },
      { label: 'Parent Company', value: 'Robinhood Markets Inc. (NASDAQ: HOOD)' },
      { label: 'Certification', value: 'ISO 27001' },
    ],
    affiliateLinks: {
      primary: { label: "Trade on Europe's Most Regulated Exchange", url: `#${UTM}` },
      secondary: { label: 'Open Institutional Account', url: `#${UTM}` },
    },
    inlineQuote: '13 years operational. CSSF licensed. Now backed by a NASDAQ-listed parent.',
    regulatoryMap: {
      US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'REGISTERED',
    },
  },
  {
    id: 'okx',
    rank: 6,
    name: 'OKX',
    clearRateScore: 82,
    grade: 'PROFESSIONAL',
    bestFor: 'Best Derivatives',
    bestForEmoji: '🔁',
    bestForLabel: 'Best Derivatives',
    summary: 'Leading derivatives exchange for crypto-native professional traders. Maker rebates, integrated Web3 wallet, and the strongest perpetuals product outside Binance.',
    regulatoryLicenses: ['Dubai VARA', 'Bahamas SCB', 'Malta MGA', 'EU MiCA (in progress)'],
    makerFee: '-0.01%',
    takerFee: '0.05%',
    makerFeeNum: -0.0001,
    takerFeeNum: 0.0005,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'FULL',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES'],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 7,
    minInstitutionalDeposit: '$500K',
    riskFlags: [{ severity: 'MEDIUM', description: 'US persons excluded. Regulatory expansion ongoing.' }],
    pros: [
      'Maker rebates at professional volume tiers (net negative cost at scale)',
      'OKX Wallet: non-custodial Web3 integration directly linked to exchange',
      'Best perpetual futures product for cross-margin multi-asset accounts',
      'DeFi access from within exchange interface (aggregated DEX routing)',
      'Expanding regulatory footprint ahead of MiCA implementation',
    ],
    cons: [
      'Not available to US persons',
      'Brand trust lower than Coinbase/Kraken/Gemini for compliance-first institutions',
      'Proof of Reserves: Uses Merkle tree attestation; not third-party audited to Big 4 standard',
    ],
    keyMetrics: [
      { label: 'PoR', value: 'Monthly, published on-chain' },
      { label: 'OTC Desk', value: 'Available for $500K+ minimum trades' },
      { label: 'Web3 Wallet', value: 'Non-custodial, integrated' },
    ],
    affiliateLinks: {
      primary: { label: 'Claim $10,000 Welcome Offer', url: `#${UTM}` },
      secondary: { label: 'Open OKX Institutional', url: `#${UTM}` },
    },
    inlineQuote: 'Negative maker fees mean the exchange pays you to provide liquidity.',
    regulatoryMap: {
      US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'REGISTERED', Canada: 'RESTRICTED',
    },
  },
  {
    id: 'bybit',
    rank: 7,
    name: 'Bybit',
    clearRateScore: 79,
    grade: 'PROFESSIONAL',
    bestFor: 'Fast-Growing Derivatives Platform',
    bestForEmoji: '📈',
    bestForLabel: 'Fastest Growing',
    summary: 'Fastest-growing derivatives-focused exchange. Strongest alternative to OKX for perpetual futures with competitive funding rates and deep institutional API infrastructure.',
    regulatoryLicenses: ['Dubai VARA', 'Cyprus CySEC'],
    makerFee: '-0.01%',
    takerFee: '0.06%',
    makerFeeNum: -0.0001,
    takerFeeNum: 0.0006,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'PARTIAL',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES'],
    fixApi: true,
    otcDesk: true,
    yearsOperational: 6,
    minInstitutionalDeposit: null,
    riskFlags: [{ severity: 'MEDIUM', description: 'US persons excluded. Newer regulatory track record than top-tier exchanges.' }],
    pros: [
      'Competitive funding rates on perpetuals vs. Binance/OKX',
      'Institutional API: FIX API, sub-accounts, algorithmic order types',
      'Copy trading infrastructure for strategy replication',
      'USDC settlement option reduces USD/USDT counterparty exposure',
    ],
    cons: [
      'Not available in US',
      'Smaller spot liquidity relative to Binance and OKX',
      'Proof of Reserves: Published but methodology less rigorous than Kraken/Coinbase',
      'Lower brand recognition creates onboarding friction for traditional finance professionals',
    ],
    keyMetrics: [
      { label: '30D Derivatives Volume', value: '~$200B (third largest globally)' },
      { label: 'Settlement', value: 'USDC option available' },
      { label: 'Copy Trading', value: 'Built-in infrastructure' },
    ],
    affiliateLinks: {
      primary: { label: 'Get Up to $30,000 Welcome Bonus', url: `#${UTM}` },
      secondary: { label: 'Open Institutional Account', url: `#${UTM}` },
    },
    regulatoryMap: {
      US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED',
    },
  },
  {
    id: 'dydx',
    rank: 8,
    name: 'dYdX',
    clearRateScore: 76,
    grade: 'PROFESSIONAL',
    bestFor: 'Best Self-Custody',
    bestForEmoji: '🔐',
    bestForLabel: 'Best Self-Custody',
    summary: 'The institutional-grade non-custodial perpetuals exchange. Eliminates exchange counterparty risk entirely — all assets remain in self-custody throughout the trading lifecycle.',
    regulatoryLicenses: ['Decentralized protocol — no single regulated entity'],
    makerFee: '-0.01%',
    takerFee: '0.03%',
    makerFeeNum: -0.0001,
    takerFeeNum: 0.0003,
    custodyModel: 'SELF_CUSTODY',
    insuranceCoverage: null,
    proofOfReserves: 'NONE',
    usPersonsEligible: true,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDesk: false,
    yearsOperational: 5,
    minInstitutionalDeposit: null,
    riskFlags: [{ severity: 'MEDIUM', description: 'Smart contract risk. Not suitable as primary venue without traditional custody infrastructure alongside.' }],
    pros: [
      'Zero exchange counterparty risk — FTX-type collapse cannot occur',
      'Lowest perpetual fees of any venue globally',
      'No KYC requirement (v3/v4 protocol)',
      'dYdX Chain: Cosmos-based, sovereign order book with CEX-comparable throughput',
      'DYDX token staking provides additional fee reduction',
    ],
    cons: [
      'Perpetuals only — no spot market, no fiat on-ramp',
      'Smart contract risk replaces counterparty risk (different risk type, not risk elimination)',
      'Lower liquidity than Binance/OKX on illiquid pairs',
      'Crypto-native onboarding required (MetaMask or equivalent)',
      'No institutional account structure or reporting tools',
    ],
    keyMetrics: [
      { label: 'Settlement', value: 'On-chain, instant finality' },
      { label: 'Custody', value: 'Self-custodial at all times' },
      { label: 'Architecture', value: 'dYdX Chain (Cosmos SDK)' },
    ],
    affiliateLinks: {
      primary: { label: 'Trade Perpetuals Without Custody Risk', url: `#${UTM}` },
    },
    inlineQuote: 'The only venue where an FTX-style collapse is structurally impossible.',
    regulatoryMap: {
      US: 'N/A', EU: 'N/A', UK: 'N/A', UAE: 'N/A', Singapore: 'N/A', Australia: 'N/A', Canada: 'N/A',
    },
  },
  {
    id: 'hyperliquid',
    rank: 9,
    name: 'Hyperliquid',
    clearRateScore: 71,
    grade: 'ACTIVE_TRADER',
    bestFor: 'Lowest Fees',
    bestForEmoji: '📉',
    bestForLabel: 'Lowest Fees',
    summary: 'The emerging institutional challenger in on-chain perpetuals. Fully on-chain order book with CEX-comparable throughput. Lowest fees in market. Rapidly capturing professional trader volume from centralized competitors.',
    regulatoryLicenses: ['Decentralized protocol — no single regulated entity'],
    makerFee: '-0.01%',
    takerFee: '0.025%',
    makerFeeNum: -0.0001,
    takerFeeNum: 0.00025,
    custodyModel: 'SELF_CUSTODY',
    insuranceCoverage: null,
    proofOfReserves: 'NONE',
    usPersonsEligible: true,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDesk: false,
    yearsOperational: 2,
    minInstitutionalDeposit: null,
    riskFlags: [{ severity: 'MEDIUM', description: 'Early-stage infrastructure risk. Smart contract audit history limited.' }],
    pros: [
      'Lowest perpetual fees of any venue globally (0.025% taker)',
      'Fully on-chain with real-time settlement — eliminates withdrawal delays',
      'Self-custody throughout trading lifecycle',
      'Growing institutional trader adoption — monthly volume crossing $100B+',
      'No counterparty custody risk (dYdX-equivalent model, higher performance)',
    ],
    cons: [
      'Operational since 2023 — limited track record relative to established venues',
      'Smart contract and infrastructure risk elevated vs. battle-tested protocols',
      'Limited asset selection vs. Binance/OKX',
      'No fiat on-ramp — crypto-native onboarding only',
      'No institutional reporting, sub-accounts, or compliance tooling',
    ],
    keyMetrics: [
      { label: 'Architecture', value: 'HyperBFT consensus; proprietary L1' },
      { label: 'Monthly Volume', value: '$100B+' },
      { label: 'Token', value: 'HYPE — fee discounts & governance' },
    ],
    affiliateLinks: {
      primary: { label: 'Trade at 0.025% — Lowest Fees in Market', url: `#${UTM}` },
    },
    inlineQuote: 'Institutional execution costs. Non-custodial architecture. The future of professional trading.',
    regulatoryMap: {
      US: 'N/A', EU: 'N/A', UK: 'N/A', UAE: 'N/A', Singapore: 'N/A', Australia: 'N/A', Canada: 'N/A',
    },
  },
  {
    id: 'kucoin',
    rank: 10,
    name: 'KuCoin',
    clearRateScore: 67,
    grade: 'ACTIVE_TRADER',
    bestFor: 'Most Altcoins',
    bestForEmoji: '🪙',
    bestForLabel: 'Most Altcoins',
    summary: 'Widest altcoin access of any major exchange — critical for emerging token exposure. DOJ indictment of founders in 2024 for AML violations creates elevated institutional risk.',
    regulatoryNote: '⚠️ DOJ indictment of founders (March 2024) for AML violations. Exchange operating under new management. Not recommended for regulated institutional mandates. Suitable only for sophisticated non-US traders with risk tolerance for regulatory uncertainty.',
    regulatoryLicenses: ['Seychelles FSA (limited)', 'Various VASP registrations'],
    makerFee: '0.00%',
    takerFee: '0.08%',
    makerFeeNum: 0,
    takerFeeNum: 0.0008,
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'PARTIAL',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'FUTURES'],
    fixApi: false,
    otcDesk: false,
    yearsOperational: 7,
    minInstitutionalDeposit: null,
    riskFlags: [{ severity: 'HIGH', description: 'DOJ action 2024. Institutional allocators: verify legal opinion before onboarding.' }],
    pros: [
      'Widest altcoin access of any major exchange — critical for emerging token exposure',
      'KuCoin Earn: Flexible and fixed-term yield products',
      'Trading bot infrastructure (Grid trading, DCA bots) built into UI',
      'Futures and margin available with competitive rates',
    ],
    cons: [
      'DOJ indictment of founders (2024) is a material institutional red flag',
      'US persons prohibited',
      'Regulatory standing weakest of any exchange in this ranking',
      'Proof of Reserves: Published but auditor quality below institutional standard',
    ],
    keyMetrics: [
      { label: 'Asset Selection', value: '700+ trading pairs' },
      { label: 'Trading Bots', value: 'Grid, DCA — built-in' },
      { label: 'Yield Products', value: 'Flexible + Fixed-term' },
    ],
    affiliateLinks: {
      primary: { label: 'Access 700+ Altcoin Markets', url: `#${UTM}` },
    },
    inlineQuote: 'Review regulatory risk disclosure before opening account.',
    regulatoryMap: {
      US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED',
    },
  },
];

// Best-For quick access mapping
export const BEST_FOR_CARDS = [
  { label: 'Best Overall', iconName: 'Trophy', exchangeId: 'coinbase', cta: 'Open Account' },
  { label: 'Best Regulated (US)', iconName: 'Building', exchangeId: 'gemini', cta: 'Open Institutional Account' },
  { label: 'Deepest Liquidity', iconName: 'Droplets', exchangeId: 'binance', cta: 'Trade with Best Execution' },
  { label: 'Lowest Fees', iconName: 'TrendingDown', exchangeId: 'hyperliquid', cta: 'Access 0.025% Taker Rate' },
  { label: 'Best Security Record', iconName: 'Shield', exchangeId: 'kraken', cta: 'Open Kraken Pro' },
  { label: 'Best for Europeans', iconName: 'Globe', exchangeId: 'bitstamp', cta: 'Open EU Regulated Account' },
  { label: 'Best Derivatives', iconName: 'Repeat', exchangeId: 'okx', cta: 'Trade Perpetuals' },
  { label: 'Best Self-Custody', iconName: 'Lock', exchangeId: 'dydx', cta: 'Trade Without Counterparty Risk' },
  { label: 'Most Altcoins', iconName: 'Coins', exchangeId: 'kucoin', cta: 'Access 700+ Markets' },
];

// FAQ Data
export const FAQ_DATA = [
  {
    q: 'What is the most regulated crypto exchange in the US?',
    a: 'Coinbase Advanced and Gemini are the most heavily regulated US exchanges. Coinbase holds a NYDFS BitLicense, is SEC-registered, and is the only major exchange with publicly audited financials as a NASDAQ-listed company (COIN). Gemini holds a NYDFS Trust Company Charter and is SOC 2 Type 2 certified. Kraken also holds a Wyoming SPDI bank charter, making it the only crypto exchange with a US banking license.',
  },
  {
    q: 'Which crypto exchanges accept institutional investors?',
    a: 'Coinbase (via Coinbase Prime), Gemini (via Gemini Custody), Kraken (via Kraken OTC), Binance, OKX, Bitstamp, and Bybit all offer institutional account tiers with features including FIX API access, sub-accounts, OTC desk services, and dedicated account management.',
  },
  {
    q: 'How are crypto exchange fees calculated at institutional volume?',
    a: 'Most exchanges use a tiered maker/taker fee model where rates decrease as 30-day trading volume increases. At institutional volumes ($1M+/month), maker fees can drop to 0% or even negative (maker rebates). Taker fees at institutional tiers range from 0.025% (Hyperliquid) to 0.10% (Kraken). BNB and DYDX tokens can provide additional fee reductions on their respective platforms.',
  },
  {
    q: 'What is Proof of Reserves and which exchanges publish it?',
    a: 'Proof of Reserves (PoR) is a cryptographic verification method that allows exchanges to prove they hold customer assets 1:1. Coinbase publishes quarterly via SEC filings. Kraken uses Armanino-audited quarterly attestations. Gemini publishes monthly via BPM LLP. OKX publishes monthly on-chain. Binance publishes PoR but its methodology has been challenged by some analysts for not including all liabilities.',
  },
  {
    q: 'Can US persons trade on Binance?',
    a: 'US residents cannot use the global Binance platform. They must use Binance.US, which offers significantly reduced asset selection, lower liquidity, and limited features compared to the global platform. Following the 2023 DOJ settlement, US regulatory scrutiny of Binance-related entities remains elevated.',
  },
  {
    q: 'What happened to FTX and how do I avoid exchange counterparty risk?',
    a: 'FTX collapsed in November 2022 after it was revealed that customer deposits were used to fund Alameda Research, resulting in approximately $8B in customer losses. To mitigate exchange counterparty risk: (1) use exchanges with published PoR, (2) consider non-custodial platforms like dYdX or Hyperliquid, (3) limit exchange balances to active trading capital only, (4) use hardware wallets for long-term storage, (5) prefer publicly audited exchanges like Coinbase.',
  },
  {
    q: 'What is a NYDFS BitLicense and why does it matter?',
    a: 'The New York Department of Financial Services (NYDFS) BitLicense is the most stringent state-level crypto license in the US. It requires comprehensive capital reserves, cybersecurity standards, AML/KYC compliance, and regular audits. Only a handful of exchanges hold it, including Coinbase, Gemini, Bitstamp, and Kraken (via its banking charter). It is a strong signal of regulatory seriousness.',
  },
  {
    q: 'Which crypto exchange has the deepest order book for large orders?',
    a: 'Binance has the deepest global order book with approximately 40%+ of total crypto spot volume and the deepest perpetual futures liquidity. For US-only execution, Coinbase Advanced offers the deepest domestic order book. For institutional block trades, Kraken OTC and Coinbase Prime provide agency-style execution to minimize market impact.',
  },
  {
    q: 'What is the difference between a custodial and non-custodial exchange?',
    a: 'A custodial exchange (Coinbase, Binance, Kraken, etc.) holds your assets on your behalf — you trust the exchange to safeguard them. A non-custodial exchange (dYdX, Hyperliquid) allows you to trade directly from your own wallet — assets remain in your self-custody throughout the trading lifecycle. Non-custodial exchanges eliminate counterparty risk but introduce smart contract risk.',
  },
  {
    q: 'How do perpetual futures differ from traditional futures?',
    a: 'Traditional futures have an expiration date and settle at a fixed price. Perpetual futures (perps) have no expiration — they trade continuously with a funding rate mechanism that keeps the perpetual price anchored to the spot price. Positive funding means longs pay shorts; negative funding means shorts pay longs. Perpetuals are the dominant derivative instrument in crypto, with daily volume exceeding spot markets.',
  },
  {
    q: 'What does ClearRate™ score mean and how is it calculated?',
    a: 'ClearRate™ is Coinvestopedia\'s proprietary 100-point institutional exchange scoring model. It evaluates exchanges across 7 weighted dimensions: Regulatory Compliance (25%), Liquidity Depth (20%), Fee Structure (20%), Custody & Security (15%), Asset Coverage (10%), Institutional Infrastructure (5%), and Operational Track Record (5%). Scores of 90+ indicate institutional grade; 80-89 professional grade; 70-79 active trader grade; below 70 indicates elevated risk.',
  },
  {
    q: 'Which crypto exchange is best for a family office or RIA?',
    a: 'For US family offices and RIAs with fiduciary obligations, Coinbase Prime and Gemini Custody are the recommended platforms. Both offer qualified custodian status, segregated customer asset storage, institutional reporting, and insurance coverage. Coinbase is the only option with publicly audited financials. Gemini offers SOC 2 Type 2 certification. Kraken\'s Wyoming bank charter also provides strong institutional credibility.',
  },
];

// Affiliate banners data
export const AFFILIATE_BANNERS = [
  {
    id: 'compliance',
    title: 'Trading crypto under a fiduciary mandate?',
    body: 'Coinbase Prime offers institutional custody, agency execution, and the only audited financials in crypto.',
    cta: 'Schedule a Coinbase Prime Demo →',
    ctaUrl: '#',
    placement: 'after-profile-3',
  },
  {
    id: 'fee-optimization',
    title: 'Most institutional traders overpay by $40K–$200K annually on exchange fees.',
    body: 'The ClearRate™ Fee Calculator shows exactly where the savings are.',
    cta: 'Run Your Fee Analysis →',
    ctaUrl: '#fee-calculator',
    placement: 'after-calculator',
  },
  {
    id: 'self-custody',
    title: 'FTX lost $8B in customer assets.',
    body: 'dYdX and Hyperliquid make that structurally impossible. Non-custodial perpetuals — same execution, zero counterparty risk.',
    cta: 'Trade Without Custody Risk →',
    ctaUrl: '#dydx',
    placement: 'after-profile-8',
  },
];

// Regions for regulatory matrix
export const REGIONS = ['US', 'EU', 'UK', 'UAE', 'Singapore', 'Australia', 'Canada'];
