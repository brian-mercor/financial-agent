export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'jakarta': ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        // Exact colors from template
        bg: '#0b0c16',
        panel: 'rgba(255, 255, 255, 0.06)',
        'panel-strong': 'rgba(255, 255, 255, 0.12)',
        text: '#e9ecf5',
        muted: '#a4acc2',
        link: '#8bd3ff',
        accent: '#ff6bb3',
        'accent-2': '#ffb400',
        'accent-3': '#2e6af6',
        good: '#3ce6b2',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderRadius: {
        'default': '16px',
      },
      boxShadow: {
        'ring': '0 0 0 8px rgb(255 107 179 / 12%)',
        'shadow-1': '0 10px 30px rgba(0,0,0,0.35)',
        'shadow-2': '0 30px 80px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'gradient': 'linear-gradient(120deg, #5b1aa1 0%, #b32fd3 15%, #e33ba0 30%, #ff6b6b 45%, #ffb400 60%, #00bfa6 75%, #2e6af6 90%, #5b1aa1 100%)',
        'page': `
          radial-gradient(1200px 800px at 10% -20%, #301a44 0%, transparent 60%),
          radial-gradient(1200px 800px at 110% 20%, #0a1f3f 0%, transparent 60%),
          linear-gradient(180deg, #0b0c16 0%, #0b0c16 50%, #070812 100%)
        `,
      },
    },
  },
  plugins: [],
}