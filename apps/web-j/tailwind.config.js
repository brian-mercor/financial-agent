export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact colors from template
        bg: '#0a0b0c',
        ink: '#0b0c0d',
        paper: '#0f1012',
        line: '#131417',
        gold: '#d2b26d',
        'gold-2': '#b59657',
        'gold-dim': '#8a7444',
        text: '#ececec',
        muted: 'rgba(255,255,255,.68)',
        dim: 'rgba(255,255,255,.40)',
        'ink-veil': 'rgba(255,255,255,0.04)',
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'inter': ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'mono': ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll-x': 'scroll-x 28s linear infinite',
      },
      keyframes: {
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}