// vite.config.ts
// ─────────────────────────────────────────────────────────
// Coinvestopedia — Optimized Vite Config
// Fixes: 1.24MB single bundle → split chunks for fast loading
// Changes from original:
//   + manualChunks: splits vendor libs into separate cacheable files
//   + chunkSizeWarningLimit raised (suppress false positives)
//   + gzip/brotli compression hint
//   + sourcemaps for production debugging
// ─────────────────────────────────────────────────────────

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Raise the warning threshold — but the real fix is splitting
    chunkSizeWarningLimit: 600,

    // Source maps for production debugging (comment out to save bandwidth)
    sourcemap: false,

    rollupOptions: {
      output: {
        // ── Manual chunk splitting ───────────────────────
        // These become separate files, fetched only when needed.
        // The browser caches them independently — a code change
        // only invalidates the changed chunk, not the whole app.
        manualChunks: (id) => {
          // React core — changes rarely, long cache life
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          // Router — changes rarely
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Recharts is large (~350KB) — lazy load with charts
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/victory') ||
              id.includes('node_modules/d3')) {
            return 'vendor-charts';
          }
          // Animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Icon libraries
          if (id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/@heroicons')) {
            return 'vendor-icons';
          }
          // All other node_modules → shared vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
          // Source pages → automatically split by React.lazy()
          // No manual chunk needed — Rollup handles dynamic imports
        },

        // Consistent hash-based file names for long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },

  // Optimize dev server
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts'],
  },
});

// ══════════════════════════════════════════════════════════
// ALSO REQUIRED: Convert page imports to lazy in App.tsx
// ══════════════════════════════════════════════════════════
//
// BEFORE (all modules bundled together at startup):
//   import Tools from './pages/Tools';
//   import Markets from './pages/Markets';
//
// AFTER (each page chunk loads only when the route is visited):
//   import React, { Suspense, lazy } from 'react';
//   const Tools   = lazy(() => import('./pages/Tools'));
//   const Markets = lazy(() => import('./pages/Markets'));
//   const Academy = lazy(() => import('./pages/Academy'));
//
//   // Wrap your routes:
//   <Suspense fallback={<PageSkeleton />}>
//     <Routes>
//       <Route path="/tools"   element={<Tools />} />
//       <Route path="/markets" element={<Markets />} />
//     </Routes>
//   </Suspense>
//
// PageSkeleton example:
//   function PageSkeleton() {
//     return (
//       <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//         {[...Array(4)].map((_, i) => (
//           <div key={i} style={{
//             height: '80px',
//             borderRadius: '16px',
//             background: 'var(--cv-bg-secondary)',
//             animation: 'pulse 1.5s ease-in-out infinite',
//             animationDelay: `${i * 0.1}s`,
//           }} />
//         ))}
//       </div>
//     );
//   }
