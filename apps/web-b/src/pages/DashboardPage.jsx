import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Menu, X, Settings, LogOut, DollarSign, Activity, PieChart } from 'lucide-react'
import { SmartChatInterface } from '../components/SmartChatInterface'
import { assistants } from '../config/assistants'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r overflow-hidden`}>
        <div className="p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <h1 className="text-xl font-bold gradient-text">FinanceAI</h1>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Signed in as</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>

          {/* Assistant Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Assistant
            </label>
            <div className="space-y-2">
              {assistants.map((assistant) => (
                <button
                  key={assistant.id}
                  onClick={() => setSelectedAssistant(assistant)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedAssistant.id === assistant.id
                      ? 'bg-purple-100 border border-purple-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${assistant.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                      <assistant.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{assistant.name}</p>
                      <p className="text-xs text-gray-600">{assistant.expertise[0]}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Portfolio Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Total Value</span>
                </div>
                <span className="text-sm font-semibold">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Today's Change</span>
                </div>
                <span className="text-sm font-semibold text-green-500">+0.00%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Assets</span>
                </div>
                <span className="text-sm font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Push to bottom */}
          <div className="mt-auto space-y-2">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h2 className="text-lg font-semibold">{selectedAssistant.name}</h2>
              <p className="text-sm text-gray-600">{selectedAssistant.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${selectedAssistant.color} animate-pulse`} />
            <span className="text-sm text-gray-600">Online</span>
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