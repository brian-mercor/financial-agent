import { StreamConfig } from 'motia'
import { z } from 'zod'

export const chatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(['token', 'complete', 'error', 'provider_switch', 'chart', 'status']),
  userId: z.string(),
  traceId: z.string(),
  content: z.string().optional(),
  response: z.string().optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
  chartHtml: z.string().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string(),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

export const config: StreamConfig = {
  name: 'chat-messages',
  schema: chatMessageSchema,
  baseConfig: {
    storageType: 'default',
    ttl: 3600, // 1 hour
    maxItems: 100, // Keep last 100 messages per stream
  },
}