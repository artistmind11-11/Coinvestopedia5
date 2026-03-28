import { GoogleGenAI } from '@google/genai';

// ─── UTILITY SETTINGS ────────────────────────────────────────────────────────
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API || '';
const CRYPTOPANIC_API_KEY = import.meta.env.VITE_CRYPTOPANIC_API || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const WHALE_ALERT_API_KEY = import.meta.env.VITE_WHALE_ALERT_API_KEY || '';
const GLASSNODE_API_KEY = import.meta.env.VITE_GLASSNODE_API_KEY || '';
const CRYPTOQUANT_API_KEY = import.meta.env.VITE_CRYPTOQUANT_API || '';
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY || '';
const FMP_BASE_URL = import.meta.env.VITE_FMP_BASE_URL || 'https://financialmodelingprep.com/api/v3';

// ─── COINGECKO API ───────────────────────────────────────────────────────────

export const fetchMarketMetrics = async () => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/global`, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return null;
  }
};

export const fetchTrendingAssets = async () => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
    const data = await response.json();
    return data.coins;
  } catch (error) {
    console.error('Error fetching trending assets:', error);
    return [];
  }
};

export interface FetchMarketDataOptions {
  category?: string;
  perPage?: number;
  page?: number;
}

export const fetchMarketData = async (options: FetchMarketDataOptions = {}) => {
  try {
    const { category, perPage = 100, page = 1 } = options;
    let url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`;
    
    if (category) {
      // mapping our filter to coingecko categories
      if (category === 'defi') url += '&category=decentralized-finance-defi';
      else if (category === 'layer1') url += '&category=layer-1';
      else if (category !== 'all') url += `&category=${category}`;
    }

    const response = await fetch(url, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};

// ─── FEAR & GREED API ────────────────────────────────────────────────────────

export const fetchSectorPerformance = async () => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/coins/categories?order=market_cap_desc`, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    return [];
  }
};

export const fetchFearAndGreed = async () => {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=8');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching fear and greed:', error);
    return null;
  }
};

// ─── CRYPTOPANIC API ─────────────────────────────────────────────────────────

export const fetchNewsFeed = async () => {
  try {
    // Proxied through Vite to handle CORS locally
    const response = await fetch(`/api/cryptopanic/api/v1/posts/?auth_token=${CRYPTOPANIC_API_KEY}&kind=news`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching news feed:', error);
    return [];
  }
};

// ─── GEMINI AI API ───────────────────────────────────────────────────────────

const GEMINI_CACHE_KEY = 'coinvestopedia_gemini_insights';
const CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

export const generateMarketPulseInsights = async (marketContext: string) => {
  // Check Cache first
  const cachedData = localStorage.getItem(GEMINI_CACHE_KEY);
  if (cachedData) {
    const parsedCache = JSON.parse(cachedData);
    if (Date.now() - parsedCache.timestamp < CACHE_DURATION_MS) {
      return parsedCache.data;
    }
  }

  // If no valid cache, fetch new
  if (!GEMINI_API_KEY) {
     console.error("Gemini API key missing.");
     return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const prompt = `
      You are an elite, institutional-grade crypto analyst specifically writing for 'Coinvestopedia Academy'.
      Context based on live data (or mock if unavailable): ${marketContext}
      
      Generate exactly 5 distinct market insights.
      Must be returned as valid JSON array ONLY, without markdown wrapping or backticks.
      Format:
      [
        {
          "type": "technical" | "fundamental" | "sentiment" | "onchain",
          "category": "Technical Analysis" | "Fundamental News" | "Market Sentiment" | "On-Chain Data",
          "title": "Short title",
          "content": "Insightful paragraph for a finance professional."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "[]";
    const insights = JSON.parse(resultText);

    // Save to Cache
    localStorage.setItem(GEMINI_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: insights
    }));

    return insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Return fallback if API fails
    return [
      { type: 'technical', category: 'Technical Analysis', title: 'RSI Divergence', content: 'A bullish divergence occurs when price makes a lower low, but the RSI makes a higher low. This often precedes a trend reversal.' },
      { type: 'fundamental', category: 'Fundamental News', title: 'Institutional Flow', content: 'Spot Bitcoin ETFs witness consecutive weeks of net positive inflows, drastically reducing accessible over-the-counter supply.' }
    ];
  }
};

// ─── INSTITUTIONAL ON-CHAIN APIS (WHALE ALERT, GLASSNODE, ETC) ──────────────

export const fetchWhaleAlerts = async (min_value = 500000) => {
  try {
    if (!WHALE_ALERT_API_KEY) {
      console.warn('No Whale Alert API key found. Using fallback data.');
      return [];
    }
    const timestamp = Math.floor(Date.now() / 1000) - 86400; // last 24h
    // Note: Due to CORS, this might require a Vite proxy or backend. Assuming proxy or CORS enabled for this instruction.
    const response = await fetch(`https://api.whale-alert.io/v1/transactions?api_key=${WHALE_ALERT_API_KEY}&min_value=${min_value}&start=${timestamp}`);
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error fetching Whale Alerts:', error);
    return [];
  }
};

export const fetchMempoolTxs = async () => {
  try {
    // mempool.space is completely free, no API key required
    const response = await fetch('https://mempool.space/api/mempool/recent');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Mempool txs:', error);
    return [];
  }
};

export const fetchDefiLlamaTVL = async () => {
  try {
    // DefiLlama is completely free, no API key required
    const response = await fetch('https://api.llama.fi/v2/chains');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching DefiLlama TVL:', error);
    return [];
  }
};

export const fetchGlassnodeMetrics = async () => {
  try {
    if (!GLASSNODE_API_KEY) {
      console.warn('No Glassnode API key found.');
      return null;
    }
    // E.g. fetch exchange net position change
    const response = await fetch(`https://api.glassnode.com/v1/metrics/indicators/sopr?a=BTC&api_key=${GLASSNODE_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Glassnode metrics:', error);
    return null;
  }
};

export const fetchCryptoQuantReserves = async () => {
  try {
    if (!CRYPTOQUANT_API_KEY) {
      console.warn('No CryptoQuant API key found.');
      return null;
    }
    // Placeholder fetching logic for CryptoQuant exchange reserves
    const response = await fetch(`https://api.cryptoquant.com/v1/btc/exchange-flows/reserve?limit=10`, {
      headers: { 'Authorization': `Bearer ${CRYPTOQUANT_API_KEY}` }
    });
    const data = await response.json();
    return data.result?.data;
  } catch (error) {
    console.error('Error fetching CryptoQuant reserves:', error);
    return null;
  }
};

// ─── RSS CRYPTO NEWS FEEDS ──────────────────────────────────────────────────

export interface RSSNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

const RSS_SOURCES = [
  { url: '/rss/coindesk', name: 'CoinDesk' },
  { url: '/rss/theblock', name: 'The Block' },
  { url: '/rss/decrypt', name: 'Decrypt' },
];

const parseRSSXml = (xmlText: string, sourceName: string): RSSNewsItem[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results: RSSNewsItem[] = [];

    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const descRaw = item.querySelector('description')?.textContent?.trim() || '';
      // Strip HTML tags from description
      const description = descRaw.replace(/<[^>]*>/g, '').substring(0, 200);

      if (title) {
        results.push({ title, link, pubDate, source: sourceName, description });
      }
    });

    return results;
  } catch (e) {
    console.error(`Failed to parse RSS from ${sourceName}:`, e);
    return [];
  }
};

export const fetchCryptoRSSFeeds = async (): Promise<RSSNewsItem[]> => {
  try {
    const feedPromises = RSS_SOURCES.map(async (src) => {
      try {
        const response = await fetch(src.url);
        if (!response.ok) return [];
        const text = await response.text();
        return parseRSSXml(text, src.name);
      } catch {
        console.warn(`Failed to fetch RSS from ${src.name}`);
        return [];
      }
    });

    const allFeeds = await Promise.all(feedPromises);
    const merged = allFeeds.flat();

    // Sort by publication date (newest first)
    merged.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime() || 0;
      const dateB = new Date(b.pubDate).getTime() || 0;
      return dateB - dateA;
    });

    return merged.slice(0, 30); // Top 30 headlines
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return [];
  }
};

// ─── MACRO INTEL APIS (FMP) ───────────────────────────────────────────────────

export const fetchMacroIndicators = async () => {
  try {
    if (!FMP_API_KEY) {
      console.warn('No FMP API key found.');
      return null;
    }
    
    // Symbols: DXY (Dollar Index), GSPC (S&P 500), GCUSD (Gold), TNX (10Y Yield)
    const symbols = 'DX-Y.NYB,^GSPC,GCUSD,^TNX';
    const url = `${FMP_BASE_URL}quote?symbol=${symbols}&apikey=${FMP_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Macro Indicators:', error);
    return null;
  }
};
