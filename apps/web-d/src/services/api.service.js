const API_BASE_URL = '/api'

// Standardized request builder to ensure consistency
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
  async sendMessage(message, assistantType, options = {}) {
    const body = buildRequestBody(message, assistantType, { ...options, stream: false })

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('API request failed')
    return response.json()
  },

  // Keep streamMessage for backward compatibility but it just calls sendMessage
  // since Motia doesn't support actual streaming
  async streamMessage(message, assistantType, options = {}, onChunk) {
    try {
      const response = await this.sendMessage(message, assistantType, options)

      // Simulate streaming by breaking the response into chunks
      const text = response.response || response.message || response.content || ''
      const words = text.split(' ')

      for (const word of words) {
        onChunk({ chunk: word + ' ' })
        await new Promise(resolve => setTimeout(resolve, 50)) // Small delay between words
      }

      // Send chart if present
      if (response.chartHtml) {
        onChunk({ chartHtml: response.chartHtml })
      }

      return response
    } catch (error) {
      console.error('Error in streamMessage:', error)
      throw error
    }
  }
}