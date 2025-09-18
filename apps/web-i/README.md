# FinAgent - Web-i

AI-powered financial trading companion with a unique design system that matches the exact style of the web-i template.

## Features

- **Exact Template Style**: Pixel-perfect implementation of the web-i.html template design
- **AI Trading Assistants**: Market Analyst, Trading Advisor, and Portfolio Manager
- **Real-time Streaming**: Server-sent events for streaming AI responses
- **Supabase Authentication**: Secure user authentication with Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5181

## Pages

- **Landing Page** (`/`): Marketing page with demo panel matching exact template style
- **Login** (`/login`): Sign in with email/password or social providers
- **Sign Up** (`/sign-up`): Create a new account
- **Dashboard** (`/dashboard`): Protected chat interface with AI assistants

## Design System

The app uses the exact color scheme and component styles from the template:

- Background: `#060608`
- Panel: `#0b0d12`
- Primary: `#2d7dff`
- Accent Red: `#ff3131`
- Accent Yellow: `#ffc83a`
- Gradient: `linear-gradient(135deg, #ff3131 0%, #ffc83a 50%, #2d7dff 100%)`

## API Integration

The app connects to the backend API at port 3000 for:
- Chat streaming endpoints (`/api/chat/stream`)
- Real-time market analysis
- Trading signals and portfolio recommendations

## Authentication

Supports two modes:
1. **Supabase** (when configured): Full authentication with email/password
2. **Demo Mode** (fallback): Local storage for testing without Supabase

## Technologies

- React 18
- React Router v7
- Tailwind CSS
- Supabase Auth
- React Markdown
- Lucide Icons
- Vite

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Port Configuration

This app runs on port **5181** to avoid conflicts with other frontend apps.