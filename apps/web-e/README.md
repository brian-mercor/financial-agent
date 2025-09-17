# Web-E - FinAgent Frontend

A React-based financial assistant application with the exact styling of web-d.html but featuring FinAgent content.

## Features

- **Exact Web-D Styling**: Matches the mystical tarot-inspired design with golden borders and starfield backgrounds
- **FinAgent Content**: 6 specialized AI financial assistants for market analysis and trading
- **Authentication System**: Login and signup pages with protected dashboard
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Tech Stack

- React 19
- React Router DOM
- Tailwind CSS
- Lucide React Icons
- React Markdown

## Design Elements

The application features the exact same mystical design system from web-d.html:

- **Color Palette**:
  - Gold gradients (#FFD36E, #F9C847, #F2B807)
  - Deep purple backgrounds
  - Purple glass morphism effects

- **Visual Effects**:
  - Animated starfield background
  - Rotating glow animations
  - Ornate corner borders
  - Tarot-panel cards with blur effects

- **Typography**:
  - Inter font family
  - Gold gradient text with shimmer animation
  - Consistent hierarchy

## Pages

### Landing Page (`/`)
- AI assistant selector cards
- Interactive demo console
- Feature showcase with exact web-d styling

### Login Page (`/login`)
- Authentication form with glass morphism
- Demo credentials display
- Feature cards with tarot styling

### Sign Up Page (`/signup`)
- Registration form with ornate borders
- Benefits showcase
- Trust indicators

### Dashboard (`/dashboard`)
- Protected route requiring authentication
- AI assistant chat interface
- Portfolio summary widget
- Real-time messaging with markdown support

## Running the App

```bash
# Install dependencies
npm install

# Start development server (runs on port 5177)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Authentication

The app uses mock authentication for demo purposes. Any email/password combination will work for login.

## Styling Philosophy

This app demonstrates pixel-perfect recreation of the web-d.html mystical design system while completely replacing the content from a book assistance tool (iChatbook) to a financial AI platform (FinAgent).

All styling elements are preserved:
- Tarot panel cards with ornate corners
- Gold gradient buttons with hover effects
- Chip selection elements
- Spinner animations
- Input field focus states
- Mobile-responsive drawer animations
