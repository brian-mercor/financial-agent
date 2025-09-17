import React from 'react'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'

export function AgentStatusPanel({ workflow }) {
  if (!workflow) return null

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'processing':
        return 'bg-blue-50 border-blue-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">Workflow Processing</h3>
        <span className="text-sm text-gray-500">
          Est. time: {workflow.estimatedTime}s
        </span>
      </div>

      <div className="space-y-3">
        {workflow.agents.map((agent) => (
          <div
            key={agent.id}
            className={`rounded-lg border p-4 transition-all ${getStatusColor(agent.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(agent.status)}
                <span className="font-medium text-gray-900">{agent.name}</span>
              </div>
              {agent.progress !== undefined && (
                <span className="text-sm text-gray-600">{agent.progress}%</span>
              )}
            </div>

            {agent.currentAction && (
              <p className="text-sm text-gray-600 ml-6">{agent.currentAction}</p>
            )}

            {agent.result && (
              <div className="mt-2 ml-6 text-sm text-gray-700 bg-white rounded-lg p-3">
                {agent.result}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}