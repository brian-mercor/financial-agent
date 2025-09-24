import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load all env vars (including NEXT_PUBLIC_*)
  const env = loadEnv(mode, process.cwd(), '')
  // Debug: show proxy target
  let apiTarget = env.VITE_API_URL || 'http://localhost:3000'
  // Normalize localhost to IPv4 to avoid ::1 connection issues
  apiTarget = apiTarget.replace('http://localhost', 'http://127.0.0.1')
  console.log('[vite] proxy target =', apiTarget)

  return {
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        '/api': {
          // Prefer configured API URL; fallback to localhost:3000
          target: apiTarget,
          changeOrigin: true,
          secure: false
        }
      },
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://*.tradingview.com",
          "style-src 'self' 'unsafe-inline' https://s3.tradingview.com https://fonts.googleapis.com https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://*.tradingview.com https://s3.tradingview.com",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* ws://localhost:* wss://localhost:* wss://*.tradingview.com https://*.tradingview.com https://api.openai.com https://*.supabase.co wss://*.supabase.co",
          "frame-src 'self' https://*.tradingview.com",
          "worker-src 'self' blob:",
          "child-src blob:",
          "object-src 'none'"
        ].join('; ')
      }
    },
    define: {
      // Map NEXT_PUBLIC_ env vars to be accessible via import.meta.env
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    }
  }
})
