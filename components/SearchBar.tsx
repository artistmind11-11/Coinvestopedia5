import React, { useState } from 'react';
import { Search, TrendingUp, Sparkles, Flame, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '',
  placeholder = 'Search assets, guides, tools...'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const suggestions = [
    { icon: '₿', text: 'Bitcoin', type: 'Asset', trending: true },
    { icon: '📊', text: 'DCA Calculator', type: 'Tool', trending: false },
    { icon: '🐋', text: 'Whale Radar', type: 'Feature', trending: true },
    { icon: '📚', text: 'What is DeFi?', type: 'Learn', trending: false }
  ];

  return (
    <div className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-105' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className={`transition-colors ${isFocused ? 'text-primary' : 'text-text-muted'}`} />
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full bg-surface/50 backdrop-blur-sm border rounded-xl pl-12 pr-24 py-4 text-sm text-text placeholder-text-muted/50 transition-all duration-200 ${
            isFocused 
              ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10' 
              : 'border-border hover:border-border/80'
          } focus:outline-none`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2 pointer-events-none">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border border-border/80 shadow-sm rounded-lg text-xs font-bold text-text-muted font-sans tracking-wide">
            <kbd className="font-sans">⌘</kbd> 
            <kbd className="font-sans">K</kbd>
          </div>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {isFocused && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            <div className="text-xs text-text-muted uppercase tracking-wider px-3 py-2 font-bold flex items-center gap-2">
              <Sparkles size={12} />
              Trending Searches
            </div>
            {suggestions.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-text group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.text}
                    {item.trending && <Flame size={14} className="text-orange-500" />}
                  </div>
                  <div className="text-xs text-text-muted">{item.type}</div>
                </div>
                <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};