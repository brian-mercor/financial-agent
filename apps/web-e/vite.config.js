import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5177,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      },
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://*.tradingview.com",
          "style-src 'self' 'unsafe-inline' https://s3.tradingview.com https://fonts.googleapis.com https://cdn.jsdelivr.net",
          "img-src 'self' data: blob: https://*.tradingview.com https://s3.tradingview.com https://randomuser.me https://images.unsplash.com https://via.placeholder.com",
          "connect-src 'self' wss://*.tradingview.com https://*.tradingview.com https://api.openai.com https://*.supabase.co wss://*.supabase.co",
          "frame-src 'self' https://*.tradingview.com",
          "worker-src 'self' blob:",
          "child-src blob:",
          "object-src 'none'",
          "font-src 'self' https://fonts.gstatic.com"
        ].join('; ')
      }
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    }
  }
})