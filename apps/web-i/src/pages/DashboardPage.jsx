import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Send, Loader2, User, Sparkles, TrendingUp, LineChart, PieChart, LogOut } from 'lucide-react'
import { apiService } from '../services/api.service'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState('analyst')

  const assistants = [
    {
      id: 'analyst',
      name: 'Market Analyst',
      description: 'Technical analysis and market insights',
      icon: TrendingUp,
      color: 'var(--accent-blue)'
    },
    {
      id: 'trader',
      name: 'Trading Advisor',
      description: 'Entry/exit strategies and risk management',
      icon: LineChart,
      color: 'var(--accent-yellow)'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Manager',
      description: 'Asset allocation and optimization',
      icon: PieChart,
      color: 'var(--accent-red)'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleLogout = async () => {
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

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      const history = messages.slice(-10).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }))

      await apiService.streamMessage(
        input,
        selectedAssistant,
        {
          userId: user?.id || `user-${Date.now()}`,
          context: {
            symbols: [],
            timeframe: '1d',
            riskTolerance: 'moderate'
          },
          history
        },
        (parsed) => {
          if (parsed.chunk || parsed.content) {
            assistantMessage.content += parsed.chunk || parsed.content || ''
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.id === assistantMessage.id) {
                lastMessage.content = assistantMessage.content
              }
              return newMessages
            })
          }
        }
      )
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

  const currentAssistant = assistants.find(a => a.id === selectedAssistant)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--panel)] border-r border-[rgba(255,255,255,0.1)] flex flex-col">
        <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="logo" aria-hidden="true"></div>
            <span className="font-extrabold tracking-wide font-[Poppins]">FinAgent</span>
          </div>
        </div>

        <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-yellow)] flex items-center justify-center">
              <User className="w-5 h-5 text-[#0b0d12]" />
            </div>
            <div className="flex-1">
              <div className="font-medium truncate">{user?.email || 'Trader'}</div>
              <div className="small">Pro Account</div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="small mb-3">AI Assistants</div>
          <div className="space-y-2">
            {assistants.map(assistant => (
              <button
                key={assistant.id}
                onClick={() => setSelectedAssistant(assistant.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedAssistant === assistant.id
                    ? 'bg-[var(--glass-2)] border border-[rgba(255,255,255,0.2)]'
                    : 'hover:bg-[var(--glass)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: assistant.color }}
                  >
                    <assistant.icon className="w-4 h-4 text-[#0b0d12]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{assistant.name}</div>
                    <div className="text-xs text-[var(--muted)]">{assistant.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleLogout}
            className="w-full btn btn-outline flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="header border-b border-[rgba(255,255,255,0.1)]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: currentAssistant?.color }}
              >
                {currentAssistant && <currentAssistant.icon className="w-5 h-5 text-[#0b0d12]" />}
              </div>
              <div>
                <div className="font-semibold">{currentAssistant?.name}</div>
                <div className="small">{currentAssistant?.description}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg)' }}>
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--glass)' }}>
                <Sparkles className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
              <p className="text-[var(--muted)]">Ask me about market analysis, trading strategies, or portfolio management</p>
              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                <button
                  className="chip"
                  onClick={() => setInput('What are the current market trends?')}
                >
                  Market trends
                </button>
                <button
                  className="chip"
                  onClick={() => setInput('Analyze AAPL stock')}
                >
                  Stock analysis
                </button>
                <button
                  className="chip"
                  onClick={() => setInput('Best trading strategies for today?')}
                >
                  Trading strategies
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--primary)] text-white'
                      : 'panel'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <Sparkles className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <User className="w-5 h-5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="panel rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
                    <span className="text-[var(--muted)]">Analyzing markets...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[rgba(255,255,255,0.1)] p-4" style={{ background: 'var(--panel)' }}>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${currentAssistant?.name} anything...`}
              className="flex-1 text-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn btn-primary px-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}