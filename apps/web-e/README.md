# FinAgent Web-E

AI-powered financial intelligence platform with a playful, hand-drawn aesthetic.

## Features

- 🎨 Unique hand-drawn, outsider art style design
- 🤖 6 Specialized AI Financial Assistants
- 📊 Real-time market analysis and charting
- 🛡️ Advanced risk management tools
- 💼 Portfolio optimization and tracking
- 🚀 Lightning-fast streaming responses

## Design System

This app uses a distinctive design system inspired by outsider art:
- **Font Families**: Gaegu (hand-drawn) and Quicksand
- **Color Palette**:
  - Primary: #FF6B6B (Coral)
  - Secondary: #4ECDC4 (Turquoise)
  - Accent: #FFD166 (Yellow)
  - Background: #F7F9FC (Light Blue)
  - Dark: #2E3440 (Navy)
- **Components**: Folk cards with thick borders and box shadows
- **Buttons**: Outsider-style with hover animations
- **Decorative Elements**: Hand-drawn circles and scribbles

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will run on http://localhost:5177

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
web-e/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   ├── config/          # Configuration files
│   ├── styles/          # Global styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

## AI Assistants

1. **Market Analyst** - Technical analysis and market trends
2. **Trading Advisor** - Trading strategies and risk management
3. **Portfolio Manager** - Asset allocation and diversification
4. **Financial Planner** - Long-term planning and retirement
5. **Risk Manager** - Risk assessment and hedging
6. **Economic Analyst** - Macro trends and policy analysis

## Authentication

The app includes a complete authentication flow:
- Sign up with email and password
- Login with remember me option
- Protected dashboard routes
- Persistent sessions

## API Integration

The app connects to the backend API at port 3000 (Motia) through a proxy configuration. All API requests follow a standardized format for consistency across frontend applications.

## Styling

The app uses Tailwind CSS with custom utility classes for the unique design system. Key styling features:
- Folk-style cards with thick borders
- Outsider buttons with box shadows
- Hand-drawn background patterns
- Rainbow gradient text effects
- Floating animations
- Responsive mobile menu

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private - All rights reserved