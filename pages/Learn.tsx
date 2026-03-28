import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BookOpen, Video, FileText, PlayCircle, Star, Award, TrendingUp, Shield, ArrowLeft, Lock, Unlock, Clock } from 'lucide-react';
import { TargetIcon } from '../components/AnimatedIcons';

// --- Types & Data ---

type ResourceType = 'Video' | 'Article' | 'Guide' | 'Deep Dive' | 'Video Series';
type Level = 'Beginner' | 'Intermediate' | 'Advanced';

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  time: string;
  level: Level;
  locked: boolean;
  desc?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  resources: Resource[];
}

const ACADEMY_CATEGORIES: Category[] = [
  {
    id: 'defi',
    name: 'DeFi Strategies',
    icon: <TrendingUp size={24} />,
    desc: 'Master decentralized finance, liquidity provision, lending protocols, and yield generation strategies.',
    resources: [
      { id: 'df-1', title: 'Yield Farming 101: Understanding Liquidity Pools', type: 'Video Series', time: '1h 20m', level: 'Beginner', locked: false, desc: 'A fundamental overview of how AMMs work and how to earn trading fees.' },
      { id: 'df-2', title: 'Flash Loans & Arbitrage Mechanics', type: 'Deep Dive', time: '45m read', level: 'Advanced', locked: true, desc: 'Technical breakdown of 0-block risk-free arbitrage opportunities.' },
      { id: 'df-3', title: 'Navigating Impermanent Loss in AMMs', type: 'Guide', time: '20m read', level: 'Intermediate', locked: false, desc: 'Mathematical modeling and hedging strategies against AMM price divergence.' },
      { id: 'df-4', title: 'Evaluating Protocol TVL & Tokenomics', type: 'Article', time: '15m read', level: 'Intermediate', locked: false, desc: 'Frameworks to analyze actual usage vs purely inflationary utility metrics.' },
    ]
  },
  {
    id: 'ta',
    name: 'Technical Analysis',
    icon: <TargetIcon className="w-6 h-6" />,
    desc: 'Read charts like an institutional trader using advanced indicators, order flow, and market profiling.',
    resources: [
      { id: 'ta-1', title: 'Reading Institutional Order Flow', type: 'Video', time: '40m', level: 'Advanced', locked: true, desc: 'How to use order book heatmaps to spot smart money positioning.' },
      { id: 'ta-2', title: 'Advanced Fibonacci Extensions & Retracements', type: 'Guide', time: '25m read', level: 'Intermediate', locked: false, desc: 'Proper anchor placement for structural price expansion targets.' },
      { id: 'ta-3', title: 'Volume Profile & VPVR Trading', type: 'Video Series', time: '2h 15m', level: 'Advanced', locked: true, desc: 'Finding hidden support/resistance using volume nodes.' },
      { id: 'ta-4', title: 'Spotting Wyckoff Accumulation Patterns', type: 'Article', time: '18m read', level: 'Beginner', locked: false, desc: 'Identifying composite operator footprints during sideways markets.' },
    ]
  },
  {
    id: 'sec',
    name: 'Security & Custody',
    icon: <Shield size={24} />,
    desc: 'Protect your digital assets with enterprise-grade operational security and custody solutions.',
    resources: [
      { id: 'sec-1', title: 'Hardware Wallet Cold Storage Best Practices', type: 'Video', time: '30m', level: 'Beginner', locked: false, desc: 'Setting up and securing physical seed phrase backups.' },
      { id: 'sec-2', title: 'Multi-Sig Wallets vs MPC Technology', type: 'Deep Dive', time: '22m read', level: 'Advanced', locked: false, desc: 'Comparing multisig contracts against Multi-Party Computation architectures.' },
      { id: 'sec-3', title: 'How to Read Smart Contract Audit Reports', type: 'Guide', time: '35m read', level: 'Intermediate', locked: true, desc: 'What red flags to look for when evaluating new DeFi protocol deposits.' },
      { id: 'sec-4', title: 'Phishing Defense & OpSec for Crypto Investors', type: 'Article', time: '12m read', level: 'Beginner', locked: false, desc: 'Common attack vectors and how to harden your personal operational security.' },
    ]
  },
  {
    id: 'psy',
    name: 'Market Psychology',
    icon: <BookOpen size={24} />,
    desc: 'Master the mental game of trading by recognizing cognitive biases and managing emotions.',
    resources: [
      { id: 'psy-1', title: 'Managing Fear & Greed in High Volatility', type: 'Video', time: '45m', level: 'Beginner', locked: false, desc: 'Techniques to prevent emotional decision making during 20%+ daily moves.' },
      { id: 'psy-2', title: 'Probabilistic Thinking vs Certainty Bias', type: 'Guide', time: '15m read', level: 'Intermediate', locked: false, desc: 'Why traders must think in EV (Expected Value) rather than absolute predictions.' },
      { id: 'psy-3', title: 'Building a Rule-Based Trading System', type: 'Video Series', time: '1h 30m', level: 'Advanced', locked: true, desc: 'Constructing systematic entry, invalidation, and profit taking frameworks.' },
      { id: 'psy-4', title: 'The Sunk Cost Fallacy in Altcoin Bags', type: 'Article', time: '10m read', level: 'Beginner', locked: false, desc: 'How to know when a thesis is objectively broken and a position must be cut.' },
    ]
  }
];

export const Learn: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const featuredCourse = {
    title: 'Institutional Crypto Investing Masterclass',
    description: 'Learn the advanced strategies used by hedge funds to navigate market cycles, manage risk, and identify asymmetric opportunities.',
    duration: '4.5 Hours',
    modules: 12,
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop'
  };

  const recentArticles = [
    { title: 'Understanding Impermanent Loss in AMMs', type: 'Article', readTime: '8 min read', icon: <FileText size={16} />, tag: 'DeFi' },
    { title: 'How to Read On-Chain Order Books', type: 'Video Series', readTime: '45 mins', icon: <Video size={16} />, tag: 'Trading' },
    { title: 'The Evolution of Layer 2 Rollups', type: 'Deep Dive', readTime: '15 min read', icon: <FileText size={16} />, tag: 'Technology' }
  ];

  // --- Scroll to Top on View Change ---
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategoryId]);

  // --- Views ---

  if (activeCategoryId) {
    const category = ACADEMY_CATEGORIES.find(c => c.id === activeCategoryId);
    if (!category) return null;

    return (
      <div className="animate-fade-in space-y-8 pb-12">
        <button 
          onClick={() => setActiveCategoryId(null)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Academy
        </button>

        <div>
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-2xl mb-6">
            {category.icon}
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{category.name}</h1>
          <p className="text-text-muted text-lg max-w-3xl">{category.desc}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Course Material ({category.resources.length})</h2>
          {category.resources.map(resource => (
            <Card key={resource.id} className="p-0 overflow-hidden hover:border-primary/40 transition-colors group cursor-pointer group">
              <div className="flex flex-col md:flex-row">
                {/* Visual Indicator */}
                <div className="w-full md:w-48 bg-surface border-b md:border-b-0 md:border-r border-border p-6 flex flex-col items-center justify-center gap-3 text-text-muted group-hover:text-primary transition-colors">
                  {resource.type.includes('Video') ? <PlayCircle size={32} /> : <FileText size={32} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{resource.type}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-center relative">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{resource.title}</h3>
                    {resource.locked ? (
                      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded text-xs font-medium text-text-muted cursor-not-allowed">
                        <Lock size={14} /> PRO
                      </div>
                    ) : (
                      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded text-xs font-medium text-primary">
                        <Unlock size={14} /> FREE
                      </div>
                    )}
                  </div>
                  
                  <p className="text-text-muted text-sm mb-6 max-w-2xl">{resource.desc}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
                    <div className="flex items-center gap-1.5"><Clock size={14} /> {resource.time}</div>
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className={resource.level === 'Advanced' ? 'text-amber-500' : resource.level === 'Intermediate' ? 'text-blue-400' : 'text-green-400'} /> 
                      {resource.level}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- Main Dashboard View ---

  return (
    <div className="animate-fade-in space-y-12 lg:space-y-16 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Award size={14} /> Academy
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Master the Markets</h1>
        <p className="text-text-muted text-lg max-w-2xl">
          Curated education from industry professionals. Elevate your understanding of digital assets, from foundational concepts to advanced trading mechanics.
        </p>
      </div>

      {/* Featured Course */}
      <section>
        <Card variant="featured" className="p-0 overflow-hidden relative group">
          <div className="flex flex-col md:flex-row h-full">
             <div className="md:w-1/2 relative min-h-[250px] md:min-h-full">
               <img 
                 src={featuredCourse.image} 
                 alt="Course cover" 
                 className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/80 to-transparent"></div>
               <div className="absolute inset-x-0 bottom-0 p-6 md:hidden">
                 <div className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full w-fit mb-2">FEATURED</div>
               </div>
             </div>
             
             <div className="md:w-1/2 p-6 lg:p-10 flex flex-col justify-center relative z-10">
               <div className="hidden md:block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full w-fit mb-4">FEATURED COURSE</div>
               <h2 className="text-2xl lg:text-3xl font-bold mb-4">{featuredCourse.title}</h2>
               <p className="text-text-muted mb-8 leading-relaxed">
                 {featuredCourse.description}
               </p>
               
               <div className="flex flex-wrap gap-6 mb-8 text-sm text-text-muted font-medium">
                  <div className="flex items-center gap-2"><PlayCircle size={16} className="text-primary" /> {featuredCourse.modules} Modules</div>
                  <div className="flex items-center gap-2"><Star size={16} className="text-[#FFD700]" /> {featuredCourse.level}</div>
                  <div className="flex items-center gap-2">⏱ {featuredCourse.duration}</div>
               </div>
               
               <Button>
                 Start Learning Now
               </Button>
             </div>
          </div>
        </Card>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="flex flex-col gap-4">
          {ACADEMY_CATEGORIES.map((cat) => (
             <div 
               key={cat.id} 
               onClick={() => setActiveCategoryId(cat.id)}
               className="leather-card rounded-xl p-6 cursor-pointer hover:border-primary/50 group flex items-center gap-6 transition-all"
             >
                <div className="p-4 bg-surface rounded-xl text-primary group-hover:bg-primary/20 transition-all flex-shrink-0">
                   {cat.icon}
                </div>
                <div className="flex-1">
                   <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                   <p className="text-sm text-text-muted mt-1">{cat.resources.length} Modules & Resources</p>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* Latest Resources */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold">Latest Free Resources</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {recentArticles.map((article, i) => (
              <Card key={i} className="flex flex-col cursor-pointer group hover:border-primary/40">
                 <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-surface border border-border text-xs rounded font-medium text-text-muted uppercase">
                       {article.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                       {article.icon} {article.type}
                    </div>
                 </div>
                 
                 <h3 className="text-lg font-bold mb-4 group-hover:text-primary transition-colors pr-4">
                    {article.title}
                 </h3>
                 
                 <div className="mt-auto flex items-center justify-between text-xs text-text-muted font-medium pt-4 border-t border-border">
                    <span>{article.readTime}</span>
                    <span className="flex items-center gap-1 group-hover:text-primary transition-colors">Read Now</span>
                 </div>
              </Card>
           ))}
        </div>
      </section>

      {/* Assessment CTA */}
      <section>
         <div className="leather-card rounded-2xl p-8 lg:p-12 text-center bg-gradient-to-b from-surface to-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
               <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 rotate-12">
                  <BookOpen size={32} />
               </div>
               <h2 className="text-3xl font-bold mb-4">Test Your Knowledge</h2>
               <p className="text-text-muted mb-8">
                  Take our comprehensive 50-question assessment to identify gaps in your crypto knowledge and get personalized course recommendations.
               </p>
               <Button size="lg" variant="secondary">Take the Assessment</Button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Learn;
