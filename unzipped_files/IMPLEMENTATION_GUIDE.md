# Coinvestopedia — Implementation Guide
## Changes from Audit · March 2026

---

## 🚀 Quick Start — Apply All Fixes

```bash
# 1. Install new dependencies
npm install react-helmet-async

# 2. Copy files into your project:
#    src/styles/globals.css     → replace existing globals/index.css
#    src/hooks/useTheme.ts      → new file
#    src/hooks/useChartColors.ts → new file  
#    src/lib/calculators.ts     → new file (replaces inline calc logic)
#    src/pages/Tools.tsx        → replace existing Tools page
#    src/components/PageMeta.tsx → new file
#    src/components/ThemeToggle.tsx → new file
#    vite.config.ts             → replace existing
#    vercel.json                → new file at project root

# 3. Update main.tsx to import globals
#    Add: import './styles/globals.css';
#    Wrap App: import { HelmetProvider } from 'react-helmet-async';
#    <HelmetProvider><App /></HelmetProvider>

# 4. Fix index.css (FOUC issue)
#    Move /index.css → /src/index.css
#    In main.tsx: import './index.css';

# 5. Add lazy imports in App.tsx (see vite.config.ts comments)

# 6. Deploy
git add -A && git commit -m "fix: code splitting, calculator formulas, dark mode, SEO"
git push origin main
```

---

## 📋 Files Changed & Why

### `src/styles/globals.css` — REPLACE
- Full CSS variable token system for light + dark modes
- Syne display font + Inter body + JetBrains Mono
- Semantic color names: `--cv-primary`, `--cv-accent`, `--cv-danger`, `--cv-text-profit`, `--cv-text-loss`
- Chart-specific tokens: `--cv-chart-1` through `--cv-chart-5`, grid, tooltip
- Auto-adapts via `[data-theme="dark"]` attribute

### `src/hooks/useTheme.ts` — NEW
- Reads/writes `localStorage` + respects system preference
- Applies `data-theme` attribute to `<html>` for CSS variable switching
- `const { isDark, toggle } = useTheme();`

### `src/hooks/useChartColors.ts` — NEW
- Mode-aware Recharts colors
- `const chart = useChartColors();`
- `<CartesianGrid stroke={chart.grid} />`
- `<Tooltip contentStyle={chart.tooltipStyle} />`

### `src/lib/calculators.ts` — NEW (replaces inline math)
**Bugs fixed:**
| Calculator | Bug | Fix |
|---|---|---|
| ROI | Annualized = roi * 12 (wrong) | `annualized = (roi / years)`, CAGR = `(final/initial)^(1/years) - 1` |
| DCA | `Math.floor(months / freq)` loses partial period | `totalInvested = amt * months` (exact), weighted avg cost = `totalInvested / totalUnits` |
| Sharpe | Missing √12 annualization | `annualized = monthly_sharpe × √12` |
| Kelly | Negative values not clamped | `safeKelly = Math.max(0, kelly)`, use half-Kelly |
| P&L | No fee calculation | Fees on both buy + sell sides |
| Compound | PMT not adjusted for compounding freq | `PMT = monthly × (12/n)` |

### `src/pages/Tools.tsx` — REPLACE
- All calculators use `src/lib/calculators.ts` (corrected formulas)
- Responsive grid: `grid-template-columns: repeat(auto-fit, minmax(min(200px,100%), 1fr))`
- All money values through `Intl.NumberFormat` (no raw `.toFixed()` for display)
- Mode-aware Recharts via `useChartColors()`
- `PageMeta` SEO component on page
- Affiliate CTAs in result states (Coinbase, TradingView)

### `vite.config.ts` — REPLACE
- `manualChunks` splits: `vendor-react`, `vendor-router`, `vendor-charts`, `vendor-motion`, `vendor-icons`, `vendor-misc`
- Pages auto-split via `React.lazy()` dynamic imports (add to App.tsx)
- Hash-based filenames for long-term CDN caching

**Expected bundle result:**
| Chunk | Before | After |
|---|---|---|
| Initial load | 1.24 MB | ~80-120 KB |
| vendor-react | — | ~140 KB |
| vendor-charts | — | ~350 KB (lazy) |
| Tools page | — | ~25 KB (lazy) |

### `vercel.json` — NEW
- 1-year cache on `/assets/*` (hash-named = safe)
- `no-cache` on HTML files (always fresh)
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- SPA rewrite rule (fixes direct URL navigation)

### `src/components/PageMeta.tsx` — NEW
```tsx
// Usage on any page:
<PageMeta
  title="Free Crypto & Investment Calculators"
  description="Institutional-grade ROI, DCA, Sharpe..."
  canonical="/tools"
  structuredData={toolsPageSchema}
/>
```
- Google will index each page with unique title/description
- OpenGraph = social sharing previews (drives viral traffic)
- Schema.org `WebApplication` markup = rich results potential

---

## 💰 Affiliate Integration

Add these to your affiliate accounts first:
1. **Coinbase** → commerce.coinbase.com/affiliates (~$10/signup)
2. **Binance** → binance.com/en/activity/affiliate (~25-40% fee share)
3. **TradingView** → tradingview.com/gopro (up to $90/subscription)
4. **Ledger** → affiliate.ledger.com ($20-50/hardware wallet sale)

Then replace the placeholder links in Tools.tsx with your affiliate URLs:
```tsx
// Replace:
href="https://coinbase.com/join"
// With your affiliate link:
href="https://coinbase.com/join/YOUR_REFERRAL_CODE"
```

---

## 📈 SEO Priority Pages to Create

| Page URL | Target Keyword | Monthly Searches | Affiliate Intent |
|---|---|---|---|
| `/tools/bitcoin-dca-calculator` | bitcoin DCA calculator | 8,100 | High (Coinbase) |
| `/tools/crypto-roi-calculator` | crypto ROI calculator | 4,400 | High |
| `/learn/sharpe-ratio` | what is sharpe ratio | 22,000 | Medium |
| `/data/fear-greed-index` | crypto fear greed index | 40,000 | High return visits |
| `/compare/best-crypto-exchanges` | best crypto exchanges 2026 | 33,000 | Very High (multi-affiliate) |

---

## 🎨 Image Generation Prompts

**Hero / Banner (1920×1080):**
> "Dark navy institutional financial dashboard. Multiple glowing candlestick charts in electric blue and teal, Bitcoin and Ethereum price feeds, terminal-style data tables. Cinematic depth of field, minimal UI chrome. No people, no text overlays."

**OG / Social Share (1200×630):**
> "Coinvestopedia logo — bold modern sans-serif — on dark navy background. Upward-trending price chart with blue glow. 'World-Class Institutional Crypto Data' tagline in white. Clean, high-contrast, professional fintech aesthetic."

**Tools Page Icon Set (64×64 SVG):**
> "Minimal flat icon set on transparent background: (1) rising bar chart with arrow, (2) dollar signs in a loop, (3) balance scale, (4) crosshair target, (5) compound growth curve, (6) dollar coin stack, (7) lightning bolt. Single color: electric blue #0057FF. Geometric, no gradients."

**Academy / Education Section (800×450):**
> "Isometric illustration of a person studying financial charts on multiple screens. Crypto symbols (₿, Ξ) floating around. Dark background, blue and teal accent lighting. Modern, editorial illustration style."

---

## 🔊 Audio Generation Prompts

**Alert / Notification Sound:**
> "Short 0.3s UI notification chime. Rising two-note ding. Clean, modern, not distracting. Similar to a premium fintech app notification. WAV format."

**Success / Trade Confirmed:**
> "Satisfying 0.5s positive confirmation sound. Ascending chime with slight reverb. Used when a calculation completes or a trade is confirmed. Professional and rewarding, not childish."

**Market Open Tone:**
> "Subtle 1.5s ambient tone for market open notification. Deep resonant single note fading out. Like a premium exchange bell. Serious, institutional."
