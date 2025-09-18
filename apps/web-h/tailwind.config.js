export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'grotesk': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'batik-indigo': '#1e3a5f',
        'batik-brown': '#6b4423',
        'quantum-glow': '#00d4ff',
        'memory-purple': '#8b5cf6',
      },
      animation: {
        'quantum-float': 'quantum-float 20s infinite linear',
        'pulse-line': 'pulse-line 3s ease-in-out infinite',
        'memory-pulse': 'memory-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float-up': 'float-up 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'dash': 'dash 20s linear infinite',
      },
      keyframes: {
        'quantum-float': {
          '0%': { transform: 'translate(0, 100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translate(200px, -100vh) rotate(720deg)', opacity: '0' }
        },
        'pulse-line': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' }
        },
        'memory-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.5)', opacity: '1' }
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        'float-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'dash': {
          'to': { 'stroke-dashoffset': '-100' }
        }
      }
    },
  },
  plugins: [],
}