import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5175,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      },
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://*.tradingview.com",
          "style-src 'self' 'unsafe-inline' https://s3.tradingview.com",
          "img-src 'self' data: blob: https://*.tradingview.com https://s3.tradingview.com",
          "connect-src 'self' wss://*.tradingview.com https://*.tradingview.com https://api.openai.com https://*.supabase.co wss://*.supabase.co",
          "frame-src 'self' https://*.tradingview.com",
          "worker-src 'self' blob:",
          "child-src blob:",
          "object-src 'none'"
        ].join('; ')
      }
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    }
  }
})
