import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, ArrowLeft, Clock, Share2, BookmarkPlus, Globe, Shield, Building2 } from 'lucide-react';
import { TargetIcon } from '../components/AnimatedIcons';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = ['All', 'Sovereignty', 'Regulation', 'Institutions', 'Markets', 'Geopolitics', 'Africa'];

export interface Article {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  readTime: string;
  date: string;
  image: string;
  desc: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export const ARTICLES: Article[] = [
  {
    id: 'cross-border-portability',
    title: 'Cross-Border Asset Portability in Conflict Zones',
    category: 'Geopolitics',
    readTime: '12 min read',
    date: 'March 24, 2026',
    image: '/cross-border-featured.png',
    desc: 'Hardware wallets plus seed phrase backup eliminates exchange dependency. Explore how traditional wealth storage fails during geopolitical instability.',
    content: (
      <>
        <p className="text-xl text-text-muted mb-8 italic">
          The Jurisdictional Trap: Traditional wealth storage fails during geopolitical instability.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Three Critical Barriers to Mobility</h2>
        
        <h3 className="text-xl font-bold mt-6 mb-2 text-primary">1. Physical constraints:</h3>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li><strong>Cash:</strong> Detection risk at borders, currency controls, confiscation.</li>
          <li><strong>Gold:</strong> Weight, security screening, import duties.</li>
          <li><strong>Real estate:</strong> Illiquid, immovable, subject to seizure.</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-2 text-primary">2. Banking system vulnerabilities:</h3>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Account freezes during political transitions.</li>
          <li>SWIFT disconnection (Russia 2022, Iran 2018).</li>
          <li>Correspondent banking restrictions.</li>
          <li>Capital controls emerge rapidly (Cyprus 2013, Lebanon 2019).</li>
        </ul>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/cross-border-2.png" alt="Letter of Credit Rejected" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Trade finance breakdown: Letters of credit are often the first casualty of banking restrictions.
           </div>
        </div>

        <h3 className="text-xl font-bold mt-6 mb-2 text-primary">3. Time sensitivity:</h3>
        <ul className="list-disc pl-5 mb-8 space-y-2">
          <li><strong>Bank wire transfers:</strong> 1-5 business days.</li>
          <li><strong>International checks:</strong> 7-14 days.</li>
          <li><strong>Property liquidation:</strong> weeks to months.</li>
          <li className="text-red-400 font-medium">Conflict escalates faster than asset mobility.</li>
        </ul>

        <div className="my-10 p-6 bg-surface border border-border rounded-xl">
           <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><TargetIcon className="w-5 h-5 text-primary" /> Case study: Ukraine 2022</h3>
           <p className="text-sm">Ukrainian government received $100M+ in crypto donations within 48 hours of invasion. Citizens used crypto to:</p>
           <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-text-muted">
              <li>Convert hryvnia before currency collapse</li>
              <li>Receive remittances from abroad</li>
              <li>Pay for border crossing services</li>
              <li>Purchase supplies in neighboring countries</li>
           </ul>
           <p className="text-sm mt-3 border-t border-border pt-3">
              <strong>Contrast with traditional banking:</strong> ATMs emptied, card networks disrupted, international transfers delayed weeks.
           </p>
        </div>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/cross-border-1.png" alt="Empty Supermarket Shelves" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              System shocks: Supply chain collapses outpace traditional banking mobility in conflict zones.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">The Crypto Solution: Self-Custody</h2>
        <p className="mb-4">Bitcoin and Ethereum enable borderless wealth transfer through cryptographic keys, not physical possession.</p>
        
        <h3 className="text-xl font-bold mt-6 mb-2 text-text">The Exchange Jurisdiction Problem</h3>
        <p className="mb-4">
           Centralized exchanges (Coinbase, Binance, Kraken) introduce regulatory dependencies that negate crypto's portability advantage. Geographic compliance variation poses severe risks when crossing borders.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
           <div className="p-5 bg-background border border-border rounded-lg">
              <h4 className="font-bold text-red-400 mb-2">Turkey Example</h4>
              <ul className="text-sm text-text-muted space-y-2 list-none">
                 <li><span className="text-text font-medium">Enhanced KYC:</span> Proof of address, tax ID, biometric</li>
                 <li><span className="text-text font-medium">Caps:</span> $5,000 daily withdrawals</li>
                 <li><span className="text-text font-medium">Reporting:</span> &gt;$1,500 flagged to authorities</li>
                 <li><span className="text-text font-medium">Delays:</span> 3-7 days for international</li>
              </ul>
           </div>
           <div className="p-5 bg-background border border-border rounded-lg">
              <h4 className="font-bold text-emerald-400 mb-2">UAE Example</h4>
              <ul className="text-sm text-text-muted space-y-2 list-none">
                 <li><span className="text-text font-medium">Minimal KYC:</span> ID and selfie sufficient</li>
                 <li><span className="text-text font-medium">Limits:</span> $100,000+ daily withdrawals</li>
                 <li><span className="text-text font-medium">Speed:</span> &lt;24 hours processing</li>
                 <li><span className="text-text font-medium">Tax:</span> No capital gains tax</li>
              </ul>
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Risk Matrix Analysis</h2>
        <div className="leather-card p-6 rounded-xl mb-10 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                 <thead>
                    <tr className="border-b border-border text-text-muted">
                       <th className="py-3 pr-4 font-medium uppercase text-xs">Scenario</th>
                       <th className="py-3 px-4 font-medium uppercase text-xs">Cash/Gold</th>
                       <th className="py-3 px-4 font-medium uppercase text-xs">Bank Account</th>
                       <th className="py-3 px-4 font-medium uppercase text-xs">Crypto (Exchange)</th>
                       <th className="py-3 pl-4 font-medium uppercase text-xs">Crypto (Self-Custody)</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">Border Confiscation</td>
                       <td className="py-3 px-4 text-red-400">High</td>
                       <td className="py-3 px-4 text-green-400">Low</td>
                       <td className="py-3 px-4 text-green-400">None</td>
                       <td className="py-3 pl-4 text-green-400">None</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">Account Freeze</td>
                       <td className="py-3 px-4 text-text-muted">N/A</td>
                       <td className="py-3 px-4 text-red-400">High</td>
                       <td className="py-3 px-4 text-red-400">High</td>
                       <td className="py-3 pl-4 text-green-400">None</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">Access Delay</td>
                       <td className="py-3 px-4 text-green-400">None</td>
                       <td className="py-3 px-4 text-amber-400">Medium</td>
                       <td className="py-3 px-4 text-red-400">High</td>
                       <td className="py-3 pl-4 text-green-400">None</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">Volatility Risk</td>
                       <td className="py-3 px-4 text-amber-400">Low-Med</td>
                       <td className="py-3 px-4 text-green-400">Low</td>
                       <td className="py-3 px-4 text-red-400">High</td>
                       <td className="py-3 pl-4 text-red-400">High</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </>
    )
  },
  {
    id: 'africa-crypto-infrastructure',
    title: "Africa's Crypto Infrastructure: From Grassroots Utility to Regulated Markets",
    category: 'Geopolitics',
    tags: ['Africa'],
    readTime: '14 min read',
    date: 'April 10, 2026',
    image: '/africa-crypto-featured.png',
    desc: 'Sub-Saharan Africa is the third fastest-growing crypto region globally, driven by infrastructure needs, financial inclusion, and FX stability.',
    icon: <Globe className="text-emerald-400" size={24} />,
    content: (
      <>
        <p className="text-xl text-text-muted mb-8 italic">
          Infrastructure-Driven Adoption: How African markets are building financial utility from the bottom up.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Scale and Context</h2>
        <p className="mb-6">
          Sub-Saharan Africa received $205B in on-chain value in the 12 months to June 2025 — a 52% YoY increase, making it the third fastest-growing crypto region globally behind APAC and Latin America.
        </p>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/africa-crypto-featured.png" alt="Africa Crypto Infrastructure" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Digital Finance Evolution: Stylized visualization of Africa's emerging crypto infrastructure and cross-border nodes.
           </div>
        </div>

        <div className="leather-card p-6 rounded-xl mb-10 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                 <thead>
                    <tr className="border-b border-border text-text-muted">
                       <th className="py-3 pr-4 font-medium uppercase text-xs">Region</th>
                       <th className="py-3 px-4 font-medium uppercase text-xs">YoY Growth</th>
                       <th className="py-3 px-4 font-medium uppercase text-xs">On-Chain Value</th>
                       <th className="py-3 pl-4 font-medium uppercase text-xs">Primary Driver</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">APAC</td>
                       <td className="py-3 px-4">69%</td>
                       <td className="py-3 px-4">$2.36T</td>
                       <td className="py-3 pl-4 text-text-muted">Retail + Inst. Innovation</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">Latin America</td>
                       <td className="py-3 px-4">63%</td>
                       <td className="py-3 px-4">—</td>
                       <td className="py-3 pl-4 text-text-muted">Remittances, Inflation Hedge</td>
                    </tr>
                    <tr className="border-b border-border/50 bg-primary/5">
                       <td className="py-3 pr-4 font-bold text-primary">Sub-Saharan Africa</td>
                       <td className="py-3 px-4 font-bold">52%</td>
                       <td className="py-3 px-4 font-bold">$205B</td>
                       <td className="py-3 pl-4 font-bold">Financial Inclusion, FX Stability</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                       <td className="py-3 pr-4 font-medium">MENA</td>
                       <td className="py-3 px-4">33%</td>
                       <td className="py-3 px-4">$500B+</td>
                       <td className="py-3 pl-4 text-text-muted">Wealth Management</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Macro Catalyst: Currency Devaluation</h2>
        <p className="mb-4">
          Nigeria serves as the primary case study. Between May 2023 and February 2024, the Naira lost over 200% of its value against the USD, driving immediate adoption of stablecoins as a store of value — not for speculation, but for capital preservation.
        </p>

        <div className="my-8 p-6 bg-surface border border-border rounded-xl">
           <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><TargetIcon className="w-5 h-5 text-primary" /> Devaluation Engine</h3>
           <p className="text-sm">When a domestic currency devalues, three distinct phases occur:</p>
           <ul className="list-disc pl-5 mt-4 space-y-2 text-sm text-text-muted">
              <li><strong>Hedged Entry:</strong> New users enter to preserve existing savings.</li>
              <li><strong>Accumulation:</strong> Existing users accelerate stablecoin holdings.</li>
              <li><strong>Volume Spike:</strong> Exchange volumes decouple from global market trends.</li>
           </ul>
        </div>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/africa-market-growth.png" alt="Africa Market Growth" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Market Dynamics: Visualizing the shift from traditional banking to stablecoin-based commerce in Nigeria and Kenya.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Regulatory Landscape: A Divergent Map</h2>
        <h3 className="text-xl font-bold mt-6 mb-2 text-primary">Mature Frameworks: Mauritius & South Africa</h3>
        <p className="mb-6">Mauritius offers the most structured licensing under the VAITOS Act (2021), while South Africa has approved 138 CASP licenses as of mid-2024, including VALR and Luno.</p>

        <div className="overflow-x-auto mb-10">
           <table className="w-full text-sm text-left border-collapse bg-surface border border-border rounded-xl overflow-hidden">
              <thead>
                 <tr className="bg-white/5 border-b border-border text-xs uppercase tracking-wider">
                    <th className="p-4">License Type</th>
                    <th className="p-4">Service Scope</th>
                    <th className="p-4 text-right">Min. Capital (MUR)</th>
                 </tr>
              </thead>
              <tbody>
                 <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">Class M</td>
                    <td className="p-4 text-text-muted">Broker-Dealer</td>
                    <td className="p-4 text-right">2,000,000</td>
                 </tr>
                 <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">Class R</td>
                    <td className="p-4 text-text-muted">Custodial Services</td>
                    <td className="p-4 text-right">5,000,000</td>
                 </tr>
                 <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">Class S</td>
                    <td className="p-4 text-text-muted">Exchange Operations</td>
                    <td className="p-4 text-right">6,500,000</td>
                 </tr>
              </tbody>
           </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Exchange Ecosystem: Global vs. Local</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="p-6 bg-background border border-border rounded-xl">
              <h4 className="font-bold text-primary mb-3">Global Dominance</h4>
              <p className="text-sm text-text-muted">Binance holds the majority market share, with its P2P marketplace acting as a critical differentiator in markets with legacy banking restrictions.</p>
           </div>
           <div className="p-6 bg-background border border-border rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">Local Champions</h4>
              <p className="text-sm text-text-muted">Local exchanges like VALR and Yellow Card compete on regulatory trust, local currency integration, and 24/7 fiat settlement.</p>
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Stablecoins as the Physical Rail</h2>
        <p className="mb-6">
          While Bitcoin drives retail purchase behavior, stablecoins underpin actual commerce. Stablecoin payment volume for real economic activity reached $390B in 2025.
        </p>

        <div className="my-10 p-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
           <div className="flex items-start gap-4">
              <Shield className="text-blue-400 shrink-0 mt-1" size={24} />
              <div>
                 <h4 className="font-bold text-blue-400 mb-2">Remittance and B2B Impact</h4>
                 <p className="text-sm text-text-muted leading-relaxed italic">
                    For SMEs trading with suppliers in Asia, USDC/USDT settlement bypasses SWIFT delays entirely. For migrant workers, costs drop from 8.3% to under 1% via Polygon or Solana rails.
                 </p>
              </div>
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Fraud and Risk Trajectory</h2>
        <p className="mb-6">Fraud rates declined to 2.6% in 2025, driven by faster KYC and FATF Travel Rule compliance, but AI-enabled scams have become 4.5x more profitable.</p>
        <div className="leather-card p-6 rounded-xl mb-10 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead>
                 <tr className="border-b border-border text-text-muted text-xs uppercase font-bold">
                    <th className="py-2">Country</th>
                    <th className="py-2">2025 Fraud Rate</th>
                    <th className="py-2 text-right">YoY Change</th>
                 </tr>
              </thead>
              <tbody>
                 <tr className="border-b border-border/30">
                    <td className="py-3">Kenya</td>
                    <td className="py-2">2.5%</td>
                    <td className="py-3 text-green-400 text-right font-medium">-30%</td>
                 </tr>
                 <tr className="border-b border-border/30">
                    <td className="py-3">Nigeria</td>
                    <td className="py-3">2.6%</td>
                    <td className="py-3 text-green-400 text-right font-medium">-28%</td>
                 </tr>
                 <tr className="border-b border-border/30">
                    <td className="py-3">South Africa</td>
                    <td className="py-3">3.1%</td>
                    <td className="py-3 text-green-400 text-right font-medium">-14%</td>
                 </tr>
              </tbody>
           </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Key Takeaways for Institutional Allocators</h2>
        <ul className="space-y-4 mb-10">
           <li className="flex gap-4 p-4 bg-surface/50 border border-border rounded-lg">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">01</span>
              <p className="text-sm"><strong>Nigeria is the Market:</strong> 25% adult penetration, $92B volume, and persistent stablecoin demand.</p>
           </li>
           <li className="flex gap-4 p-4 bg-surface/50 border border-border rounded-lg">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">02</span>
              <p className="text-sm"><strong>South Africa is the Hub:</strong> 138 licensed CASPs and the continent's most mature regulatory regime.</p>
           </li>
           <li className="flex gap-4 p-4 bg-surface/50 border border-border rounded-lg">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">03</span>
              <p className="text-sm"><strong>Utility &gt; Speculation:</strong> Infrastructure adoption is denominated in USD-stablecoins, not BTC volatility.</p>
           </li>
        </ul>
      </>
    )
  },
  {
    id: 'correspondent-banking-crisis',
    title: 'The Correspondent Banking Crisis',
    category: 'Sovereignty',
    readTime: '15 min read',
    date: 'March 21, 2026',
    image: '/correspondent-1.png',
    desc: 'Why small nations cant access global finance and how crypto acts as an alternative rail.',
    icon: <Globe className="text-blue-400" size={24} />,
    content: (
      <>
        <p className="text-xl text-text-muted mb-8 italic">
          Why small nations can't access global finance and how crypto acts as an alternative rail.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">The Mechanics of Correspondent Banking</h2>
        <p className="mb-4">
          International payments require correspondent banking relationships. Small nation banks cannot directly access US dollar clearing systems.
        </p>
        
        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/correspondent-2.png" alt="Correspondent Banking Mechanics" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Fig 1: Modern correspondent banking relationships require pooled accounts.
           </div>
        </div>

        <div className="my-8 p-6 bg-surface border border-border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Typical Transaction Flow:</h3>
          <ol className="list-decimal pl-5 space-y-3 text-text-muted">
            <li>Local bank (e.g., Vanuatu) holds account at correspondent bank (JPMorgan).</li>
            <li>Customer initiates transfer.</li>
            <li>Local bank debits customer, messages correspondent.</li>
            <li>Correspondent bank executes SWIFT transfer from pooled account.</li>
            <li>Settlement occurs 1-5 business days later.</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">De-Risking: Why Banks Exit</h2>
        <p className="mb-4">Post-2008 regulatory environment shifted the risk-reward calculation. Banks are increasingly exiting emerging markets due to:</p>
        <ul className="list-disc pl-5 mb-8 space-y-3">
          <li><strong>Regulatory Penalties:</strong> Massive fines (e.g., HSBC $1.9B, Standard Chartered $1.1B) often exceed total revenue from these relationships.</li>
          <li><strong>Compliance Costs:</strong> KYC verification ($50-100/customer) and transaction monitoring ($5-15/tx) make small accounts unprofitable.</li>
          <li><strong>High-Risk Jurisdiction Factors:</strong> Weak AML enforcement, PEP prevalence, and tax haven designations.</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="p-6 bg-background border border-border rounded-xl">
            <h4 className="font-bold text-red-400 mb-3">Caribbean Critical Impact</h4>
            <ul className="text-sm space-y-2">
              <li>13 of 16 jurisdictions lost &gt;50% of relationships.</li>
              <li>Transaction costs doubled ($30 → $60).</li>
              <li>Settlement time increased by 3-5 days.</li>
              <li>40% of SMEs affected by account closures.</li>
            </ul>
          </div>
          <div className="p-6 bg-background border border-border rounded-xl">
            <h4 className="font-bold text-emerald-400 mb-3">Pacific Islands Crisis</h4>
            <ul className="text-sm space-y-2">
              <li>85% of regional banks lost correspondent access.</li>
              <li>Import costs increased by 15-25%.</li>
              <li>Export competitiveness declined significantly.</li>
              <li>GDP growth impact: -0.8 to -1.2 percentage points.</li>
            </ul>
          </div>
        </div>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/financial-exclusion-1.png" alt="Financial Exclusion Graphic" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Fig 2: Financial exclusion driven by strict compliance.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Crypto as the Alternative Rail</h2>
        <p className="mb-6">Stablecoins and decentralized protocols are filling the gap left by traditional banking exits.</p>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm text-left border-collapse bg-surface border border-border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/5 border-b border-border">
                <th className="p-4">Method</th>
                <th className="p-4">Fee</th>
                <th className="p-4">FX Spread</th>
                <th className="p-4">Settlement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Western Union</td>
                <td className="p-4">$15</td>
                <td className="p-4">3.5%</td>
                <td className="p-4">1-3 days</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Bank Wire</td>
                <td className="p-4">$45</td>
                <td className="p-4">2.0%</td>
                <td className="p-4">3-5 days</td>
              </tr>
              <tr className="text-primary font-bold">
                <td className="p-4">USDC (Polygon)</td>
                <td className="p-4">&lt;$0.01</td>
                <td className="p-4">0.5%</td>
                <td className="p-4">2 min</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 text-text">CBDC Infrastructure: mBridge</h3>
        <p className="mb-4">
          The mBridge project (China, Hong Kong, Thailand, UAE, Saudi Arabia) enables direct central bank-to-central bank settlement, bypassing commercial correspondents entirely.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-text-muted">
          <li><strong>Volume:</strong> $22B in test transactions.</li>
          <li><strong>Cost:</strong> 90% reduction vs. SWIFT.</li>
          <li><strong>Timeline:</strong> Production deployment expected 2025-2027.</li>
        </ul>
      </>
    )
  },
  {
    id: 'capital-controls-playbook',
    title: 'Capital Controls Playbook: How Governments Trap Wealth',
    category: 'Regulation',
    readTime: '20 min read',
    date: 'March 25, 2026',
    image: '/capital-controls-1.png',
    desc: 'Understanding currency exchange restrictions, bank rationing, and evasion methods in distressed economies.',
    icon: <Shield className="text-emerald-400" size={24} />,
    content: (
      <>
        <p className="text-xl text-text-muted mb-8 italic">
          How governments use conversion limits and bank rationing to prevent capital flight.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Control Mechanisms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 bg-surface border border-border rounded-xl">
             <h3 className="font-bold text-primary mb-3">Currency Restrictions</h3>
             <ul className="text-sm space-y-2 text-text-muted">
                <li><strong>Argentina (2019):</strong> $200/month USD limit.</li>
                <li><strong>Lebanon (2019):</strong> Unofficial $3,000/month withdrawal cap.</li>
                <li><strong>Venezuela:</strong> Complete FX market shutdown.</li>
             </ul>
          </div>
          <div className="p-5 bg-surface border border-border rounded-xl">
             <h3 className="font-bold text-primary mb-3">Capital Flow Restrictions</h3>
             <ul className="text-sm space-y-2 text-text-muted">
                <li><strong>China (2016):</strong> Banned overseas real estate purchases &gt;$50K.</li>
                <li><strong>Russia (2022):</strong> 80% export revenue must convert to rubles.</li>
                <li><strong>Iceland (2008):</strong> Prohibited foreign currency conversion entirely.</li>
             </ul>
          </div>
        </div>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/capital-controls-2.png" alt="Control Mechanisms Illustration" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Visualizing the choke points of currency control.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">The "Corralito" Case Study: Argentina 2001</h2>
        <p className="mb-4">Wealth destruction manifested through a series of escalating measures:</p>
        <ol className="list-decimal pl-5 space-y-3 mb-8">
          <li><strong>Withdrawal Limit:</strong> $250/week initial restriction.</li>
          <li><strong>Frozen Deposits:</strong> Bank accounts locked entirely 3 weeks later.</li>
          <li><strong>Forced Conversion:</strong> USD deposits converted to pesos at 1.4:1 while market rates were 3:1.</li>
        </ol>
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl mb-10">
           <h4 className="font-bold text-red-400 mb-2">Resulting Wealth Destruction:</h4>
           <p className="text-sm">Middle class savings lost 60-70% in dollar terms. Real estate prices plummeted 50% in USD terms within two years.</p>
        </div>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/wealth-trap-1.png" alt="Wealth Destruction" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Middle class savings impacts after aggressive devaluation.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Early Warning Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
           <div className="p-4 bg-background border border-border rounded-lg text-center">
              <div className="text-xs text-text-muted uppercase font-bold mb-1">FX Reserves</div>
              <div className="text-xl font-bold text-red-400">&lt;3 Months</div>
              <div className="text-[10px] text-text-muted">Import Cover</div>
           </div>
           <div className="p-4 bg-background border border-border rounded-lg text-center">
              <div className="text-xs text-text-muted uppercase font-bold mb-1">Parallel Spread</div>
              <div className="text-xl font-bold text-amber-400">&gt;20%</div>
              <div className="text-[10px] text-text-muted">Signal Heightened Risk</div>
           </div>
           <div className="p-4 bg-background border border-border rounded-lg text-center">
              <div className="text-xs text-text-muted uppercase font-bold mb-1">Deposit Flight</div>
              <div className="text-xl font-bold text-red-500">&gt;15%</div>
              <div className="text-[10px] text-text-muted">Monthly Decline</div>
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Mitigation Strategies</h2>
        <p className="mb-6">Portfolio robustness requires jurisdictional diversification and asset class rotation.</p>
        <ul className="list-disc pl-5 space-y-3 text-text-muted mb-10">
           <li><strong>Tiered Accounts:</strong> Primary (Domestic), Secondary (Regional Center - UAE), Tertiary (Major Center - CH/US).</li>
           <li><strong>Self-Custody Crypto:</strong> Stablecoins (USDC) for 24-hour liquidity outside the banking system.</li>
           <li><strong>Hard Assets:</strong> Gold in allocated storage (Zurich/London), Art, and liquid Real Estate (Dubai/Miami).</li>
        </ul>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/mitigation-strategies-1.png" alt="Diversification Strategy" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Tiered accounts and hard assets offer robust diversification.
           </div>
        </div>
      </>
    )
  },
  {
    id: 'stablecoin-regulation',
    title: 'Stablecoin Regulation: The Three Jurisdictional Models',
    category: 'Regulation',
    readTime: '12 min read',
    date: 'March 26, 2026',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2070&auto=format&fit=crop',
    desc: 'US state-by-state licensing vs EU MiCA vs Offshore Caymans models.',
    icon: <Shield className="text-emerald-400" size={24} />,
    content: (
      <>
        <p className="text-xl text-text-muted mb-8 italic">
          Regulatory Arbitrage: How different jurisdictions are competing to become the global hub for digital dollars.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">The Great Regulatory Divergence</h2>
        <p className="mb-6">
          While stablecoins have reached a market cap of over $150 billion, the legal framework governing them remains fragmented. We currently see three distinct models emerging globally.
        </p>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/stablecoin-disconnected.png" alt="Regulatory Landscape" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Figure 1: The gap between traditional finance networks and new digital hubs.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">1. The US Model: State-by-State Fragmentation</h2>
        <p className="mb-4">
          The United States currently lacks a unified federal framework for stablecoins. Instead, it relies on a patchwork of state-level money transmitter licenses (MTLs) and limited-purpose trust charters.
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-text-muted">
           <li><strong>NYDFS BitLicense:</strong> The "Gold Standard" but notoriously difficult and expensive to obtain.</li>
           <li><strong>SEC Uncertainty:</strong> Ongoing debate over whether algorithmic or certain yield-bearing stablecoins constitute securities.</li>
           <li><strong>FED Oversight:</strong> Proposed legislation aims to bring non-bank issuers under federal supervision similar to commercial banks.</li>
        </ul>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/stablecoin-transfer.png" alt="USDC Transfer Diagram" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              USDC remains the dominant regulated dollar representation in US markets.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">2. The EU Model: MiCA (Markets in Crypto-Assets)</h2>
        <p className="mb-4">
          The European Union has taken the lead with the most comprehensive framework to date. MiCA provides a "passportable" license that allows issuers to operate across all 27 member states.
        </p>
        <div className="my-8 p-6 bg-surface border-l-4 border-primary rounded-r-xl">
           <h4 className="font-bold mb-2">Key MiCA Pillars for Stablecoins:</h4>
           <ul className="text-sm space-y-2 text-text-muted list-none">
              <li><span className="text-text font-medium">Reserve Ratios:</span> 1:1 liquid reserve requirement with 60% in cash at independent banks.</li>
              <li><span className="text-text font-medium">Yield Ban:</span> Issuers are strictly prohibited from offering interest on stablecoin holdings.</li>
              <li><span className="text-text font-medium">Transaction Caps:</span> Limits on non-euro denominated stablecoins for domestic payments (200M EUR/day).</li>
           </ul>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">3. The Offshore Model: Arbitrage and Innovation</h2>
        <p className="mb-6">
          Jurisdictions like the Cayman Islands, BVI, and Bahamas continue to dominate in terms of volume through Tether (USDT), favoring a "light-touch" approach that prioritizes liquidity over strict prudential oversight.
        </p>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl relative">
           <img src="/stablecoin-blocked.png" alt="Blocked Transfer Risk" className="w-full h-auto object-cover" />
           <div className="absolute top-0 right-0 p-3">
              <span className="px-3 py-1 bg-red-500/90 text-text text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-md">Compliance Risk</span>
           </div>
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Account freezes are 4x more likely in jurisdictions with non-standardized AML protocols.
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Conclusion: The Convergence toward "Safe Assets"</h2>
        <p className="mb-4">
          As institutional adoption scales, the market is voting for transparency. We expect a natural convergence where the majority of global trade will eventually settle on MiCA-compliant or US federal-authorized rails.
        </p>
        
        <div className="mt-12 p-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
              <Shield size={24} /> Institutional Outlook 2027
           </h3>
           <p className="text-sm italic text-text-muted">
              "The next phase of stablecoin evolution will be the 'tokenization of bank deposits' where traditional banks issue their own liabilities on-chain, effectively merging the speed of crypto with the safety of a banking charter."
           </p>
        </div>
      </>
    )
  },
  {
    id: 'pension-funds-bitcoin',
    title: "Why Pension Funds Can't Allocate to Bitcoin (Yet)",
    category: 'Institutions',
    readTime: '15 min read',
    date: 'March 26, 2026',
    image: '/pension-risk-report.png',
    desc: 'Fiduciary constraints, qualified custodian requirements, and accounting treatment blockers.',
    icon: <Building2 className="text-amber-400" size={24} />,
    content: (
      <>
        <p className="text-xl text-text-muted mb-8 italic">
          Institutional Inertia: Why the world's largest pools of capital are stuck in "wait-and-see" mode despite clear market demand.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">The Trillion-Dollar Question</h2>
        <p className="mb-6">
          While retail and corporate treasuries have begun their migration toward digital assets, pension funds—representing over $50 trillion in global assets—remain largely on the sidelines. The barriers are not ideological; they are structural, legal, and operational.
        </p>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
           <img src="/pension-policy-doc.png" alt="Investment Policy Document" className="w-full h-auto object-cover" />
           <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
              Most Investment Policy Statements (IPS) still categorize Bitcoin as a "Non-Permissible Asset."
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">1. Fiduciary Duty and the "Prudent Man" Rule</h2>
        <p className="mb-4">
          Pension fund trustees are bound by strict fiduciary duties. Under the "Prudent Man Rule," an investment must be what a "prudent person" would do with their own money. Without a long-term track record (20+ years) and high-quality institutional research, allocating to Bitcoin is often viewed as a breach of duty.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
           <div className="p-6 bg-surface border border-border rounded-xl">
              <h4 className="font-bold text-primary mb-2">Legal Liability</h4>
              <p className="text-sm text-text-muted">Trustees face personal liability for losses deemed "reckless." Unlike hedge funds, pension funds prioritize capital preservation over alpha generation.</p>
           </div>
           <div className="p-6 bg-surface border border-border rounded-xl">
              <h4 className="font-bold text-primary mb-2">Consultant Dominance</h4>
              <p className="text-sm text-text-muted">Funds rely on consultants (Mercer, Aon, Willis Towers Watson) who have yet to issue blanket "Buy" recommendations for crypto-assets.</p>
           </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">2. The Qualified Custodian Gap</h2>
        <p className="mb-4">
          The SEC's "Custody Rule" requires registered investment advisers to hold client funds with a "qualified custodian." While several crypto-native firms (Coinbase Custody, Fidelity Digital Assets) now fit this description, the insurance coverage remains a major blocker.
        </p>
        
        <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="rounded-xl overflow-hidden border border-border">
              <img src="/pension-vault-comparison.png" alt="Custody Vaults" className="w-full h-[250px] object-cover" />
           </div>
           <div className="rounded-xl overflow-hidden border border-border">
              <img src="/pension-insurance-gap.png" alt="Insurance Gap Chart" className="w-full h-[250px] object-cover" />
           </div>
        </div>

        <ul className="list-disc pl-5 mb-8 space-y-3 text-text-muted">
           <li><strong>Inadequate Limits:</strong> Standard insurance policies for digital assets rarely exceed $500M—insignificant for a fund looking to allocate $2B-$5B.</li>
           <li><strong>Proof of Reserves:</strong> Institutional auditors require real-time, third-party verified proof of assets which many custodians are still perfecting.</li>
           <li><strong>Separation of Duties:</strong> Traditional finance requires a separation between the broker and the custodian. Most crypto firms are vertically integrated, creating a conflict of interest.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">3. Accounting Treatment: The Impairment Trap</h2>
        <p className="mb-6">
          Until recently, GAAP rules required Bitcoin to be treated as an "indefinite-lived intangible asset." This meant companies had to write down the value if the price dropped (impairment), but could not write it up if the price rose.
        </p>

        <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-lg">
           <img src="/pension-volatility-graph.png" alt="Accounting Volatility" className="w-full h-auto object-cover" />
        </div>

        <div className="p-6 bg-background border border-border rounded-xl mb-8">
           <h4 className="font-bold text-amber-400 mb-2">The FASB Breakthrough (2025/2026)</h4>
           <p className="text-sm text-text-muted mb-4">
              The shift toward "Fair Value Accounting" is the single biggest catalyst for adoption. Funds can now show gains and losses in real-time on their income statements, matching the treatment of other financial assets.
           </p>
           <img src="/pension-impairment-accounting.png" alt="Accounting Comparison" className="w-full h-auto rounded-lg" />
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Conclusion: The Gradual Dawn of Institutional Adoption</h2>
        <p className="mb-8">
          The "Wait and See" approach is slowly transitioning to "How and When." As the regulatory fog clears and accounting standards modernize, we expect the first wave of major state pension funds to begin 0.5% - 1.0% allocations by late 2026.
        </p>
      </>
    )
  }
];

export const Insights: React.FC = () => {
  const { addToast } = useAppContext();
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL Hash for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const hashId = window.location.hash.replace('#', '');
        const validArticle = ARTICLES.find(a => a.id === hashId);
        if (validArticle) {
          setActiveArticleId(hashId);
        }
      }
    };
    
    // Initial check
    handleHashChange();
    
    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeArticle = ARTICLES.find(a => a.id === activeArticleId);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeArticleId]);

  const handleBackToList = () => {
    setActiveArticleId(null);
    history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  if (activeArticle) {
    return (
      <div className="animate-fade-in max-w-[800px] mx-auto pb-16">
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold group mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Insights
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 text-xs font-bold text-text-muted tracking-wider uppercase mb-4">
            <span className="text-primary">{activeArticle.category}</span>
            <span>•</span>
            <span>{activeArticle.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {activeArticle.readTime}</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
            {activeArticle.title}
          </h1>
          
          <div className="flex items-center justify-between py-6 border-y border-border mb-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  RT
               </div>
               <div>
                  <div className="font-bold text-sm">Coinvestopedia Research Team</div>
                  <div className="text-xs text-text-muted">Institutional Strategy</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-2 border border-border rounded-lg text-text-muted hover:text-primary transition-colors"><BookmarkPlus size={18} /></button>
               <button className="p-2 border border-border rounded-lg text-text-muted hover:text-primary transition-colors"><Share2 size={18} /></button>
            </div>
          </div>
        </div>

        <article className="prose prose-invert max-w-none text-text leading-relaxed">
          {activeArticle.content}
        </article>

        {/* Newsletter Callout */}
        <div className="mt-16 p-8 bg-surface border border-primary/20 rounded-2xl text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
           </div>
           <h3 className="text-2xl font-bold mb-3">Subscribe to Institutional Research</h3>
           <p className="text-text-muted mb-6 max-w-lg mx-auto">
              Join 15,000+ institutional allocators receiving our weekly market intelligence.
           </p>
           <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your work email" className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-sm" />
              <Button>Get Intelligence</Button>
           </div>
        </div>
      </div>
    );
  }

  const filteredArticles = ARTICLES.filter(a => {
    const matchesCategory = activeCategory === 'All' || 
                          a.category === activeCategory || 
                          (a.tags && a.tags.includes(activeCategory));
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = ARTICLES[0];
  const listArticles = filteredArticles.filter(a => a.id !== featuredArticle.id);

  return (
    <div className="animate-fade-in space-y-10 lg:space-y-14 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16 mb-12 lg:mb-20 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <TargetIcon className="w-4 h-4" />
            <span>Institutional Research Hub</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Insights</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            In-depth analysis of market structure, geopolitical impacts, and regulatory frameworks reshaping digital finance.
          </p>

          <div className="relative w-full max-w-lg mx-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
             <input 
                type="text" 
                placeholder="Search research and reports..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary transition-all hover:border-text-muted shadow-sm"
             />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
         <div className="flex gap-2">
            {CATEGORIES.map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                     activeCategory === cat 
                        ? 'bg-primary text-background' 
                        : 'bg-surface border border-border text-text hover:border-primary/50'
                  }`}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      {/* Featured Article */}
      <section>
         <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span> 
            Featured Research
         </h2>
         <Card 
            className="p-0 overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-all duration-300"
            onClick={() => setActiveArticleId(featuredArticle.id)}
         >
            <div className="flex flex-col">
               <div className="w-full relative h-[300px] lg:h-[400px] overflow-hidden">
                  <img 
                     src={featuredArticle.image} 
                     alt="Featured" 
                     className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
               </div>
               <div className="w-full p-8 lg:p-12 flex flex-col justify-center bg-surface relative z-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                     <span className="text-primary">{featuredArticle.category}</span>
                     <span>•</span>
                     <span>{featuredArticle.readTime}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                     {featuredArticle.title}
                  </h3>
                  <p className="text-text-muted mb-8 text-sm lg:text-base leading-relaxed">
                     {featuredArticle.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                     <span className="text-sm font-bold">{featuredArticle.date}</span>
                     <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Full Analysis <ArrowLeft className="rotate-180" size={16} />
                     </span>
                  </div>
               </div>
            </div>
         </Card>
      </section>

      {/* Latest Intelligence */}
      <section>
         <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-border rounded-sm inline-block"></span> 
            Latest Intelligence
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listArticles.map((article) => (
               <Card 
                  key={article.id} 
                  className="flex flex-col group hover:border-primary/40 cursor-pointer h-full transition-all duration-300"
                  onClick={() => setActiveArticleId(article.id)}
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                        {article.icon}
                     </div>
                     <span className="px-3 py-1 bg-surface border border-border text-xs rounded-full font-bold text-text-muted uppercase tracking-widest">
                        {article.category}
                     </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                     {article.title}
                  </h3>
                  
                  <p className="text-text-muted text-sm mb-8 flex-grow">
                     {article.desc}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto w-full text-xs font-medium text-text-muted">
                     <div className="flex items-center gap-2">
                        <Clock size={14} /> {article.readTime}
                     </div>
                     <span>{article.date}</span>
                  </div>
               </Card>
            ))}
         </div>
      </section>
      
      <div className="flex justify-center mt-8">
         <Button 
            variant="secondary" 
            size="lg"
            onClick={() => addToast('More research is being indexed. Coming soon!', 'info')}
         >
            Load More Research
         </Button>
      </div>
    </div>
  );
};

export default Insights;
