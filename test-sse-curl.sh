#!/bin/bash

echo "🔵 Testing Streaming with curl (SSE format)"
echo "==========================================="
echo ""
echo "Note: The backend returns JSON, not SSE."
echo "For true streaming, use WebSocket connection to:"
echo "ws://localhost:3000/streams/chat-messages/user:{userId}"
echo ""
echo "Testing each app's API response:"
echo ""

# Test web (port 5173)
echo "1️⃣ Testing web (port 5173)..."
echo "-----------------------------------"
curl -N -H "Content-Type: application/json" \
  -d '{"message":"Tell me about Tesla in one sentence","assistantType":"analyst","userId":"test123","stream":true}' \
  http://localhost:5173/api/chat/stream 2>/dev/null | python3 -m json.tool | head -5
echo "..."
echo ""

# Test web-a (port 5174)
echo "2️⃣ Testing web-a (port 5174)..."
echo "-----------------------------------"
curl -N -H "Content-Type: application/json" \
  -d '{"message":"What is Apple stock price?","assistantType":"analyst","userId":"test123","stream":true}' \
  http://localhost:5174/api/chat/stream 2>/dev/null | python3 -m json.tool | head -5
echo "..."
echo ""

# Test web-c (port 5176) - Reference
echo "3️⃣ Testing web-c (port 5176) - Reference..."
echo "-----------------------------------"
curl -N -H "Content-Type: application/json" \
  -d '{"message":"NVDA price","assistantType":"analyst","userId":"test123","stream":true}' \
  http://localhost:5176/api/chat/stream 2>/dev/null | python3 -m json.tool | head -5
echo "..."
echo ""

echo "🔍 Analysis:"
echo "- All apps return JSON, not SSE stream"
echo "- This is expected with Motia architecture"
echo "- Streaming happens via WebSocket, not HTTP SSE"
echo ""
echo "✅ To see real streaming:"
echo "1. Frontend connects to ws://localhost:3000/streams/chat-messages/user:{userId}"
echo "2. Frontend sends request to /api/chat/stream"
echo "3. Frontend receives tokens via WebSocket"