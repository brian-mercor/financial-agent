/**
 * Motia Stream Client for Browser
 * Connects to Motia's native WebSocket streams
 */

class MotiaStreamClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || window.location.origin.replace('http', 'ws')
    this.connections = new Map()
    this.listeners = new Map()
    this.reconnectAttempts = new Map()
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  /**
   * Connect to a Motia stream
   * @param {string} streamName - Name of the stream (e.g., 'chat-messages')
   * @param {string} streamId - Stream ID to subscribe to (e.g., 'user:123')
   * @param {Object} options - Connection options
   */
  connect(streamName, streamId, options = {}) {
    const key = `${streamName}:${streamId}`

    // If already connected, return existing connection
    if (this.connections.has(key)) {
      return this.connections.get(key)
    }

    // Create WebSocket URL for Motia streams
    // Motia exposes streams at ws://host:port/streams/{streamName}/{streamId}
    const wsUrl = `${this.baseUrl}/streams/${streamName}/${streamId}`

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log(`[MotiaStream] Connected to ${key}`)
      this.reconnectAttempts.set(key, 0)
      this.emit(key, 'connected', { streamName, streamId })
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.emit(key, 'message', data)

        // Emit specific event types
        if (data.type) {
          this.emit(key, data.type, data)
        }
      } catch (error) {
        console.error('[MotiaStream] Failed to parse message:', error)
        this.emit(key, 'error', { error: 'Parse error', raw: event.data })
      }
    }

    ws.onerror = (error) => {
      console.error(`[MotiaStream] WebSocket error on ${key}:`, error)
      this.emit(key, 'error', { error })
    }

    ws.onclose = (event) => {
      console.log(`[MotiaStream] Disconnected from ${key}`, event.code, event.reason)
      this.connections.delete(key)
      this.emit(key, 'disconnected', { code: event.code, reason: event.reason })

      // Auto-reconnect if not a normal closure
      if (event.code !== 1000 && options.autoReconnect !== false) {
        this.attemptReconnect(streamName, streamId, options)
      }
    }

    this.connections.set(key, ws)
    return ws
  }

  /**
   * Disconnect from a stream
   */
  disconnect(streamName, streamId) {
    const key = `${streamName}:${streamId}`
    const ws = this.connections.get(key)

    if (ws) {
      ws.close(1000, 'Client disconnect')
      this.connections.delete(key)
      this.listeners.delete(key)
      this.reconnectAttempts.delete(key)
    }
  }

  /**
   * Send a message to a stream (if Motia supports bidirectional streams)
   */
  send(streamName, streamId, data) {
    const key = `${streamName}:${streamId}`
    const ws = this.connections.get(key)

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data))
      return true
    }

    console.warn(`[MotiaStream] Cannot send to ${key}: not connected`)
    return false
  }

  /**
   * Add event listener for a stream
   */
  on(streamName, streamId, event, callback) {
    const key = `${streamName}:${streamId}`

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Map())
    }

    const eventListeners = this.listeners.get(key)
    if (!eventListeners.has(event)) {
      eventListeners.set(event, new Set())
    }

    eventListeners.get(event).add(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key)?.get(event)
      if (listeners) {
        listeners.delete(callback)
      }
    }
  }

  /**
   * Remove event listener
   */
  off(streamName, streamId, event, callback) {
    const key = `${streamName}:${streamId}`
    const listeners = this.listeners.get(key)?.get(event)

    if (listeners) {
      listeners.delete(callback)
    }
  }

  /**
   * Emit an event
   */
  emit(key, event, data) {
    const eventListeners = this.listeners.get(key)?.get(event)

    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[MotiaStream] Error in event listener:`, error)
        }
      })
    }
  }

  /**
   * Attempt to reconnect to a stream
   */
  attemptReconnect(streamName, streamId, options) {
    const key = `${streamName}:${streamId}`
    const attempts = this.reconnectAttempts.get(key) || 0

    if (attempts >= this.maxReconnectAttempts) {
      console.error(`[MotiaStream] Max reconnect attempts reached for ${key}`)
      this.emit(key, 'reconnect_failed', { attempts })
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts) // Exponential backoff

    console.log(`[MotiaStream] Reconnecting to ${key} in ${delay}ms (attempt ${attempts + 1})`)

    setTimeout(() => {
      this.reconnectAttempts.set(key, attempts + 1)
      this.connect(streamName, streamId, options)
    }, delay)
  }

  /**
   * Disconnect all streams
   */
  disconnectAll() {
    this.connections.forEach((ws, key) => {
      ws.close(1000, 'Client disconnect all')
    })

    this.connections.clear()
    this.listeners.clear()
    this.reconnectAttempts.clear()
  }
}

// Export singleton instance
export const motiaStreamClient = new MotiaStreamClient()

/**
 * React hook for using Motia streams
 */
export function useMotiaStream(streamName, streamId, options = {}) {
  const [messages, setMessages] = React.useState([])
  const [connected, setConnected] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!streamName || !streamId) return

    // Connect to stream
    motiaStreamClient.connect(streamName, streamId, options)

    // Set up event listeners
    const unsubscribers = [
      motiaStreamClient.on(streamName, streamId, 'connected', () => {
        setConnected(true)
        setError(null)
      }),

      motiaStreamClient.on(streamName, streamId, 'disconnected', () => {
        setConnected(false)
      }),

      motiaStreamClient.on(streamName, streamId, 'message', (data) => {
        setMessages(prev => [...prev, data])
      }),

      motiaStreamClient.on(streamName, streamId, 'error', (err) => {
        setError(err)
      }),
    ]

    // Cleanup on unmount
    return () => {
      unsubscribers.forEach(unsub => unsub())
      motiaStreamClient.disconnect(streamName, streamId)
    }
  }, [streamName, streamId])

  return {
    messages,
    connected,
    error,
    send: (data) => motiaStreamClient.send(streamName, streamId, data),
  }
}