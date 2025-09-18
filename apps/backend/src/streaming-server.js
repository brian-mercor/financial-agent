const express = require('express');
const cors = require('cors');
const { LLMService } = require('../services/llm-service');

const app = express();
const PORT = process.env.STREAMING_PORT || 5179;

// Enable CORS for the frontend
app.use(cors({
  origin: ['http://localhost:5178', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

// Helper to detect if this is a chart request
function isChartRequest(message) {
  const lowerMessage = message.toLowerCase();

  // Financial abbreviations that should NOT trigger charts
  const financialAbbreviations = [
    'p/e ratio', 'pe ratio', 'price earnings',
    'p/b ratio', 'pb ratio', 'price to book',
    'p/s ratio', 'ps ratio', 'price to sales',
    'eps', 'earnings per share',
    'rsi', 'relative strength',
    'ma', 'moving average',
    'roi', 'return on investment',
    'dcf', 'discounted cash flow'
  ];

  // Check if it's asking about a financial concept
  if (financialAbbreviations.some(term => lowerMessage.includes(term))) {
    return false;
  }

  // Educational keywords that indicate explanation, not chart
  const educationalKeywords = ['what is', 'explain', 'how does', 'define', 'meaning', 'definition'];
  if (educationalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return false;
  }

  // Must have explicit chart/show/display keywords for non-symbol queries
  const chartKeywords = ['chart', 'graph', 'show', 'display', 'view'];
  const hasChartKeyword = chartKeywords.some(keyword => lowerMessage.includes(keyword));

  // Check for stock symbols (but exclude single letters unless with context)
  const tickerMatch = message.match(/\b([A-Z]{2,5}(?:\.[A-Z]{1,2})?)\b/);

  return hasChartKeyword && tickerMatch;
}

// SSE endpoint for true streaming
app.post('/api/chat/stream', async (req, res) => {
  const { message, assistantType = 'general', userId, context, history, stream } = req.body;

  console.log('Streaming server received request:', { message, stream, assistantType });

  // Check if this should be a chart response
  if (isChartRequest(message)) {
    // For chart requests, return JSON (not streaming)
    res.json({
      response: "Chart display is not available in streaming mode. Please use the non-streaming endpoint.",
      hasChart: false,
      assistantType
    });
    return;
  }

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable Nginx buffering
  });

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');

  try {
    // Initialize LLM service
    const llmService = new LLMService();

    // Since we can't get true streaming from LLM through Motia,
    // we'll simulate it by chunking the response
    const response = await llmService.process(
      message,
      assistantType,
      { userId: userId || `user-${Date.now()}` },
      history
    );

    // Simulate streaming by sending the response in chunks
    const fullResponse = response.content;
    const words = fullResponse.split(' ');
    const chunkSize = 3; // Send 3 words at a time

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, Math.min(i + chunkSize, words.length)).join(' ');
      const isLast = i + chunkSize >= words.length;

      const eventData = {
        type: 'content',
        content: chunk + (isLast ? '' : ' '),
        assistantType,
        done: isLast
      };

      res.write(`data: ${JSON.stringify(eventData)}\n\n`);

      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Send completion event
    res.write(`data: {"type":"done","provider":"${response.provider}","model":"${response.model}"}\n\n`);
    res.end();

  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: {"type":"error","message":"${error.message}"}\n\n`);
    res.end();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'streaming-server', port: PORT });
});

app.listen(PORT, () => {
  console.log(`Streaming server running on http://localhost:${PORT}`);
  console.log('This server handles SSE streaming for chat responses');
});