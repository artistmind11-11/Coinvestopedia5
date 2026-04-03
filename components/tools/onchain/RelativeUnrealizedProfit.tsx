import { useState } from "react";
import { ExternalLink, Info, TrendingDown, TrendingUp, Minus } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Zone {
  label: string;
  range: string;
  condition: string;
  color: "red" | "yellow" | "green";
  icon: React.ReactNode;
  description: string;
  historicalExamples: string;
}

interface Signal {
  label: string;
  value: string;
  sub: string;
  alert: "red" | "yellow" | "green" | "neutral";
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const ZONES: Zone[] = [
  {
    label: "Sell Zone",
    range: "RUP > 2.5",
    condition: "Overvalued",
    color: "red",
    icon: <TrendingDown size={13} />,
    description:
      "Market participants hold large unrealized gains relative to circulating supply. Historically precedes cycle tops. Reduce exposure or take partial profits.",
    historicalExamples: "Dec 2017 · Nov 2021 · Mar 2024",
  },
  {
    label: "Neutral / Bull",
    range: "0.5 – 2.5",
    condition: "Fair Value",
    color: "yellow",
    icon: <Minus size={13} />,
    description:
      "Normal bull market conditions. Holders in profit but not at extremes. Accumulation remains viable; monitor for zone transitions.",
    historicalExamples: "2019 recovery · 2023 bull run",
  },
  {
    label: "Accumulation Zone",
    range: "RUP < 0",
    condition: "Undervalued",
    color: "green",
    icon: <TrendingUp size={13} />,
    description:
      "Average holder is in unrealized loss. Historically the highest risk-adjusted entry across all BTC cycles. Strong buy signal for long-term positions.",
    historicalExamples: "Jan 2015 · Mar 2020 · Nov 2022",
  },
];

const SIGNALS: Signal[] = [
  {
    label: "Current Signal",
    value: "CAUTION",
    sub: "RUP in sell zone",
    alert: "red",
  },
  {
    label: "Approx. RUP",
    value: "~3.0",
    sub: "Above 2.5 threshold",
    alert: "red",
  },
  {
    label: "Last Buy Zone",
    value: "Nov 2022",
    sub: "FTX collapse bottom",
    alert: "green",
  },
  {
    label: "Buy Zone Trigger",
    value: "RUP < 0",
    sub: "Capitulation level",
    alert: "neutral",
  },
  {
    label: "Data Source",
    value: "ChainExposed",
    sub: "UTXO-based · Daily",
    alert: "neutral",
  },
];

// ─── Color helpers (Tailwind classes from your design system) ─────────────────

const alertColors = {
  red:     "text-red-500 dark:text-red-400",
  yellow:  "text-yellow-500 dark:text-yellow-400",
  green:   "text-emerald-500 dark:text-emerald-400",
  neutral: "text-text",
};

const zoneBg = {
  red:    "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50",
  yellow: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50",
  green:  "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50",
};

const zoneText = {
  red:    "text-red-900 dark:text-red-200",
  yellow: "text-yellow-900 dark:text-yellow-200",
  green:  "text-emerald-900 dark:text-emerald-200",
};

const zoneLabel = {
  red:    "text-red-700 dark:text-red-300",
  yellow: "text-yellow-700 dark:text-yellow-300",
  green:  "text-emerald-700 dark:text-emerald-300",
};

const zoneIcon = {
  red:    "text-red-500 dark:text-red-400",
  yellow: "text-yellow-500 dark:text-yellow-400",
  green:  "text-emerald-500 dark:text-emerald-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RelativeUnrealizedProfit() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="leather-card rounded-xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-semibold text-sm text-text tracking-tight">
              Relative Unrealized Profit
            </h3>
            {/* Live indicator */}
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-medium text-emerald-500 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Daily
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5 font-body">
            On-Chain · Market-wide · Unrealized P&amp;L · UTXO model
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-medium border border-red-200 dark:border-red-900/60">
            SELL ZONE &gt; 2.5
          </span>
          <span className="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-900/60">
            BUY ZONE &lt; 0
          </span>
          {/* Info toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 rounded-md border border-border text-text-muted hover:text-text hover:border-primary transition-colors"
            title="What is RUP?"
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* ── Explainer (collapsible) ── */}
      {showInfo && (
        <div className="px-5 py-3 border-b border-border bg-surface/60 text-[12px] text-text-muted font-body leading-relaxed">
          <strong className="text-text font-semibold">What is Relative Unrealized Profit?</strong>
          <br />
          RUP measures the total unrealized profit held by all Bitcoin market participants,
          divided by the market cap. It is derived from the UTXO model — each unspent output
          is valued at the price when it was last moved. When the aggregate of these unrealized
          gains is high relative to market cap (RUP &gt; 2.5), the market is historically
          overextended. When negative, the average holder is underwater — a historically
          reliable bottom signal.
        </div>
      )}

      {/* ── Signal strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y divide-border border-b border-border">
        {SIGNALS.map((s) => (
          <div key={s.label} className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-widest text-text-muted mb-1 font-sans">
              {s.label}
            </p>
            <p className={`text-[13px] font-semibold font-sans ${alertColors[s.alert]}`}>
              {s.value}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5 font-body">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Iframe ── */}
      <div className="w-full bg-white overflow-hidden">
        <iframe
          src="https://chainexposed.com/RelativeUnrealizedProfit.html"
          width="100%"
          height="540"
          scrolling="no"
          loading="lazy"
          title="Relative Unrealized Profit — ChainExposed"
          style={{ display: "block", border: "none" }}
        />
      </div>

      {/* ── Zone interpretation ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-t border-border">
        {ZONES.map((z) => (
          <div key={z.label} className={`p-4 border ${zoneBg[z.color]}`}>
            <div className={`flex items-center gap-1.5 mb-1.5 font-semibold text-[10px] uppercase tracking-wide ${zoneLabel[z.color]}`}>
              <span className={zoneIcon[z.color]}>{z.icon}</span>
              {z.label} — {z.range}
            </div>
            <p className={`text-[11px] leading-relaxed font-body mb-2 ${zoneText[z.color]}`}>
              {z.description}
            </p>
            <p className={`text-[10px] font-mono opacity-70 ${zoneText[z.color]}`}>
              Historical: {z.historicalExamples}
            </p>
          </div>
        ))}
      </div>

      {/* ── Legend row ── */}
      <div className="flex items-center gap-5 px-5 py-3 border-t border-border flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 rounded-full bg-blue-400 inline-block" />
          <span className="text-[11px] text-text-muted font-body">RUP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 rounded-full bg-neutral-800 dark:bg-neutral-200 inline-block" />
          <span className="text-[11px] text-text-muted font-body">BTC Price (log)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded-sm bg-red-300/60 inline-block" />
          <span className="text-[11px] text-text-muted font-body">Sell zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded-sm bg-emerald-300/60 inline-block" />
          <span className="text-[11px] text-text-muted font-body">Accumulation zone</span>
        </div>
      </div>

      {/* ── Attribution ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-border flex-wrap gap-2 bg-surface/40">
        <span className="text-[10px] text-text-muted font-body">
          Chart by ChainExposed · @bullfromsea · Updated daily 00:00 UTC
        </span>
        <a
          href="https://chainexposed.com/RelativeUnrealizedProfit.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors font-body"
        >
          View full chart <ExternalLink size={10} />
        </a>
      </div>

    </div>
  );
}
