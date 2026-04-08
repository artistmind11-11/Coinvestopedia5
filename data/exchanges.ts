export type Grade = 'INSTITUTIONAL' | 'PROFESSIONAL' | 'ACTIVE_TRADER';
export type CustodyModel = 'EXCHANGE' | 'THIRD_PARTY_QUALIFIED' | 'SELF_CUSTODY';
export type PoRStatus = 'FULL_AUDIT' | 'MERKLE_ATTESTATION' | 'NONE';

export interface ExchangeFees {
  spotMaker: number;      // As decimal: 0.001 = 0.1%
  spotTaker: number;
  perpMaker: number;      // Negative = rebate e.g. -0.0001
  perpTaker: number;
  withdrawalBTC: number;  // In BTC
}

export interface ExchangeProfile {
  id: string;
  name: string;
  clearRateScore: number;           // 0–100
  grade: Grade;
  brandColor: string;               // Hex
  founded: number;
  headquarters: string;
  fees: ExchangeFees;
  regulatoryLicenses: string[];
  custodyModel: CustodyModel;
  insuranceCoverage: string | null; // e.g. "$250M" or null
  proofOfReserves: PoRStatus;
  usPersonsEligible: boolean | 'LIMITED';
  derivatives: ('PERPETUALS' | 'OPTIONS' | 'FUTURES' | 'MARGIN')[];
  fixApi: boolean;
  otcDeskMinimum: number | null;    // USD minimum
  assetsListed: number;             // Approximate spot pairs
  riskFlags: string[];
  pros: string[];
  cons: string[];
  summary: string;
  regulatoryNote: string | null;
  bestFor: string;
  affiliateUrl: string;
  affiliateUrlSecondary?: string;
  ctaLabel: string;
  ctaLabelSecondary?: string;
  websiteUrl: string;
  keyMetrics: { label: string; value: string }[];
  regulatoryMap: Record<string, string>;
}

export const EXCHANGES: ExchangeProfile[] = [
  {
    id: 'coinbase',
    name: 'Coinbase Advanced',
    clearRateScore: 91,
    grade: 'INSTITUTIONAL',
    brandColor: '#0052FF',
    founded: 2012,
    headquarters: 'San Francisco, USA',
    fees: { spotMaker: 0.000, spotTaker: 0.0005, perpMaker: 0.000, perpTaker: 0.0003, withdrawalBTC: 0.0000 },
    regulatoryLicenses: ['NYDFS BitLicense', 'SEC Registered', 'FinCEN MSB', 'FCA (UK)', 'MAS (Singapore)', 'NASDAQ Listed: COIN'],
    custodyModel: 'THIRD_PARTY_QUALIFIED',
    insuranceCoverage: '$250M',
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 240,
    riskFlags: [],
    pros: [
      'Only exchange with SEC-filed audited financials (10-K, 10-Q)',
      'Coinbase Custody Trust: New York State chartered qualified custodian',
      'FDIC pass-through insurance on USD balances up to $250,000',
      'Coinbase Prime: institutional lending, staking, and agency execution',
      'SOC 2 Type 2 certified infrastructure',
      'Publicly traded — full corporate governance accountability'
    ],
    cons: [
      'Retail interface fees up to 1.99% — use Advanced Trade interface',
      'Derivatives suite limited compared to OKX, Bybit, Binance',
      'Asset selection restricted vs. offshore competitors',
      'Geographic restrictions on numerous tokens'
    ],
    summary: 'The most regulated US crypto exchange. Publicly listed (NASDAQ: COIN), providing audited financials unavailable from any competitor.',
    regulatoryNote: null,
    bestFor: 'US Institutional Compliance',
    affiliateUrl: 'https://coinbase.com/join/AFFILIATE',
    affiliateUrlSecondary: 'https://prime.coinbase.com/AFFILIATE',
    ctaLabel: 'Open Institutional Account',
    ctaLabelSecondary: 'Explore Coinbase Prime',
    websiteUrl: 'https://advanced.coinbase.com',
    keyMetrics: [
      { label: 'Cold Storage', value: '97%+ of assets' },
      { label: 'USD Balances', value: 'FDIC-insured' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'REGISTERED', Singapore: 'LICENSED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'kraken',
    name: 'Kraken Pro',
    clearRateScore: 89,
    grade: 'INSTITUTIONAL',
    brandColor: '#5741D9',
    founded: 2011,
    headquarters: 'San Francisco, USA',
    fees: { spotMaker: 0.000, spotTaker: 0.0010, perpMaker: 0.000, perpTaker: 0.0005, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['FinCEN MSB', 'Wyoming SPDI (Kraken Bank)', 'FCA (UK)', 'VASP (Ireland, EU)', 'AUSTRAC (Australia)', 'FINTRAC (Canada)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 250,
    riskFlags: [],
    pros: [
      'Wyoming SPDI bank charter — only crypto exchange with US bank-equivalent status',
      '13+ year operational track record, zero major security incidents',
      'PoR audited by Armanino LLP quarterly',
      'Kraken OTC desk for institutional block execution',
      'Multi-jurisdictional licensing across US, EU, UK, Canada, Australia',
      'FIX API and institutional sub-account structure'
    ],
    cons: [
      'US derivatives product restricted vs. offshore competitors',
      'Fewer altcoins than Binance or KuCoin',
      'No crime insurance figure publicly disclosed',
      'Customer support response criticized during peak volatility periods'
    ],
    summary: 'Kraken delivers an unparalleled security track record backed by a Wyoming SPDI bank charter.',
    regulatoryNote: null,
    bestFor: 'Best Security Record + Bank Charter',
    affiliateUrl: 'https://kraken.com/AFFILIATE',
    affiliateUrlSecondary: 'https://kraken.com/otc/AFFILIATE',
    ctaLabel: 'Open Kraken Pro Account',
    ctaLabelSecondary: 'Contact OTC Desk',
    websiteUrl: 'https://pro.kraken.com',
    keyMetrics: [
      { label: 'Custody', value: 'Geographically distributed' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    clearRateScore: 86,
    grade: 'INSTITUTIONAL',
    brandColor: '#00DCFA',
    founded: 2014,
    headquarters: 'New York, USA',
    fees: { spotMaker: 0.000, spotTaker: 0.0003, perpMaker: 0.000, perpTaker: 0.0002, withdrawalBTC: 0.00000 },
    regulatoryLicenses: ['NYDFS BitLicense', 'NYDFS Trust Company Charter', 'SOC 2 Type 2 Certified', 'FinCEN MSB'],
    custodyModel: 'THIRD_PARTY_QUALIFIED',
    insuranceCoverage: '$200M',
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDeskMinimum: 250000,
    assetsListed: 110,
    riskFlags: ['Genesis/Gemini Earn bankruptcy (2022-2023) — resolved. Reputational damage remains.'],
    pros: [
      'Strongest custody structure: NYDFS Trust Company Charter + SOC 2 Type 2',
      'Lloyd\'s of London underwritten insurance on digital assets',
      '100% of customer assets in cold storage',
      'Monthly PoR attestation by BPM LLP',
      'Gemini Clearing: institutional-grade settlement infrastructure',
      'CCPA and SOX-adjacent compliance standards'
    ],
    cons: [
      'Genesis/Earn episode (resolved 2023) remains a reputational consideration',
      'Smallest asset selection of major US exchanges (~110 pairs)',
      'US-centric — limited international regulatory footprint',
      'Lower mid-cap and altcoin liquidity'
    ],
    summary: 'The tightest custody and compliance controls via NYDFS Trust Charter.',
    regulatoryNote: 'US derivatives only via specialized sub-accounts.',
    bestFor: 'Regulated US Custody + Institutional Infrastructure',
    affiliateUrl: 'https://gemini.com/AFFILIATE',
    ctaLabel: 'Open Gemini Institutional Account',
    ctaLabelSecondary: 'Explore Gemini Custody',
    websiteUrl: 'https://gemini.com',
    keyMetrics: [
      { label: 'Insurance', value: '$200M Lloyd\'s Syndicate' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'REGISTERED', Singapore: 'LICENSED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'binance',
    name: 'Binance',
    clearRateScore: 84,
    grade: 'PROFESSIONAL',
    brandColor: '#F0B90B',
    founded: 2017,
    headquarters: 'Dubai, UAE',
    fees: { spotMaker: 0.0010, spotTaker: 0.0010, perpMaker: -0.0001, perpTaker: 0.0005, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['Dubai VARA', 'Bahrain CBB', 'Abu Dhabi FSRA', 'Binance.US (limited US states only)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: 'SAFU Fund $1B+',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: 'LIMITED',
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 400,
    riskFlags: [
      '⚠️ DOJ settlement $4.3B (November 2023) for AML violations',
      '⚠️ Founder CZ served federal sentence — completed 2024',
      '⚠️ US institutional compliance teams: require legal sign-off before onboarding',
      '⚠️ PoR uses Merkle attestation only — not Big 4 audited'
    ],
    pros: [
      '40%+ of global spot crypto volume — deepest liquidity of any exchange',
      'Lowest effective fees with BNB discount (up to 25% reduction)',
      'Most comprehensive derivatives suite globally',
      'SAFU Fund: $1B+ self-insured emergency reserve',
      'FIX API, sub-accounts, portfolio margin for institutional traders',
      '400+ spot pairs — broadest regulated exchange selection'
    ],
    cons: [
      '$4.3B DOJ settlement (2023) — material compliance risk for regulated institutions',
      'US persons must use Binance.US — reduced assets, lower liquidity',
      'Not suitable for RIAs or investment advisers with fiduciary duty without compliance clearance',
      'PoR not third-party audited to Big 4 standard'
    ],
    summary: 'The deepest liquidity pool in cryptocurrency.',
    regulatoryNote: 'Regulatory history poses compliance hurdle for US fiduciaries.',
    bestFor: 'Deepest Global Liquidity + Derivatives',
    affiliateUrl: 'https://binance.com/AFFILIATE',
    ctaLabel: 'Trade with Best Global Liquidity',
    ctaLabelSecondary: 'Get 20% Fee Discount via BNB',
    websiteUrl: 'https://binance.com',
    keyMetrics: [
      { label: 'Daily Volume', value: '$10B+' }
    ],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'REGISTERED', Canada: 'RESTRICTED' }
  },
  {
    id: 'okx',
    name: 'OKX',
    clearRateScore: 82,
    grade: 'PROFESSIONAL',
    brandColor: '#000000',
    founded: 2017,
    headquarters: 'Seychelles / Dubai',
    fees: { spotMaker: 0.0008, spotTaker: 0.0010, perpMaker: -0.0001, perpTaker: 0.0005, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['Dubai VARA', 'Bahamas SCB', 'Malta MGA', 'EU MiCA application in progress'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 500000,
    assetsListed: 350,
    riskFlags: ['US persons excluded from all OKX products'],
    pros: [
      'Maker rebates at $100M+ monthly volume (exchange pays you)',
      'OKX Wallet: non-custodial Web3 integration natively linked to exchange',
      'Best cross-margin multi-asset perpetuals product after Binance',
      'DeFi aggregation routing built into exchange interface',
      'Expanding MiCA-compliant EU regulatory footprint'
    ],
    cons: [
      'Not available to US persons — zero workaround',
      'Brand trust lower than Coinbase/Kraken/Gemini for compliance-first institutions',
      'PoR: Merkle attestation only, not third-party audited to Big 4 standard',
      'OTC desk minimum ($500K) higher than competitors'
    ],
    summary: 'A fast-growing venue for offshore derivatives and maker rebates.',
    regulatoryNote: 'Geo-blocked entirely in US.',
    bestFor: 'Derivatives Professionals + Maker Rebates',
    affiliateUrl: 'https://okx.com/AFFILIATE',
    ctaLabel: 'Claim $10,000 Welcome Offer',
    ctaLabelSecondary: 'Open OKX Institutional',
    websiteUrl: 'https://okx.com',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'bybit',
    name: 'Bybit',
    clearRateScore: 79,
    grade: 'PROFESSIONAL',
    brandColor: '#F7A600',
    founded: 2018,
    headquarters: 'Dubai, UAE',
    fees: { spotMaker: 0.0010, spotTaker: 0.0010, perpMaker: -0.0001, perpTaker: 0.0006, withdrawalBTC: 0.00005 },
    regulatoryLicenses: ['Dubai VARA', 'Cyprus CySEC'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 300,
    riskFlags: [
      'US persons excluded',
      'Newer regulatory track record — Dubai VARA license only since 2023'
    ],
    pros: [
      'Fastest-growing derivatives exchange — $200B+ monthly derivatives volume',
      'Competitive funding rates on perpetuals vs. Binance/OKX',
      'USDC settlement option reduces USDT counterparty exposure',
      'Institutional API: FIX protocol, sub-accounts, algorithmic order types',
      'Copy trading infrastructure for strategy replication'
    ],
    cons: [
      'Not available to US persons',
      'Regulatory track record shorter than Tier 1 exchanges',
      'Spot liquidity materially lower than Binance and OKX',
      'PoR methodology less rigorous than Kraken or Coinbase'
    ],
    summary: 'Massive perpetuals liquidity for international traders.',
    regulatoryNote: null,
    bestFor: 'Derivatives-Focused Professionals (ex-US)',
    affiliateUrl: 'https://bybit.com/AFFILIATE',
    ctaLabel: 'Get Up to $30,000 Welcome Bonus',
    ctaLabelSecondary: 'Open Institutional Account',
    websiteUrl: 'https://bybit.com',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'bitstamp',
    name: 'Bitstamp',
    clearRateScore: 83,
    grade: 'INSTITUTIONAL',
    brandColor: '#00922E',
    founded: 2011,
    headquarters: 'Luxembourg',
    fees: { spotMaker: 0.000, spotTaker: 0.0003, perpMaker: 0.000, perpTaker: 0.000, withdrawalBTC: 0.00005 },
    regulatoryLicenses: ['Luxembourg CSSF (MiCA passportable)', 'FCA (UK)', 'NYDFS BitLicense', 'FinCEN MSB', 'FINTRAC', 'AUSTRAC'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 85,
    riskFlags: ['2015 security incident ($5M lost) — recovered and remediated. Zero incidents since.'],
    pros: [
      '13+ year operational track record — longest of any ranked exchange',
      'CSSF Luxembourg license provides EU-wide MiCA-ready passportable access',
      'Acquired by Robinhood Markets (NASDAQ: HOOD) in 2024',
      'ISO 27001 certified security management system',
      'Multi-jurisdictional licensing: US, EU, UK, Canada, Australia',
      'FIX API institutional access'
    ],
    cons: [
      'Only 85 spot pairs — focused on major assets only',
      'Limited liquidity on anything outside BTC, ETH, major stablecoins',
      'Minimal derivatives offering — primarily a spot exchange',
      'UI/UX dated compared to modern institutional platforms'
    ],
    summary: 'Europe\'s oldest and most legally compliant exchange.',
    regulatoryNote: null,
    bestFor: 'European Institutional Clients + Longest Track Record',
    affiliateUrl: 'https://bitstamp.net/AFFILIATE',
    ctaLabel: "Trade on Europe's Most Regulated Exchange",
    websiteUrl: 'https://bitstamp.net',
    keyMetrics: [],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'N/A', Singapore: 'N/A', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'dydx',
    name: 'dYdX',
    clearRateScore: 76,
    grade: 'PROFESSIONAL',
    brandColor: '#6966FF',
    founded: 2017,
    headquarters: 'Decentralized Protocol',
    fees: { spotMaker: 0.000, spotTaker: 0.000, perpMaker: -0.0001, perpTaker: 0.0003, withdrawalBTC: 0.000 },
    regulatoryLicenses: ['Decentralized protocol', 'dYdX Foundation: Swiss non-profit'],
    custodyModel: 'SELF_CUSTODY',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDeskMinimum: null,
    assetsListed: 65,
    riskFlags: [
      'Smart contract risk replaces counterparty risk',
      'US persons geofenced per dYdX protocol terms',
      'Perpetuals only — no spot market, no fiat on-ramp'
    ],
    pros: [
      'Zero exchange counterparty risk — FTX-style collapse structurally impossible',
      'Lowest perpetual fees of any major venue (0.03% taker)',
      'All positions publicly verifiable on-chain',
      'dYdX Chain: Cosmos-based sovereign order book',
      'DYDX token staking provides additional fee reduction',
      'No KYC requirement'
    ],
    cons: [
      'Perpetuals only — no spot trading, no fiat on-ramp',
      'Smart contract vulnerabilities represent the primary risk vector',
      'Lower liquidity than Binance/OKX on illiquid pairs',
      'Crypto-native onboarding required — not beginner friendly',
      'No institutional reporting or compliance tooling'
    ],
    summary: 'The bleeding edge of non-custodial persistent trading infrastructure.',
    regulatoryNote: 'US IP addresses blocked entirely.',
    bestFor: 'Non-Custodial Perpetuals + Zero Counterparty Risk',
    affiliateUrl: 'https://dydx.exchange/AFFILIATE',
    ctaLabel: 'Trade Perpetuals Without Custody Risk',
    websiteUrl: 'https://dydx.exchange',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'kucoin',
    name: 'KuCoin',
    clearRateScore: 67,
    grade: 'ACTIVE_TRADER',
    brandColor: '#23AF91',
    founded: 2017,
    headquarters: 'Seychelles',
    fees: { spotMaker: 0.000, spotTaker: 0.0008, perpMaker: -0.0001, perpTaker: 0.0006, withdrawalBTC: 0.00005 },
    regulatoryLicenses: ['Seychelles FSA', 'Various VASP registrations'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: null,
    assetsListed: 700,
    riskFlags: [
      '⚠️ HIGH RISK: DOJ indictment of founders for AML violations (March 2024)',
      '⚠️ Operating under new management following founder indictment',
      '⚠️ NOT recommended for regulated institutional mandates',
      '⚠️ US persons prohibited'
    ],
    pros: [
      'Widest altcoin selection of any major exchange (700+ pairs)',
      'KuCoin Earn: flexible and fixed-term yield products',
      'Built-in trading bot infrastructure',
      'Competitive futures and margin rates',
      'Active listing of new projects'
    ],
    cons: [
      'DOJ indictment of founders (2024) — highest regulatory risk',
      'US persons prohibited',
      'Weakest regulatory standing of any exchange',
      'PoR auditor quality below institutional standard',
      'Not suitable for compliance-constrained mandates'
    ],
    summary: 'Vast altcoin selection but carries significant regulatory baggage.',
    regulatoryNote: 'Founders under US federal indictment as of 2024.',
    bestFor: 'Altcoin Access',
    affiliateUrl: 'https://kucoin.com/AFFILIATE',
    ctaLabel: 'Access 700+ Altcoin Markets',
    websiteUrl: 'https://kucoin.com',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    clearRateScore: 71,
    grade: 'ACTIVE_TRADER',
    brandColor: '#00FF94',
    founded: 2023,
    headquarters: 'Decentralized Protocol',
    fees: { spotMaker: 0.00010, spotTaker: 0.00025, perpMaker: -0.0001, perpTaker: 0.00025, withdrawalBTC: 0.000 },
    regulatoryLicenses: ['Decentralized protocol'],
    custodyModel: 'SELF_CUSTODY',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDeskMinimum: null,
    assetsListed: 120,
    riskFlags: [
      'Operational since 2023 — limited track record',
      'Smart contract and infrastructure risk elevated vs. battle-tested protocols',
      'No fiat on-ramp — crypto-native onboarding only',
      'No institutional reporting or compliance tooling',
      'US persons geofenced'
    ],
    pros: [
      'Lowest perpetual fees of any venue globally (0.025% taker)',
      'Fully on-chain with real-time settlement',
      'Self-custody throughout trading lifecycle',
      '$100B+ monthly volume milestone crossed',
      'HYPE token provides additional fee reduction',
      'HyperBFT consensus: purpose-built for order book throughput'
    ],
    cons: [
      'Launched 2023 — limited operational track record',
      'Smart contract audit history limited relative to mature protocols',
      'Asset selection narrower than Binance/OKX',
      'No fiat on-ramp — must bring crypto from another venue',
      'No institutional compliance infrastructure'
    ],
    summary: 'The fastest growing orderbook-based perpetual DEX.',
    regulatoryNote: 'Geo-blocked in the US.',
    bestFor: 'Lowest Fees in Market',
    affiliateUrl: 'https://app.hyperliquid.xyz/AFFILIATE',
    ctaLabel: 'Trade at 0.025% — Lowest Fees in Market',
    websiteUrl: 'https://hyperliquid.xyz',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  }
];

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

export const REGIONS = ['US', 'EU', 'UK', 'UAE', 'Singapore', 'Australia', 'Canada'];
