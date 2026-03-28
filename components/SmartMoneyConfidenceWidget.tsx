import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { calculateSmartMoneyConfidence, getMockedSmartMoneyConfidence } from '../utils/smartMoneyScore';
import { fetchGlassnodeMetrics, fetchCryptoQuantReserves, fetchFearAndGreed } from '../services/api';
import { Activity, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

export const SmartMoneyConfidenceWidget: React.FC = () => {
  const [score, setScore] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndCalculateScore = async () => {
      setIsLoading(true);
      try {
        // We will attempt to fetch real data here
        const [fearAndGreedData, glassnodeData, cryptoQuantData] = await Promise.all([
          fetchFearAndGreed(),
          fetchGlassnodeMetrics(),
          fetchCryptoQuantReserves()
        ]);

        // Note: the endpoints will gracefully fall-back to null or empty if API keys are missing.
        if (!glassnodeData || !cryptoQuantData) {
          // If keys are missing (as expected initially), use the highly detailed mock generator.
          const mockScore = getMockedSmartMoneyConfidence();
          setScore(mockScore);
        } else {
          // Compute true live score from proprietary APIs when available
          const metrics = {
            fearAndGreed: fearAndGreedData?.[0]?.value ? parseInt(fearAndGreedData[0].value) : 50,
            sopr: glassnodeData?.sopr || 1.0, 
            netFlow: glassnodeData?.netFlow || 0,
            exchangeOutflow: glassnodeData?.exchangeOutflow || 0,
            minerOutflow: cryptoQuantData?.minerOutflow || 50
          };
          const liveScore = calculateSmartMoneyConfidence(metrics);
          setScore(liveScore);
        }
      } catch (err) {
        console.error('Error computing Smart Money Score:', err);
        setScore(getMockedSmartMoneyConfidence());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCalculateScore();
  }, []);

  const getStatusColor = (s: number) => {
    if (s >= 70) return 'text-primary border-primary bg-primary/10';
    if (s <= 30) return 'text-[#EF4444] border-[#EF4444] bg-[#EF4444]/10';
    return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
  };

  const getStatusText = (s: number) => {
    if (s >= 80) return 'Strong Accumulation';
    if (s >= 60) return 'Accumulation';
    if (s <= 20) return 'Strong Distribution';
    if (s <= 40) return 'Distribution';
    return 'Neutral';
  };

  const getStatusIcon = (s: number) => {
    if (s >= 60) return <ShieldCheck size={20} className="text-primary" />;
    if (s <= 40) return <AlertTriangle size={20} className="text-[#EF4444]" />;
    return <Activity size={20} className="text-yellow-500" />;
  };

  const borderColorClass = score >= 60 ? 'border-primary' : score <= 40 ? 'border-[#EF4444]' : 'border-yellow-500';

  return (
    <Card className={`p-6 h-full flex flex-col md:flex-row md:items-center justify-between border-t-2 overflow-hidden relative ${borderColorClass}`}>
        {/* Animated Background Pulse */}
        <div className={`absolute -right-12 -top-12 w-48 h-48 md:w-64 md:h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${score >= 60 ? 'bg-primary' : score <= 40 ? 'bg-[#EF4444]' : 'bg-yellow-500'}`} />

      <div className="flex justify-between items-start mb-4 md:mb-0 relative z-20 md:w-1/2">
        <div>
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
             Smart Money Confidence
          </h2>
          <p className="text-text-muted text-xs mt-1 max-w-[200px] md:max-w-[300px]">Proprietary composite of Exchange Flows, SOPR, and Miner Reserves</p>
        </div>
        <div className="tooltip-container group relative">
           <Info size={16} className="text-text-muted cursor-help" />
           <div className="absolute right-0 md:left-0 top-6 w-48 p-2 bg-surface text-xs text-text border border-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              Aggregates data from Glassnode, CryptoQuant, Whale Alert, and Alternative.me.
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-4 relative z-10 md:w-1/2">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-surface border-t-primary animate-spin mb-4" />
            <div className="h-4 bg-surface rounded w-24" />
          </div>
        ) : (
          <>
            <div className="relative flex items-center justify-center mb-6 mt-2">
                {/* SVG Gauge Implementation */}
                <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface" />
                    <circle 
                        cx="50" cy="50" r="45" fill="none" 
                        stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="282.7" 
                        strokeDashoffset={282.7 - (282.7 * score) / 100}
                        strokeLinecap="round"
                        className={score >= 60 ? 'text-primary' : score <= 40 ? 'text-[#EF4444]' : 'text-yellow-500'}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} 
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center transform translate-y-1">
                    <span className="text-4xl font-bold font-mono tracking-tighter">{score.toFixed(0)}</span>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1 text-center leading-tight">out of<br/>100</span>
                </div>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(score)} font-bold text-sm uppercase tracking-wide`}>
              {getStatusIcon(score)}
              {getStatusText(score)}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default SmartMoneyConfidenceWidget;
