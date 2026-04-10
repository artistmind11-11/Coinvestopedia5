import React from 'react';
import { PageRoute } from '../types';
import { Button } from './Button';

interface HeroProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface mb-12 lg:mb-20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      
      <div className="relative z-10 p-8 lg:p-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 lg:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Strategic Digital Asset Analysis
        </div>
        <h1 className="text-[28px] sm:text-4xl lg:text-5xl xl:text-[56px] font-heading font-bold text-text leading-[1.15] sm:leading-tight mb-4 lg:mb-6 tracking-tight">
          Cross-Asset Intelligence <br className="sm:hidden" />for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Informed Capital</span>
        </h1>
        <p className="text-[15px] sm:text-base lg:text-xl text-text-muted mb-6 lg:mb-10 font-body leading-[1.6] max-w-[600px] mx-auto px-2">
          Bridging traditional capital markets and digital assets with quantitative research, real-time data flows, and institutional-grade analysis.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
          <Button size="lg" onClick={() => onNavigate?.(PageRoute.COMPARE)}>
            Analyze Assets
          </Button>
          <Button variant="secondary" size="lg" onClick={() => onNavigate?.(PageRoute.NEWSLETTER)}>
            View Market Intelligence
          </Button>
        </div>
      </div>
    </section>
  );
};