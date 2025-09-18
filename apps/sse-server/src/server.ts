import Fastify from 'fastify'
import cors from '@fastify/cors'
import { randomUUID } from 'crypto'
import { sseManager } from './sse-manager.js'
import { RedisSubscriber } from './redis-subscriber.js'

const PORT = parseInt(process.env.SSE_PORT || '3002')
const HOST = process.env.SSE_HOST || '0.0.0.0'

// Initialize Fastify with logging
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

// Register CORS
await fastify.register(cors, {
  origin: true, // Allow all origins in development
  credentials: true,
})

// Initialize Redis subscriber
const redisSubscriber = new RedisSubscriber(fastify.log)

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    clients: sseManager.getClientCount(),
    queued: sseManager.getQueueSize(),
    timestamp: new Date().toISOString(),
  }
})

// SSE endpoint for chat streaming
fastify.get('/sse/chat/:userId', async (request, reply) => {
  const { userId } = request.params as { userId: string }
  const clientId = randomUUID()

  fastify.log.info({ userId, clientId }, 'New SSE connection')

  // Add client to SSE manager
  sseManager.addClient(clientId, reply, userId)

  // Keep connection alive
  request.socket.on('close', () => {
    fastify.log.info({ userId, clientId }, 'SSE connection closed')
  })
})

// SSE endpoint for anonymous connections
fastify.get('/sse/stream', async (request, reply) => {
  const clientId = randomUUID()
  const userId = request.headers['x-user-id'] as string | undefined

  fastify.log.info({ clientId, userId }, 'New anonymous SSE connection')

  // Add client to SSE manager
  sseManager.addClient(clientId, reply, userId)

  // Keep connection alive
  request.socket.on('close', () => {
    fastify.log.info({ clientId }, 'Anonymous SSE connection closed')
  })
})

// Test endpoint to trigger SSE events
fastify.post('/test/publish', async (request, reply) => {
  const { channel, message } = request.body as { channel: string; message: any }

  await redisSubscriber.publish(channel, message)

  return {
    success: true,
    channel,
    message,
  }
})

// Test endpoint to send SSE directly (for debugging)
fastify.post('/test/send/:userId', async (request, reply) => {
  const { userId } = request.params as { userId: string }
  const { event, data } = request.body as { event: string; data: any }

  const sentCount = sseManager.sendToUser(userId, {
    event: event || 'message',
    data,
  })

  return {
    success: sentCount > 0,
    sentCount,
    userId,
  }
})

// Metrics endpoint
fastify.get('/metrics', async (request, reply) => {
  return {
    connections: {
      total: sseManager.getClientCount(),
      byUser: {}, // Could be expanded to show per-user counts
    },
    queues: {
      total: sseManager.getQueueSize(),
    },
    timestamp: new Date().toISOString(),
  }
})

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  fastify.log.info(`Received signal ${signal}, shutting down gracefully`)

  try {
    // Cleanup SSE connections
    sseManager.cleanup()

    // Cleanup Redis
    await redisSubscriber.cleanup()

    // Close Fastify
    await fastify.close()

    process.exit(0)
  } catch (err) {
    fastify.log.error(err, 'Error during shutdown')
    process.exit(1)
  }
}

process.on('SIGTERM', () => closeGracefully('SIGTERM'))
process.on('SIGINT', () => closeGracefully('SIGINT'))

// Start server
try {
  await fastify.listen({ port: PORT, host: HOST })
  fastify.log.info(`SSE server listening on http://${HOST}:${PORT}`)
  fastify.log.info(`Health check: http://${HOST}:${PORT}/health`)
  fastify.log.info(`SSE endpoint: http://${HOST}:${PORT}/sse/stream`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}