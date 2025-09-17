import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { SmartChatInterface } from '../components/SmartChatInterface'
import { assistants } from '../config/assistants'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-brutal-bg font-grotesk text-brutal-fg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-brutal-ink border-r-4 border-brutal-line flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b-4 border-brutal-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 brutal-card grid place-items-center">
              <span className="font-mono font-bold text-brutal-red">FA</span>
            </div>
            <div>
              <span className="text-lg font-extrabold">FinAgent</span>
              <div className="text-xs font-mono uppercase text-gray-500">
                {user?.email?.split('@')[0] || 'Trader'}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="p-4 border-b-4 border-brutal-line">
          <h3 className="text-xs font-mono uppercase text-brutal-red mb-4">Portfolio Status</h3>
          <div className="space-y-3">
            <div className="brutal-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase">Value</span>
                <span className="text-sm font-mono font-bold">$125,430</span>
              </div>
            </div>
            <div className="brutal-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase">Day +/-</span>
                <span className="text-sm font-mono font-bold text-brutal-red">+2.4%</span>
              </div>
            </div>
            <div className="brutal-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase">Risk</span>
                <span className="text-sm font-mono font-bold">MODERATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agents */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-mono uppercase text-brutal-red mb-4">AI Agents</h3>
          <div className="space-y-2">
            {assistants.map((assistant) => {
              const Icon = assistant.icon
              return (
                <button
                  key={assistant.id}
                  onClick={() => setSelectedAssistant(assistant)}
                  className={`w-full text-left transition-all ${
                    selectedAssistant.id === assistant.id
                      ? 'brutal-card bg-brutal-red text-brutal-bg'
                      : 'brutal-card hover:translate-x-1'
                  }`}
                  style={{ padding: '12px' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${selectedAssistant.id === assistant.id ? 'bg-brutal-bg text-brutal-red' : 'bg-brutal-gray'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-xs uppercase font-bold">{assistant.name}</div>
                      <div className="text-xs opacity-80">{assistant.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t-4 border-brutal-line">
          <button
            onClick={handleSignOut}
            className="w-full btn-ghost py-3 font-mono text-xs uppercase"
          >
            [ DISCONNECT ]
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-brutal-ink border-b-4 border-brutal-line px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="brutal-card p-2 hover:bg-brutal-red hover:text-brutal-bg transition-colors"
            >
              <span className="font-mono text-xs">{sidebarOpen ? '<<<' : '>>>'}</span>
            </button>
            <div>
              <h1 className="text-xl font-extrabold">{selectedAssistant.name}</h1>
              <div className="flex gap-2 mt-1">
                {selectedAssistant.expertise.map((skill, index) => (
                  <span key={index} className="text-xs font-mono uppercase text-brutal-red">
                    {skill} {index < selectedAssistant.expertise.length - 1 && '•'}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono uppercase">
              <span className="text-gray-500">Status:</span>{' '}
              <span className="text-brutal-red">ONLINE</span>
            </div>
            <div className="text-xs font-mono uppercase">
              <span className="text-gray-500">Market:</span>{' '}
              <span className="text-brutal-red">OPEN</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden bg-brutal-bg">
          <SmartChatInterface assistant={selectedAssistant} />
        </div>
      </div>
    </div>
  )
}