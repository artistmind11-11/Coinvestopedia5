import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/cryptopanic': {
            target: 'https://cryptopanic.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/cryptopanic/, '')
          },
          '/rss/coindesk': {
            target: 'https://www.coindesk.com',
            changeOrigin: true,
            rewrite: () => '/arc/outboundfeeds/rss/'
          },
          '/rss/theblock': {
            target: 'https://www.theblock.co',
            changeOrigin: true,
            rewrite: () => '/rss.xml'
          },
          '/rss/decrypt': {
            target: 'https://decrypt.co',
            changeOrigin: true,
            rewrite: () => '/feed'
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (
                  id.includes('react') || 
                  id.includes('react-dom') || 
                  id.includes('scheduler') ||
                  id.includes('prop-types')
                ) {
                  return 'foundation';
                }
                if (id.includes('lucide-react')) {
                  return 'vendor-icons';
                }
                if (id.includes('framer-motion')) {
                  return 'vendor-motion';
                }
                if (id.includes('recharts')) {
                  return 'vendor-charts';
                }
                return 'vendor-libs';
              }
            }
          }
        },
        chunkSizeWarningLimit: 1000,
      }
    };
});
