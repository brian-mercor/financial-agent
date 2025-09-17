import React, { useState } from 'react'
import { ChevronDown, Brain, TrendingUp, DollarSign, Shield, LineChart, Globe } from 'lucide-react'

export const assistantProfiles = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Balanced financial analysis and general advice',
    color: 'bg-blue-500',
    icon: Brain,
    expertise: ['General Finance', 'Education', 'Guidance'],
  },
  {
    id: 'analyst',
    name: 'Financial Analyst',
    description: 'Deep fundamental and technical analysis',
    color: 'bg-green-500',
    icon: LineChart,
    expertise: ['Fundamental Analysis', 'Technical Analysis', 'Valuations'],
  },
  {
    id: 'trader',
    name: 'Trading Assistant',
    description: 'Short-term trading and market timing',
    color: 'bg-orange-500',
    icon: TrendingUp,
    expertise: ['Day Trading', 'Technical Indicators', 'Risk Management'],
  },
  {
    id: 'advisor',
    name: 'Wealth Advisor',
    description: 'Long-term portfolio and retirement planning',
    color: 'bg-purple-500',
    icon: DollarSign,
    expertise: ['Portfolio Management', 'Retirement Planning', 'Tax Strategy'],
  },
  {
    id: 'risk',
    name: 'Risk Manager',
    description: 'Risk assessment and portfolio protection',
    color: 'bg-red-500',
    icon: Shield,
    expertise: ['Risk Analysis', 'Hedging', 'Insurance'],
  },
  {
    id: 'global',
    name: 'Global Markets',
    description: 'International markets and forex trading',
    color: 'bg-indigo-500',
    icon: Globe,
    expertise: ['Forex', 'International Markets', 'Commodities'],
  },
]

export function AssistantSelector({ selectedAssistant, onSelectAssistant }) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = selectedAssistant.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selectedAssistant.color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-gray-900">{selectedAssistant.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {assistantProfiles.map((profile) => {
              const ProfileIcon = profile.icon
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    onSelectAssistant(profile)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 hover:bg-purple-50 transition flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className={`p-2 rounded-lg ${profile.color}`}>
                    <ProfileIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-xs text-gray-500">{profile.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}