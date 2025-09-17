# FinAgent Web-D

AI-powered financial intelligence platform with mystical tarot-inspired design.

## Features

- **Real Supabase Authentication**: Secure user authentication with Supabase
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

Copy the example environment file and add your actual credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

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

- **NO MOCK DATA**: This app uses real Supabase authentication and real API calls
- **Backend Required**: The backend must be running for the chat to work
- **Environment Variables**: All environment variables are required for the app to function

## Authentication Flow

1. **Sign Up**: Creates a new Supabase user with email/password
2. **Sign In**: Authenticates with Supabase
3. **Protected Routes**: Dashboard requires authentication
4. **Session Management**: Automatic session refresh with Supabase

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