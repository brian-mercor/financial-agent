/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 8s ease-in-out infinite',
        'drift': 'drift 140s linear infinite',
        'rotateGlow': 'rotateGlow 16s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 900ms linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        drift: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' }
        },
        rotateGlow: {
          'to': { transform: 'rotate(360deg)' }
        }
      },
      colors: {
        'gold': '#FFD36E',
        'gold-2': '#F9C847',
        'gold-3': '#F2B807',
        'deep-purple': '#0C0616',
        'violet-700': '#5B2A86',
        'violet-800': '#4C1D95',
        'ink': '#120B1A',
        'surface': 'rgba(22, 8, 36, 0.76)',
      },
      fontFamily: {
        'cardo': ['Cardo', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}