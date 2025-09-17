import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api.service'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Send, Loader2, User, Sparkles, LogOut, TrendingUp,
  BarChart3, PieChart, Brain, Shield, Settings, Menu, X
} from 'lucide-react'

const assistants = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Your all-purpose AI trading assistant',
    icon: Brain,
    color: 'text-accent',
  },
  {
    id: 'analyst',
    name: 'Market Analyst',
    description: 'Expert in market trends and technical analysis',
    icon: TrendingUp,
    color: 'text-accent-3',
  },
  {
    id: 'trader',
    name: 'Trading Advisor',
    description: 'Specialized in trading strategies and risk management',
    icon: BarChart3,
    color: 'text-good',
  },
  {
    id: 'advisor',
    name: 'Portfolio Manager',
    description: 'Focused on portfolio optimization and asset allocation',
    icon: PieChart,
    color: 'text-accent-2',
  },
]

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await apiService.sendMessage(
        input,
        selectedAssistant.id,
        {
          history: messages.slice(-10), // Send last 10 messages for context
          userId: user?.id || `user-${Date.now()}`,
        }
      )

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || response.content || 'I apologize, but I was unable to process your request.',
        timestamp: new Date(),
        assistantType: selectedAssistant.id,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-panel border-r border-white/10`}>
        <div className="p-6 h-full flex flex-col">
          {/* User Profile */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{user?.email || 'Guest User'}</p>
                <p className="text-xs text-muted">Free Plan</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="btn secondary w-full justify-center"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Assistant Selection */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">AI Assistants</h3>
            <div className="space-y-2">
              {assistants.map((assistant) => {
                const Icon = assistant.icon
                return (
                  <button
                    key={assistant.id}
                    onClick={() => setSelectedAssistant(assistant)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedAssistant.id === assistant.id
                        ? 'bg-panel-strong border border-white/20'
                        : 'hover:bg-panel-strong border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${assistant.color} mt-0.5`} />
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{assistant.name}</p>
                        <p className="text-xs text-muted mt-0.5">{assistant.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="mt-6 p-4 rounded-xl bg-panel-strong border border-white/10">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Portfolio</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Total Value</span>
                <span className="text-sm font-semibold text-white">$12,450.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Today's P&L</span>
                <span className="text-sm font-semibold text-good">+$245.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Win Rate</span>
                <span className="text-sm font-semibold text-white">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="site-header relative">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-panel-strong transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-3">
                <span className="brand-mark" style={{ width: '32px', height: '32px' }}></span>
                <div>
                  <h1 className="text-lg font-bold text-white">Finagent Dashboard</h1>
                  <p className="text-xs text-muted">
                    Chatting with {selectedAssistant.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-panel-strong transition-colors">
                <Settings className="w-5 h-5 text-muted" />
              </button>
              <button className="p-2 rounded-lg hover:bg-panel-strong transition-colors">
                <Shield className="w-5 h-5 text-muted" />
              </button>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="brand-mark mx-auto mb-6" style={{ width: '64px', height: '64px' }}></div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Finagent</h2>
                <p className="text-muted mb-8">
                  Ask me anything about markets, trading strategies, or portfolio management.
                  I'm here to help you make smarter trading decisions.
                </p>
                <div className="grid gap-3">
                  <button
                    onClick={() => setInput('What are the top trending stocks today?')}
                    className="p-3 rounded-xl bg-panel-strong border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <span className="text-sm text-white">What are the top trending stocks today?</span>
                  </button>
                  <button
                    onClick={() => setInput('Analyze AAPL stock for me')}
                    className="p-3 rounded-xl bg-panel-strong border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <span className="text-sm text-white">Analyze AAPL stock for me</span>
                  </button>
                  <button
                    onClick={() => setInput('What is a good portfolio allocation strategy?')}
                    className="p-3 rounded-xl bg-panel-strong border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <span className="text-sm text-white">What is a good portfolio allocation strategy?</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl ${
                      message.role === 'user'
                        ? 'bg-gradient rounded-2xl px-6 py-4'
                        : 'bg-panel rounded-2xl px-6 py-4 border border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.role === 'assistant' && (
                        <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        {message.role === 'user' ? (
                          <p className="text-white whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <User className="w-5 h-5 text-white flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-panel rounded-2xl px-6 py-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      <span className="text-muted">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${selectedAssistant.name} anything...`}
                className="input w-full pr-12"
                style={{ minWidth: 'auto' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}