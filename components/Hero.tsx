import React from 'react';
import { Button } from './Button';
import { PageRoute } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onNavigate?: (route: PageRoute) => void;
  partner?: string;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, partner }) => {
  return (
    <section className="relative hero-mesh bg-background overflow-hidden py-12 lg:py-24 mb-8 lg:mb-12 rounded-2xl lg:rounded-3xl border border-border">
      <div className="relative z-10 max-w-[800px] mx-auto text-center px-4 lg:px-6">
        {partner && (
          <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted/60">Institutional Partner</span>
             <div className="h-[1px] w-8 bg-border" />
             <span className="text-sm font-heading font-extrabold text-primary tracking-tight capitalize">{partner}</span>
          </div>
        )}
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
          Bridge traditional finance and crypto markets with data-driven analysis, real-time tracking, and educational resources.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
          <Button size="lg" onClick={() => onNavigate?.(PageRoute.COMPARE)}>
            Browse Comparisons
          </Button>
          
          <a 
            href="https://www.binance.com/en/register?ref=COINVEST"
            target="_blank"
            rel="noopener sponsored"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-surface border border-border text-text font-bold rounded-xl hover:border-primary/50 transition-all text-sm lg:text-base group"
          >
            Start Trading <ArrowUpRight size={18} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
        
        <div className="mt-8 lg:mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[10px] lg:text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">
            <span>Market Data: Bybit</span>
            <span>•</span>
            <span>Security: Ledger</span>
            <span>•</span>
            <span>Research: Glassnode</span>
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