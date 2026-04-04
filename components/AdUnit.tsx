import React, { useMemo } from 'react';
import { ArrowUpRight, Zap, Gift, BarChart2, Shield, Bot, Globe, Target, LineChart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AdPartner, AdContext, getContextualAd } from '../services/adService';

interface AdUnitProps {
  size: 'medium' | 'large' | 'billboard' | 'skyscraper' | 'leaderboard' | 'mobile-sticky' | 'native';
  className?: string;
  label?: string;
  partner?: AdPartner;
  context?: AdContext;
  showOnMobileOnly?: boolean;
}

const PARTNERS: Record<AdPartner, {
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  offer: string;
  subOffer: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  url: string;
}> = {
  kucoin: {
    name: 'KuCoin',
    bgGradient: 'from-[#051813] to-[#24AE8F]',
    textColor: 'text-white',
    accentColor: 'bg-[#24AE8F] text-white hover:bg-[#1C967A]',
    offer: '700 USDT',
    subOffer: 'Welcome Gift',
    description: 'Find the next crypto gem on the people\'s exchange.',
    cta: 'Claim Bonus',
    url: 'https://www.kucoin.com/r/af/COINVEST',
    icon: <Zap size={20} className="text-[#24AE8F]" />
  },
  trezor: {
    name: 'Trezor',
    bgGradient: 'from-[#121212] to-[#0f3a2a]',
    textColor: 'text-white',
    accentColor: 'bg-[#00854D] text-white hover:bg-[#006e40]',
    offer: 'Model T',
    subOffer: 'Total Security',
    description: 'Protect your crypto assets with the original hardware wallet.',
    cta: 'Get Safe',
    url: 'https://trezor.io/?offer=coinvest',
    icon: <Shield size={20} className="text-[#00854D]" />
  },
  '3commas': {
    name: '3Commas',
    bgGradient: 'from-[#0D1117] to-[#1A1F2C]',
    textColor: 'text-white',
    accentColor: 'bg-[#00D09C] text-black hover:bg-[#00B084]',
    offer: 'Smart Bots',
    subOffer: 'Automate 24/7',
    description: 'The world\'s best crypto trading bots and terminal.',
    cta: 'Try For Free',
    url: 'https://3commas.io/?c=tc-coinvest',
    icon: <Bot size={20} className="text-[#00D09C]" />
  },
  binance: {
    name: 'Binance',
    bgGradient: 'from-[#0B0E11] to-[#F3BA2F]',
    textColor: 'text-white',
    accentColor: 'bg-[#F3BA2F] text-black hover:bg-[#D9A52A]',
    offer: '100 USDT',
    subOffer: 'Trading Rebate',
    description: 'Trade crypto on the world\'s largest exchange.',
    cta: 'Register Now',
    url: 'https://www.binance.com/en/register?ref=COINVEST',
    icon: <Zap size={20} className="text-[#F3BA2F]" />
  },
  bybit: {
    name: 'Bybit',
    bgGradient: 'from-[#17181E] to-[#FBAB24]',
    textColor: 'text-white',
    accentColor: 'bg-[#FBAB24] text-black hover:bg-[#E0981F]',
    offer: '30,000 USDT',
    subOffer: 'Deposit Bonus',
    description: 'Next level trading with professional tools.',
    cta: 'Claim Now',
    url: 'https://www.bybit.com/register?affiliate_id=COINVEST',
    icon: <BarChart2 size={20} className="text-[#FBAB24]" />
  },
  okx: {
    name: 'OKX',
    bgGradient: 'from-[#000000] to-[#FFFFFF]',
    textColor: 'text-white',
    accentColor: 'bg-white text-black hover:bg-gray-200',
    offer: 'Mystery Box',
    subOffer: 'Up to $10,000',
    description: 'One app for everything crypto.',
    cta: 'Get App',
    url: 'https://www.okx.com/join/COINVEST',
    icon: <Gift size={20} className="text-black" />
  },
  ledger: {
    name: 'Ledger',
    bgGradient: 'from-[#1A1A1A] to-[#6E3BB6]',
    textColor: 'text-white',
    accentColor: 'bg-[#6E3BB6] text-white hover:bg-[#5A3095]',
    offer: 'Nano X',
    subOffer: 'Self-Custody',
    description: 'Your crypto, your keys. Secure your future.',
    cta: 'Shop Now',
    url: 'https://shop.ledger.com/?offer=coinvest',
    icon: <Shield size={20} className="text-[#6E3BB6]" />
  },
  coinledger: {
    name: 'CoinLedger',
    bgGradient: 'from-[#141E30] to-[#243B55]',
    textColor: 'text-white',
    accentColor: 'bg-primary text-white hover:bg-primary-dark',
    offer: 'Free Tax Report',
    subOffer: 'Crypto Taxes',
    description: 'Simplify your crypto taxes in minutes.',
    cta: 'Start Free',
    url: 'https://coinledger.io/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <BarChart2 size={20} className="text-primary" />
  },
  htx: {
    name: 'HTX',
    bgGradient: 'from-[#000000] to-[#122A4F]',
    textColor: 'text-white',
    accentColor: 'bg-[#2152D9] text-white hover:bg-[#183EA3]',
    offer: '5,672 USDT',
    subOffer: 'Welcome Bonus',
    description: 'Global crypto exchange and Web3 ecosystem.',
    cta: 'Register',
    url: 'https://www.htx.com/invite?utm_source=coinvestopedia&utm_medium=banner',
    icon: <Globe size={20} className="text-[#2152D9]" />
  },
  bitget: {
    name: 'Bitget',
    bgGradient: 'from-[#111] to-[#0A8787]',
    textColor: 'text-white',
    accentColor: 'bg-[#00E5C9] text-black hover:bg-[#00BFA8]',
    offer: 'Copy Trading',
    subOffer: 'Follow the Pros',
    description: 'World\'s leading crypto copy trading platform.',
    cta: 'Copy Trade',
    url: 'https://www.bitget.com/expressly?utm_source=coinvestopedia&utm_medium=banner',
    icon: <Target size={20} className="text-[#00E5C9]" />
  },
  glassnode: {
    name: 'Glassnode',
    bgGradient: 'from-[#111111] to-[#333333]',
    textColor: 'text-white',
    accentColor: 'bg-white text-black hover:bg-gray-200',
    offer: 'Pro Data',
    subOffer: 'On-Chain Intel',
    description: 'Institutional grade on-chain analytics and insights.',
    cta: 'Get Pro',
    url: 'https://glassnode.com/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <LineChart size={20} className="text-white" />
  },
  nansen: {
    name: 'Nansen',
    bgGradient: 'from-[#0F172A] to-[#1E3A8A]',
    textColor: 'text-white',
    accentColor: 'bg-[#3B82F6] text-white hover:bg-[#2563EB]',
    offer: 'Smart Money',
    subOffer: 'Wallet Labels',
    description: 'Surface the signal in blockchain data.',
    cta: 'Track Wallets',
    url: 'https://nansen.ai/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <Zap size={20} className="text-[#3B82F6]" />
  },
  tradingview: {
    name: 'TradingView',
    bgGradient: 'from-[#131722] to-[#2A2E39]',
    textColor: 'text-white',
    accentColor: 'bg-[#2962FF] text-white hover:bg-[#1E4EB8]',
    offer: 'Pro Charts',
    subOffer: 'Advanced Tools',
    description: 'Look first / then leap. Premium charting software.',
    cta: 'Upgrade',
    url: 'https://www.tradingview.com/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <BarChart2 size={20} className="text-[#2962FF]" />
  }
};

export const AdUnit: React.FC<AdUnitProps> = ({ size, className = '', label = 'Advertisement', partner, context, showOnMobileOnly }) => {
  const { isProUser } = useAppContext();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Ad rules: Hide if Pro user or if dismissed
  if (isProUser || isDismissed) return null;

  const dimensions = {
    medium: 'w-[300px] h-[250px]',
    large: 'w-full h-full min-h-[250px]',
    billboard: 'w-full h-[250px]',
    skyscraper: 'w-[300px] h-[600px]',
    leaderboard: 'w-full max-w-[728px] h-[90px] mx-auto',
    'mobile-sticky': 'fixed bottom-0 left-0 right-0 h-[64px] bg-background/95 backdrop-blur-md border-t border-border/50 z-[100] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.3)] animate-slide-up',
    native: 'w-full h-auto mx-auto'
  };

  const resolvedPartner = useMemo(() => {
    if (context) return getContextualAd(context);
    if (partner && PARTNERS[partner]) return partner;
    const keys = Object.keys(PARTNERS) as AdPartner[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey;
  }, [partner, context]);

  const adData = PARTNERS[resolvedPartner];

  if (size === 'native') {
    return (
      <div className={`leather-card rounded-2xl p-6 border border-primary/20 relative shadow-2xl hover:border-primary/40 transition-all duration-500 overflow-hidden group bg-gradient-to-br from-surface to-background ${dimensions[size]} ${className}`}>
        {/* Subtle Background Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        
        <span className="absolute top-3 right-3 text-[9px] text-text-muted uppercase tracking-[0.2em] font-extrabold px-2 py-1 bg-surface/50 border border-border/30 rounded-md backdrop-blur-sm z-10">
          {label}
        </span>
        
        <div className="flex items-center gap-4 mb-5 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex flex-shrink-0 items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
            {adData.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-text-muted uppercase tracking-widest leading-none mb-1">{adData.name}</span>
            <span className="font-black text-sm text-text leading-tight">{adData.subOffer}</span>
          </div>
        </div>
        
        <div className="relative z-10">
           <p className="text-xl font-black mb-2 tracking-tight text-primary group-hover:text-primary-light transition-colors leading-none">
              {adData.offer}
           </p>
           <p className="text-xs text-text-muted mb-6 line-clamp-2 leading-relaxed font-medium">
              {adData.description}
           </p>
        </div>
        
        <a 
           href={adData.url} 
           target="_blank" 
           rel="nofollow sponsored"
           className={`w-full py-3 flex items-center justify-center gap-2 rounded-xl font-bold text-xs shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 relative z-10 ${adData.accentColor}`}
        >
          {adData.cta} <ArrowUpRight size={14} strokeWidth={3} />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.01] ${(showOnMobileOnly && size !== 'mobile-sticky') ? 'flex md:hidden' : ''} ${dimensions[size]} ${className}`}>
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${adData.bgGradient} opacity-95`}></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        
        {/* Close Button for Sticky */}
        {size === 'mobile-sticky' && (
           <button 
             onClick={(e) => {
               e.preventDefault();
               setIsDismissed(true);
             }}
             className="absolute -top-1 -right-1 p-2 text-white/50 hover:text-white z-20"
           >
              <div className="bg-red-500/20 hover:bg-red-500/40 p-1 rounded-full backdrop-blur-sm border border-white/10 transition-colors">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
           </button>
        )}

        {/* Label */}
        <span className="absolute top-2 right-2 text-[8px] uppercase tracking-[0.2em] opacity-60 font-black z-10 px-2 py-1 bg-black/40 rounded-md backdrop-blur-sm text-white border border-white/10">
            {label}
        </span>

        {/* Content */}
        <div className={size === 'mobile-sticky' 
            ? `relative z-10 flex items-center justify-between h-full px-5 ${adData.textColor}`
            : `relative z-10 flex flex-col h-full p-8 justify-between ${adData.textColor}`
        }>
            {size === 'mobile-sticky' ? (
                <>
                   <div className="flex items-center gap-4">
                      <div className="p-1.5 bg-white/10 rounded-lg border border-white/20 backdrop-blur-md shadow-inner">{adData.icon}</div>
                      <div>
                         <div className="text-sm font-black leading-none mb-0.5 tracking-tight">{adData.offer}</div>
                         <div className="text-[10px] opacity-70 font-extrabold uppercase tracking-widest">{adData.name}</div>
                      </div>
                   </div>
                   <a 
                     href={adData.url} 
                     target="_blank" 
                     rel="nofollow sponsored"
                     className={`px-6 py-2 rounded-xl text-[10px] font-black shadow-2xl tracking-widest uppercase transition-transform active:scale-95 ${adData.accentColor}`}
                   >
                     {adData.cta}
                   </a>
                </>
            ) : (
                <>
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6 font-bold text-sm tracking-[0.1em] uppercase opacity-90">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xl border border-white/20 shadow-inner">
                                {adData.icon}
                            </div>
                            {adData.name}
                        </div>
                        
                        <div className="font-black text-5xl leading-none mb-2 tracking-tighter drop-shadow-2xl">
                            {adData.offer}
                        </div>
                        <div className="text-sm font-black opacity-80 uppercase tracking-[0.25em] mb-6 text-white/90">
                            {adData.subOffer}
                        </div>
                        
                        {size !== 'medium' && size !== 'leaderboard' && (
                            <p className="text-sm lg:text-base opacity-85 leading-relaxed max-w-[95%] font-medium drop-shadow-sm">
                                {adData.description}
                            </p>
                        )}
                    </div>

                    <a 
                      href={adData.url}
                      target="_blank"
                      rel="nofollow sponsored"
                      className={`mt-8 w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 ${adData.accentColor}`}
                    >
                        {adData.cta} <ArrowUpRight size={18} strokeWidth={3} />
                    </a>
                </>
            )}
        </div>
    </div>
  );
};