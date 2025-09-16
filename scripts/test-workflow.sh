#!/bin/bash

# Test workflow trigger with trading opportunities query

echo "Testing workflow detection for 'Find trading opportunities in today's market'"
echo "================================================"

# First, test the chat/stream endpoint
echo -e "\n1. Testing chat/stream endpoint..."
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find trading opportunities in today'\''s market",
    "assistantType": "trader",
    "userId": "test-user-123",
    "context": {
      "symbols": ["AAPL", "GOOGL"],
      "timeframe": "1d",
      "riskTolerance": "moderate"
    }
  }' | jq .

echo -e "\n2. Testing direct workflow trigger..."
curl -X POST http://localhost:3000/api/workflow/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find trading opportunities in today'\''s market",
    "userId": "test-user-123",
    "context": {
      "symbols": ["AAPL", "GOOGL"],
      "timeframe": "1d",
      "riskTolerance": "moderate"
    }
  }' | jq .

echo -e "\n3. Testing SSE connection..."
echo "Connecting to SSE stream (press Ctrl+C to stop)..."
curl -N http://localhost:3000/api/workflow/stream