import React from 'react';
import { Grade } from '../../data/exchanges';

interface ClearRateBadgeProps {
  score: number;
  grade: Grade;
  size?: 'sm' | 'md' | 'lg';
}

const GRADE_CONFIG: Record<Grade, { label: string; color: string; bg: string; border: string }> = {
  INSTITUTIONAL: {
    label: 'INSTITUTIONAL GRADE',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  PROFESSIONAL: {
    label: 'PROFESSIONAL GRADE',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  ACTIVE_TRADER: {
    label: 'ACTIVE TRADER GRADE',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 80) return 'text-blue-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
};

export const ClearRateBadge: React.FC<ClearRateBadgeProps> = ({
  score,
  grade,
  size = 'md'
}) => {
  const config = GRADE_CONFIG[grade];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Score Circle */}
      <div className={`relative flex items-center justify-center ${
        size === 'lg' ? 'w-20 h-20' :
        size === 'md' ? 'w-14 h-14' : 'w-10 h-10'
      }`}>
        <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke="#27272a" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke="currentColor" strokeWidth="3"
            strokeDasharray={`${score} ${100 - score}`}
            strokeLinecap="round"
            className={getScoreColor(score)}
          />
        </svg>
        <span className={`font-bold font-mono relative z-10 ${
          size === 'lg' ? 'text-xl' :
          size === 'md' ? 'text-sm' : 'text-xs'
        } ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>

      {/* Grade Badge */}
      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5
        rounded border ${config.color} ${config.bg} ${config.border}`}>
        {config.label}
      </span>

      {/* ClearRate label */}
      <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">
        ClearRate™
      </span>
    </div>
  );
};
