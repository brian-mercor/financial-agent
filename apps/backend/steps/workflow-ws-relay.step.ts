import type { EventRouteConfig, Handlers } from '../types'

export const config: EventRouteConfig = {
  type: 'event',
  name: 'WorkflowWSRelay',
  subscribes: [
    'workflow.started',
    'workflow.agent.started',
    'workflow.agent.progress',
    'workflow.agent.completed',
    'workflow.completed',
    'workflow.error',
  ],
  input: {
    workflowId: 'string',
    userId: 'string?',
    streamKey: 'string?', // WebSocket stream key
    type: 'string?',
    stepIndex: 'number?',
    agent: 'string?',
    task: 'string?',
    data: 'any?',
    results: 'any?',
    message: 'string?',
    progress: 'number?',
    error: 'string?',
    timestamp: 'string?',
  },
  emits: [],
}

export const handler: Handlers['WorkflowWSRelay'] = async (event, { logger, streams }) => {
  const { workflowId, streamKey, type, ...eventData } = event

  try {
    // Check if streams are available
    if (!streams) {
      logger.warn('Streams context not available for workflow relay')
      return
    }

    // Determine which stream to use
    const targetStreamKey = streamKey || `workflow-${workflowId}`

    logger.info('Relaying workflow event to WebSocket stream', { 
      workflowId, 
      streamKey: targetStreamKey, 
      eventType: type 
    })

    // Send the workflow update to the WebSocket stream
    // Check if a workflow stream exists and use it
    if (streams && streams['workflow-updates']) {
      const messageId = `${workflowId}-${Date.now()}`
      await streams['workflow-updates'].set(
        targetStreamKey,
        messageId,
        {
          id: messageId,
          type: 'workflow_update',
          workflowId,
          eventType: type,
          ...eventData,
          timestamp: eventData.timestamp || new Date().toISOString(),
        }
      )
    } else {
      logger.warn('Workflow updates stream not configured', { workflowId })
    }

  } catch (error) {
    logger.error('Error relaying workflow event to WebSocket', {
      error: error instanceof Error ? error.message : 'Unknown error',
      workflowId,
      streamKey,
    })
  }
}