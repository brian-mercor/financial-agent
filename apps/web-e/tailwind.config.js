export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'gaegu': ['Gaegu', 'cursive'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFD166',
        background: '#F7F9FC',
        dark: '#2E3440',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out 0.5s infinite',
        'float-delay-2': 'float 3s ease-in-out 1s infinite',
        'float-delay-3': 'float 3s ease-in-out 1.5s infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}