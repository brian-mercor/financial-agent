'use client'

import { useState, useRef, useCallback } from 'react'
import { motiaStreamClient, type StreamMessage } from '@/lib/motia-stream-client'

interface UseMotiaChatOptions {
  assistantType?: string
  userId?: string
  onToken?: (token: string) => void
  onComplete?: (response: string) => void
  onError?: (error: string) => void
}

export function useMotiaStreamChat(options: UseMotiaChatOptions = {}) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const unsubscribeRef = useRef<(() => void)[]>([])
  const streamIdRef = useRef<string | null>(null)
  const traceIdRef = useRef<string | null>(null)

  const sendMessage = useCallback(async (
    message: string,
    history: any[] = []
  ): Promise<{ response: string; traceId?: string }> => {
    setIsStreaming(true)
    setError(null)

    const userId = options.userId || `user-${Date.now()}`
    streamIdRef.current = `user:${userId}`

    try {
      // First, initiate the chat request
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          assistantType: options.assistantType || 'general',
          userId,
          history,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`)
      }

      const data = await response.json()
      traceIdRef.current = data.traceId

      // If we got an immediate response (non-streaming), return it
      if (data.response) {
        setIsStreaming(false)
        options.onComplete?.(data.response)
        return { response: data.response, traceId: data.traceId }
      }

      // Otherwise, set up WebSocket streaming
      return new Promise((resolve, reject) => {
        let fullContent = ''
        let finalResponse = ''

        // Connect to Motia stream
        const streamName = 'chat-messages'
        const streamId = streamIdRef.current!

        motiaStreamClient.connect(streamName, streamId, { autoReconnect: false })

        // Clean up previous subscriptions
        unsubscribeRef.current.forEach(unsub => unsub())
        unsubscribeRef.current = []

        // Set up message handler
        const unsubMessage = motiaStreamClient.on(streamName, streamId, 'message', (msg: StreamMessage) => {
          // Only process messages for this trace
          if (msg.traceId !== traceIdRef.current) return

          switch (msg.type) {
            case 'token':
              if (msg.content) {
                fullContent += msg.content
                options.onToken?.(msg.content)
              }
              break

            case 'complete':
              finalResponse = msg.response || fullContent
              options.onComplete?.(finalResponse)
              setIsStreaming(false)

              // Cleanup
              unsubscribeRef.current.forEach(unsub => unsub())
              motiaStreamClient.disconnect(streamName, streamId)

              resolve({
                response: finalResponse,
                traceId: traceIdRef.current || undefined
              })
              break

            case 'error':
              const errorMsg = msg.error || 'Stream error'
              setError(errorMsg)
              options.onError?.(errorMsg)
              setIsStreaming(false)

              // Cleanup
              unsubscribeRef.current.forEach(unsub => unsub())
              motiaStreamClient.disconnect(streamName, streamId)

              reject(new Error(errorMsg))
              break
          }
        })

        // Set up error handler
        const unsubError = motiaStreamClient.on(streamName, streamId, 'error', (err: any) => {
          console.error('Stream error:', err)
          setError('Connection error')
          setIsStreaming(false)

          // Cleanup
          unsubscribeRef.current.forEach(unsub => unsub())
          motiaStreamClient.disconnect(streamName, streamId)

          reject(new Error('Stream connection failed'))
        })

        // Set up disconnect handler
        const unsubDisconnect = motiaStreamClient.on(streamName, streamId, 'disconnected', () => {
          if (isStreaming) {
            // Unexpected disconnect
            setError('Connection lost')
            setIsStreaming(false)
            reject(new Error('Stream disconnected unexpectedly'))
          }
        })

        unsubscribeRef.current = [unsubMessage, unsubError, unsubDisconnect]

        // Set timeout
        setTimeout(() => {
          if (isStreaming) {
            setError('Stream timeout')
            setIsStreaming(false)

            // Cleanup
            unsubscribeRef.current.forEach(unsub => unsub())
            motiaStreamClient.disconnect(streamName, streamId)

            reject(new Error('Stream timeout'))
          }
        }, 60000) // 60 second timeout
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setIsStreaming(false)
      throw err
    }
  }, [options])

  const cleanup = useCallback(() => {
    if (streamIdRef.current) {
      unsubscribeRef.current.forEach(unsub => unsub())
      motiaStreamClient.disconnect('chat-messages', streamIdRef.current)
      streamIdRef.current = null
      traceIdRef.current = null
    }
  }, [])

  return {
    sendMessage,
    isStreaming,
    error,
    cleanup,
  }
}