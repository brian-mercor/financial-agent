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
        'spin': 'spin 900ms linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        drift: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        rotateGlow: {
          to: { transform: 'rotate(360deg)' }
        },
        spin: {
          to: { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}