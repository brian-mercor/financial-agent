# FinAgent Web-C - Neo-Brutalist Financial Assistant

A Neo-Brutalist themed financial assistant web application featuring AI-powered market analysis, real-time trading insights, and portfolio optimization.

## Features

- 🎨 **Neo-Brutalist Design** - Exact replica of the brutal design system with monolithic UI
- 🤖 **5 AI Agents** - Specialized assistants for different financial needs
- 📊 **Real-time Charts** - TradingView integration for market data visualization
- 🔒 **Authentication** - Login/Signup with protected dashboard
- 📱 **Responsive** - Works on all devices

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Port Configuration

- Development: `http://localhost:5176`
- API Proxy: Routes to `http://localhost:3000`

## Design System

### Colors
- Background: `#0A0A0A` (brutal-bg)
- Foreground: `#F5F5F5` (brutal-fg)
- Accent: `#FF2D2D` (brutal-red)
- Ink: `#111111` (brutal-ink)
- Gray: `#1C1C1C` (brutal-gray)
- Line: `#2A2A2A` (brutal-line)

### Typography
- Headings: Space Grotesk (400, 600, 700, 800)
- Body: Space Grotesk
- Monospace: Space Mono (400, 700)

### Components
- `.brutal-card` - Main card component with shadow
- `.btn-brutal` - Primary action button
- `.btn-ghost` - Secondary button
- `.stroke-text` - Outlined text effect
- `.ticker` - Animated scrolling text
- `.scanline` - Retro monitor effect
- `.concrete` - Textured background

## Pages

1. **Landing Page** (`/`) - Neo-brutalist hero with interactive console
2. **Login** (`/login`) - Authentication page
3. **Sign Up** (`/signup`) - Registration page
4. **Dashboard** (`/dashboard`) - Protected AI chat interface

## AI Assistants

- **General Assistant** - All-purpose financial AI
- **Market Analyst** - Technical analysis and trends
- **Trading Advisor** - Trading strategies and signals
- **Portfolio Manager** - Asset allocation and optimization
- **Risk Manager** - Risk assessment and mitigation

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Chart.js
- Lucide Icons
- React Markdown

## Styling

The app uses a combination of:
- Tailwind CSS for utility classes
- Custom CSS in `/src/styles/brutal.css` for Neo-Brutalist effects
- Inline styles for dynamic values

## Development

The app is structured as follows:

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── contexts/      # React contexts
├── services/      # API services
├── config/        # Configuration files
└── styles/        # CSS files
```

## Notes

- The landing page (`BrutalLandingPage.jsx`) is an exact replica of the Neo-Brutalist design
- Interactive console simulates AI responses
- Charts use Chart.js for sparklines and portfolio performance
- All animations and effects match the original design