const express = require('express');
const cors = require('cors');
const http = require('http');

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
    'p/e ratio', 'pe ratio', 'price earnings', 'price-earnings',
    'p/b ratio', 'pb ratio', 'price to book', 'price-to-book',
    'p/s ratio', 'ps ratio', 'price to sales', 'price-to-sales',
    'eps', 'earnings per share',
    'rsi', 'relative strength',
    'roi', 'return on investment',
    'dcf', 'discounted cash flow',
    'ebitda', 'ebit', 'roe', 'roa'
  ];

  // Check if it's asking about a financial concept
  if (financialAbbreviations.some(term => lowerMessage.includes(term))) {
    return false;
  }

  // Educational keywords that indicate explanation, not chart
  const educationalKeywords = ['what is', 'what are', 'explain', 'how does', 'how do', 'define', 'meaning', 'definition', 'tell me about'];
  if (educationalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return false;
  }

  // Must have explicit chart/show/display keywords for non-symbol queries
  const chartKeywords = ['chart', 'graph', 'show', 'display', 'view', 'track', 'price of'];
  const hasChartKeyword = chartKeywords.some(keyword => lowerMessage.includes(keyword));

  // Check for stock symbols (but exclude single letters unless with context)
  const tickerMatch = message.match(/\b([A-Z]{2,5}(?:\.[A-Z]{1,2})?)\b/);

  return hasChartKeyword && tickerMatch;
}

// SSE endpoint for true streaming
app.post('/api/chat/stream', async (req, res) => {
  const { message, assistantType = 'general', userId, context, history, stream } = req.body;

  console.log('Streaming proxy received:', { message, stream, assistantType });

  // Check if this should be a chart response - if so, forward to Motia backend
  if (isChartRequest(message)) {
    console.log('Detected chart request, forwarding to Motia backend');

    // Forward to Motia backend for chart handling
    try {
      const motiaResponse = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      const data = await motiaResponse.json();
      return res.json(data);
    } catch (error) {
      console.error('Error forwarding to Motia:', error);
      return res.status(500).json({ error: 'Failed to process chart request' });
    }
  }

  // For streaming text responses, forward to Motia and stream the response
  if (stream) {
    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    // Send initial connection
    res.write('data: {"type":"connected"}\n\n');

    try {
      // Call Motia backend
      const motiaResponse = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...req.body, stream: false }) // Motia doesn't support streaming
      });

      const data = await motiaResponse.json();

      // Simulate streaming by chunking the response
      const fullResponse = data.response || data.body?.response || 'I understand your question. Let me help you with that.';
      const words = fullResponse.split(' ');
      const chunkSize = 3;

      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, Math.min(i + chunkSize, words.length)).join(' ');
        const isLast = i + chunkSize >= words.length;

        const eventData = {
          type: 'content',
          content: chunk + (isLast ? '' : ' '),
          assistantType: data.assistantType || assistantType,
          done: isLast
        };

        res.write(`data: ${JSON.stringify(eventData)}\n\n`);

        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      // Send completion
      res.write(`data: {"type":"done","provider":"${data.llmProvider || 'azure'}","model":"${data.model || 'gpt-4'}"}\n\n`);
      res.end();

    } catch (error) {
      console.error('Streaming error:', error);
      res.write(`data: {"type":"error","message":"${error.message}"}\n\n`);
      res.end();
    }
  } else {
    // Non-streaming, forward directly to Motia
    try {
      const motiaResponse = await fetch('http://localhost:3000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      const data = await motiaResponse.json();
      res.json(data);
    } catch (error) {
      console.error('Error forwarding to Motia:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'streaming-proxy', port: PORT });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Streaming proxy server running on http://localhost:${PORT}`);
  console.log('This server proxies requests and adds SSE streaming support');
});