import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskFlagProps {
  flags: string[];
}

export const RiskFlags: React.FC<RiskFlagProps> = ({ flags }) => {
  if (flags.length === 0) return null;

  const isHighRisk = flags.some(f => f.includes('⚠️'));

  return (
    <div className={`rounded-xl border p-4 ${
      isHighRisk
        ? 'bg-red-500/5 border-red-500/20'
        : 'bg-amber-500/5 border-amber-500/20'
    }`}>
      <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest ${
        isHighRisk ? 'text-red-400' : 'text-amber-400'
      }`}>
        <AlertTriangle size={14} />
        {isHighRisk ? 'HIGH RISK FLAGS' : 'RISK FLAGS'}
      </div>
      <ul className="space-y-2">
        {flags.map((flag, i) => (
          <li key={i} className={`text-xs leading-relaxed ${
            isHighRisk ? 'text-red-300' : 'text-amber-300'
          }`}>
            {flag}
          </li>
        ))}
      </ul>
    </div>
  );
};
