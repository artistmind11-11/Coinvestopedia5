import React from 'react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative hero-mesh bg-background overflow-hidden py-12 lg:py-24 mb-8 lg:mb-12 rounded-2xl lg:rounded-3xl border border-border">
      <div className="relative z-10 max-w-[800px] mx-auto text-center px-4 lg:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 lg:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Where Crypto Meets Wall Street
        </div>
        <h1 className="text-3xl lg:text-5xl xl:text-[56px] font-heading font-bold text-text leading-tight mb-4 lg:mb-6 tracking-tight">
          Expert Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Smart Investing</span>
        </h1>
        <p className="text-base lg:text-xl text-text-muted mb-6 lg:mb-10 font-body leading-relaxed max-w-[600px] mx-auto">
          Bridge traditional finance and crypto markets with data-driven analysis, real-time tracking, and educational resources
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
          <Button size="lg">
            Browse Comparisons
          </Button>
          <Button variant="secondary" size="lg">
            Read the Newsletter
          </Button>
        </div>
        
        {/* Live Data Ticker */}
        <div className="mt-8 lg:mt-12 border-t border-border/50 pt-6 flex w-full overflow-hidden max-w-[800px] mx-auto opacity-80" aria-label="Live Market Ticker">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-sm min-w-max pr-8 hover:[animation-play-state:paused] cursor-default">
            {/* Duplicated for smooth marquee effect */}
            {[1, 2, 3].map((set) => (
              <React.Fragment key={set}>
                <span className="flex items-center gap-2"><span className="text-text-muted font-semibold">BTC</span> <span className="font-bold text-text">$68,432</span> <span className="text-primary text-xs font-bold">↑ 2.4%</span></span>
                <span className="flex items-center gap-2"><span className="text-text-muted font-semibold">ETH</span> <span className="font-bold text-text">$3,521</span> <span className="text-primary text-xs font-bold">↑ 1.8%</span></span>
                <span className="flex items-center gap-2"><span className="text-text-muted font-semibold">SOL</span> <span className="font-bold text-text">$142.50</span> <span className="text-primary text-xs font-bold">↑ 5.2%</span></span>
                <span className="flex items-center gap-2"><span className="text-text-muted font-semibold">S&P 500</span> <span className="font-bold text-text">5,123.41</span> <span className="text-primary text-xs font-bold">↑ 0.8%</span></span>
                <span className="flex items-center gap-2"><span className="text-text-muted font-semibold">GOLD</span> <span className="font-bold text-text">$2,156.20</span> <span className="text-red-400 text-xs font-bold">↓ 0.2%</span></span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 opacity-50 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none pattern-grid"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-[100%] blur-3xl animate-pulse-slow transform-gpu"></div>
      </div>
    </section>
  );
};