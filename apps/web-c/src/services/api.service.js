const API_BASE_URL = '/api'

const buildRequestBody = (message, assistantType = 'general', options = {}) => {
  return {
    message,
    assistantType,
    userId: options.userId || `user-${Date.now()}`,
    context: options.context || {
      symbols: [],
      timeframe: '1d',
      riskTolerance: 'moderate'
    },
    history: options.history || [],
    stream: options.stream !== undefined ? options.stream : true
  }
}

export const apiService = {
  async sendMessage(message, assistantType, history = []) {
    const body = buildRequestBody(message, assistantType, { history, stream: false })

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('API request failed')
    return response.json()
  },

  async streamMessage(message, assistantType, options = {}, onChunk) {
    const body = buildRequestBody(message, assistantType, { ...options, stream: true })

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Stream request failed')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return
          try {
            const parsed = JSON.parse(data)
            onChunk(parsed)
          } catch (e) {
            console.error('Failed to parse SSE data:', e)
          }
        }
      }
    }
  }
}