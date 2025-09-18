import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Menu, X, Settings, LogOut, DollarSign, Activity, PieChart, LineChart, BarChart } from 'lucide-react'
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
    <div className="flex h-screen relative">
      <div className="baroque-bg"></div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 luxury-card border-r border-yellow-500/20 overflow-hidden flex-shrink-0 relative z-10`}>
        <div className="p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="graffiti-tag street-art-text text-2xl">FinAgent</div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 luxury-card rounded-lg">
            <p className="text-sm text-gray-400">Trading as</p>
            <p className="text-sm font-medium truncate street-art-text">{user?.email}</p>
          </div>

          {/* Assistant Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-yellow-400 mb-3 block">
              AI Assistant
            </label>
            <div className="space-y-2">
              {assistants.map((assistant) => (
                <button
                  key={assistant.id}
                  onClick={() => setSelectedAssistant(assistant)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                    selectedAssistant.id === assistant.id
                      ? 'luxury-card neon-glow border border-yellow-400/50'
                      : 'bg-black/30 hover:bg-black/50 border border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${assistant.color} w-10 h-10 rounded-full flex items-center justify-center feature-icon`}>
                      <assistant.icon className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{assistant.name}</p>
                      <p className="text-xs text-gray-400">{assistant.expertise[0]}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="mb-6 p-4 luxury-card rounded-lg">
            <h3 className="text-sm font-medium mb-3 street-art-text">Portfolio Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Total Value</span>
                </div>
                <span className="text-sm font-semibold text-white">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Today's Change</span>
                </div>
                <span className="text-sm font-semibold text-green-400">+0.00%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Positions</span>
                </div>
                <span className="text-sm font-semibold text-white">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Push to bottom */}
          <div className="mt-auto space-y-2">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-black/50 rounded-lg transition">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-black/50 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Bar */}
        <div className="luxury-card border-b border-yellow-500/20 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-black/50 rounded-lg transition"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Assistant</p>
                <p className="font-medium street-art-text">{selectedAssistant.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 luxury-card m-4 rounded-2xl neon-glow overflow-hidden">
          <SmartChatInterface assistant={selectedAssistant} />
        </div>
      </div>

      {/* Ornate Flourishes */}
      <div className="ornate-flourish" style={{ top: '10%', right: '5%', animationDelay: '0s', opacity: 0.3 }}></div>
      <div className="ornate-flourish" style={{ bottom: '10%', left: '20%', animationDelay: '-10s', opacity: 0.3 }}></div>
    </div>
  )
}