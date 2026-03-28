import React from 'react';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Card } from '../components/Card';
import { IconCard } from '../components/IconCard';
import { Mail, Sparkles, TrendingUp, BarChart3, Shield, Clock, Check, Users, Target } from 'lucide-react';
import { Button } from '../components/Button';

export const Newsletter: React.FC = () => {
  const sampleIssues = [
    {
      date: 'Dec 9, 2025',
      title: 'Institutional Accumulation Accelerates',
      highlights: [
        'BlackRock\'s Bitcoin ETF sees record $450M inflow',
        'Why traditional banks are quietly building crypto custody',
        'The Fed\'s stance: What Powell really means for crypto'
      ],
      readTime: '4 min read'
    },
    {
      date: 'Dec 2, 2025',
      title: 'DeFi Yield Compression Analysis',
      highlights: [
        'Stablecoin yields drop to 3.2% - still beat traditional savings',
        'Regulatory clarity boosts institutional DeFi participation',
        'Risk-adjusted returns: DeFi vs corporate bonds'
      ],
      readTime: '5 min read'
    },
    {
      date: 'Nov 25, 2025',
      title: 'Crypto vs Traditional Assets Q4 Review',
      highlights: [
        'Bitcoin correlation with gold hits 18-month low',
        'Real estate vs tokenized assets: Liquidity comparison',
        'Portfolio allocation models for 2026'
      ],
      readTime: '6 min read'
    }
  ];

  const valueProps = [
    {
      icon: <TrendingUp size={24} />,
      title: 'No Crypto Jargon',
      description: 'We translate blockchain concepts into traditional finance language you already understand.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Data-Driven Analysis',
      description: 'Every insight backed by market data, not hype or speculation.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Risk-First Perspective',
      description: 'We highlight risks before opportunities - just like proper due diligence.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Time-Efficient',
      description: 'Get the 3 most important stories each week in under 5 minutes.'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface mb-12 lg:mb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        
        <div className="relative z-10 p-8 lg:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Wall Street Reads Crypto</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Crypto News, Translated for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Finance Professionals</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Get the top 3 crypto stories each Monday, explained in traditional finance terms. No jargon. No hype. Just analysis.
          </p>
          
          {/* Extended width container for the card */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <NewsletterSignup variant="compact" />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="mb-16 lg:mb-24">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">Why Finance Professionals Trust Our Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, i) => (
            <IconCard
              key={i}
              icon={prop.icon}
              title={prop.title}
              description={prop.description}
            />
          ))}
        </div>
      </section>

      {/* Sample Issues */}
      <section className="mb-16 lg:mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold">Recent Issues</h2>
          <Button variant="secondary">
            Read Sample Issue
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sampleIssues.map((issue, i) => (
            <Card key={i} variant="interactive" className="hover:-translate-y-2 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-primary font-semibold">{issue.date}</span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock size={12} />
                  {issue.readTime}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-4">{issue.title}</h3>
              
              <ul className="space-y-3 mb-6">
                {issue.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-text-muted text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                Read This Issue
              </button>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 lg:mb-24">
        <Card className="bg-gradient-to-br from-surface to-background">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-12">Join 15,000+ Finance Professionals</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">92%</div>
                <div className="text-text-muted">Open Rate</div>
                <div className="text-xs text-text-muted mt-1">(Industry avg: 21%)</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">48%</div>
                <div className="text-text-muted">Click-Through Rate</div>
                <div className="text-xs text-text-muted mt-1">(2.4x industry avg)</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">15K+</div>
                <div className="text-text-muted">Subscribers</div>
                <div className="text-xs text-text-muted mt-1">Portfolio managers, analysts, VPs</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">4.8/5</div>
                <div className="text-text-muted">Reader Rating</div>
                <div className="text-xs text-text-muted mt-1">Based on 2,300+ reviews</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Final CTA */}
      <section>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Mail size={16} />
            <span>Ready to Get Smarter About Crypto?</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Start Your Free Subscription Today
          </h2>
          
          <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
            Join thousands of finance professionals who use our analysis to make informed decisions.
            First issue arrives next Monday.
          </p>
          
          <div className="max-w-md mx-auto">
            <NewsletterSignup />
          </div>
          
          <div className="mt-8 text-text-muted text-sm">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-primary" />
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-primary" />
                <span>100% free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};