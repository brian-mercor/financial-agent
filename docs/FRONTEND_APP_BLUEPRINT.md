# Frontend Application Blueprint
## Complete Guide for Building Chart-Enabled Financial Assistant Apps

### Table of Contents
1. [Overview](#overview)
2. [Core Requirements](#core-requirements)
3. [Project Structure](#project-structure)
4. [Essential Dependencies](#essential-dependencies)
5. [Configuration Files](#configuration-files)
6. [Component Architecture](#component-architecture)
7. [API Integration](#api-integration)
8. [Chart Implementation](#chart-implementation)
9. [Routing Structure](#routing-structure)
10. [Styling Guidelines](#styling-guidelines)
11. [Testing Checklist](#testing-checklist)

---

## Overview

This blueprint provides a complete specification for building a financial assistant frontend application with:
- Real-time chat interface with AI assistants
- TradingView chart integration
- Multi-assistant support (Market Analyst, Trading Advisor, Portfolio Manager)
- Streaming API responses
- Professional financial UI/UX

## Core Requirements

### Technical Stack
- **Framework**: React 18+ (Vite or Next.js)
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **Charts**: TradingView Widget API
- **API Communication**: Fetch API with streaming support
- **Markdown**: react-markdown with remark-gfm
- **Icons**: lucide-react

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
app-name/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── AssistantCard.jsx
│   │   ├── SmartChatInterface.jsx
│   │   ├── ChartRenderer.jsx
│   │   ├── AgentStatusPanel.jsx
│   │   ├── Navigation.jsx
│   │   └── Layout.jsx
│   ├── services/
│   │   └── api.service.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ChatPage.jsx
│   │   └── AboutPage.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vite.config.js (or next.config.js)
├── tailwind.config.js
├── package.json
└── README.md
```

## Essential Dependencies

### Package.json Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "react-markdown": "^9.0.3",
    "remark-gfm": "^4.0.0",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.3.6",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.2",
    "autoprefixer": "^10.4.20"
  }
}
```

## Configuration Files

### 1. Vite Configuration (vite.config.js)
```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: 'http://localhost:3001', // Backend API server port
          changeOrigin: true
        }
      },
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://*.tradingview.com",
          "style-src 'self' 'unsafe-inline' https://s3.tradingview.com",
          "img-src 'self' data: blob: https://*.tradingview.com https://s3.tradingview.com",
          "connect-src 'self' wss://*.tradingview.com https://*.tradingview.com https://api.openai.com https://*.supabase.co wss://*.supabase.co",
          "frame-src 'self' https://*.tradingview.com",
          "worker-src 'self' blob:",
          "child-src blob:",
          "object-src 'none'"
        ].join('; ')
      }
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    }
  }
})
```

### 2. Tailwind Configuration (tailwind.config.js)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
```

### 3. Global Styles (src/styles/globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .gradient-bg {
    @apply bg-gradient-to-r from-purple-500 to-indigo-600;
  }
  
  .gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600;
  }
  
  .card-shadow {
    @apply shadow-lg hover:shadow-xl transition-shadow duration-300;
  }
}
```

## Component Architecture

### 1. API Service (src/services/api.service.js)
```javascript
const API_BASE_URL = '/api'

export const apiService = {
  async sendMessage(message, assistantType, history = []) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, assistantType, history })
    })

    if (!response.ok) throw new Error('API request failed')
    return response.json()
  },

  async streamMessage(message, assistantType, history = [], onChunk) {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, assistantType, history, stream: true })
    })

    if (!response.ok) throw new Error('Stream request failed')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return
          try {
            const parsed = JSON.parse(data)
            onChunk(parsed)
          } catch (e) {
            console.error('Failed to parse SSE data:', e)
          }
        }
      }
    }
  }
}
```

### 2. Chart Renderer Component (src/components/ChartRenderer.jsx)
```javascript
import { useEffect, useRef, useState } from 'react'
import { AlertCircle, TrendingUp } from 'lucide-react'

export function ChartRenderer({ chartHtml, symbol, height = '500px' }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!chartHtml || !containerRef.current) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Clear previous content
      containerRef.current.innerHTML = ''

      // Create isolated container for chart
      const chartContainer = document.createElement('div')
      chartContainer.style.width = '100%'
      chartContainer.style.height = height
      chartContainer.style.position = 'relative'
      chartContainer.innerHTML = chartHtml

      // Append to container
      containerRef.current.appendChild(chartContainer)

      // Execute any inline scripts
      const scripts = chartContainer.getElementsByTagName('script')
      Array.from(scripts).forEach(script => {
        if (script.src) {
          // External script
          const newScript = document.createElement('script')
          newScript.src = script.src
          newScript.async = true
          newScript.onload = () => setIsLoading(false)
          newScript.onerror = () => {
            setError('Failed to load TradingView library')
            setIsLoading(false)
          }
          document.head.appendChild(newScript)
        } else {
          // Inline script
          try {
            const newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.head.appendChild(newScript)
            setIsLoading(false)
          } catch (err) {
            console.error('Error executing chart script:', err)
            setError('Failed to render chart')
            setIsLoading(false)
          }
        }
      })

      // Set loading false after a timeout if scripts don't report back
      const timeout = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(timeout)

    } catch (err) {
      console.error('Error rendering chart:', err)
      setError('Failed to render chart')
      setIsLoading(false)
    }
  }, [chartHtml, height])

  if (!chartHtml) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No chart data available</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Chart Error</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
            <span className="text-gray-600 text-sm">Loading chart...</span>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full rounded-lg overflow-hidden bg-white"
        style={{ minHeight: height }}
      />
      {symbol && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Chart for {symbol}
        </div>
      )}
    </div>
  )
}
```

### 3. Smart Chat Interface (src/components/SmartChatInterface.jsx)
```javascript
import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChartRenderer } from './ChartRenderer'
import { apiService } from '../services/api.service'

export function SmartChatInterface({ assistant }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await apiService.sendMessage(
        input,
        assistant.id,
        messages
      )

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || response.content,
        timestamp: new Date(),
        chartHtml: response.chartHtml,
        hasChart: response.hasChart,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, assistant.id, messages])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                  : 'bg-white shadow-md'
              } rounded-2xl px-6 py-4`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && (
                  <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.chartHtml && (
                        <div className="mt-4">
                          <ChartRenderer 
                            chartHtml={message.chartHtml}
                            height="400px"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {message.role === 'user' && (
                  <User className="h-5 w-5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span className="text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${assistant.name} anything...`}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
```

## Routing Structure

### Routes Configuration
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="chat/:assistantId" element={<ChatPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### Assistant Configuration
```javascript
// src/config/assistants.js
export const assistants = [
  {
    id: 'market-analyst',
    name: 'Market Analyst',
    description: 'Expert in market trends and technical analysis',
    icon: TrendingUp,
    color: 'bg-blue-500',
    expertise: ['Technical Analysis', 'Market Trends', 'Chart Patterns'],
    route: '/chat/market-analyst'
  },
  {
    id: 'trading-advisor',
    name: 'Trading Advisor',
    description: 'Specialized in trading strategies and risk management',
    icon: LineChart,
    color: 'bg-green-500',
    expertise: ['Trading Strategies', 'Risk Management', 'Position Sizing'],
    route: '/chat/trading-advisor'
  },
  {
    id: 'portfolio-manager',
    name: 'Portfolio Manager',
    description: 'Focused on portfolio optimization and asset allocation',
    icon: PieChart,
    color: 'bg-purple-500',
    expertise: ['Asset Allocation', 'Diversification', 'Rebalancing'],
    route: '/chat/portfolio-manager'
  }
]
```

## API Response Format

### Standard Chat Response
```json
{
  "message": "Here's the analysis of AAPL...",
  "assistantType": "market-analyst",
  "timestamp": "2025-01-16T12:00:00Z",
  "hasChart": false
}
```

### Chart Response
```json
{
  "message": "Here's the chart for AAPL showing the recent price action...",
  "assistantType": "market-analyst",
  "timestamp": "2025-01-16T12:00:00Z",
  "hasChart": true,
  "chartHtml": "<div id='tradingview_widget'>...</div><script>...</script>",
  "symbol": "AAPL"
}
```

### Streaming Response Format (SSE)
```
data: {"chunk": "Here's ", "type": "content"}
data: {"chunk": "the analysis", "type": "content"}
data: {"chartHtml": "<div>...</div>", "type": "chart"}
data: [DONE]
```

## Styling Guidelines

### Color Palette
- **Primary**: Purple (#8B5CF6 to #6366F1)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Component Styling Patterns
```css
/* Card Component */
.card {
  @apply bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow;
}

/* Button Primary */
.btn-primary {
  @apply gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition;
}

/* Input Field */
.input-field {
  @apply px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500;
}
```

## Environment Variables

### Required Environment Variables (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key  # Use JWT format, not sb_publishable_ format

# OpenAI Configuration (if client-side)
VITE_OPENAI_API_KEY=your_api_key

# TradingView (if using advanced features)
VITE_TRADINGVIEW_CONTAINER_ID=tradingview_widget
```

## Testing Checklist

### Functionality Tests
- [ ] Chat interface sends and receives messages
- [ ] Assistant switching works correctly
- [ ] Chart rendering displays properly
- [ ] API error handling shows user-friendly messages
- [ ] Streaming responses display incrementally
- [ ] Mobile responsive design works
- [ ] Keyboard shortcuts function (Enter to send)
- [ ] Loading states display correctly
- [ ] Empty states show appropriate content

### Chart-Specific Tests
- [ ] TradingView widget loads without CSP errors
- [ ] Charts render with correct symbols
- [ ] Chart resizing works responsively
- [ ] Multiple charts can be displayed in conversation
- [ ] Chart loading states show properly
- [ ] Chart error states handle gracefully

### Performance Tests
- [ ] Messages scroll smoothly
- [ ] Chart loading doesn't block UI
- [ ] API responses handle within 3 seconds
- [ ] Memory usage stays stable during long conversations
- [ ] Bundle size stays under 500KB

## Deployment Checklist

### Pre-Deployment
1. Run production build: `npm run build`
2. Test production build locally: `npm run preview`
3. Verify all environment variables are set
4. Check CSP headers for production domain
5. Optimize images and assets
6. Enable gzip compression

### Deployment Platforms
- **Vercel**: Zero-config deployment with `vercel`
- **Netlify**: Deploy with `netlify deploy --prod`
- **Azure Static Web Apps**: Use GitHub Actions workflow
- **AWS S3 + CloudFront**: Upload build to S3, configure CloudFront

## Quick Start Commands

```bash
# Create new app from this blueprint
npx create-vite@latest my-financial-app --template react
cd my-financial-app

# Install dependencies
npm install react-router-dom react-markdown remark-gfm lucide-react clsx
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copy configuration files
# Copy the configurations from this blueprint

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Common Issues & Solutions

### Issue: TradingView Widget Not Loading
**Solution**: Check CSP headers in vite.config.js, ensure TradingView domains are whitelisted

### Issue: API Calls Failing
**Solution**: Verify proxy configuration in vite.config.js, check CORS settings

### Issue: Chart Scripts Not Executing
**Solution**: Ensure ChartRenderer component properly handles script execution

### Issue: Styles Not Applied
**Solution**: Import globals.css in main.jsx, check Tailwind configuration

### Issue: Supabase Authentication Errors (401 Unauthorized / CSP Violations)
**Solution**: 
1. Ensure CSP includes `https://*.supabase.co wss://*.supabase.co` in `connect-src`
2. Use JWT format keys (eyJ...) not the deprecated sb_publishable_ format
3. Verify keys match your Supabase project configuration
4. Check that your Supabase project hasn't disabled legacy API keys

## Additional Resources

- [TradingView Widget Documentation](https://www.tradingview.com/widget/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

---

*This blueprint provides everything needed to create a production-ready financial assistant application with chart capabilities. Follow each section carefully and customize as needed for your specific requirements.*