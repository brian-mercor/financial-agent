# Webb - Modern Financial Dashboard

Webb is an alternative UI for the Fin Agent application, featuring a modern gradient design while maintaining all the functionality of the original web app.

## Features

- **Full HomePage Functionality**: Includes all features from the original app on port 3001
- **Modern Gradient Design**: Purple to indigo gradients throughout the interface
- **Authentication**: Supabase authentication with sign in/sign up
- **AI Assistants**: Multiple AI assistant profiles for different financial tasks
- **Bank Integration**: Plaid connection for bank account linking
- **Smart Chat Interface**: Real-time chat with markdown support and agent status tracking
- **Portfolio Dashboard**: Overview of financial portfolio with real-time updates

## Key Components

### HomePage (`/src/components/HomePage.jsx`)
The main dashboard with:
- Collapsible sidebar with user info and controls
- Assistant selector for choosing AI personalities
- Bank connection management
- Portfolio overview card with gradient styling
- Quick action buttons
- Integrated chat interface

### Authentication (`/src/components/AuthForm.jsx`)
- Beautiful gradient-styled login/signup form
- Supabase integration for user management
- Smooth transitions between sign in and sign up

### Smart Chat Interface (`/src/components/SmartChatInterface.jsx`)
- Real-time messaging with selected AI assistant
- Markdown rendering support
- Agent workflow status tracking
- Gradient message bubbles for user messages
- Clean white cards for assistant responses

### Assistant Profiles
- General Assistant - Balanced financial analysis
- Financial Analyst - Deep fundamental and technical analysis
- Trading Assistant - Short-term trading and market timing
- Wealth Advisor - Long-term portfolio planning
- Risk Manager - Risk assessment and protection
- Global Markets - International markets and forex

## Styling Highlights

- **Gradient Backgrounds**: Purple to indigo gradients for buttons and cards
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Modern Card Design**: Clean white cards with subtle shadows
- **Interactive Elements**: Buttons with scale effects on hover
- **Responsive Layout**: Works on desktop and tablet sizes

## Setup

1. Install dependencies:
```bash
cd apps/webb
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5174

## API Integration

The app connects to the backend API for:
- Chat messages (`/api/chat`)
- Workflow processing
- Financial data retrieval
- Bank account management (via Plaid)

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Authentication
- **Lucide React** - Icons
- **React Markdown** - Message formatting
- **React Plaid Link** - Bank connections

## Differences from Original Web App

While functionality remains the same, the UI has been completely redesigned with:
- Gradient color schemes instead of flat colors
- More prominent visual hierarchy
- Enhanced hover states and animations
- Redesigned cards with gradient accents
- Modern button styles with shadow effects
- Improved spacing and typography