import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

// Helper function to generate random values within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const TICKERS = [
  'BTCUSD', 'ETHUSD', 'SOLUSD', // Crypto
  'SPX', 'NDAQ', 'AAPL', 'NVDA', // Stocks
  'EUR/USD', 'USD/JPY', 'GBP/USD', // Forex
  'XAU/USD', 'XAG/USD' // Commodities
];

export const Background: React.FC = () => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth);
      mouseY.set(event.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const xSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const ySpring = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const moveX = useTransform(xSpring, [0, 1], [20, -20]);
  const moveY = useTransform(ySpring, [0, 1], [20, -20]);

  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    const generatedElements = Array.from({ length: 40 }).map(() => {
      const typeRandom = Math.random();
      const type = typeRandom > 0.7 ? 'ticker' : 'candle';
      const isGreen = Math.random() > 0.5;
      
      // Candle logic
      const height = random(40, 100);
      const bodyHeight = random(10, height * 0.8);
      const bodyOffset = random(0, height - bodyHeight);

      return {
        type,
        ticker: TICKERS[Math.floor(Math.random() * TICKERS.length)],
        left: `${random(2, 98)}%`,
        top: `${random(5, 95)}%`,
        delay: random(0, 20),
        duration: random(20, 60),
        isGreen,
        scale: random(0.5, 1.2),
        // Dark mode: subtle. Light mode: more visible.
        opacityBase: random(0.06, 0.14),
        // Candle specific
        height,
        bodyHeight,
        bodyOffset
      };
    });
    setElements(generatedElements);
  }, []);

  // Scale opacity based on theme: light mode needs higher values to show against white background
  const opacityMultiplier = isDark ? 0.7 : 1.8;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background transition-colors duration-300">
      {/* Deep Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          opacity: isDark ? 0.06 : 0.20,
          backgroundImage: isDark
            ? `linear-gradient(rgba(16,185,129,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.35) 1px, transparent 1px)`
            : `linear-gradient(rgba(16,185,129,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.45) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Floating Candlestick & Ticker Elements */}
      {elements.map((el, i) => {
        const finalOpacity = Math.min(el.opacityBase * opacityMultiplier, 0.35);
        return (
          <motion.div
            key={`el-${i}`}
            className="absolute"
            initial={{ y: 150, opacity: 0 }}
            animate={{ 
              y: -150, 
              opacity: [0, finalOpacity, finalOpacity, 0],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "linear"
            }}
            style={{
              left: el.left,
              top: el.top,
              scale: el.scale
            }}
          >
            {el.type === 'candle' ? (
              // Realistic Candle Rendering
              <div className="relative flex flex-col items-center" style={{ height: `${el.height}px` }}>
                {/* Wick */}
                <div 
                  className={`absolute w-[1.5px] h-full ${el.isGreen ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}
                  style={{ opacity: isDark ? 0.6 : 0.9 }}
                />
                {/* Body */}
                <div 
                  className={`absolute w-3 rounded-[1px] ${el.isGreen ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}
                  style={{ 
                    height: `${el.bodyHeight}px`,
                    top: `${el.bodyOffset}px`,
                    opacity: isDark ? 0.8 : 1.0
                  }}
                />
              </div>
            ) : (
              // Ticker Text — light mode uses dark ink, dark mode uses white
              <div
                className="font-mono text-xs font-bold tracking-widest select-none whitespace-nowrap"
                style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)' }}
              >
                {el.ticker}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Glowing Orbs with Parallax */}
      <motion.div 
        style={{ y: y1, x: moveX, scale: 1.2 }}
        className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] ${isDark ? 'bg-[#10B981]/5' : 'bg-[#10B981]/10'}`}
      />
      <motion.div 
        style={{ y: y2, x: moveY, scale: 1.3 }}
        className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] ${isDark ? 'bg-[#10B981]/5' : 'bg-[#10B981]/10'}`}
      />
      
      {/* Chart Line Decoration at bottom */}
      <svg className="absolute bottom-0 left-0 w-full h-48" style={{ opacity: isDark ? 0.03 : 0.06 }} preserveAspectRatio="none">
         <motion.path
           d="M0,200 L100,180 L200,220 L300,100 L400,150 L500,50 L600,120 L700,80 L800,180 L900,140 L1000,200 L1100,160 L1200,220 L1300,100 L1400,180 L1500,120 L1600,200 L1700,150 L1800,250 L1920,200 V300 H0 Z"
           fill="url(#bg-gradient)"
           stroke="none"
         />
         <defs>
           <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
             <stop offset="100%" stopColor="transparent" />
           </linearGradient>
         </defs>
      </svg>
    </div>
  );
};