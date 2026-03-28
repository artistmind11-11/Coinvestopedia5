import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchCryptoRSSFeeds, RSSNewsItem } from '../services/api';

const formatTimeAgo = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  } catch {
    return '';
  }
};

// Simple color hash for source icons
const SOURCE_ICON_COLORS: Record<string, string> = {
  'CoinDesk': '#3B82F6',
  'The Block': '#8B5CF6',
  'Decrypt': '#F59E0B',
};

export const CryptoNewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<RSSNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchCryptoRSSFeeds().then(data => {
      setArticles(data);
      setIsLoading(false);
    });
  }, []);

  const visibleArticles = expanded ? articles : articles.slice(0, 8);

  return (
    <div className="leather-card rounded-xl overflow-hidden h-full flex flex-col" style={{ background: 'var(--color-card-bg, #1e222d)' }}>
      {/* Feed Body — matches TradingView's timeline style */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3">
        {isLoading ? (
          <div className="space-y-5 pt-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 bg-surface/50 rounded w-24" />
                <div className="h-5 bg-surface/50 rounded w-full" />
                <div className="h-4 bg-surface/50 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted py-12">
            <Newspaper size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No news available right now.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {visibleArticles.map((article, idx) => (
              <a
                key={`${article.source}-${idx}`}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-2.5 border-b border-border/30 last:border-b-0 hover:bg-white/[0.03] -mx-1 px-1 rounded transition-colors"
              >
                {/* Source icon + Time row — matches TradingView's layout */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
                    style={{ backgroundColor: SOURCE_ICON_COLORS[article.source] || '#6B7280' }}
                  >
                    {article.source.charAt(0)}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatTimeAgo(article.pubDate)}
                  </span>
                </div>

                {/* Headline */}
                <h4 className="text-[15px] font-semibold text-text leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Show More / Less */}
      {articles.length > 8 && (
        <div className="border-t border-border/30 flex-shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-primary hover:bg-surface/50 transition-colors"
          >
            {expanded ? (
              <><ChevronUp size={14} /> Show Less</>
            ) : (
              <><ChevronDown size={14} /> Show All {articles.length} Headlines</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptoNewsFeed;
