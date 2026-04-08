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
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env': env
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 2000,
      }
    };
});
