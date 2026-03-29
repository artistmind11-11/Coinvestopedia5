// src/components/ThemeToggle.tsx
// Animated dark/light mode toggle button.
// Usage: <ThemeToggle />

import { useTheme } from '../hooks/useTheme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`theme-toggle ${className}`}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className={`theme-toggle-icon ${isDark ? 'moon' : 'sun'}`}>
        {isDark ? '☀️' : '🌙'}
      </span>
      <style>{`
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--cv-border-md);
          background: var(--cv-bg-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--cv-text-secondary);
          font-size: 16px;
          line-height: 1;
        }
        .theme-toggle:hover {
          background: var(--cv-bg-tertiary);
          border-color: var(--cv-border-strong);
          transform: scale(1.05);
        }
        .theme-toggle:active { transform: scale(0.95); }
        .theme-toggle-icon { display: flex; }
      `}</style>
    </button>
  );
}

// ── Alternate: Slide Track Toggle ──────────────────────────

export function ThemeToggleTrack({ className = '' }: { className?: string }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`theme-track-toggle ${isDark ? 'dark' : 'light'} ${className}`}
    >
      <span className="theme-track-thumb" />
      <span className="theme-track-label">{isDark ? 'Dark' : 'Light'}</span>
      <style>{`
        .theme-track-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: var(--radius-full);
          border: 1px solid var(--cv-border-md);
          background: var(--cv-bg-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
          font-weight: 500;
          color: var(--cv-text-secondary);
          font-family: var(--font-body);
        }
        .theme-track-toggle:hover { border-color: var(--cv-border-strong); }
        .theme-track-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--cv-text);
          flex-shrink: 0;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }
        .theme-track-toggle.dark .theme-track-thumb::after { content: '🌙'; font-size: 10px; }
        .theme-track-toggle.light .theme-track-thumb::after { content: '☀️'; font-size: 10px; }
        .theme-track-label { color: var(--cv-text-secondary); }
      `}</style>
    </button>
  );
}
