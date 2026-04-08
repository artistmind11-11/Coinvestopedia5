import React, { useState } from 'react';

type LogoVariant = 'color' | 'mono' | 'white';

interface ExchangeLogoProps {
  exchangeId: string;
  exchangeName: string;
  size?: number;
  variant?: LogoVariant;
  className?: string;
  showFallback?: boolean;   // Show colored initial badge if logo unavailable
}

const BRAND_COLORS: Record<string, string> = {
  coinbase: '#0052FF',
  binance: '#F0B90B',
  kraken: '#5741D9',
  okx: '#000000',
  bybit: '#F7A600',
  gemini: '#00DCFA',
  kucoin: '#23AF91',
  bitstamp: '#00922E',
  dydx: '#6966FF',
  hyperliquid: '#00FF94'
};

export const ExchangeLogo: React.FC<ExchangeLogoProps> = ({
  exchangeId,
  exchangeName,
  size = 40,
  variant = 'color',
  className = '',
  showFallback = true
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getLogoPath = (): string => {
    const folder = variant === 'color' ? 'color'
      : variant === 'mono' ? 'mono'
      : 'white';
    return `/assets/exchanges/${folder}/${exchangeId}.svg`;
  };

  // Fallback: colored initial badge using brand color
  if (hasError && showFallback) {
    const color = BRAND_COLORS[exchangeId] || '#3f3f46';
    const initial = exchangeName.charAt(0).toUpperCase();

    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color + '20',
          border: `1.5px solid ${color}40`,
          borderRadius: size * 0.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.42,
          fontWeight: 700,
          color: color,
          flexShrink: 0
        }}
        className={className}
        aria-label={`${exchangeName} logo`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}
      className={className}
    >
      {isLoading && (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: '#27272a',
            borderRadius: size * 0.25,
            position: 'absolute'
          }}
          className="animate-pulse"
        />
      )}
      <img
        src={getLogoPath()}
        alt={`${exchangeName} logo`}
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.2s ease'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};
