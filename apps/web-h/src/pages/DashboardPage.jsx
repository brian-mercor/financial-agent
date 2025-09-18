import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChatInterface } from '../components/ChatInterface'
import { TrendingUp, LineChart, PieChart, Brain, BarChart3, LogOut, Menu, X, User } from 'lucide-react'

const assistants = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'All-purpose financial AI assistant',
    icon: Brain,
    color: 'from-purple-500 to-blue-500',
  },
  {
    id: 'analyst',
    name: 'Market Analyst',
    description: 'Expert in market trends and technical analysis',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'trader',
    name: 'Trading Advisor',
    description: 'Specialized in trading strategies',
    icon: LineChart,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'advisor',
    name: 'Portfolio Manager',
    description: 'Portfolio optimization expert',
    icon: PieChart,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'riskManager',
    name: 'Risk Manager',
    description: 'Risk assessment and management',
    icon: BarChart3,
    color: 'from-red-500 to-pink-500',
  }
]

export default function DashboardPage() {
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Generate quantum particles for dashboard
    const quantumField = document.getElementById('quantum-field-dashboard')
    if (quantumField) {
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div')
        particle.className = 'quantum-particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (15 + Math.random() * 10) + 's'
        quantumField.appendChild(particle)
      }
    }

    // Draw neural connections
    const svg = document.getElementById('dashboard-neural')
    if (svg) {
      for (let i = 0; i < 5; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const x1 = Math.random() * window.innerWidth
        const y1 = Math.random() * window.innerHeight
        const x2 = x1 + (Math.random() - 0.5) * 200
        const y2 = y1 + (Math.random() - 0.5) * 200

        line.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`)
        line.setAttribute('class', 'feynman-line')
        svg.appendChild(line)
      }
    }

    // Cleanup
    return () => {
      const particles = document.querySelectorAll('#quantum-field-dashboard .quantum-particle')
      particles.forEach(p => p.remove())
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen text-white relative flex">
      <div className="batik-pattern"></div>
      <div id="quantum-field-dashboard"></div>

      {/* Neural Network Background */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-10" id="dashboard-neural">
        <defs>
          <pattern id="dashboard-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#6b4423" strokeWidth="0.5" opacity="0.2"/>
            <path d="M 50 20 Q 80 50 50 80 Q 20 50 50 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dashboard-pattern)"/>
      </svg>

      {/* Sidebar */}
      <div className={`relative z-40 ${sidebarOpen ? 'w-80' : 'w-20'} transition-all duration-300 bg-gray-900/50 backdrop-blur-md border-r border-gray-700/50`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center space-x-2 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">FA</span>
              </div>
              {sidebarOpen && <span className="text-xl font-semibold">FinAgent</span>}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* User Info */}
          {sidebarOpen && (
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{user?.email || 'Trader'}</p>
                  <p className="text-xs text-gray-400">Premium Account</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-gray-400">Portfolio</p>
                  <p className="font-semibold text-green-400">+12.4%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <p className="text-gray-400">Trades</p>
                  <p className="font-semibold">247</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Assistants */}
          <div className="flex-1 space-y-2">
            {sidebarOpen && (
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">AI Assistants</p>
            )}
            {assistants.map((assistant) => {
              const Icon = assistant.icon
              return (
                <button
                  key={assistant.id}
                  onClick={() => setSelectedAssistant(assistant)}
                  className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-2'} rounded-xl transition-all ${
                    selectedAssistant.id === assistant.id
                      ? 'bg-gradient-to-r ' + assistant.color + ' text-white'
                      : 'hover:bg-gray-800'
                  }`}
                  title={!sidebarOpen ? assistant.name : ''}
                >
                  <Icon className={`${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
                  {sidebarOpen && (
                    <div className="text-left">
                      <p className="font-medium text-sm">{assistant.name}</p>
                      <p className="text-xs opacity-80">{assistant.description}</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`flex items-center ${sidebarOpen ? 'space-x-3 p-3' : 'justify-center p-2'} hover:bg-gray-800 rounded-xl transition-colors`}
            title={!sidebarOpen ? 'Sign Out' : ''}
          >
            <LogOut className={`${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'}`} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-40 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1 hero-text">
                {selectedAssistant.name}
              </h1>
              <p className="text-gray-400">{selectedAssistant.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="glass-card px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm">Live Market Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface assistant={selectedAssistant} />
        </div>
      </div>
    </div>
  )
}