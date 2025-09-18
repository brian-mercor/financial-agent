import { motiaStreamClient } from './motia-stream-client'

class ApiService {
  constructor() {
    this.baseUrl = '';
  }

  async sendMessage(message, assistantType = 'general', history = []) {
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantType,
          history,
          userId: `user-${Date.now()}`,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate',
          },
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async streamMessageMotia(message, assistantType = 'general', history = [], onChunk) {
    const userId = `user-${Date.now()}`

    try {
      // First, initiate the streaming request
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantType,
          history,
          userId,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate',
          },
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Stream error! status: ${response.status}`);
      }

      const result = await response.json()
      const traceId = result.traceId

      // If we got an immediate response, return it
      if (result.response) {
        onChunk({ type: 'complete', response: result.response })
        return result
      }

      // Connect to Motia stream for this user
      const streamName = 'chat-messages'
      const streamId = `user:${userId}`

      return new Promise((resolve, reject) => {
        let fullContent = ''
        let chartHtml = null

        // Connect to the stream
        motiaStreamClient.connect(streamName, streamId, { autoReconnect: false })

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
                model: data.model,
                chartHtml,
                traceId
              })
              break

            case 'error':
              onChunk({ type: 'error', error: data.error })
              unsubscribe()
              motiaStreamClient.disconnect(streamName, streamId)
              reject(new Error(data.error || 'Stream error'))
              break

            case 'chart':
              chartHtml = data.chartHtml
              onChunk({ type: 'chart', chartHtml })
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
    } catch (error) {
      console.error('Stream Error:', error);
      throw error;
    }
  }

  async streamMessage(message, assistantType = 'general', history = [], onChunk) {
    // Try Motia streaming first
    try {
      return await this.streamMessageMotia(message, assistantType, history, onChunk)
    } catch (error) {
      console.warn('Motia streaming failed, falling back to polling:', error)

      // Fallback to simple JSON response with simulated streaming
      const response = await this.sendMessage(message, assistantType, history)

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

  async getWorkflowStatus(workflowId) {
    try {
      const response = await fetch(`/api/workflow/${workflowId}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Workflow status error:', error);
      throw error;
    }
  }
}

export default new ApiService();