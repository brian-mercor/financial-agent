# Motia Streaming Architecture

## ✅ Current Implementation

The streaming architecture uses **Motia's native WebSocket streams**, NOT Server-Sent Events (SSE).

### How It Works
1. **Stream Configuration**: Created `/apps/backend/steps/streams/chat-messages.stream.ts`
2. **Handler Updates**: Modified `/apps/backend/steps/chat-stream.step.ts` to use `streams` context
3. **Publishing to Streams**: Added logic to publish tokens to `streams['chat-messages']`

### Frontend Changes

#### apps/web (Next.js)
- Created `/src/lib/motia-stream-client.ts` - TypeScript Motia stream client
- Created `/src/hooks/useMotiaStreamChat.ts` - React hook for streaming chat
- Created `/src/components/streaming-chat-interface.tsx` - Streaming-enabled chat component

#### apps/web-a (Vite React)
- Added `/src/services/motia-stream-client.js` - JavaScript Motia stream client
- Updated `/src/services/api.service.js` - Added `streamMessageMotia()` method with fallback

#### apps/web-b (Vite React)
- Added `/src/services/motia-stream-client.js` - JavaScript Motia stream client
- Updated `/src/services/api.service.js` - Added `streamMessageMotia()` method with fallback

#### apps/web-c (Vite React)
- Already had implementation from earlier work

## 🧪 Testing Steps

### 1. Start the Backend
```bash
cd apps/backend
npm run dev
```
The Motia backend should start on port 3000 with WebSocket support.

### 2. Test WebSocket Endpoint
Motia should expose WebSocket streams at:
- `ws://localhost:3000/streams/chat-messages/user:{userId}`

### 3. Test Each Frontend App

#### Test web (Next.js) - Port 3001
```bash
cd apps/web
npm run dev
```
1. Navigate to http://localhost:3001
2. Go to the chat interface
3. Send a message
4. Observe real-time token streaming

#### Test web-a (Vite) - Port 5173
```bash
cd apps/web-a
npm run dev
```
1. Navigate to http://localhost:5173
2. Use the chat interface
3. Send a message
4. Observe real-time token streaming

#### Test web-b (Vite) - Port 5174
```bash
cd apps/web-b
npm run dev
```
1. Navigate to http://localhost:5174
2. Use the chat interface
3. Send a message
4. Observe real-time token streaming

## 📝 How It Works

### Request Flow
1. **Client sends message** → POST to `/api/chat/stream` with `stream: true`
2. **Backend initiates processing** → Returns `{ traceId, ... }`
3. **Client connects to WebSocket** → `ws://localhost:3000/streams/chat-messages/user:${userId}`
4. **Backend publishes tokens** → Each LLM token is published to the stream
5. **Client receives tokens** → Real-time updates through WebSocket
6. **Completion message sent** → Final message with complete response

### Message Types
- `token`: Individual token from LLM
- `complete`: Final complete response
- `error`: Error message
- `provider_switch`: When LLM provider changes

### Fallback Mechanism
If WebSocket connection fails:
1. Client falls back to polling the regular endpoint
2. Response is simulated as streaming by breaking into words
3. User still sees progressive text appearance

## 🔍 Debugging

### Check Backend Logs
Look for:
- "ChatStream received message" - Message received
- Stream publishing logs
- WebSocket connection logs

### Check Browser Console
Look for:
- "[MotiaStream] Connected to chat-messages:user:XXX"
- "[MotiaStream] Disconnected from..."
- Stream message events

### Common Issues
1. **WebSocket connection fails**: Check if port 3000 is accessible
2. **No streaming**: Verify `stream: true` is sent in request
3. **Tokens not appearing**: Check `streams` context is available in handler

## ✨ Benefits

1. **Real-time streaming**: Actual token-by-token streaming
2. **Native Motia integration**: Using framework's built-in capabilities
3. **Automatic fallback**: Graceful degradation if WebSocket fails
4. **Consistent implementation**: Same pattern across all web apps
5. **No external dependencies**: No need for separate SSE server