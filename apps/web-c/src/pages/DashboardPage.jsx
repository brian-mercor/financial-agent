import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { SmartChatInterface } from '../components/SmartChatInterface'
import { assistants } from '../config/assistants'
import { TrendingUp, LogOut, Menu, X, DollarSign, Activity, PieChart } from 'lucide-react'

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold">FinAgent</span>
          </div>
          <div className="text-sm text-gray-600">
            Welcome, {user?.name || user?.email?.split('@')[0] || 'Trader'}
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Portfolio Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">Total Value</span>
              </div>
              <span className="text-sm font-semibold">$125,430</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Day Change</span>
              </div>
              <span className="text-sm font-semibold text-green-600">+2.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Allocation</span>
              </div>
              <span className="text-sm font-semibold">Balanced</span>
            </div>
          </div>
        </div>

        {/* AI Assistants */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Assistants</h3>
          <div className="space-y-2">
            {assistants.map((assistant) => {
              const Icon = assistant.icon
              return (
                <button
                  key={assistant.id}
                  onClick={() => setSelectedAssistant(assistant)}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedAssistant.id === assistant.id
                      ? 'bg-purple-50 border border-purple-300'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${assistant.color} p-2 rounded-lg text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{assistant.name}</div>
                      <div className="text-xs text-gray-500">{assistant.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-xl font-semibold">{selectedAssistant.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            {selectedAssistant.expertise.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <SmartChatInterface assistant={selectedAssistant} />
        </div>
      </div>
    </div>
  )
}