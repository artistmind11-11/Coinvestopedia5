// src/hooks/useChartColors.ts
// Returns mode-aware chart colors for Recharts.
// Usage:
//   const chart = useChartColors();
//   <CartesianGrid stroke={chart.grid} />
//   <Line stroke={chart.colors[0]} />
//   <Tooltip contentStyle={chart.tooltipStyle} />

import { useMemo } from 'react';
import { useTheme } from './useTheme';

export interface ChartColors {
  colors: string[];          // ordered series colors
  grid: string;              // CartesianGrid stroke
  tick: string;              // XAxis / YAxis tick color
  tooltipStyle: React.CSSProperties;
  activeDot: object;
  profitColor: string;
  lossColor: string;
  // Convenience accessors
  primary: string;
  secondary: string;
  tertiary: string;
  danger: string;
}

export function useChartColors(): ChartColors {
  const { isDark } = useTheme();

  return useMemo(() => {
    const colors = isDark
      ? ['#4D8FFF', '#00E5B0', '#FCD34D', '#FF6B6B', '#C084FC', '#60A5FA']
      : ['#0057FF', '#00D4A0', '#F59E0B', '#FF4444', '#A855F7', '#3B82F6'];

    const grid    = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    const tick    = isDark ? '#4A5568' : '#9CA3AF';
    const tooltipBg = isDark ? '#1A2235' : '#FFFFFF';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';

    return {
      colors,
      grid,
      tick,
      profitColor: isDark ? '#00E5B0' : '#00D4A0',
      lossColor:   isDark ? '#FF6B6B' : '#FF4444',
      primary:     colors[0],
      secondary:   colors[1],
      tertiary:    colors[2],
      danger:      colors[3],
      tooltipStyle: {
        backgroundColor: tooltipBg,
        border: `1px solid ${tooltipBorder}`,
        borderRadius: '10px',
        boxShadow: isDark
          ? '0 8px 24px rgba(0,0,0,0.4)'
          : '0 4px 12px rgba(0,0,0,0.08)',
        color: isDark ? '#E8ECF4' : '#0D1117',
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        padding: '10px 14px',
      },
      activeDot: {
        r: 5,
        strokeWidth: 2,
        stroke: colors[0],
        fill: isDark ? '#1A2235' : '#FFFFFF',
      },
    };
  }, [isDark]);
}
