import { z } from 'zod'

export const workflowUpdateSchema = z.object({
  id: z.string(),
  type: z.enum(['workflow_update']),
  workflowId: z.string(),
  eventType: z.string().optional(),
  userId: z.string().optional(),
  stepIndex: z.number().optional(),
  agent: z.string().optional(),
  task: z.string().optional(),
  data: z.any().optional(),
  results: z.any().optional(),
  message: z.string().optional(),
  progress: z.number().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
})

export const config = {
  name: 'workflow-updates',
  schema: workflowUpdateSchema,
  baseConfig: {
    storageType: 'default',
    ttl: 7200, // 2 hours
    maxItems: 500,
  },
}