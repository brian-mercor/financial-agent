import { FastifyReply } from 'fastify'
import { EventEmitter } from 'events'

export interface SSEClient {
  id: string
  userId?: string
  reply: FastifyReply
  lastPing: number
  isAlive: boolean
}

export interface SSEMessage {
  id?: string
  event?: string
  data: any
  retry?: number
}

export class SSEManager extends EventEmitter {
  private clients: Map<string, SSEClient> = new Map()
  private messageQueue: Map<string, SSEMessage[]> = new Map()
  private heartbeatInterval: NodeJS.Timer | null = null
  private messageCounter = 0

  constructor() {
    super()
    this.startHeartbeat()
  }

  /**
   * Add a new SSE client
   */
  addClient(clientId: string, reply: FastifyReply, userId?: string): void {
    // Set SSE headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    })

    // Create client record
    const client: SSEClient = {
      id: clientId,
      userId,
      reply,
      lastPing: Date.now(),
      isAlive: true,
    }

    this.clients.set(clientId, client)

    // Send initial connection message
    this.sendToClient(clientId, {
      event: 'connected',
      data: {
        message: 'SSE stream connected',
        clientId,
        timestamp: new Date().toISOString(),
      },
    })

    // Send any queued messages for this user
    if (userId) {
      const queuedMessages = this.messageQueue.get(userId) || []
      queuedMessages.forEach(msg => this.sendToClient(clientId, msg))
      this.messageQueue.delete(userId)
    }

    // Handle client disconnect
    reply.raw.on('close', () => {
      this.removeClient(clientId)
      this.emit('client:disconnected', { clientId, userId })
    })

    this.emit('client:connected', { clientId, userId })
  }

  /**
   * Remove a client
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId)
    if (client) {
      client.isAlive = false
      this.clients.delete(clientId)
    }
  }

  /**
   * Format SSE message
   */
  private formatSSEMessage(message: SSEMessage): string {
    const lines: string[] = []

    if (message.id) {
      lines.push(`id: ${message.id}`)
    }

    if (message.event) {
      lines.push(`event: ${message.event}`)
    }

    if (message.retry) {
      lines.push(`retry: ${message.retry}`)
    }

    // Handle data - split by newlines for proper SSE format
    const dataStr = typeof message.data === 'string'
      ? message.data
      : JSON.stringify(message.data)

    dataStr.split('\n').forEach(line => {
      lines.push(`data: ${line}`)
    })

    // Double newline to end the message
    return lines.join('\n') + '\n\n'
  }

  /**
   * Send message to a specific client
   */
  sendToClient(clientId: string, message: SSEMessage): boolean {
    const client = this.clients.get(clientId)
    if (!client || !client.isAlive) {
      return false
    }

    try {
      // Generate message ID if not provided
      if (!message.id) {
        message.id = `msg-${++this.messageCounter}`
      }

      const formattedMessage = this.formatSSEMessage(message)
      client.reply.raw.write(formattedMessage)
      client.lastPing = Date.now()
      return true
    } catch (error) {
      console.error(`Failed to send message to client ${clientId}:`, error)
      this.removeClient(clientId)
      return false
    }
  }

  /**
   * Send message to all clients of a specific user
   */
  sendToUser(userId: string, message: SSEMessage): number {
    let sentCount = 0
    const deadClients: string[] = []

    this.clients.forEach((client, clientId) => {
      if (client.userId === userId) {
        if (this.sendToClient(clientId, message)) {
          sentCount++
        } else {
          deadClients.push(clientId)
        }
      }
    })

    // Clean up dead connections
    deadClients.forEach(id => this.removeClient(id))

    // If no clients were connected, queue the message
    if (sentCount === 0) {
      const queue = this.messageQueue.get(userId) || []
      queue.push(message)
      if (queue.length > 100) {
        queue.shift() // Remove oldest message if queue is too large
      }
      this.messageQueue.set(userId, queue)
    }

    return sentCount
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: SSEMessage): number {
    let sentCount = 0
    const deadClients: string[] = []

    this.clients.forEach((_client, clientId) => {
      if (this.sendToClient(clientId, message)) {
        sentCount++
      } else {
        deadClients.push(clientId)
      }
    })

    // Clean up dead connections
    deadClients.forEach(id => this.removeClient(id))

    return sentCount
  }

  /**
   * Send heartbeat to keep connections alive
   */
  private sendHeartbeat(): void {
    const heartbeat: SSEMessage = {
      event: 'heartbeat',
      data: { timestamp: Date.now() },
    }

    const deadClients: string[] = []

    this.clients.forEach((client, clientId) => {
      // Check if client has been inactive for too long
      if (Date.now() - client.lastPing > 60000) {
        deadClients.push(clientId)
      } else {
        // Send comment to keep connection alive
        try {
          client.reply.raw.write(':heartbeat\n\n')
        } catch {
          deadClients.push(clientId)
        }
      }
    })

    deadClients.forEach(id => this.removeClient(id))
  }

  /**
   * Start heartbeat interval
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat()
    }, 30000) // Send heartbeat every 30 seconds
  }

  /**
   * Stop heartbeat interval
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * Get client count
   */
  getClientCount(): number {
    return this.clients.size
  }

  /**
   * Get clients by user
   */
  getClientsByUser(userId: string): number {
    let count = 0
    this.clients.forEach(client => {
      if (client.userId === userId) count++
    })
    return count
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    let total = 0
    this.messageQueue.forEach(queue => {
      total += queue.length
    })
    return total
  }

  /**
   * Clear message queue for a user
   */
  clearQueue(userId: string): void {
    this.messageQueue.delete(userId)
  }

  /**
   * Cleanup all connections
   */
  cleanup(): void {
    this.stopHeartbeat()
    this.clients.forEach((client, clientId) => {
      try {
        this.sendToClient(clientId, {
          event: 'disconnect',
          data: { message: 'Server shutting down' },
        })
        client.reply.raw.end()
      } catch {
        // Ignore errors during cleanup
      }
    })
    this.clients.clear()
    this.messageQueue.clear()
  }
}

export const sseManager = new SSEManager()