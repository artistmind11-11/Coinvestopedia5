import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BookOpen, Video, FileText, PlayCircle, Star, Award, TrendingUp, Shield, ArrowLeft, Lock, Unlock, Clock, BarChart3, Zap } from 'lucide-react';
import { TargetIcon } from '../components/AnimatedIcons';
import { PageRoute } from '../types';
import { AdUnit } from '../components/AdUnit';
import { AffiliateCTA } from '../components/AffiliateCTA';
import { useAppContext } from '../context/AppContext';

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

export interface LearnProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Learn: React.FC<LearnProps> = ({ onNavigate }) => {
  const { isProUser } = useAppContext();
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
      <Hero onNavigate={onNavigate} partner="glassnode" />

      <div className="flex justify-center -mt-8 mb-4">
         <AdUnit size="native" context={{ page: PageRoute.LEARN }} label="Academy Sponsor" />
      </div>

      <div className="h-px bg-border/50 w-full" />

      {/* Featured Course */}
      <section>
        <Card variant="featured" className="p-0 overflow-hidden relative group border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
          <div className="flex flex-col md:flex-row h-full">
             <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
               <img 
                 src={featuredCourse.image} 
                 alt="Course cover" 
                 className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/80 to-transparent"></div>
               <div className="absolute inset-x-0 bottom-0 p-6 md:hidden">
                 <div className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full w-fit mb-2 shadow-lg">FEATURED</div>
               </div>
             </div>
             
             <div className="md:w-1/2 p-8 lg:p-14 flex flex-col justify-center relative z-10">
               <div className="hidden md:block px-3 py-1 bg-primary text-white text-[10px] font-extrabold rounded-full w-fit mb-6 tracking-widest shadow-lg">FEATURED COURSE</div>
               <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading tracking-tight leading-tight">{featuredCourse.title}</h2>
               <p className="text-text-muted mb-10 text-lg leading-relaxed font-medium">
                 {featuredCourse.description}
               </p>
               
               <div className="flex flex-wrap gap-8 mb-10 text-sm text-text-muted font-bold uppercase tracking-tighter">
                  <div className="flex items-center gap-2"><PlayCircle size={18} className="text-primary" /> {featuredCourse.modules} Modules</div>
                  <div className="flex items-center gap-2"><Star size={18} className="text-primary" /> {featuredCourse.level}</div>
                  <div className="flex items-center gap-2">⏱ {featuredCourse.duration}</div>
               </div>
               
               <Button size="lg" className="w-full md:w-fit font-bold tracking-widest shadow-xl">
                 GET CERTIFIED <ArrowLeft className="rotate-180 ml-2" size={18} />
               </Button>
             </div>
          </div>
        </Card>
      </section>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
         <div className="xl:col-span-3 space-y-12 lg:space-y-16">
            
            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Research & Reports Card */}
               <div 
                  className="leather-card rounded-2xl p-8 bg-gradient-to-br from-surface to-background relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-all flex flex-col items-center text-center gap-6 shadow-xl"
                  onClick={() => onNavigate?.(PageRoute.RESEARCH)}
               >
                   <div className="absolute top-0 right-0 p-4">
                     {!isProUser && <AdUnit size="medium" context={{ page: PageRoute.LEARN }} label="Sponsor" />}
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 bg-surface border border-border rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500 shadow-inner mt-4">
                     <BookOpen size={32} className="group-hover:animate-pulse" />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Research & Reports</h3>
                     <p className="text-text-muted text-sm leading-relaxed mb-4">
                        Weekly on-chain analysis and institutional reports.
                     </p>
                     <span className="text-primary font-bold text-xs flex items-center gap-1 justify-center group-hover:gap-2 transition-all">
                        EXPLORE NOW <ArrowLeft className="rotate-180" size={14} />
                     </span>
                  </div>
               </div>

               {/* Institutional Insights Card */}
               <div 
                  className="leather-card rounded-2xl p-8 bg-gradient-to-br from-surface to-background relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-all flex flex-col items-center text-center gap-6 shadow-xl"
                  onClick={() => onNavigate?.(PageRoute.INSIGHTS)}
               >
                  <div className="flex-shrink-0 w-16 h-16 bg-surface border border-border rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500 shadow-inner">
                     <TargetIcon className="w-8 h-8 group-hover:animate-pulse" />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Market Insights</h3>
                     <p className="text-text-muted text-sm leading-relaxed mb-4">
                        Regulatory frameworks and geopolitical deep dives.
                     </p>
                     <span className="text-primary font-bold text-xs flex items-center gap-1 justify-center group-hover:gap-2 transition-all">
                        READ REPORTS <ArrowLeft className="rotate-180" size={14} />
                     </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
               </div>
            </div>

            {/* In-feed Ad */}
            {!isProUser && (
               <div className="py-8 border-y border-border/30 flex justify-center">
                  <AdUnit size="leaderboard" context={{ page: PageRoute.LEARN }} label="Academy Sponsor" />
               </div>
            )}

            {/* Categories */}
            <section>
               <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted mb-8 flex items-center gap-4">
                  Learning Modules <div className="h-[1px] flex-1 bg-border/50" />
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {ACADEMY_CATEGORIES.map((cat) => (
                  <div 
                     key={cat.id} 
                     onClick={() => setActiveCategoryId(cat.id)}
                     className="leather-card rounded-xl p-6 cursor-pointer hover:border-primary/50 group flex items-center gap-6 transition-all bg-gradient-to-r from-surface to-transparent shadow-lg"
                  >
                     <div className="p-4 bg-surface rounded-xl text-primary group-hover:bg-primary/20 transition-all flex-shrink-0 shadow-inner">
                        {cat.icon}
                     </div>
                     <div className="flex-1">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                        <p className="text-xs text-text-muted mt-1 uppercase font-bold tracking-widest">{cat.resources.length} Modules Available</p>
                     </div>
                     <ArrowLeft className="rotate-180 text-border group-hover:text-primary transition-colors" size={20} />
                  </div>
               ))}
               </div>
            </section>

            {/* Latest Resources */}
            <section>
               <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted mb-8 flex items-center gap-4">
                  Latest Academy Drops <div className="h-[1px] flex-1 bg-border/50" />
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentArticles.slice(0, 2).map((article, i) => (
                     <Card key={i} className="flex flex-col cursor-pointer group hover:border-primary/40 p-6 bg-surface">
                        <div className="flex justify-between items-start mb-6">
                           <span className="px-3 py-1 bg-background border border-border text-[9px] rounded-full font-extrabold text-text-muted uppercase tracking-widest">
                              {article.tag}
                           </span>
                           <div className="flex items-center gap-1.5 text-[10px] text-primary font-extrabold uppercase tracking-widest">
                              {article.icon} {article.type}
                           </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors leading-snug">
                           {article.title}
                        </h3>
                        
                        <div className="mt-auto flex items-center justify-between text-[10px] text-text-muted font-extrabold uppercase tracking-widest pt-4 border-t border-border">
                           <span>{article.readTime}</span>
                           <span className="flex items-center gap-1 group-hover:text-primary transition-colors">Start Module</span>
                        </div>
                     </Card>
                  ))}
                  
                   {!isProUser && (
                      <AdUnit size="native" context={{ page: PageRoute.LEARN }} label="Sponsor" />
                   )}
               </div>
            </section>
         </div>

         {/* Academy Sidebar */}
         <aside className="hidden xl:flex flex-col gap-10">
            {!isProUser && <AdUnit size="medium" context={{ page: PageRoute.LEARN }} label="Sponsored Partner" />}
            
            <div className="leather-card p-6 rounded-2xl border-dashed border-primary/30 bg-primary/5">
               <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-primary fill-primary" />
                  Free Alpha
               </h4>
               <p className="text-xs text-text-muted mb-6 leading-relaxed">
                  Join our discord to get real-time institutional flow alerts and community research reviews.
               </p>
               <Button isFullWidth size="sm" variant="secondary" className="font-bold tracking-widest">JOIN DISCORD</Button>
            </div>

            <div className="p-6 bg-surface border border-border rounded-xl shadow-lg">
               <h4 className="font-bold text-sm mb-6 flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  Your Progress
               </h4>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                        <span className="text-text-muted">Total XP</span>
                        <span className="text-primary">2,450 / 5,000</span>
                     </div>
                     <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-primary w-[45%] shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-3 bg-background border border-border rounded-lg text-center">
                        <div className="text-lg font-bold text-primary">08</div>
                        <div className="text-[8px] text-text-muted uppercase font-bold">Resourses</div>
                     </div>
                     <div className="p-3 bg-background border border-border rounded-lg text-center">
                        <div className="text-lg font-bold text-emerald-400">03</div>
                        <div className="text-[8px] text-text-muted uppercase font-bold">Certificates</div>
                     </div>
                  </div>
               </div>
            </div>

            {!isProUser && <AdUnit size="skyscraper" context={{ page: PageRoute.LEARN }} label="Secure Your Gains" />}
         </aside>
      </div>

      {/* Assessment CTA */}
      <section className="pt-8">
         <div className="leather-card rounded-3xl p-10 lg:p-16 text-center bg-gradient-to-b from-surface to-background relative overflow-hidden border-border/50 shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
               <Award size={200} />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
               <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8 rotate-12 shadow-inner">
                  <Star size={40} className="fill-primary" />
               </div>
               <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 tracking-tight">Institutional Skills Assessment</h2>
               <p className="text-text-muted mb-10 text-lg leading-relaxed font-medium">
                  Take our comprehensive 50-question assessment designed by senior analysts to identify gaps in your crypto portfolio management and get personalized course recommendations.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Button size="lg" className="px-10 font-bold tracking-widest">START EXAM</Button>
                  <Button size="lg" variant="secondary" className="px-10 font-bold tracking-widest">VIEW SYLLABUS</Button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Learn;
