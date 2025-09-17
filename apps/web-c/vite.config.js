import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5176,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      },
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://*.tradingview.com https://cdn.jsdelivr.net",
          "style-src 'self' 'unsafe-inline' https://s3.tradingview.com https://fonts.googleapis.com",
          "img-src 'self' data: blob: https://*.tradingview.com https://s3.tradingview.com",
          "connect-src 'self' wss://*.tradingview.com https://*.tradingview.com https://api.openai.com https://*.supabase.co wss://*.supabase.co",
          "frame-src 'self' https://*.tradingview.com",
          "font-src 'self' https://fonts.gstatic.com",
          "worker-src 'self' blob:",
          "child-src blob:",
          "object-src 'none'"
        ].join('; ')
      }
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3000/api'),
    }
  }
})