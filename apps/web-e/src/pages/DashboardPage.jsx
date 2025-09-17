import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, TrendingUp, DollarSign, Activity, PieChart, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SmartChatInterface } from '../components/SmartChatInterface'
import { AssistantCard } from '../components/AssistantCard'
import { assistants } from '../config/assistants'

export default function DashboardPage() {
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Add class to body to prevent scrolling on dashboard
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100vh'
      root.style.overflow = 'hidden'
    }

    // Cleanup function to restore scrolling when leaving dashboard
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      if (root) {
        root.style.height = ''
        root.style.overflow = ''
      }
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const portfolioStats = [
    { label: 'Total Value', value: '$125,430', change: '+12.5%', icon: DollarSign, color: 'bg-green-500' },
    { label: "Today's P&L", value: '+$2,345', change: '+1.87%', icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Win Rate', value: '67%', change: '+5%', icon: Activity, color: 'bg-purple-500' },
    { label: 'Positions', value: '12', change: '3 Active', icon: PieChart, color: 'bg-yellow-500' },
  ]

  return (
    <div className="h-screen handdrawn-bg flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r-4 border-dashed border-dark overflow-hidden flex flex-col h-full`}>
        <div className="p-6 border-b-4 border-dashed border-dark flex-shrink-0 overflow-y-auto max-h-[50%]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-accent border-3 border-dark flex items-center justify-center mr-3">
                <DollarSign className="h-6 w-6 text-dark" />
              </div>
              <div>
                <h2 className="folk-title text-2xl font-bold">FinAgent</h2>
                <p className="text-xs uppercase tracking-widest">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="folk-card p-4 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary border-3 border-dark flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="folk-text font-bold">{user?.name || 'Investor'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="mb-6">
            <h3 className="folk-text text-lg font-bold mb-4">Portfolio Overview</h3>
            <div className="space-y-3">
              {portfolioStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="folk-card p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${stat.color} border-2 border-dark flex items-center justify-center mr-3`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="folk-text font-bold">{stat.value}</p>
                        </div>
                      </div>
                      <span className={`text-xs folk-text ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* AI Assistants Selection */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="folk-text text-lg font-bold mb-4">AI Assistants</h3>
          <div className="space-y-3">
            {assistants.map((assistant) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                isSelected={selectedAssistant.id === assistant.id}
                onClick={() => setSelectedAssistant(assistant)}
              />
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t-4 border-dashed border-dark flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full outsider-button py-3 flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <div className="bg-white border-b-4 border-dashed border-dark p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h1 className="folk-title text-2xl font-bold">
              Chat with {selectedAssistant.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {selectedAssistant.expertise.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full border-2 border-dark bg-background folk-text"
              >
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