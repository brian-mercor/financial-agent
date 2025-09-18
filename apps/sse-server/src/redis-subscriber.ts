import Redis from 'ioredis'
import { sseManager } from './sse-manager.js'
import { FastifyInstance } from 'fastify'

export interface RedisMessage {
  type: 'chat' | 'workflow' | 'stream'
  userId?: string
  data: any
}

export class RedisSubscriber {
  private subscriber: Redis
  private publisher: Redis
  private logger: FastifyInstance['log']

  constructor(logger: FastifyInstance['log'], redisUrl?: string) {
    this.logger = logger

    const redisOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
    }

    this.subscriber = new Redis(redisOptions)
    this.publisher = new Redis(redisOptions)

    this.setupSubscriptions()
    this.setupEventHandlers()
  }

  private setupSubscriptions(): void {
    // Subscribe to all SSE-related channels
    const channels = [
      'sse:chat:stream',
      'sse:workflow:update',
      'sse:broadcast',
    ]

    this.subscriber.subscribe(...channels, (err, count) => {
      if (err) {
        this.logger.error({ err }, 'Failed to subscribe to Redis channels')
      } else {
        this.logger.info({ count }, 'Subscribed to Redis channels')
      }
    })

    // Handle incoming messages
    this.subscriber.on('message', (channel, message) => {
      this.handleRedisMessage(channel, message)
    })
  }

  private setupEventHandlers(): void {
    this.subscriber.on('error', (err) => {
      this.logger.error({ err }, 'Redis subscriber error')
    })

    this.subscriber.on('connect', () => {
      this.logger.info('Redis subscriber connected')
    })

    this.subscriber.on('reconnecting', () => {
      this.logger.info('Redis subscriber reconnecting')
    })

    this.publisher.on('error', (err) => {
      this.logger.error({ err }, 'Redis publisher error')
    })
  }

  private handleRedisMessage(channel: string, message: string): void {
    try {
      const parsedMessage = JSON.parse(message)
      this.logger.debug({ channel, message: parsedMessage }, 'Received Redis message')

      switch (channel) {
        case 'sse:chat:stream':
          this.handleChatStream(parsedMessage)
          break

        case 'sse:workflow:update':
          this.handleWorkflowUpdate(parsedMessage)
          break

        case 'sse:broadcast':
          this.handleBroadcast(parsedMessage)
          break

        default:
          this.logger.warn({ channel }, 'Unknown channel')
      }
    } catch (error) {
      this.logger.error({ error, channel, message }, 'Failed to process Redis message')
    }
  }

  private handleChatStream(message: any): void {
    const { userId, traceId, type, data } = message

    if (!userId) {
      this.logger.warn({ message }, 'Chat stream message missing userId')
      return
    }

    // Format the SSE message based on type
    let sseMessage
    switch (type) {
      case 'token':
        sseMessage = {
          event: 'message',
          data: {
            type: 'token',
            content: data.content || data,
            traceId,
          },
        }
        break

      case 'complete':
        sseMessage = {
          event: 'message',
          data: {
            type: 'complete',
            response: data.response,
            provider: data.provider,
            model: data.model,
            traceId,
          },
        }
        break

      case 'error':
        sseMessage = {
          event: 'error',
          data: {
            message: data.message || 'An error occurred',
            traceId,
          },
        }
        break

      default:
        sseMessage = {
          event: 'message',
          data: {
            type,
            ...data,
            traceId,
          },
        }
    }

    // Send to all clients for this user
    const sentCount = sseManager.sendToUser(userId, sseMessage)
    this.logger.debug({ userId, sentCount, type }, 'Sent chat stream to user')
  }

  private handleWorkflowUpdate(message: any): void {
    const { workflowId, userId, type, data } = message

    const sseMessage = {
      event: 'workflow',
      data: {
        workflowId,
        type,
        ...data,
        timestamp: new Date().toISOString(),
      },
    }

    if (userId) {
      // Send to specific user
      const sentCount = sseManager.sendToUser(userId, sseMessage)
      this.logger.debug({ userId, workflowId, sentCount }, 'Sent workflow update to user')
    } else {
      // Broadcast to all
      const sentCount = sseManager.broadcast(sseMessage)
      this.logger.debug({ workflowId, sentCount }, 'Broadcast workflow update')
    }
  }

  private handleBroadcast(message: any): void {
    const sseMessage = {
      event: message.event || 'broadcast',
      data: message.data || message,
    }

    const sentCount = sseManager.broadcast(sseMessage)
    this.logger.debug({ sentCount }, 'Broadcast message to all clients')
  }

  /**
   * Publish a message to Redis (for testing or manual publishing)
   */
  async publish(channel: string, message: any): Promise<void> {
    try {
      await this.publisher.publish(channel, JSON.stringify(message))
      this.logger.debug({ channel, message }, 'Published message to Redis')
    } catch (error) {
      this.logger.error({ error, channel }, 'Failed to publish to Redis')
    }
  }

  /**
   * Cleanup connections
   */
  async cleanup(): Promise<void> {
    await this.subscriber.quit()
    await this.publisher.quit()
  }
}