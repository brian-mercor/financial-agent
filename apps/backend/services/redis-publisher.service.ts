/**
 * Redis Publisher Service
 * Publishes events from Motia to Redis for the SSE server to consume
 * Falls back to no-op if Redis is not available
 */

// Try to import ioredis, but make it optional
let Redis: any = null
try {
  Redis = require('ioredis')
} catch (error) {
  console.log('[RedisPublisher] ioredis not found - Redis publishing will be disabled')
}

class RedisPublisher {
  private publisher: any = null
  private isConnected = false
  private connectionPromise: Promise<void> | null = null
  private redisEnabled = false

  constructor() {
    // Check if Redis is available
    this.redisEnabled = !!Redis && (
      !!process.env.REDIS_HOST ||
      !!process.env.REDIS_URL ||
      process.env.ENABLE_REDIS === 'true'
    )

    if (!this.redisEnabled) {
      console.log('[RedisPublisher] Redis is disabled - using no-op implementation')
    }
  }

  private async connect(): Promise<void> {
    if (!this.redisEnabled) return
    if (this.isConnected) return
    if (this.connectionPromise) return this.connectionPromise

    this.connectionPromise = this.doConnect()
    return this.connectionPromise
  }

  private async doConnect(): Promise<void> {
    if (!this.redisEnabled || !Redis) {
      return
    }

    try {
      const redisOptions = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times: number) => {
          // Give up after 10 attempts
          if (times > 10) return null
          return Math.min(times * 50, 2000)
        },
        enableOfflineQueue: true,
      }

      this.publisher = new Redis(redisOptions)

      await new Promise<void>((resolve, reject) => {
        this.publisher!.once('ready', () => {
          console.log('[RedisPublisher] Connected to Redis')
          this.isConnected = true
          resolve()
        })

        this.publisher!.once('error', (err: any) => {
          console.error('[RedisPublisher] Connection error:', err)
          reject(err)
        })

        // Timeout after 5 seconds
        setTimeout(() => {
          reject(new Error('Redis connection timeout'))
        }, 5000)
      })
    } catch (error) {
      console.error('[RedisPublisher] Failed to connect:', error)
      this.publisher = null
      this.isConnected = false
      this.connectionPromise = null
      this.redisEnabled = false
      // Don't throw - allow the system to work without Redis
    }
  }

  /**
   * Publish a chat stream event
   */
  async publishChatStream(userId: string, traceId: string, type: string, data: any): Promise<void> {
    if (!userId) return

    const message = {
      userId,
      traceId,
      type,
      data,
      timestamp: new Date().toISOString(),
    }

    await this.publish('sse:chat:stream', message)
  }

  /**
   * Publish a workflow update
   */
  async publishWorkflowUpdate(
    workflowId: string,
    userId: string | undefined,
    type: string,
    data: any
  ): Promise<void> {
    const message = {
      workflowId,
      userId,
      type,
      data,
      timestamp: new Date().toISOString(),
    }

    await this.publish('sse:workflow:update', message)
  }

  /**
   * Broadcast a message to all clients
   */
  async broadcast(event: string, data: any): Promise<void> {
    const message = {
      event,
      data,
      timestamp: new Date().toISOString(),
    }

    await this.publish('sse:broadcast', message)
  }

  /**
   * Publish a message to Redis
   */
  private async publish(channel: string, message: any): Promise<void> {
    // If Redis is disabled, silently skip
    if (!this.redisEnabled) {
      return
    }

    try {
      // Try to connect if not connected
      if (!this.isConnected) {
        await this.connect()
      }

      if (this.publisher && this.isConnected) {
        await this.publisher.publish(channel, JSON.stringify(message))
        console.log(`[RedisPublisher] Published to ${channel}`)
      } else {
        console.warn(`[RedisPublisher] Not connected, skipping publish to ${channel}`)
      }
    } catch (error) {
      console.error(`[RedisPublisher] Failed to publish to ${channel}:`, error)
      // Don't throw - allow the system to continue without Redis
    }
  }

  /**
   * Cleanup connection
   */
  async cleanup(): Promise<void> {
    if (this.publisher) {
      await this.publisher.quit()
      this.publisher = null
      this.isConnected = false
    }
  }
}

// Export singleton instance
export const redisPublisher = new RedisPublisher()