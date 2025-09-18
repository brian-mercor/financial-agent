#!/usr/bin/env node

/**
 * Test script to demonstrate proper streaming with Motia
 *
 * The flow is:
 * 1. Connect to WebSocket stream first
 * 2. Send chat request via HTTP API
 * 3. Receive streaming updates via WebSocket
 */

const WebSocket = require('ws');
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000/streams/chat-messages';

async function testStreaming() {
  const userId = 'test-' + Date.now();
  const streamId = `user:${userId}`;

  console.log('🔵 Testing Motia WebSocket Streaming');
  console.log('=====================================\n');

  // Step 1: Connect to WebSocket stream
  console.log('1️⃣ Connecting to WebSocket stream...');
  const ws = new WebSocket(`${WS_URL}/${streamId}`);

  const tokens = [];
  let completeMessage = null;

  ws.on('open', () => {
    console.log('✅ WebSocket connected\n');
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'token') {
        process.stdout.write(message.content || '');
        tokens.push(message.content);
      } else if (message.type === 'complete') {
        console.log('\n\n✅ Streaming complete!');
        completeMessage = message;
        ws.close();
      } else if (message.type === 'error') {
        console.error('\n❌ Error:', message);
        ws.close();
      }
    } catch (err) {
      console.log('Raw message:', data.toString());
    }
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
  });

  // Wait for WebSocket to be ready
  await new Promise(resolve => {
    ws.on('open', resolve);
    setTimeout(resolve, 1000); // Timeout fallback
  });

  // Step 2: Send chat request
  console.log('2️⃣ Sending chat request to API...\n');
  console.log('📝 Message: "Tell me about Apple stock in 3 sentences"\n');
  console.log('🔄 Streaming response:\n');
  console.log('-----------------------------------');

  try {
    const response = await fetch(`${BACKEND_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Tell me about Apple stock in 3 sentences',
        assistantType: 'analyst',
        userId: userId,
        stream: true,
        context: {
          symbols: [],
          timeframe: '1d',
          riskTolerance: 'moderate'
        }
      })
    });

    const jsonResponse = await response.json();

    // The API returns immediately with trace info
    console.log('-----------------------------------\n');
    console.log('📊 API Response:', {
      traceId: jsonResponse.traceId,
      hasChart: jsonResponse.hasChart,
      model: jsonResponse.model
    });

  } catch (err) {
    console.error('❌ API request failed:', err);
    ws.close();
  }

  // Wait for streaming to complete
  await new Promise(resolve => {
    ws.on('close', resolve);
    setTimeout(resolve, 30000); // 30s timeout
  });

  console.log('\n📊 Summary:');
  console.log('- Tokens received:', tokens.length);
  console.log('- Total characters:', tokens.join('').length);
  console.log('- Stream completed:', !!completeMessage);
}

// Run the test
testStreaming().catch(console.error);