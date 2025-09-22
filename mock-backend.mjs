import http from 'http'

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // Handle chat stream endpoint
  if (req.url === '/api/chat/stream' && req.method === 'POST') {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        const response = {
          success: true,
          data: {
            id: `chat-${Date.now()}`,
            message: `Mock response to: "${data.message}"`,
            assistantType: data.assistantType || 'general',
            userId: data.userId || 'anonymous',
            timestamp: new Date().toISOString(),
            streamUrl: null,
            content: `This is a mock response. The actual backend (Motia) needs to be properly configured to provide real AI responses.`
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid request' }))
      }
    })
  }
  // Handle health check
  else if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', service: 'mock-backend' }))
  }
  // 404 for other routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`)
  console.log(`Handling requests at http://localhost:${PORT}/api/*`)
})