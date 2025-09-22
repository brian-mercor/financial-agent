const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Simple chat endpoint that returns a basic response
app.post('/api/chat/stream', async (req, res) => {
  const { message, assistantType } = req.body;

  console.log('Received message:', message);

  // Return a simple response
  res.json({
    traceId: `trace-${Date.now()}`,
    response: `Backend received your message: "${message}". The full Motia backend is not currently running, but this simple server is responding.`,
    assistantType: assistantType || 'general',
    llmProvider: 'simple-server',
    model: 'echo-model'
  });
});

app.listen(port, () => {
  console.log(`Simple backend server running at http://localhost:${port}`);
});