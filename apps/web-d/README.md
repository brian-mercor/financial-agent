# FinAgent Web-D

AI-powered financial intelligence platform with mystical tarot-inspired design.

## Features

- **Authentication**: Local storage authentication (same as web-c, Supabase-ready)
- **Real-time Chat Interface**: Connect to backend API for AI-powered financial analysis
- **Multi-Agent System**: 5 specialized AI assistants (Market Analyst, Trading Advisor, Portfolio Manager, Risk Analyst, Economist)
- **Streaming Responses**: Real-time streaming of AI responses
- **Chart Support**: Display TradingView charts when available
- **Beautiful UI**: Exact web-d.html styling with starfield backgrounds, gold gradients, and tarot panels

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Backend API Configuration (REQUIRED)
VITE_API_URL=http://localhost:3000/api
```

### 3. Run the Backend

Make sure the backend is running on port 3000:

```bash
cd apps/backend
pnpm run dev
```

### 4. Start the Development Server

```bash
pnpm dev
```

The app will run on http://localhost:5176

## Important Notes

- **Authentication**: Uses localStorage like web-c (can be upgraded to Supabase)
- **Backend Required**: The backend must be running for the chat to work
- **Real API Calls**: Chat interface connects to real backend API

## Authentication

Currently uses localStorage authentication (same as web-c):
1. **Sign Up**: Creates a local user with email/password
2. **Sign In**: Stores user in localStorage
3. **Protected Routes**: Dashboard requires authentication
4. **Session Management**: Persists across browser refreshes

To enable Supabase authentication:
1. Add `@supabase/supabase-js` to package.json
2. Uncomment Supabase code in `AuthContext.jsx`
3. Add Supabase credentials to `.env`

## API Integration

The app connects to the backend API at `/api/chat/stream` with:
- Real-time streaming responses
- Multi-agent assistant types
- Conversation history context
- Symbol extraction for financial queries

## Styling

The app uses the EXACT styling from web-d.html:
- Starfield animated backgrounds
- Gold gradient text with shimmer
- Tarot panel ornate borders
- Custom buttons and form inputs
- All animations and effects preserved