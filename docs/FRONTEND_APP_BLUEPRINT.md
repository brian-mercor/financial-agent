# Frontend Application Blueprint
## Complete Guide for Building Chart-Enabled Financial Assistant Apps

### Table of Contents
1. [Overview](#overview)
2. [Core Requirements](#core-requirements)
3. [Project Structure](#project-structure)
4. [Essential Dependencies](#essential-dependencies)
5. [Configuration Files](#configuration-files)
6. [Component Architecture](#component-architecture)
   - 6.1. [Chat History & Conversation Management](#1-chat-history--conversation-management)
   - 6.2. [API Service](#2-api-service---standardized-implementation)
   - 6.3. [Chart Renderer Component](#2-chart-renderer-component)
   - 6.4. [Smart Chat Interface](#3-smart-chat-interface)
7. [API Integration](#api-integration)
8. [Chart Implementation](#chart-implementation)
9. [Routing Structure](#routing-structure)
10. [Styling Guidelines](#styling-guidelines)
11. [Testing Checklist](#testing-checklist)

---

## Overview

This blueprint provides a complete specification for building a financial assistant frontend application with:
- Landing page with product overview
- Authentication system (login/signup)
- Protected dashboard with AI chat interface
- Real-time chat interface with multiple AI assistants
- TradingView chart integration
- Multi-assistant support (Market Analyst, Trading Advisor, Portfolio Manager)
- Streaming API responses
- Professional financial UI/UX

## ⚠️ CRITICAL: Environment Configuration

### Backend Environment Setup

**IMPORTANT**: The backend MUST have proper environment variables configured or the chat features will NOT work.

1. **Environment File Location**: `/apps/backend/.env` (NOT `.env.local`)
2. **Required Configuration**: At least ONE LLM provider must be configured:
   - **Azure OpenAI** (Recommended for enterprise):
     ```bash
     AZURE_OPENAI_API_KEY=your-actual-key
     AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
     AZURE_OPENAI_DEPLOYMENT_NAME=model-router
     ```
   - **Groq** (Recommended for free tier):
     ```bash
     GROQ_API_KEY=your-actual-groq-key
     ```

3. **Verification**: Check backend logs on startup:
   ```
   [LLMService] Checking API providers: {
     hasGroqKey: true,      // ✅ At least one should be true
     hasAzureKey: true,
     hasAzureEndpoint: true
   }
   ```

   If you see all `false`, the chat will NOT work!

4. **Common Issues**:
   - ❌ Using `.env.local` instead of `.env`
   - ❌ Using placeholder keys like "your-api-key-here"
   - ❌ Missing `.env` file entirely (not in git for security)
   - ❌ Invalid or expired API keys

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
│   │   ├── ProtectedRoute.jsx
│   │   ├── Navigation.jsx
│   │   └── Layout.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.service.js
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── DashboardPage.jsx
│   ├── config/
│   │   └── assistants.js
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

### Standardized API Request Format

**CRITICAL**: All frontend applications MUST send requests with the exact same payload structure to ensure consistent responses from the backend.

#### Required Request Payload Structure
```json
{
  "message": "User's question or input",
  "assistantType": "general",
  "userId": "user-1234567890",
  "context": {
    "symbols": [],
    "timeframe": "1d",
    "riskTolerance": "moderate"
  },
  "history": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Previous message",
      "timestamp": "2025-01-16T12:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Previous response",
      "timestamp": "2025-01-16T12:00:01Z"
    }
  ],
  "stream": true
}
```

#### Field Specifications
- **message** (string, required): The user's current message
- **assistantType** (string, optional): Type of assistant - defaults to 'general'
  - Options: 'general', 'analyst', 'trader', 'advisor', 'riskManager', 'economist'
- **userId** (string, optional): User identifier - auto-generated as `user-${Date.now()}` if not provided
- **context** (object, optional): Additional context for the assistant
  - **symbols** (array): Stock/crypto symbols being discussed
  - **timeframe** (string): Time period for analysis (e.g., '1d', '1w', '1m')
  - **riskTolerance** (string): User's risk preference ('low', 'moderate', 'high')
- **history** (array, optional): Conversation history for context-aware responses
  - Each message should have: id, role ('user'/'assistant'), content, timestamp
- **stream** (boolean, optional): Whether to stream the response - defaults to true

## Configuration Files

### Important: API Proxy Configuration

When building frontend applications, ensure proper API routing:

#### For Next.js Apps (Port 3001)
If using Next.js, create an API route that forwards requests to your backend:

```typescript
// app/api/chat/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the actual backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Forward the entire body as-is
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Backend request failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat stream proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

**Warning**: Do NOT implement mock responses in your API routes. Always forward to the real backend to ensure consistent behavior across all frontend applications.

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

### 1. Chat History & Conversation Management

**IMPORTANT**: This section documents the complete chat history implementation patterns from the `web-a` reference application, including persistent storage with Supabase, conversation contexts, and UI components.

#### Chat History Database Schema

The chat history system uses Supabase with the following table structure:

```sql
-- Chat Sessions (main chat containers)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  assistant_type TEXT DEFAULT 'general',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages (individual messages within chats)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  thread_id UUID,
  parent_message_id UUID REFERENCES chat_messages(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Metadata (aggregated stats and tags)
CREATE TABLE chat_metadata (
  chat_session_id UUID PRIMARY KEY REFERENCES chat_sessions(id),
  total_messages INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  providers_used JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  last_activity TIMESTAMPTZ DEFAULT NOW()
);
```

#### Backend API Endpoints

The chat history system requires these backend API endpoints:

1. **Create Chat Session**: `POST /api/chat/sessions`
   ```typescript
   // Request body
   {
     "userId": "user-id",
     "assistantType": "general",
     "initialMessage": "Hello world"
   }

   // Response
   {
     "sessionId": "uuid",
     "url": "/chat/uuid",
     "chatSession": { /* session data */ }
   }
   ```

2. **Get Chat History**: `GET /api/chat/sessions?userId=user-id&limit=20&offset=0`
   ```typescript
   // Response
   {
     "sessions": [
       {
         "id": "uuid",
         "title": "Chat title",
         "assistant_type": "general",
         "last_message_at": "2025-01-16T12:00:00Z",
         "lastMessage": {
           "content": "Last message preview",
           "role": "user"
         }
       }
     ],
     "total": 50,
     "limit": 20,
     "offset": 0
   }
   ```

3. **Get Chat Messages**: `GET /api/chat/messages?sessionId=session-id`
   ```typescript
   // Response
   {
     "session": { /* session details */ },
     "messages": [
       {
         "id": "uuid",
         "role": "user",
         "content": "Message content",
         "created_at": "2025-01-16T12:00:00Z",
         "metadata": {}
       }
     ],
     "total": 25
   }
   ```

4. **Save Chat Message**: `POST /api/chat/messages`
   ```typescript
   // Request body
   {
     "sessionId": "session-id",
     "role": "user",
     "content": "Message content",
     "metadata": {
       "provider": "groq",
       "model": "llama-3.3-70b",
       "tokens": 150
     }
   }
   ```

#### Conversation Context Implementation

```javascript
// src/contexts/ConversationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ConversationContext = createContext({})

export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider')
  }
  return context
}

export function ConversationProvider({ children }) {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all conversations for the user
  const fetchConversations = async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/chat/sessions?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  // Create a new conversation
  const createConversation = async (initialMessage, assistantType = 'general') => {
    if (!user?.id) return null
    try {
      const response = await fetch(`/api/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          assistantType,
          initialMessage: initialMessage?.substring(0, 100),
        })
      })
      if (response.ok) {
        const data = await response.json()
        const newConversation = data.chatSession
        setConversations(prev => [newConversation, ...prev])
        setCurrentConversation(newConversation)
        navigate(`/dashboard/${newConversation.id}`)
        return newConversation
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
    return null
  }

  // Save a message to the current conversation
  const saveMessage = async (role, content, metadata = {}) => {
    if (!currentConversation?.id) return null
    try {
      const response = await fetch(`/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentConversation.id,
          role,
          content,
          metadata,
        })
      })
      if (response.ok) {
        const data = await response.json()
        const newMessage = data.message
        setMessages(prev => [...prev, newMessage])
        return newMessage
      }
    } catch (error) {
      console.error('Failed to save message:', error)
    }
    return null
  }

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    createConversation,
    saveMessage,
    startNewConversation: () => {
      setCurrentConversation(null)
      setMessages([])
      navigate('/dashboard')
    },
    fetchConversations,
    setMessages,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
```

#### Conversation History UI Component

```javascript
// src/components/ConversationHistory.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '../contexts/ConversationContext'
import { MessageSquare, Plus, Clock } from 'lucide-react'

export function ConversationHistory() {
  const navigate = useNavigate()
  const { conversations, currentConversation, startNewConversation } = useConversation()

  // Group conversations by date
  const groupedConversations = React.useMemo(() => {
    const groups = { today: [], yesterday: [], thisWeek: [], older: [] }
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    conversations.forEach(conv => {
      const convDate = new Date(conv.created_at || conv.last_message_at)
      if (convDate >= today) groups.today.push(conv)
      else if (convDate >= yesterday) groups.yesterday.push(conv)
      else if (convDate >= weekAgo) groups.thisWeek.push(conv)
      else groups.older.push(conv)
    })
    return groups
  }, [conversations])

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-gray-700">
          Conversation History
        </label>
        {currentConversation && (
          <button
            onClick={startNewConversation}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedConversations).map(([period, convs]) =>
              convs.length > 0 && (
                <ConversationGroup
                  key={period}
                  title={period.charAt(0).toUpperCase() + period.slice(1)}
                  conversations={convs}
                  currentId={currentConversation?.id}
                  onSelect={(id) => navigate(`/dashboard/${id}`)}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ConversationGroup({ title, conversations, currentId, onSelect }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{title}</h3>
      <div className="space-y-1">
        {conversations.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              conv.id === currentId
                ? 'bg-blue-100 border border-blue-300'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conv.title || 'New conversation'}
                </p>
                {conv.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(conv.last_message_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

#### Updated Routing Structure

```javascript
// src/App.jsx - Updated routing for chat history
import { ConversationProvider } from './contexts/ConversationContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/:conversationId" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Routes>
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

#### Integration with Chat Interface

Update SmartChatInterface to work with conversation context:

```javascript
// In SmartChatInterface component
import { useConversation } from '../contexts/ConversationContext'

export function SmartChatInterface({ assistant }) {
  const {
    messages,
    currentConversation,
    createConversation,
    saveMessage,
    setMessages
  } = useConversation()

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    // Create conversation if none exists
    let conversation = currentConversation
    if (!conversation) {
      conversation = await createConversation(input, assistant.id)
      if (!conversation) return
    }

    // Add user message immediately for responsiveness
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Save to database
    await saveMessage('user', input)

    // Continue with streaming response...
  }, [input, isLoading, assistant.id, currentConversation, createConversation, saveMessage, setMessages])
}
```

#### Environment Variables for Chat History

Add these environment variables for Supabase integration:

```bash
# Supabase Configuration (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase Configuration (Backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

#### Chat History Best Practices

1. **Database Performance**:
   - Use proper indexes on `user_id`, `chat_session_id`, and `created_at`
   - Implement pagination for large conversation lists
   - Consider archiving old conversations

2. **UI/UX Patterns**:
   - Group conversations by time periods (Today, Yesterday, This Week, Older)
   - Show preview of last message in conversation list
   - Display conversation titles based on first user message
   - Provide "New Chat" button when in an existing conversation

3. **State Management**:
   - Use React Context for conversation state
   - Implement optimistic updates for better UX
   - Cache conversation list and update incrementally

4. **Error Handling**:
   - Graceful fallbacks when database is unavailable
   - Retry mechanisms for failed API calls
   - User-friendly error messages

5. **Security**:
   - Implement Row Level Security (RLS) in Supabase
   - Validate user ownership of conversations
   - Use service keys on backend, anon keys on frontend

### 2. API Service - STANDARDIZED IMPLEMENTATION

**IMPORTANT**: This is the reference implementation from `web-a`. All frontend apps should follow this pattern for consistent behavior.

#### Streaming Methods Priority:
1. **Primary**: Motia WebSocket Streaming (Fastest, real-time)
2. **Fallback**: Polling with simulated streaming

#### Complete API Service with Motia WebSocket Streaming (src/services/api.service.js)

**Note**: This requires the Motia stream client to be set up first (see below).

```javascript
import { motiaStreamClient } from './motia-stream-client'

class ApiService {
  constructor() {
    this.baseUrl = '';
  }

  async sendMessage(message, assistantType = 'general', history = []) {
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantType,
          history,
          userId: `user-${Date.now()}`,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate',
          },
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async streamMessageMotia(message, assistantType = 'general', history = [], onChunk, responseStyle = 'conversational') {
    const userId = `user-${Date.now()}`

    try {
      // First, initiate the streaming request
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantType,
          history,
          userId,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate',
          },
          stream: true,
          responseStyle // Pass the response style preference
        }),
      });

      if (!response.ok) {
        throw new Error(`Stream error! status: ${response.status}`);
      }

      const result = await response.json()
      const traceId = result.traceId

      // Store the immediate response as fallback
      const immediateResponse = result

      // Connect to Motia stream for this user
      const streamName = 'chat-messages'
      const streamId = `user:${userId}`

      return new Promise((resolve, reject) => {
        let fullContent = ''
        let chartHtml = immediateResponse.chartHtml || null
        let hasReceivedTokens = false
        let resolved = false

        // Connect to the stream
        motiaStreamClient.connect(streamName, streamId, { autoReconnect: false })

        // Listen for messages
        const unsubscribe = motiaStreamClient.on(streamName, streamId, 'message', (data) => {
          console.log('[StreamDebug] Received message:', data)

          // Process messages for this trace or without traceId (for compatibility)
          if (data.traceId && data.traceId !== traceId) return

          switch (data.type) {
            case 'token':
              hasReceivedTokens = true
              fullContent += data.content || ''
              onChunk({ chunk: data.content, type: 'token' })
              break

            case 'complete':
              resolved = true
              onChunk({
                type: 'complete',
                response: data.response || fullContent,
                provider: data.provider,
                model: data.model,
                chartHtml: chartHtml || data.chartHtml
              })
              // Cleanup and resolve
              unsubscribe()
              motiaStreamClient.disconnect(streamName, streamId)
              resolve({
                response: data.response || fullContent || immediateResponse.response,
                provider: data.provider || immediateResponse.llmProvider,
                model: data.model || immediateResponse.model,
                chartHtml: chartHtml || immediateResponse.chartHtml,
                traceId
              })
              break

            case 'error':
              onChunk({ type: 'error', error: data.error })
              unsubscribe()
              motiaStreamClient.disconnect(streamName, streamId)
              reject(new Error(data.error || 'Stream error'))
              break

            case 'chart':
              chartHtml = data.chartHtml
              onChunk({ type: 'chart', chartHtml })
              break
          }
        })

        // Handle connection errors
        motiaStreamClient.on(streamName, streamId, 'error', (error) => {
          console.error('Stream connection error:', error)
          unsubscribe()
          reject(new Error('Stream connection failed'))
        })

        // Fallback to immediate response if no streaming after 2 seconds
        setTimeout(() => {
          if (!hasReceivedTokens && !resolved && immediateResponse.response) {
            console.log('[StreamDebug] No tokens received, using immediate response')
            resolved = true
            unsubscribe()
            motiaStreamClient.disconnect(streamName, streamId)

            // Simulate streaming the immediate response
            const text = immediateResponse.response
            const words = text.split(' ')
            let index = 0
            const interval = setInterval(() => {
              if (index < words.length) {
                const chunk = words[index] + ' '
                onChunk({ chunk, type: 'token' })
                index++
              } else {
                clearInterval(interval)
                onChunk({
                  type: 'complete',
                  response: text,
                  provider: immediateResponse.llmProvider,
                  model: immediateResponse.model,
                  chartHtml: immediateResponse.chartHtml
                })
                resolve(immediateResponse)
              }
            }, 50) // Simulate streaming speed
          }
        }, 2000)

        // Hard timeout after 60 seconds
        setTimeout(() => {
          if (!resolved) {
            unsubscribe()
            motiaStreamClient.disconnect(streamName, streamId)
            reject(new Error('Stream timeout'))
          }
        }, 60000)
      })
    } catch (error) {
      console.error('Stream Error:', error);
      throw error;
    }
  }

  async streamMessage(message, assistantType = 'general', history = [], onChunk, responseStyle = 'conversational') {
    // Try Motia streaming first
    try {
      return await this.streamMessageMotia(message, assistantType, history, onChunk, responseStyle)
    } catch (error) {
      console.warn('Motia streaming failed, falling back to polling:', error)

      // Fallback to simple JSON response with simulated streaming
      const response = await this.sendMessage(message, assistantType, history)

      // Simulate streaming by breaking the response into chunks
      const text = response.response || response.message || response.content || ''
      const words = text.split(' ')

      for (let i = 0; i < words.length; i++) {
        onChunk({ chunk: words[i] + ' ', type: 'token' })
        await new Promise(resolve => setTimeout(resolve, 30))
      }

      onChunk({ type: 'complete', response: text })
      return response
    }
  }
}

export default new ApiService();
```

#### Motia Stream Client (src/services/motia-stream-client.js)

This client handles WebSocket connections to Motia's streaming endpoints:

```javascript
class MotiaStreamClient {
  constructor() {
    this.connections = new Map()
    this.listeners = new Map()
    this.baseUrl = `ws://${window.location.hostname}:3000/streams`
  }

  connect(streamName, streamId, options = {}) {
    const key = `${streamName}:${streamId}`

    if (this.connections.has(key)) {
      console.log(`[MotiaStream] Already connected to ${key}`)
      return this.connections.get(key)
    }

    const url = `${this.baseUrl}/${streamName}/${streamId}`
    console.log(`[MotiaStream] Connecting to ${url}`)

    const ws = new WebSocket(url)

    ws.onopen = () => {
      console.log(`[MotiaStream] Connected to ${key}`)
      this.emit(streamName, streamId, 'open')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log(`[MotiaStream] Message on ${key}:`, data)
        this.emit(streamName, streamId, 'message', data)
      } catch (error) {
        console.error(`[MotiaStream] Failed to parse message on ${key}:`, error)
        this.emit(streamName, streamId, 'error', error)
      }
    }

    ws.onerror = (error) => {
      console.error(`[MotiaStream] Error on ${key}:`, error)
      this.emit(streamName, streamId, 'error', error)
    }

    ws.onclose = () => {
      console.log(`[MotiaStream] Disconnected from ${key}`)
      this.connections.delete(key)
      this.emit(streamName, streamId, 'close')

      // Auto-reconnect if option is enabled
      if (options.autoReconnect && options.autoReconnect !== false) {
        setTimeout(() => {
          console.log(`[MotiaStream] Attempting to reconnect to ${key}`)
          this.connect(streamName, streamId, options)
        }, 1000)
      }
    }

    this.connections.set(key, ws)
    return ws
  }

  disconnect(streamName, streamId) {
    const key = `${streamName}:${streamId}`
    const ws = this.connections.get(key)

    if (ws) {
      console.log(`[MotiaStream] Disconnecting from ${key}`)
      ws.close()
      this.connections.delete(key)
    }
  }

  on(streamName, streamId, event, callback) {
    const key = `${streamName}:${streamId}:${event}`

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }

    this.listeners.get(key).add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.listeners.delete(key)
        }
      }
    }
  }

  emit(streamName, streamId, event, data) {
    const key = `${streamName}:${streamId}:${event}`
    const callbacks = this.listeners.get(key)

    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[MotiaStream] Error in callback for ${key}:`, error)
        }
      })
    }
  }

  disconnectAll() {
    this.connections.forEach((ws, key) => {
      console.log(`[MotiaStream] Disconnecting from ${key}`)
      ws.close()
    })
    this.connections.clear()
  }
}

export const motiaStreamClient = new MotiaStreamClient()
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

## Authentication Flow

### Auth Context (src/contexts/AuthContext.jsx)
```javascript
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    // Replace with actual API call
    const mockUser = { id: Date.now().toString(), email }
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    return { success: true }
  }

  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Page Components

### Landing Page (Public)
- Marketing-focused homepage with product overview
- Feature highlights and benefits sections
- Call-to-action buttons for login/signup
- Professional gradient styling
- Responsive design for mobile/desktop

### Authentication Pages
**Login Page**:
- Split-screen design with form and gradient background
- Email/password inputs with validation
- "Remember me" checkbox
- Link to signup page
- Error handling for failed attempts

**SignUp Page**:
- Registration form with name, email, password
- Password confirmation field
- Terms of service agreement
- Link back to login
- Success redirects to dashboard

### Dashboard Page (Protected)
- Requires authentication to access
- Sidebar with:
  - User profile information
  - AI assistant selector
  - Portfolio summary widget
  - Quick action buttons
- Main chat interface area
- Real-time portfolio metrics
- Responsive sidebar toggle

## Routing Structure

### Routes Configuration
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
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
  "traceId": "unique-trace-id",
  "response": "Here's the analysis of AAPL...",
  "assistantType": "market-analyst",
  "llmProvider": "groq",
  "model": "llama-3.3-70b-versatile",
  "hasChart": false
}
```

### Chart Response
```json
{
  "traceId": "unique-trace-id",
  "response": "Here's the chart for AAPL showing the recent price action...",
  "assistantType": "market-analyst",
  "llmProvider": "groq",
  "model": "chart-display",
  "hasChart": true,
  "chartHtml": "<div id='tradingview_widget'>...</div><script>...</script>",
  "chartIframe": "<iframe src='https://s.tradingview.com/...'></iframe>",
  "chartConfig": {
    "symbol": "AAPL",
    "containerId": "tradingview_aapl_123456",
    "height": 500,
    "width": "100%",
    "interval": "1D"
  },
  "symbol": "AAPL"
}
```

### Workflow Response (Multi-Agent)
```json
{
  "workflowId": "unique-workflow-id",
  "message": "Workflow initiated successfully",
  "agents": ["market-analyst", "trading-advisor"],
  "estimatedTime": 30
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
# Backend Configuration (CRITICAL for proper routing)
BACKEND_URL=http://localhost:3000    # Motia backend port
NEXT_PUBLIC_API_URL=http://localhost:3000   # For Next.js apps

# API Configuration
VITE_API_URL=http://localhost:3000/api       # For Vite apps

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key  # Use JWT format, not sb_publishable_ format

# OpenAI Configuration (if client-side)
VITE_OPENAI_API_KEY=your_api_key

# TradingView (if using advanced features)
VITE_TRADINGVIEW_CONTAINER_ID=tradingview_widget
```

### Port Configuration Reference
- **Port 3000**: Motia backend (handles actual API requests)
- **Port 3001**: Next.js web app (proxies to backend)
- **Port 5174**: Vite React app webb (proxies to Next.js)
- **Port 5175**: Vite React app web-b (proxies to Next.js)
- **Port 5173**: Default Vite dev server port

## Testing Checklist

### Authentication Tests
- [ ] Landing page displays correctly
- [ ] Login form validates and submits
- [ ] SignUp form validates passwords match
- [ ] Protected routes redirect to login when unauthenticated
- [ ] User session persists on refresh
- [ ] Logout clears session and redirects

### Dashboard Tests
- [ ] Chat interface sends and receives messages
- [ ] Assistant switching works correctly
- [ ] Sidebar toggles open/closed
- [ ] Portfolio metrics display
- [ ] User profile shows in sidebar

### Functionality Tests
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

### Issue: Inconsistent API Responses Between Frontend Apps
**Diagnosis**: Different frontend apps sending different payload structures or routing to different endpoints.

**Solution Checklist**:
1. **Verify Payload Structure**:
   - Use browser DevTools Network tab to inspect actual requests
   - Compare payloads between apps - they should be identical
   - All apps must include: message, assistantType, userId, context, history, stream

2. **Check API Routing**:
   - **Vite Apps**: Ensure proxy configuration points to correct backend
   - **Next.js Apps**: Verify API route forwards to backend (not mocking responses)
   - **Direct Backend**: Ensure backend URL is correct (default: http://localhost:3000)

3. **Common Routing Mistakes**:
   - Next.js API route returning mock data instead of forwarding
   - Vite proxy targeting wrong port (should proxy to backend, not another frontend)
   - Missing environment variables for backend URL

4. **Testing**:
   ```bash
   # Test directly against backend to verify it works
   curl -X POST http://localhost:3000/api/chat/stream \
     -H "Content-Type: application/json" \
     -d '{
       "message": "test",
       "assistantType": "general",
       "userId": "test-user",
       "context": {"symbols": [], "timeframe": "1d", "riskTolerance": "moderate"},
       "history": [],
       "stream": true
     }'
   ```

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

### Issue: Backend Validation Errors on Request
**Solution**:
1. Check backend Zod schema matches frontend request structure
2. Ensure all fields are properly typed in the request body
3. Verify optional fields are marked as optional in backend schema
4. Include proper TypeScript types for history array elements

## 🔍 CRITICAL VERIFICATION CHECKLIST

### Environment Configuration Verification

#### Backend Environment
```bash
# 1. Check if .env file exists
ls -la apps/backend/.env

# 2. Verify API keys are configured (should show true for at least one)
cd apps/backend
node -e "require('dotenv').config(); console.log({
  hasGroq: !!process.env.GROQ_API_KEY,
  hasAzure: !!process.env.AZURE_OPENAI_API_KEY,
  hasAzureEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT
})"

# 3. Start backend and check logs
npm run dev
# Look for: "[LLMService] ✓ READY: Configured providers: ..."
```

#### Frontend Environment Check
```bash
# 1. Verify proxy configuration in vite.config.js or next.config.js
grep -A 5 "proxy" vite.config.js

# 2. Check API service uses correct endpoints
grep "/api/chat/stream" src/services/api.service.js

# 3. Verify Motia WebSocket client setup
ls src/services/motia-stream-client.js
```

### Streaming Method Verification

#### Test WebSocket Connection
```javascript
// Browser Console Test
const ws = new WebSocket('ws://localhost:3000/streams/chat-messages/user:test')
ws.onopen = () => console.log('✅ WebSocket connected')
ws.onerror = (e) => console.log('❌ WebSocket error:', e)
ws.onmessage = (e) => console.log('📨 Message:', e.data)
```

#### Test API Endpoint Directly
```bash
# Direct backend test (should return JSON with traceId)
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "test",
    "assistantType": "general",
    "userId": "test-user",
    "stream": true
  }'
```

### Common Configuration Issues Checklist

| Issue | Check | Solution |
|-------|-------|----------|
| **No LLM response** | Backend logs show "No LLM providers configured" | Add API keys to `/apps/backend/.env` |
| **Slow responses** | Web app using multi-agent workflow unintentionally | Pass `responseStyle: 'conversational'` |
| **401 Errors** | Invalid API keys in logs | Update API keys in `.env` |
| **WebSocket fails** | Connection refused on port 3000 | Ensure Motia backend is running |
| **Streaming not working** | No tokens received in console | Check Motia stream configuration |
| **Different behavior between apps** | Request payloads differ | Standardize using blueprint API service |

### Performance Optimization Checklist

- [ ] **Environment Variables**
  - `.env` file exists in `/apps/backend/`
  - At least one LLM provider configured (Groq or Azure)
  - No `.env.local` files being used

- [ ] **Streaming Setup**
  - Motia WebSocket client implemented
  - Fallback to polling configured
  - Timeout handling in place (2s for fallback, 60s max)

- [ ] **Request Optimization**
  - Using `responseStyle: 'conversational'` for chat
  - Avoiding workflow triggers unless needed
  - History limited to last 10 exchanges

- [ ] **Error Handling**
  - Graceful fallback when streaming fails
  - User-friendly error messages
  - Retry logic for transient failures

### Debugging Steps

1. **Check Backend Health**:
   ```bash
   # View backend logs for LLM configuration
   cd apps/backend && npm run dev
   # Should see: "[LLMService] ✓ READY: Configured providers: Groq, Azure OpenAI"
   ```

2. **Verify Request/Response**:
   - Open browser DevTools → Network tab
   - Send a chat message
   - Check request payload matches blueprint format
   - Verify response contains `traceId`

3. **Monitor WebSocket Traffic**:
   - DevTools → Network → WS tab
   - Look for connection to `/streams/chat-messages/user:*`
   - Verify messages flow with type: 'token', 'complete'

4. **Test Fallback Behavior**:
   - Temporarily block WebSocket port
   - Verify app falls back to polling
   - Check simulated streaming works

### Final Deployment Checklist

- [ ] Production `.env` configured with real API keys
- [ ] WebSocket URLs updated for production domain
- [ ] CSP headers include production domains
- [ ] Error tracking configured
- [ ] Rate limiting implemented
- [ ] API key rotation scheduled
- [ ] Monitoring dashboards set up
- [ ] Load testing completed

## Additional Resources

- [TradingView Widget Documentation](https://www.tradingview.com/widget/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

---

*This blueprint provides everything needed to create a production-ready financial assistant application with chart capabilities. Follow each section carefully and customize as needed for your specific requirements.*