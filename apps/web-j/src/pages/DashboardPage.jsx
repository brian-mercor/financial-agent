import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChatInterface } from '../components/ChatInterface'
import { LogOut, TrendingUp, LineChart, PieChart, BarChart3, Activity, Settings, User, Menu, X } from 'lucide-react'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [selectedAssistant, setSelectedAssistant] = useState('general')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const assistants = [
    {
      id: 'general',
      name: 'Market Analyst',
      description: 'Expert in market trends and technical analysis',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      id: 'trader',
      name: 'Trading Advisor',
      description: 'Specialized in trading strategies and risk management',
      icon: LineChart,
      color: 'text-green-400',
    },
    {
      id: 'portfolio',
      name: 'Portfolio Manager',
      description: 'Focused on portfolio optimization and asset allocation',
      icon: PieChart,
      color: 'text-purple-400',
    },
    {
      id: 'risk',
      name: 'Risk Analyst',
      description: 'Expert in risk assessment and hedging strategies',
      icon: BarChart3,
      color: 'text-red-400',
    },
    {
      id: 'quant',
      name: 'Quant Strategist',
      description: 'Algorithmic trading and quantitative analysis',
      icon: Activity,
      color: 'text-yellow-400',
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const currentAssistant = assistants.find(a => a.id === selectedAssistant)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-white/[0.08] glass-card`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-text font-semibold tracking-wider mb-8">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] opacity-95">
                <path d="M4 16.5C7.5 14 11.5 9.5 13.5 6.5M10 19c2.5-2.2 5.8-6.2 8-11"
                      stroke="url(#g1)" strokeWidth="2.2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0" stopColor="#d2b26d"/>
                    <stop offset="1" stopColor="#b2914d"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>FinAgent</span>
          </Link>

          {/* User Info */}
          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <User className="w-5 h-5 text-ink" />
              </div>
              <div>
                <div className="font-semibold text-sm">{user?.email?.split('@')[0]}</div>
                <div className="text-xs text-muted">Pro Trader</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-card rounded-lg p-2">
                <div className="text-gold font-bold">$125,432</div>
                <div className="text-muted">Portfolio</div>
              </div>
              <div className="glass-card rounded-lg p-2">
                <div className="text-green-400 font-bold">+18.5%</div>
                <div className="text-muted">This Month</div>
              </div>
            </div>
          </div>

          {/* AI Assistants */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">AI Assistants</h3>
            <div className="space-y-2">
              {assistants.map((assistant) => {
                const Icon = assistant.icon
                return (
                  <button
                    key={assistant.id}
                    onClick={() => setSelectedAssistant(assistant.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-150 ${
                      selectedAssistant === assistant.id
                        ? 'bg-gold/10 border border-gold/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${assistant.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{assistant.name}</div>
                        <div className="text-xs text-muted line-clamp-1">{assistant.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5 text-muted" />
              <span className="text-sm text-muted">Settings</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5 text-muted" />
              <span className="text-sm text-muted">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-white/[0.08] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="font-cormorant text-2xl font-semibold flex items-center gap-2">
                  <currentAssistant.icon className={`w-6 h-6 ${currentAssistant.color}`} />
                  {currentAssistant.name}
                </h1>
                <p className="text-sm text-muted">{currentAssistant.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted">Market Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-400">Markets Open</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface assistant={currentAssistant} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage