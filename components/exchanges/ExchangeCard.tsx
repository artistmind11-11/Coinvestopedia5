import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Shield, CheckCircle, XCircle } from 'lucide-react';
import { ClearRateBadge } from './ClearRateBadge';
import { RiskFlags } from './RiskFlags';
import { ExchangeProfile } from '../../data/exchanges';

interface ExchangeCardProps {
  exchange: ExchangeProfile;
  rank: number;
}

export const ExchangeCard: React.FC<ExchangeCardProps> = ({ exchange, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const formatFee = (fee: number): string => {
    if (fee < 0) return `${(fee * 100).toFixed(3)}% (rebate)`;
    if (fee === 0) return '0.00%';
    return `${(fee * 100).toFixed(3)}%`;
  };

  return (
    <div
      id={exchange.id}
      className="leather-card rounded-xl overflow-hidden scroll-mt-24"
    >
      {/* Collapsed Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between gap-4 hover:bg-surface/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Rank */}
          <span className="text-2xl font-bold text-text-muted/30 w-8 shrink-0">
            #{rank}
          </span>



          {/* Name + Best For */}
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-text">{exchange.name}</h3>
            <p className="text-xs text-text-muted truncate">{exchange.bestFor}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {/* Key Stats Strip */}
          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase font-bold">Taker Fee</p>
              <p className="font-mono font-bold text-sm">{formatFee(exchange.fees.spotTaker)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase font-bold">US Access</p>
              <p className={`font-bold text-sm ${
                exchange.usPersonsEligible === true ? 'text-emerald-400'
                : exchange.usPersonsEligible === 'LIMITED' ? 'text-amber-400'
                : 'text-red-400'
              }`}>
                {exchange.usPersonsEligible === true ? 'Yes'
                  : exchange.usPersonsEligible === 'LIMITED' ? 'Limited'
                  : 'No'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase font-bold">Risk Flags</p>
              <p className={`font-bold text-sm ${
                exchange.riskFlags.length === 0 ? 'text-emerald-400'
                : exchange.riskFlags.some(f => f.includes('⚠️')) ? 'text-red-400'
                : 'text-amber-400'
              }`}>
                {exchange.riskFlags.length === 0 ? 'None' : `${exchange.riskFlags.length}`}
              </p>
            </div>
          </div>

          {/* ClearRate Score */}
          <ClearRateBadge score={exchange.clearRateScore} grade={exchange.grade} size="sm" />

          {/* Expand Icon */}
          <ChevronDown
            size={20}
            className={`text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border p-6 space-y-8 animate-fade-in">

          {/* Header Row: Logo + Score + CTAs */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex items-center gap-6">

              <ClearRateBadge
                score={exchange.clearRateScore}
                grade={exchange.grade}
                size="lg"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
              <a
                href={exchange.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-background
                  font-bold rounded-xl hover:bg-primary-dark transition-all
                  shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                {exchange.ctaLabel}
                <ExternalLink size={14} />
                <sup className="text-[9px] opacity-70">A</sup>
              </a>
              {exchange.ctaLabelSecondary && exchange.affiliateUrlSecondary && (
                <a
                  href={exchange.affiliateUrlSecondary}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-2 px-6 py-3 bg-surface border border-border
                    text-text font-bold rounded-xl hover:border-primary transition-all"
                >
                  {exchange.ctaLabelSecondary}
                  <ExternalLink size={14} />
                  <sup className="text-[9px] opacity-70">A</sup>
                </a>
              )}
            </div>
          </div>

          {/* Risk Flags — render FIRST if present */}
          {exchange.riskFlags.length > 0 && (
            <RiskFlags flags={exchange.riskFlags} />
          )}

          {/* Fee Table */}
          <div className="leather-card rounded-xl p-5">
            <h4 className="font-bold text-sm uppercase tracking-widest text-text-muted mb-4">
              Fee Structure
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Spot Maker', value: formatFee(exchange.fees.spotMaker) },
                { label: 'Spot Taker', value: formatFee(exchange.fees.spotTaker) },
                { label: 'Perp Maker', value: formatFee(exchange.fees.perpMaker) },
                { label: 'Perp Taker', value: formatFee(exchange.fees.perpTaker) }
              ].map(item => (
                <div key={item.label} className="text-center p-3 bg-background rounded-lg border border-border">
                  <p className="text-[10px] text-text-muted font-bold uppercase mb-1">{item.label}</p>
                  <p className={`font-mono font-bold text-sm ${
                    item.value.includes('rebate') ? 'text-emerald-400' : 'text-text'
                  }`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Licenses */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-text-muted mb-3">
              Regulatory Licenses
            </h4>
            <div className="flex flex-wrap gap-2">
              {exchange.regulatoryLicenses.map((license, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface
                  border border-border rounded-full text-xs font-bold">
                  <Shield size={10} className="text-primary" />
                  {license}
                </span>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-emerald-400 mb-3">
                Advantages
              </h4>
              <ul className="space-y-2">
                {exchange.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-red-400 mb-3">
                Limitations
              </h4>
              <ul className="space-y-2">
                {exchange.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
