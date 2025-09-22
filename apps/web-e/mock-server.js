import express from 'express'
import cors from 'cors'
const app = express()

app.use(cors())
app.use(express.json())

// Mock chat stream endpoint
app.post('/api/chat/stream', (req, res) => {
  const { message, assistantType, userId } = req.body

  // Return a mock response
  res.json({
    success: true,
    data: {
      id: `chat-${Date.now()}`,
      message: `Mock response to: "${message}"`,
      assistantType: assistantType || 'general',
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      streamUrl: null, // No actual streaming in mock
      content: `This is a mock response. The actual backend server needs to be started with Motia framework to provide real AI responses.`
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'mock-backend' })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`)
  console.log(`Handling requests at http://localhost:${PORT}/api/*`)
})