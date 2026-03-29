// src/components/PageMeta.tsx
// SEO meta tags for every page.
// Requires: npm install react-helmet-async
// Wrap App in: <HelmetProvider>...</HelmetProvider>

import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  structuredData?: object;
}

const SITE_NAME = 'Coinvestopedia';
const DEFAULT_OG_IMAGE = 'https://coinvestopedia.com/og-default.png';
const BASE_URL = 'https://coinvestopedia.com';

export function PageMeta({
  title,
  description,
  canonical,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  structuredData,
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : typeof window !== 'undefined' ? window.location.href : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@coinvestopedia" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// ── Pre-built structured data schemas ──────────────────────

export const toolsPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Coinvestopedia Crypto & Investment Calculators',
  url: `${BASE_URL}/tools`,
  applicationCategory: 'FinanceApplication',
  description: 'Free institutional-grade crypto and investment calculators: ROI, DCA, Sharpe ratio, position sizing, compound interest and more.',
  featureList: [
    'ROI Calculator with CAGR',
    'Dollar Cost Averaging (DCA) Simulator',
    'Sharpe & Sortino Ratio Calculator',
    'Kelly Criterion Position Sizer',
    'Compound Interest Calculator',
    'Break-even Price Calculator',
    'Profit & Loss Calculator',
  ],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: 'World-class institutional crypto data, analysis, and investment tools.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};
