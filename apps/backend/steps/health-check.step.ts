import type { ApiRouteConfig, Handlers } from 'motia'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'HealthCheck',
  method: 'GET',
  path: '/health',
  flows: ['core'],
  emits: [],
}

export const handler: Handlers['HealthCheck'] = async (req, { logger }) => {
  logger.info('Health check requested')
  return {
    status: 200,
    body: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'fin-agent-backend',
      version: '1.0.0',
    },
  }
}