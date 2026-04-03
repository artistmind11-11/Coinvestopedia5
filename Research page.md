Glassnode Newsletter Feed on Tools & Calculators Page
Project Context
Build environment: Google AI Studio (Antigravity)
Deploy target: Cloudflare Pages (production)
Stack: React 19, Tailwind CSS with custom CSS variables, Lucide React, Framer Motion, Recharts
Current tools page: Existing component with leather-card sections — ChainExposed embed and TradingView widgets already added in previous sessions
Dependency constraint: Zero new npm packages

Objective
Add a "Research & Insights" section to the existing Tools & Calculators page component. The section renders a curated feed of Glassnode's "The Week On-Chain" newsletter editions as article cards.
Implementation strategy:

Now (AI Studio / local): Static hardcoded data array — full UI testable with zero infrastructure
At Cloudflare deploy: Data source swaps to RSS fetch in a Pages Function — component is unchanged, only data origin changes

Build the static version now. The component must be architected so the data source is the only thing that changes at deploy time — no structural refactoring required later.

Data Architecture
Declare this interface and array at the top of the tools page file, outside the component function:
tsinterface GlassnodeArticle {
  title: string
  summary: string
  date: string
  readTime: string
  url: string
  tags: string[]
}

const GLASSNODE_ARTICLES: GlassnodeArticle[] = [
  {
    title: "Awaiting Liquidity",
    summary: "Bitcoin stabilised around ~$70k with ETF flows improving and sell-side pressure easing. Muted spot volume and overhead supply suggest stronger demand is still needed for a durable recovery.",
    date: "Mar 25, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-13-2026/",
    tags: ["ETF Flows", "Liquidity"]
  },
  {
    title: "Supply Cleared, Conviction Pending",
    summary: "Bitcoin rebounded toward ~$74k as ETF inflows and spot demand recover. Shorts crowded with negative funding; easing options stress suggests improving conditions but early conviction only.",
    date: "Mar 18, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-12-2026/",
    tags: ["Funding Rate", "Options"]
  },
  {
    title: "Resilient in the Face of War",
    summary: "Early stabilisation as ETF inflows return and spot demand begins recovering. Negative funding reveals crowded shorts; options volatility eases suggesting reduced immediate downside risk.",
    date: "Mar 11, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-11-2026/",
    tags: ["Spot Demand", "Derivatives"]
  },
  {
    title: "Waiting for Conviction",
    summary: "BTC stuck between $60k–$69k demand zone. Profitability and breadth fading, spot and ETF flows negative, leverage reset. Market stabilising, not yet recovering.",
    date: "Feb 25, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-9-2026/",
    tags: ["Realized Price", "Leverage"]
  },
  {
    title: "Range-Bound Under Pressure",
    summary: "Bitcoin broke below the True Market Mean (~$79k) into a defensive range. Spot and ETF flows weak; options show panic hedging fading but no renewed bullish conviction.",
    date: "Feb 18, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-8-2026/",
    tags: ["True Market Mean", "ETF"]
  },
  {
    title: "Bears In Control",
    summary: "Spot BTC volumes structurally weak with 30D average depressed despite BTC rolling from $98K to $72K. Demand vacuum — sell-side pressure not met by sustained absorption.",
    date: "Feb 4, 2026",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-6-2026/",
    tags: ["Spot Volume", "Bear Market"]
  },
  {
    title: "Tariffs and Turmoil",
    summary: "Trump's Liberation Day tariffs sent shockwaves through financial markets. Major macro indexes declined unilaterally. Digital assets saw broad-based contraction across all sectors.",
    date: "Apr 9, 2025",
    readTime: "9 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-15-2025/",
    tags: ["Macro", "Correlation"]
  },
  {
    title: "Price Discovery",
    summary: "Bitcoin reached a new ATH trading as high as $122.6k, putting all BTC investors back in profit. Key on-chain metrics suggest a potential push toward ~$130K before demand exhaustion.",
    date: "Jul 16, 2025",
    readTime: "6 min",
    url: "https://insights.glassnode.com/the-week-on-chain-week-29-2025/",
    tags: ["ATH", "NUPL"]
  },
]
```

---

## Section Placement

Insert **after** the TradingView "Traditional Markets" section, **before** the page footer. Use the identical section header pattern already established for ChainExposed and TradingView sections — inspect those and replicate exactly: same heading size, font weight, spacing, and divider style.

**Section header content:**
```
Icon:        BookOpen (Lucide)
Heading:     Research & Insights
Subheading:  Weekly on-chain market analysis · Powered by Glassnode
Badge 1:     The Week On-Chain
Badge 2:     Free Research
```

---

## Article Card Specification

Layout: `grid grid-cols-1 md:grid-cols-2 gap-4`

Each card is an `<a>` tag wrapping a `leather-card` div — the entire card is clickable, opens `article.url` in a new tab with `target="_blank" rel="noopener noreferrer"`.

**Internal card structure — top to bottom:**
```
[date · Clock icon · readTime]              ← flex row, text-[10px] text-text-muted, px-4 pt-4
[title]                                     ← font-semibold text-sm text-text, px-4 pt-1
[summary — line-clamp-2]                    ← text-xs text-text-muted leading-relaxed, px-4 pt-1 pb-3
[tags row ← left | "Read more ↗" → right]  ← flex justify-between items-center, px-4 pb-4 border-t border-border pt-3
Tags: Show maximum 2 tags. If article.tags.length > 2, show first 2 tags plus a +{n} overflow pill where n is the remaining count.
Tag pill class: text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-medium
"Read more ↗": text-[10px] text-primary font-medium — right-aligned, always visible.
Date row: <Clock size={10} className="inline mr-1" /> before readTime. Date and readTime separated by a · character.

Footer Elements
"View all" button — centered, full-width row below the grid:
tsx
  href="https://insights.glassnode.com/tag/newsletter/"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 text-xs text-text-muted hover:text-primary
             border border-border hover:border-primary rounded-lg px-4 py-2
             transition-colors font-sans mx-auto w-fit mt-4"
>
  View all editions on Glassnode Insights
  <ExternalLink size={12} />
</a>
Attribution line — below the button:
tsx<p className="text-center text-[10px] text-text-muted pt-2 font-body">
  Research by Glassnode · The Week On-Chain · Published every Tuesday ·{" "}
  
    href="https://insights.glassnode.com"
    target="_blank"
    rel="noopener noreferrer"
    className="underline underline-offset-2 hover:text-primary transition-colors"
  >
    insights.glassnode.com
  </a>
</p>

Lucide Icons Required
Add to the existing Lucide import statement — do not create a new import:
BookOpen, Clock, ExternalLink

Constraints

No new files — all changes within the existing tools page component only
No useEffect, no fetch, no API calls — purely static render
No modifications to any existing section above the new addition
All external links use <a> tags — no onClick + window.open
TypeScript — GlassnodeArticle interface declared at file scope, array explicitly typed
line-clamp-2 on summary — Tailwind utility, already available via CDN build
leather-card hover state (border turns primary color) is handled by existing CSS — no inline override


Cloudflare Deploy Note (Do Not Implement Now)
At deploy time, the static array becomes the fallback only. A Cloudflare Pages Function will fetch https://insights.glassnode.com/rss/, parse the XML, and inject the same GlassnodeArticle[] shape as server-side props. The component receives identical data — no structural changes required. The static array serves as the error fallback if the RSS fetch fails.

Verification Before Committing

 Section header matches ChainExposed and TradingView section headers — identical typography, spacing, badge style
 All 8 article cards render in 2-column grid on md+ screens, single column on mobile
 Tags truncate correctly at 2 — overflow shows +1 pill
 Entire card is clickable via <a> wrapper — no dead zones
 line-clamp-2 applied to summary — no overflow on long text
 "View all" button and attribution line render below grid
 Zero TypeScript errors
 Existing tools sections above are unmodified
