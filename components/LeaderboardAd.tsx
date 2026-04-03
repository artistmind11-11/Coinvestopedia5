import React from 'react';
import { AdUnit } from './AdUnit';

interface LeaderboardAdProps {
  partner?: string;
  className?: string;
}

export const LeaderboardAd: React.FC<LeaderboardAdProps> = ({ partner = 'binance', className = '' }) => (
  <div className={`hidden md:flex justify-center w-full ${className}`}>
    <AdUnit size="leaderboard" partner={partner} label="Advertisement" />
  </div>
);
