/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      colors: {
        brutal: {
          bg: '#0A0A0A',
          fg: '#F5F5F5',
          red: '#FF2D2D',
          ink: '#111111',
          gray: '#1C1C1C',
          line: '#2A2A2A'
        }
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}