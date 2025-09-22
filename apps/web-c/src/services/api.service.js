import { motiaStreamClient } from './motia-stream-client'

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

  /**
   * Stream message using Motia's native WebSocket streams
   */
  async streamMessageMotia(message, assistantType, options = {}, onChunk) {
    const userId = options.userId || `user-${Date.now()}`
    const body = buildRequestBody(message, assistantType, { ...options, userId, stream: true })

    // First, initiate the streaming request
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error('Stream request failed')

    const result = await response.json()
    const traceId = result.traceId

    // Connect to Motia stream for this user
    const streamName = 'chat-messages'
    const streamId = `user:${userId}`

    return new Promise((resolve, reject) => {
      let fullContent = ''

      // Connect to the stream
      motiaStreamClient.connect(streamName, streamId, { autoReconnect: true })

      // Listen for messages
      const unsubscribe = motiaStreamClient.on(streamName, streamId, 'message', (data) => {
        // Only process messages for this trace
        if (data.traceId !== traceId) return

        switch (data.type) {
          case 'token':
            fullContent += data.content || ''
            onChunk({ chunk: data.content, type: 'token' })
            break

          case 'complete':
            onChunk({
              type: 'complete',
              response: data.response,
              provider: data.provider,
              model: data.model
            })
            // Cleanup and resolve
            unsubscribe()
            motiaStreamClient.disconnect(streamName, streamId)
            resolve({
              response: data.response || fullContent,
              provider: data.provider,
              model: data.model
            })
            break

          case 'error':
            onChunk({ type: 'error', error: data.error })
            unsubscribe()
            motiaStreamClient.disconnect(streamName, streamId)
            reject(new Error(data.error || 'Stream error'))
            break
        }
      })

      // Handle connection errors
      motiaStreamClient.on(streamName, streamId, 'error', (error) => {
        console.error('Stream connection error:', error)
        unsubscribe()
        reject(new Error('Stream connection failed'))
      })

      // Timeout after 60 seconds
      setTimeout(() => {
        unsubscribe()
        motiaStreamClient.disconnect(streamName, streamId)
        reject(new Error('Stream timeout'))
      }, 60000)
    })
  },

  /**
   * Legacy streaming (fallback for compatibility)
   */
  async streamMessage(message, assistantType, options = {}, onChunk) {
    // Try Motia streaming first
    try {
      return await this.streamMessageMotia(message, assistantType, options, onChunk)
    } catch (error) {
      console.warn('Motia streaming failed, falling back to polling:', error)

      // Fallback to simple JSON response with simulated streaming
      const response = await this.sendMessage(message, assistantType, options.history || [])

      // Simulate streaming by breaking the response into chunks
      const text = response.response || response.message || response.content || ''
      const words = text.split(' ')

      for (let i = 0; i < words.length; i++) {
        onChunk({ chunk: words[i] + ' ', type: 'token' })
        await new Promise(resolve => setTimeout(resolve, 30))
      }

      onChunk({ type: 'complete', response: text })
      return response
    }
  }
}