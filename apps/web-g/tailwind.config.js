/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'gradientShift': 'gradientShift 8s ease infinite',
        'skateFloat': 'skateFloat 4s ease-in-out infinite',
        'rotate': 'rotate 20s linear infinite',
        'iconPulse': 'iconPulse 2s ease-in-out infinite',
        'textGlow': 'textGlow 2s ease-in-out infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        skateFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        rotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        iconPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          },
          '50%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.8)'
          }
        },
        textGlow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' },
          '50%': { textShadow: '0 0 20px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 0, 150, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}