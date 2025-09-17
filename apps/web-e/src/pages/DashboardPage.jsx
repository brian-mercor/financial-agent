import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { DollarSign, TrendingUp, BarChart3, Shield, Brain, LineChart, Send, LogOut, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [selectedAssistant, setSelectedAssistant] = useState('analyst')
  const [message, setMessage] = useState('')
  const [symbol, setSymbol] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const assistants = {
    analyst: {
      name: 'Market Analyst',
      desc: 'Technical analysis & trends',
      tone: 'Precise and insightful',
      conf: 0.92,
      icon: <TrendingUp className="w-6 h-6" />
    },
    trader: {
      name: 'Trading Specialist',
      desc: 'Entry/exit optimization',
      tone: 'Strategic and timely',
      conf: 0.88,
      icon: <LineChart className="w-6 h-6" />
    },
    advisor: {
      name: 'Investment Advisor',
      desc: 'Personalized strategies',
      tone: 'Thoughtful and balanced',
      conf: 0.90,
      icon: <BarChart3 className="w-6 h-6" />
    },
    risk: {
      name: 'Risk Manager',
      desc: 'Portfolio protection',
      tone: 'Cautious and protective',
      conf: 0.94,
      icon: <Shield className="w-6 h-6" />
    },
    economist: {
      name: 'Macro Economist',
      desc: 'Global market insights',
      tone: 'Comprehensive',
      conf: 0.86,
      icon: <Brain className="w-6 h-6" />
    },
    general: {
      name: 'General Assistant',
      desc: 'All-purpose financial help',
      tone: 'Friendly and clear',
      conf: 0.89,
      icon: <DollarSign className="w-6 h-6" />
    }
  }

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      symbol: symbol,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        assistant: assistants[selectedAssistant].name,
        content: generateAIResponse(selectedAssistant, message, symbol),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1500)
  }

  const generateAIResponse = (assistant, query, sym) => {
    const responses = {
      analyst: `Based on my technical analysis of ${sym || 'the market'}, I see several key patterns forming. The RSI indicates oversold conditions while MACD shows bullish divergence. Support levels are holding at current prices with resistance at the 50-day moving average. Volume patterns suggest accumulation phase. **Recommendation**: Consider a measured entry with stop-loss below recent support.`,
      trader: `For ${sym || 'this position'}, optimal entry point appears to be at current levels with scaling opportunities on any dips. Set initial target at +15% with trailing stops. Risk/reward ratio favors long position. **Action**: Enter 30% of position now, add on confirmation above resistance.`,
      advisor: `Given your query about ${sym || 'portfolio allocation'}, I recommend diversifying across sectors while maintaining 60/40 equity/fixed income split. Current market conditions favor quality growth stocks with strong fundamentals. Consider dollar-cost averaging over next 3 months to reduce volatility impact.`,
      risk: `Risk assessment for ${sym || 'your portfolio'} shows moderate exposure to market volatility. Current VaR at 95% confidence: -8.2%. Recommend hedging through protective puts or reducing position size by 20%. Correlation analysis suggests overconcentration in tech sector.`,
      economist: `Global macro trends affecting ${sym || 'markets'}: Fed policy remains accommodative, inflation concerns moderating, geopolitical risks elevated. GDP growth projections revised upward. Currency dynamics favor USD strength near-term. **Impact**: Positive for equities, negative for bonds.`,
      general: `I can help you with ${query}. ${sym ? `Looking at ${sym}, ` : ''}current market conditions show mixed signals. Would you like me to provide specific technical analysis, fundamental insights, or portfolio recommendations? I'm here to assist with any financial questions you have.`
    }

    return responses[assistant] || responses.general
  }

  return (
    <div className="min-h-screen font-['Inter']">
      {/* Starfield layers */}
      <div aria-hidden="true" className="stars"></div>
      <div aria-hidden="true" className="stars2"></div>
      <div aria-hidden="true" className="stars3"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl" aria-hidden="true"
                 style={{background: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04))',
                         boxShadow: 'inset 0 0 0 1px rgba(255, 211, 110, .4), 0 8px 20px rgba(0,0,0,.45)'}}>
              <DollarSign className="absolute inset-0 w-full h-full p-2 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl tracking-tight font-extrabold gold-text">FinAgent</div>
              <p className="text-xs sm:text-sm text-purple-100/80">Welcome back, {user?.name || user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-ghost rounded-lg px-3 py-2 text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Assistant Selector */}
          <aside className="lg:col-span-4">
            <div className="tarot-panel p-4 sm:p-5 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">AI Assistants</h2>
                <button
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="lg:hidden btn-ghost rounded-lg px-3 py-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              </div>

              <div className={`drawer lg:max-h-[999px] ${drawerOpen ? 'max-h-[600px]' : 'max-h-0'} lg:opacity-100 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                  {Object.entries(assistants).map(([key, assistant]) => (
                    <button
                      key={key}
                      className={`guide-card group p-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-300/40 ${selectedAssistant === key ? 'active' : ''}`}
                      onClick={() => setSelectedAssistant(key)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-md bg-gradient-to-b from-purple-700/40 to-purple-900/70 flex items-center justify-center">
                          {assistant.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{assistant.name}</div>
                          <div className="text-xs text-purple-100/70">{assistant.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="mt-6 p-4 rounded-lg border border-yellow-200/20 bg-white/5">
                <h3 className="text-sm font-semibold mb-3">Portfolio Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-100/70">Total Value</span>
                    <span className="gold-text font-semibold">$124,567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-100/70">Today's Change</span>
                    <span className="text-green-400">+2.34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-100/70">Open Positions</span>
                    <span>12</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Chat Interface */}
          <section className="lg:col-span-8">
            <div className="tarot-panel relative h-[600px] flex flex-col">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              {/* Chat Header */}
              <div className="p-5 border-b border-yellow-200/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {assistants[selectedAssistant].icon}
                    <div>
                      <h3 className="font-semibold">{assistants[selectedAssistant].name}</h3>
                      <p className="text-xs text-purple-100/70">{assistants[selectedAssistant].desc}</p>
                    </div>
                  </div>
                  <div className="chip rounded-full px-3 py-1 text-xs">
                    Online
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-purple-100/60 py-12">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask {assistants[selectedAssistant].name} anything about markets, trading, or your portfolio.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500/30 to-indigo-600/30 border border-purple-400/30'
                            : 'bg-white/5 border border-yellow-200/20'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2 text-xs text-purple-100/70">
                            <Sparkles className="w-3 h-3" />
                            {msg.assistant}
                          </div>
                        )}
                        {msg.role === 'user' ? (
                          <div>
                            {msg.symbol && (
                              <div className="text-xs text-purple-100/70 mb-1">Symbol: {msg.symbol}</div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        ) : (
                          <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-yellow-200/20 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="spinner"></div>
                        <span className="text-sm text-purple-100/70">
                          {assistants[selectedAssistant].name} is analyzing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-5 border-t border-yellow-200/20">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      placeholder="Symbol (optional)"
                      className="input px-3 py-2 text-sm w-32 text-white"
                    />
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Ask ${assistants[selectedAssistant].name} anything...`}
                      className="input flex-1 px-4 py-2 text-sm text-white"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || loading}
                      className="btn-gold rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="flex gap-2 mt-3">
                  <button className="chip rounded-full px-3 py-1 text-xs" onClick={() => setMessage('What is the market outlook?')}>
                    Market Outlook
                  </button>
                  <button className="chip rounded-full px-3 py-1 text-xs" onClick={() => setMessage('Analyze my portfolio risk')}>
                    Risk Analysis
                  </button>
                  <button className="chip rounded-full px-3 py-1 text-xs" onClick={() => setMessage('Best trades today?')}>
                    Trade Ideas
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}