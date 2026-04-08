import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { BookOpen, Search, ChevronUp, Hash, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Glossary Data ──

interface GlossaryEntry {
  term: string;
  definition: string;
}

interface GlossarySection {
  letter: string;
  entries: GlossaryEntry[];
}

const GLOSSARY_DATA: GlossarySection[] = [
  {
    letter: 'A',
    entries: [
      { term: 'Address Delegation', definition: 'Delegating your wallet\'s staking power to a third party — the on-chain equivalent of giving a discretionary mandate to a sub-advisor.' },
      { term: 'Airdrop', definition: 'Free token distribution used as a marketing tactic. Think of it as a prospectus with no subscription fee — you receive shares simply for being a wallet holder on a given date.' },
      { term: 'Algorithm', definition: 'The ruleset governing how a blockchain validates transactions and produces blocks. The protocol\'s operating charter.' },
      { term: 'All-Time High (ATH) / All-Time Low (ATL)', definition: 'Standard peak/trough metrics. Same concept as 52-week high/low, applied to crypto\'s full trading history.' },
      { term: 'Altcoin', definition: 'Any cryptocurrency that isn\'t Bitcoin. The "small-cap" or "non-benchmark" portion of the crypto universe.' },
      { term: 'Application-Specific Integrated Circuit (ASIC)', definition: 'Purpose-built mining hardware — the equivalent of a high-frequency trading co-location server built for one specific computation task.' },
      { term: 'Arbitrage', definition: 'Cross-exchange price discrepancy trading. Identical in concept to cash-and-carry arbitrage in traditional markets.' },
      { term: 'Ask Me Anything (AMA)', definition: 'Public Q&A session hosted by a project team, similar to an earnings call investor day — but informal and typically held on Reddit or Twitter/X.' },
    ]
  },
  {
    letter: 'B',
    entries: [
      { term: 'Bagholder', definition: 'Investor holding a depreciated position with no clear exit strategy. The crypto equivalent of being long a stock that\'s blown through all technical support.' },
      { term: 'Bearish / Bear Market', definition: 'Standard directional terminology. Negative price outlook; sustained downtrend exceeding 20% from cycle highs.' },
      { term: 'Bitcoin ATM', definition: 'Physical terminal for retail buy/sell of Bitcoin. Analogous to a foreign currency kiosk, with significantly higher spreads.' },
      { term: 'Bitcoin Improvement Proposal (BIP)', definition: 'Formal protocol upgrade proposal for Bitcoin. Equivalent to a regulatory comment letter — community reviewed before implementation.' },
      { term: 'Block', definition: 'The unit of data appended to the blockchain ledger per validation cycle. Think of each block as a single page in a continuously growing settlement ledger.' },
      { term: 'Blockchain', definition: 'A distributed, immutable ledger. The settlement and custody layer for crypto assets — no central depository, no DTCC equivalent.' },
      { term: 'Block Confirmation', definition: 'Each subsequent block added after a given transaction provides one confirmation — reduces the statistical probability of a chain reversal. More confirmations = higher settlement finality.' },
      { term: 'Block Explorer', definition: 'On-chain data terminal. Equivalent to Bloomberg for blockchain transactions — query any address, transaction, or block in real time.' },
      { term: 'Block Height', definition: 'Sequential block number in the chain. Functions as a timestamp proxy — each block height corresponds to a point in the ledger\'s history.' },
      { term: 'Block Reward', definition: 'Newly minted coins awarded to the miner or validator who produces a valid block. The issuance mechanism — crypto\'s equivalent of seigniorage.' },
      { term: 'Bots', definition: 'Algorithmic trading programs executing pre-programmed strategies autonomously. On-chain equivalent of quant algo strategies.' },
      { term: 'Bullish / Bull Market', definition: 'Positive price outlook; sustained uptrend. Standard directional terminology applied to crypto markets.' },
      { term: 'Burned Tokens', definition: 'Tokens permanently removed from circulation by sending to an unspendable address. Equivalent to a share buyback that reduces float — deflationary by design.' },
      { term: 'Buy Wall / Sell Wall', definition: 'Concentrated bid or ask orders at a specific price level, visible on the order book. Used to signal support/resistance or manipulate perceived liquidity. Analogous to a large iceberg order that\'s been made visible.' },
    ]
  },
  {
    letter: 'C',
    entries: [
      { term: 'Central Bank Digital Currency (CBDC)', definition: 'State-issued digital currency on a permissioned ledger. Represents the central bank\'s direct liability in digital form — no commercial bank intermediary required.' },
      { term: 'Centralized / Decentralized', definition: 'Organizational structure spectrum. Centralized = single point of control (traditional bank, exchange). Decentralized = distributed control with no single governing authority.' },
      { term: 'Circulating Supply', definition: 'Freely tradeable token count — the float, net of locked, burned, or reserve tokens.' },
      { term: 'Cold Storage / Cold Wallet', definition: 'Offline private key storage. Equivalent to physical securities held in a vault, inaccessible without direct physical interaction.' },
      { term: 'Consensus', definition: 'The mechanism by which all network nodes agree on the valid state of the ledger. Replaces the role of a trusted central counterparty.' },
      { term: 'Cryptocurrency', definition: 'A cryptographically secured digital asset operating on a decentralized network. Functions simultaneously as currency, commodity, and in some cases, a security.' },
      { term: 'Cryptography', definition: 'The mathematical foundation for securing transactions, verifying ownership, and ensuring ledger integrity — the encryption layer underpinning all crypto assets.' },
      { term: 'Custody', definition: 'Safekeeping of private keys (which represent ownership). The on-chain equivalent of custodial services — but without a regulated prime broker standing behind the arrangement unless explicitly structured.' },
    ]
  },
  {
    letter: 'D',
    entries: [
      { term: 'Dead Cat Bounce', definition: 'Brief price recovery within a sustained downtrend, followed by continuation lower. Identical to the traditional markets definition.' },
      { term: 'Decentralized Applications (dApps)', definition: 'Applications running on blockchain infrastructure without centralized control — no single server, no CEO, no shutdown switch.' },
      { term: 'Decentralized Autonomous Organization (DAO)', definition: 'Governance structure where token holders vote on protocol decisions. Analogous to a shareholder democracy — minus the board, legal counsel, and regulatory filing requirements.' },
      { term: 'Decentralized Finance (DeFi)', definition: 'Financial services (lending, borrowing, trading, yield generation) delivered via smart contracts without intermediaries. The disintermediated version of your prime brokerage relationship.' },
      { term: 'Delegated Proof-of-Stake (DPoS)', definition: 'A consensus mechanism where token holders vote for validator delegates — analogous to proxy voting in corporate governance, where delegates act on behalf of stakeholders.' },
      { term: 'Derivatives', definition: 'Futures, options, and swaps on crypto assets. Same instrument category as traditional derivatives — settlement mechanics differ (often cash-settled, sometimes physically settled in tokens).' },
      { term: 'Difficulty', definition: 'A dynamic parameter governing how hard it is to mine a valid block. Self-adjusts to maintain consistent block production intervals — the protocol\'s built-in rate stabilizer.' },
      { term: 'Distributed Ledger', definition: 'A synchronized, replicated database across multiple nodes. No single point of failure; no central authority required for validation.' },
      { term: 'Dominance', definition: 'Bitcoin\'s share of total crypto market capitalization. Functions like a benchmark weight — rising BTC dominance typically signals risk-off rotation within the crypto asset class.' },
      { term: 'Double Spending', definition: 'The fraudulent attempt to spend the same digital asset twice. Blockchain\'s primary innovation was solving this problem without a trusted intermediary.' },
    ]
  },
  {
    letter: 'E',
    entries: [
      { term: 'Ethereum Improvement Proposal (EIP)', definition: 'Protocol upgrade proposal for Ethereum. Equivalent to BIP for Bitcoin — reviewed and adopted through community governance.' },
      { term: 'Emission', definition: 'The rate at which new tokens are minted and released into circulation. Equivalent to a company\'s dilution schedule — high emission rate = significant float expansion.' },
      { term: 'ERC-20', definition: 'The dominant fungible token standard on Ethereum. The technical format that 95%+ of ICO/IEO tokens used — think of it as the common share structure of the crypto capital markets.' },
      { term: 'ERC-721', definition: 'The NFT token standard on Ethereum. Each token is unique and non-interchangeable — the on-chain equivalent of a title deed or unique collectible.' },
      { term: 'Ethereum Virtual Machine (EVM)', definition: 'The sandboxed runtime environment where all Ethereum smart contracts execute. The processing engine for the Ethereum financial system.' },
      { term: 'Exchange Traded Fund (ETF)', definition: 'In crypto context: a regulated fund product providing price exposure to crypto assets without direct custody. Spot Bitcoin ETFs (BlackRock, Fidelity) now trade on NYSE and Nasdaq.' },
    ]
  },
  {
    letter: 'F',
    entries: [
      { term: 'Fear of Missing Out (FOMO)', definition: 'Momentum-driven buying behavior driven by perceived opportunity cost rather than fundamental analysis. A well-documented behavioral finance phenomenon — amplified in crypto\'s 24/7 market structure.' },
      { term: 'Fear, Uncertainty and Doubt (FUD)', definition: 'Negative sentiment campaign — deliberate or organic — that suppresses price through narrative rather than fundamentals. Equivalent to a coordinated short-and-distort campaign.' },
      { term: 'Fully Diluted Valuation (FDV)', definition: 'Total market cap if all tokens (including locked, unvested, and unminted supply) were in circulation at the current price. Critical for evaluating real valuation vs. circulating-supply market cap — analogous to fully diluted share count in equity analysis.' },
      { term: 'Futures', definition: 'Standardized contracts obligating parties to transact at a future date. Crypto futures trade on CME (regulated) and offshore exchanges (Binance, Bybit). Perpetual futures — the dominant crypto product — have no expiry and use a funding rate mechanism to track spot.' },
    ]
  },
  {
    letter: 'G',
    entries: [
      { term: 'Gas', definition: 'The computational fee denominated in ETH for executing transactions or smart contracts on Ethereum. Equivalent to exchange transaction fees, but dynamic and determined by network congestion.' },
      { term: 'Gas Limit / Gas Price', definition: 'Gas limit = maximum computational resources allocated to a transaction. Gas price = amount per unit of gas you\'re willing to pay. Together they determine transaction cost and priority — a real-time fee auction.' },
      { term: 'Genesis Block', definition: 'The founding block of a blockchain — Block 0. Analogous to a company\'s incorporation date; everything in the chain traces back to it.' },
    ]
  },
  {
    letter: 'H',
    entries: [
      { term: 'Halving', definition: 'Programmatic reduction of block reward by 50% at predetermined intervals. Bitcoin halves approximately every four years. Functions as a pre-scheduled supply shock — widely cited as a bullish catalyst.' },
      { term: 'Hard Fork', definition: 'A permanent, backward-incompatible protocol upgrade that splits the chain into two separate blockchains. Analogous to a corporate spin-off — existing holders receive tokens on both chains.' },
      { term: 'Hash / Hashrate', definition: 'A hash is the cryptographic output of a hashing algorithm — a unique fingerprint for block data. Hashrate is the network\'s total computational power: higher hashrate = more secure network = higher cost of attack.' },
      { term: 'HODL', definition: 'Hold On for Dear Life. Long-only, conviction-based position holding through volatility — the crypto equivalent of a buy-and-hold value investor ignoring short-term noise.' },
      { term: 'Hot Wallet', definition: 'Internet-connected wallet for active transactions. Higher operational utility but materially higher security risk relative to cold storage. Equivalent to cash in a trading account vs. securities in a vault.' },
    ]
  },
  {
    letter: 'I',
    entries: [
      { term: 'IEO (Initial Exchange Offering)', definition: 'Token sale conducted on a centralized exchange, which acts as an underwriter and distribution platform. Closer to a traditional IPO structure than an ICO — exchange performs initial due diligence.' },
      { term: 'Impermanent Loss', definition: 'Temporary unrealized loss experienced by liquidity providers in AMM pools when asset prices diverge from the ratio at deposit. The opportunity cost of providing liquidity vs. holding assets outright.' },
      { term: 'Initial Coin Offering (ICO)', definition: 'Unregulated token sale to raise capital — the crypto equivalent of a pre-IPO seed/Series A round without the regulatory framework. Peak ICO cycle: 2017–2018.' },
      { term: 'Interoperability', definition: 'The capacity for distinct blockchain networks to communicate and transfer value without intermediaries. The crypto equivalent of correspondent banking relationships — but trustless.' },
    ]
  },
  {
    letter: 'K',
    entries: [
      { term: 'KYC (Know Your Customer)', definition: 'Identity verification process required by regulated exchanges and financial institutions. Standard AML/KYC compliance — identical concept to traditional finance.' },
    ]
  },
  {
    letter: 'L',
    entries: [
      { term: 'Leverage', definition: 'Borrowed capital used to amplify position size. Crypto exchanges offer up to 100x leverage on perpetual futures — dramatically higher than traditional margin requirements. Significantly elevates liquidation risk.' },
      { term: 'Lightning Network', definition: 'Bitcoin\'s Layer 2 payment channel network enabling near-instant, low-cost transactions off-chain. Final settlement batched back to the Bitcoin mainchain. Analogous to netting in interbank clearing.' },
      { term: 'Limit Order / Market Order', definition: 'Standard order types — identical to traditional equity/futures markets. Limit orders specify a price; market orders execute immediately at best available price.' },
      { term: 'Liquidity', definition: 'Depth of the order book; ability to transact without material price impact. Thin liquidity = high slippage — the same framework as fixed income or small-cap equity markets.' },
    ]
  },
  {
    letter: 'M',
    entries: [
      { term: 'Market Capitalization', definition: 'Circulating supply × current price. Primary valuation metric in crypto — note it excludes locked supply (see FDV for full dilution basis).' },
      { term: 'Mempool', definition: 'The queue of unconfirmed transactions awaiting inclusion in the next block. Equivalent to a settlement queue — during congestion, transactions with higher fees get prioritized.' },
      { term: 'Merkle Tree', definition: 'A cryptographic data structure enabling efficient, tamper-proof verification of transaction inclusion in a block — the hashing architecture underlying blockchain data integrity.' },
      { term: 'Mining / Miners', definition: 'Proof-of-Work validators who expend computational resources to produce valid blocks in exchange for block rewards. The network\'s security workforce — compensated via newly minted tokens and transaction fees.' },
      { term: 'Mining Pool', definition: 'Cooperative of miners combining hashrate to increase the frequency of block discovery — revenue shared proportionally. Risk-pooling mechanism that smooths income volatility for individual miners.' },
      { term: 'Multisignature (Multi-sig)', definition: 'Wallet requiring multiple private key signatures to authorize a transaction. Institutional custody standard — analogous to requiring dual signatures on a wire transfer.' },
    ]
  },
  {
    letter: 'N',
    entries: [
      { term: 'Node', definition: 'Any computer participating in the blockchain network by maintaining a copy of the ledger. Full nodes validate all transactions independently — the distributed audit infrastructure.' },
      { term: 'Non-Fungible Token (NFT)', definition: 'A unique, indivisible on-chain asset with verifiable provenance. Each token represents a distinct item — cannot be exchanged on a 1:1 basis with another token of the same contract.' },
    ]
  },
  {
    letter: 'O',
    entries: [
      { term: 'Off-Chain', definition: 'Transactions or computation occurring outside the main blockchain — typically faster and cheaper, but relies on trust assumptions or cryptographic proofs for finality.' },
      { term: 'Options', definition: 'Derivatives giving the right (not obligation) to buy or sell a crypto asset at a specified strike price. Deribit is the dominant venue for crypto options. Greeks apply identically to traditional options.' },
      { term: 'Oracles', definition: 'Third-party data feeds that deliver real-world information (price data, interest rates, events) to smart contracts. The bridge between off-chain reality and on-chain logic — critical infrastructure for DeFi.' },
      { term: 'Order Book', definition: 'Aggregated list of outstanding buy and sell orders at each price level. Identical to traditional exchange market microstructure.' },
      { term: 'Over The Counter (OTC)', definition: 'Bilateral crypto trades executed directly between counterparties, off-exchange. Used by institutions and whales to minimize market impact. Equivalent to block trading desks in equities.' },
    ]
  },
  {
    letter: 'P',
    entries: [
      { term: 'Ponzi Scheme', definition: 'Fraudulent investment structure paying returns from new capital rather than genuine returns. Numerous crypto projects have followed this model — most infamously Bitconnect.' },
      { term: 'Portfolio', definition: 'Aggregate crypto holdings — same concept as a traditional investment portfolio, tracked by cost basis, current value, and allocation weights.' },
      { term: 'Privacy Coins', definition: 'Cryptocurrencies (e.g., Monero, Zcash) with built-in transaction obfuscation. Regulatory scrutiny is highest in this category — several major exchanges have delisted them due to FATF compliance pressure.' },
      { term: 'Private Key', definition: 'The cryptographic credential that authorizes transactions from a wallet. Whoever controls the private key controls the assets — no recovery mechanism, no custodian to call. Equivalent to bearer bonds.' },
      { term: 'Proof-of-Stake (PoS)', definition: 'Consensus mechanism where validators lock tokens as collateral to earn the right to validate blocks. Capital-at-risk model — validators can be "slashed" (penalized) for malicious or negligent behavior.' },
      { term: 'Proof-of-Work (PoW)', definition: 'Consensus mechanism requiring validators (miners) to expend computational energy to produce valid blocks. Security model is based on energy expenditure — the cost of attacking the network must exceed the reward.' },
      { term: 'Protocol', definition: 'The complete ruleset governing a blockchain network — equivalent to a regulated exchange\'s trading rules and market structure requirements.' },
      { term: 'Public Key', definition: 'The wallet\'s publicly visible address — shareable for receiving funds. Mathematically linked to the private key but computationally infeasible to reverse-engineer from it.' },
      { term: 'Pump and Dump', definition: 'Coordinated price manipulation: accumulate → promote aggressively → distribute into the artificially elevated price. Illegal in traditional markets; enforcement in crypto is nascent but increasing.' },
    ]
  },
  {
    letter: 'R',
    entries: [
      { term: 'Relative Strength Index (RSI)', definition: 'Standard momentum oscillator. Readings above 70 indicate overbought; below 30 indicate oversold. Same interpretation as traditional technical analysis.' },
      { term: 'ROI (Return on Investment)', definition: 'Net profit divided by cost of investment. Standard performance metric — identical across asset classes.' },
      { term: 'Rug Pull', definition: 'Developer team removes liquidity or abandons a project after raising capital, causing token price to collapse to near zero. The crypto equivalent of a corporate fraud exit — no regulatory recourse in most jurisdictions.' },
    ]
  },
  {
    letter: 'S',
    entries: [
      { term: 'Satoshi', definition: 'The smallest unit of Bitcoin — 1 BTC = 100,000,000 satoshis. The basis point of Bitcoin pricing.' },
      { term: 'Securities and Exchange Commission (SEC)', definition: 'The U.S. federal regulatory body asserting jurisdiction over crypto assets it classifies as securities. The Howey Test is the primary legal standard for determining whether a token is a security. Ongoing litigation with major exchanges shapes the U.S. regulatory landscape.' },
      { term: 'Seed Phrase / Mnemonic Phrase', definition: 'A 12-24 word sequence that generates your wallet\'s private key. The master credential — if compromised, all assets in the wallet are at risk. Equivalent to the master password for a bearer instrument.' },
      { term: 'Smart Contracts', definition: 'Self-executing code deployed on a blockchain that automatically enforces agreement terms when predefined conditions are met. No counterparty risk from the code itself — risk lies in code vulnerabilities and oracle manipulation.' },
      { term: 'Soft Fork', definition: 'A backward-compatible protocol upgrade. Nodes running the old software continue to function — unlike a hard fork, no chain split occurs.' },
      { term: 'Stablecoin', definition: 'A token pegged to a fiat currency (typically USD) via collateral backing (USDC, USDT) or algorithmic mechanisms. Functions as the settlement currency of the crypto ecosystem — the cash equivalent for on-chain transactions.' },
      { term: 'Staking', definition: 'Locking tokens in a PoS protocol to participate as a validator and earn yield. The crypto equivalent of posting margin to participate as a market maker — yield is earned in exchange for capital at risk.' },
      { term: 'Stop-Loss Order', definition: 'Conditional sell order triggered when price falls below a specified level. Standard risk management tool — identical to traditional markets.' },
    ]
  },
  {
    letter: 'T',
    entries: [
      { term: 'Testnet', definition: 'A staging network for protocol testing with no real value at stake. Equivalent to a sandbox environment in software development — all functionality, zero financial risk.' },
      { term: 'Total Value Locked (TVL)', definition: 'The aggregate value of assets deposited into a DeFi protocol. The primary AUM metric for decentralized protocols — used to gauge protocol adoption and liquidity depth.' },
      { term: 'Transaction Fee', definition: 'Fee paid to validators for including a transaction in a block. Dynamic in most networks — spikes during congestion. Equivalent to exchange commission + clearing fee, rolled into one.' },
      { term: 'Trustless', definition: 'Requiring no trust in a counterparty — outcomes are enforced by code and cryptography rather than legal agreements or reputational capital.' },
    ]
  },
  {
    letter: 'U',
    entries: [
      { term: 'Unspent Transaction Output (UTXO)', definition: 'The Bitcoin accounting model — each UTXO represents a discrete, unspent output from a previous transaction. Contrast with Ethereum\'s account-based model. Conceptually similar to tracking individual dollar bills rather than account balances.' },
      { term: 'Utility Token', definition: 'A token that grants access to a specific product or service within a network, rather than representing an equity-like ownership stake. Regulatory classification as utility (vs. security) has significant legal implications.' },
    ]
  },
  {
    letter: 'V',
    entries: [
      { term: 'Validator', definition: 'A PoS network participant who locks tokens as collateral to validate transactions and produce blocks. Earns staking rewards; subject to slashing penalties for protocol violations. The PoS equivalent of a clearing member.' },
      { term: 'Venture Capital (VC)', definition: 'In crypto context: early-stage capital providers who receive token allocations at significant discounts to public sale price, typically with vesting schedules. VC token unlocks are closely tracked as potential selling pressure events.' },
    ]
  },
  {
    letter: 'W',
    entries: [
      { term: 'Wallet', definition: 'Software managing private key storage and transaction signing. The custody layer for self-sovereign crypto holdings — equivalent to a prime brokerage account but without the institution standing behind it.' },
      { term: 'Whale', definition: 'An entity holding a sufficiently large position to materially impact market price through buy or sell activity. On-chain wallet tracking allows real-time monitoring of whale movements — a unique data advantage over traditional markets.' },
      { term: 'Whitepaper', definition: 'The foundational technical and economic document for a crypto project — part prospectus, part technical spec. Quality varies dramatically; rigor of analysis should mirror due diligence on any early-stage investment.' },
    ]
  },
  {
    letter: 'Y',
    entries: [
      { term: 'Yield Farming', definition: 'Deploying crypto assets across DeFi protocols to maximize return — rotating between lending rates, liquidity mining rewards, and staking yields. High return potential; high smart contract and liquidity risk.' },
      { term: 'YTD (Year-to-Date)', definition: 'Standard performance tracking period — identical to traditional markets.' },
    ]
  },
  {
    letter: 'Z',
    entries: [
      { term: 'Zero Knowledge Proof (ZK Proof)', definition: 'A cryptographic method allowing one party to prove knowledge of information without revealing the information itself. Applied in privacy-preserving transactions and Layer 2 scaling solutions (ZK-rollups). Increasingly relevant as the foundation for next-generation blockchain scaling infrastructure.' },
    ]
  },
];

const ALL_LETTERS = GLOSSARY_DATA.map(s => s.letter);

// Flat list for search suggestions
const ALL_ENTRIES: GlossaryEntry[] = GLOSSARY_DATA.flatMap(s => s.entries);
const TOTAL_ENTRIES = ALL_ENTRIES.length;

// ── Smart Search Component ──

interface SmartSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTerm: (term: string) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ searchQuery, onSearchChange, onSelectTerm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Compute suggestions — max 8, prioritize term matches over definition matches
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 1) return [];
    const q = searchQuery.toLowerCase();

    const termMatches: (GlossaryEntry & { matchType: 'term' | 'definition' })[] = [];
    const defMatches: (GlossaryEntry & { matchType: 'term' | 'definition' })[] = [];

    for (const entry of ALL_ENTRIES) {
      if (entry.term.toLowerCase().includes(q)) {
        termMatches.push({ ...entry, matchType: 'term' });
      } else if (entry.definition.toLowerCase().includes(q)) {
        defMatches.push({ ...entry, matchType: 'definition' });
      }
    }

    // Term matches first, then definition matches, capped at 8
    return [...termMatches, ...defMatches].slice(0, 8);
  }, [searchQuery]);

  const showDropdown = isFocused && searchQuery.length > 0 && suggestions.length > 0;

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((term: string) => {
    onSelectTerm(term);
    setIsFocused(false);
    inputRef.current?.blur();
  }, [onSelectTerm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex].term);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  }, [showDropdown, highlightedIndex, suggestions, handleSelect]);

  return (
    <div className="relative max-w-xl w-full" id="glossary-smart-search">
      {/* Input */}
      <div className={`
        relative flex items-center rounded-2xl transition-all duration-300
        ${isFocused
          ? 'bg-surface border-2 border-primary/50 shadow-xl shadow-primary/10 ring-4 ring-primary/5'
          : 'bg-surface border-2 border-border hover:border-primary/30'
        }
      `}>
        <div className={`pl-4 flex items-center transition-colors ${isFocused ? 'text-primary' : 'text-text-muted'}`}>
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search terms, abbreviations, or concepts..."
          className="flex-1 px-3 py-4 bg-transparent text-text text-sm font-medium placeholder:text-text-muted/50 focus:outline-none"
          id="glossary-search-input"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
        />
        {searchQuery && (
          <button
            onClick={() => { onSearchChange(''); inputRef.current?.focus(); }}
            className="pr-4 flex items-center text-text-muted hover:text-primary transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        {/* Keyboard hint */}
        {!isFocused && !searchQuery && (
          <div className="hidden md:flex items-center gap-1 pr-4 text-text-muted/40">
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono font-bold">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono font-bold">K</kbd>
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute z-50 left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden max-h-[420px] overflow-y-auto"
            role="listbox"
            id="glossary-suggestions"
          >
            {/* Results header */}
            <div className="px-4 py-2.5 border-b border-border/50 bg-background/50">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                {suggestions.length} {suggestions.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.term}
                ref={el => { itemRefs.current[index] = el; }}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`
                  px-4 py-3.5 cursor-pointer transition-all duration-150 border-b border-border/30 last:border-b-0
                  ${highlightedIndex === index
                    ? 'bg-primary/10 border-l-2 border-l-primary'
                    : 'hover:bg-primary/5 border-l-2 border-l-transparent'
                  }
                `}
                onClick={() => handleSelect(suggestion.term)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        highlightedIndex === index ? 'bg-primary text-background' : 'bg-primary/10 text-primary'
                      }`}>
                        {suggestion.term[0]}
                      </span>
                      <h4 className={`font-bold text-sm truncate ${highlightedIndex === index ? 'text-primary' : 'text-text'}`}>
                        {highlightSearchTerm(suggestion.term, searchQuery)}
                      </h4>
                      {suggestion.matchType === 'definition' && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase tracking-wider">
                          Def match
                        </span>
                      )}
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed line-clamp-2 pl-8">
                      {highlightSearchTerm(suggestion.definition, searchQuery)}
                    </p>
                  </div>
                  <ArrowRight size={14} className={`flex-shrink-0 mt-1.5 transition-all ${
                    highlightedIndex === index ? 'text-primary translate-x-0 opacity-100' : 'text-text-muted/30 -translate-x-1 opacity-0'
                  }`} />
                </div>
              </div>
            ))}

            {/* Footer hint */}
            <div className="px-4 py-2 bg-background/50 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-text-muted/50 font-medium">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface border border-border/50 rounded text-[9px] font-mono">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface border border-border/50 rounded text-[9px] font-mono">↵</kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface border border-border/50 rounded text-[9px] font-mono">esc</kbd> close
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results state within dropdown */}
      <AnimatePresence>
        {isFocused && searchQuery.length > 0 && suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            <div className="p-8 text-center">
              <Hash size={32} className="mx-auto text-text-muted/30 mb-3" />
              <p className="text-sm font-bold text-text-muted mb-1">No terms found for "{searchQuery}"</p>
              <p className="text-xs text-text-muted/60">Try a different keyword or abbreviation</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ── Glossary Entry Card Component ──

interface GlossaryEntryCardProps {
  entry: GlossaryEntry;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
}

const GlossaryEntryCard: React.FC<GlossaryEntryCardProps> = ({ entry, isExpanded, onToggle, searchQuery }) => {
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    if (textRef.current) {
      // Check if scrollHeight > clientHeight to detect clamping
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
      setCanExpand(isOverflowing);
    }
  };

  useEffect(() => {
    // Initial check
    checkOverflow();
    
    // Re-check on window resize for responsiveness
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [entry.definition]);

  // Also re-check when searchQuery changes because highlighting might change layout slightly
  useEffect(() => {
    checkOverflow();
  }, [searchQuery]);

  return (
    <div
      ref={cardRef}
      className={`
        leather-card rounded-xl overflow-hidden transition-all duration-300
        ${canExpand ? 'cursor-pointer' : 'cursor-default'}
        ${isExpanded
          ? 'border-primary/40 shadow-lg shadow-primary/5'
          : canExpand ? 'hover:border-primary/20' : ''
        }
      `}
      onClick={() => canExpand && onToggle()}
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base lg:text-lg transition-colors ${isExpanded ? 'text-primary' : 'text-text'}`}>
            {searchQuery ? highlightSearchTerm(entry.term, searchQuery) : entry.term}
          </h3>
          
          <div className="relative">
            <p
              ref={textRef}
              className={`
                text-text-muted text-sm mt-2 transition-all duration-300
                ${isExpanded ? 'leading-relaxed' : 'line-clamp-2'}
              `}
              style={{ 
                display: isExpanded ? 'block' : '-webkit-box',
                WebkitLineClamp: isExpanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: isExpanded ? 'visible' : 'hidden'
              }}
            >
              {searchQuery ? highlightSearchTerm(entry.definition, searchQuery) : entry.definition}
            </p>
          </div>
        </div>

        {canExpand && (
          <button
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 mt-0.5 ${
              isExpanded
                ? 'bg-primary/10 text-primary'
                : 'bg-surface text-text-muted hover:text-primary shadow-sm border border-border/50'
            }`}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronUp size={16} className={`transform transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
          </button>
        )}
      </div>

      {/* Expanded accent bar */}
      {isExpanded && (
        <div className="h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
      )}
    </div>
  );
};


// ── Main Glossary Component ──

export const Glossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const termRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter logic
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return GLOSSARY_DATA;
    const q = searchQuery.toLowerCase();
    return GLOSSARY_DATA
      .map(section => ({
        ...section,
        entries: section.entries.filter(
          e => e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)
        )
      }))
      .filter(section => section.entries.length > 0);
  }, [searchQuery]);

  const filteredCount = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.entries.length, 0),
    [filteredSections]
  );

  // Scroll to letter
  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const ref = sectionRefs.current[letter];
    if (ref) {
      const headerOffset = 200;
      const top = ref.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Handle selecting a term from smart search
  const handleSelectTerm = useCallback((term: string) => {
    setSearchQuery('');
    setExpandedTerm(term);

    // Find which letter this term belongs to
    const section = GLOSSARY_DATA.find(s => s.entries.some(e => e.term === term));
    if (section) {
      setActiveLetter(section.letter);
    }

    // Scroll to the specific term after a brief delay to allow re-render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const ref = termRefs.current[term];
        if (ref) {
          const headerOffset = 200;
          const top = ref.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: 'smooth' });

          // Add a brief highlight pulse
          const pulseElement = ref.querySelector('.leather-card');
          if (pulseElement) {
            pulseElement.classList.add('glossary-highlight-pulse');
            setTimeout(() => pulseElement.classList.remove('glossary-highlight-pulse'), 2000);
          }
        }
      }, 100);
    });
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('glossary-search-input') as HTMLInputElement;
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Intersection Observer for active letter tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const letter = entry.target.getAttribute('data-letter');
            if (letter) setActiveLetter(letter);
          }
        }
      },
      { rootMargin: '-200px 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredSections]);

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Highlight pulse animation */}
      <style>{`
        @keyframes glossaryHighlight {
          0%, 100% { box-shadow: 0 0 0 0 transparent; }
          25% { box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 99, 102, 241), 0.3); }
          50% { box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 99, 102, 241), 0.15); }
          75% { box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 99, 102, 241), 0.3); }
        }
        .glossary-highlight-pulse {
          animation: glossaryHighlight 2s ease-in-out;
          border-color: var(--color-primary, #6366f1) !important;
        }
      `}</style>

      {/* ── Header ── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen size={14} /> Knowledge — Glossary
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Crypto Glossary
        </h1>
        <p className="text-text-muted text-lg max-w-3xl mb-2">
          Wall Street Edition — Institutional-Grade Crypto Vocabulary
        </p>
        <p className="text-text-muted text-sm">
          {TOTAL_ENTRIES} terms defined with institutional context and traditional finance analogies.
        </p>
      </div>

      {/* ── Smart Search Bar ── */}
      <SmartSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTerm={handleSelectTerm}
      />

      {/* ── Search Results Count ── */}
      {searchQuery && (
        <p className="text-sm text-text-muted">
          Showing <span className="text-primary font-bold">{filteredCount}</span> of {TOTAL_ENTRIES} terms
        </p>
      )}

      {/* ── Alphabet Navigator ── */}
      <div className="sticky top-[72px] lg:top-[100px] z-30 py-3 bg-background/80 backdrop-blur-md border-b border-border/50 -mx-1">
        <div className="flex flex-wrap gap-1 justify-center px-1">
          {ALL_LETTERS.map(letter => {
            const hasResults = filteredSections.some(s => s.letter === letter);
            return (
              <button
                key={letter}
                onClick={() => hasResults && scrollToLetter(letter)}
                disabled={!hasResults}
                className={`
                  w-9 h-9 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center
                  ${activeLetter === letter
                    ? 'bg-primary text-background shadow-lg shadow-primary/30 scale-110'
                    : hasResults
                      ? 'bg-surface border border-border text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5'
                      : 'bg-surface/40 border border-border/30 text-text-muted/30 cursor-not-allowed'
                  }
                `}
                aria-label={`Jump to ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Glossary Entries ── */}
      <div className="space-y-10">
        {filteredSections.length === 0 ? (
          <div className="text-center py-20">
            <Hash size={48} className="mx-auto text-text-muted/30 mb-4" />
            <p className="text-xl font-bold text-text-muted mb-2">No terms found</p>
            <p className="text-sm text-text-muted/60">Try adjusting your search query</p>
          </div>
        ) : (
          filteredSections.map(section => (
            <div
              key={section.letter}
              ref={el => { sectionRefs.current[section.letter] = el; }}
              data-letter={section.letter}
            >
              {/* Letter Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-bold text-2xl flex-shrink-0">
                  {section.letter}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
                <span className="text-xs font-medium text-text-muted/50">
                  {section.entries.length} {section.entries.length === 1 ? 'term' : 'terms'}
                </span>
              </div>

              {/* Entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.entries.map(entry => (
                  <div key={entry.term} ref={el => { termRefs.current[entry.term] = el; }}>
                    <GlossaryEntryCard 
                      entry={entry}
                      isExpanded={expandedTerm === entry.term}
                      onToggle={() => setExpandedTerm(expandedTerm === entry.term ? null : entry.term)}
                      searchQuery={searchQuery}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Back to Top ── */}
      <div className="text-center pt-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-sm font-medium text-text-muted hover:text-primary hover:border-primary/50 transition-all"
        >
          <ChevronUp size={16} /> Back to Top
        </button>
      </div>
    </div>
  );
};

// ── Helper: Highlight search matches ──

function highlightSearchTerm(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default Glossary;
