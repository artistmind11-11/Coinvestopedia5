import React from 'react';

interface FloatingCard {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
}

interface FloatingCardSectionProps {
  cards: FloatingCard[];
}

export const FloatingCardSection: React.FC<FloatingCardSectionProps> = ({ cards }) => {
  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent"></div>
      
      <div className="relative z-10 flex items-center justify-center gap-8 perspective-1000">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group"
            style={{
              transform: `rotateY(${(i - 1) * 12}deg) translateZ(${Math.abs(i - 1) * -20}px)`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 min-w-[200px] shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {card.icon}
                </div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-bold">
                  {card.title}
                </div>
              </div>
              <div className="text-2xl font-bold text-text mb-1">
                {card.value}
              </div>
              {card.change && (
                <div className={`text-sm font-semibold ${
                  card.change.startsWith('+') ? 'text-primary' : 'text-red-400'
                }`}>
                  {card.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};