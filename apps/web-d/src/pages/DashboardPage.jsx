import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SmartChatInterface } from '../components/SmartChatInterface'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [selectedAssistant, setSelectedAssistant] = useState('market-analyst')
  const [showMobileAssistants, setShowMobileAssistants] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const assistants = {
    'market-analyst': {
      id: 'market-analyst',
      name: 'Market Analyst',
      tone: 'Technical & Precise',
      conf: 0.86,
      description: 'Expert in market trends and technical analysis',
      icon: 'chart'
    },
    'trading-advisor': {
      id: 'trading-advisor',
      name: 'Trading Advisor',
      tone: 'Strategic & Focused',
      conf: 0.83,
      description: 'Specialized in trading strategies and risk management',
      icon: 'trade'
    },
    'portfolio-manager': {
      id: 'portfolio-manager',
      name: 'Portfolio Manager',
      tone: 'Balanced & Wise',
      conf: 0.81,
      description: 'Focused on portfolio optimization and asset allocation',
      icon: 'portfolio'
    },
    'risk-analyst': {
      id: 'risk-analyst',
      name: 'Risk Analyst',
      tone: 'Cautious & Thorough',
      conf: 0.84,
      description: 'Protects investments through risk assessment',
      icon: 'risk'
    },
    'economist': {
      id: 'economist',
      name: 'Economist',
      tone: 'Macro & Insightful',
      conf: 0.82,
      description: 'Global economic perspectives and analysis',
      icon: 'globe'
    },
  }

  return (
    <div className="min-h-screen font-[Inter]">
      {/* Starfield layers */}
      <div aria-hidden="true" className="stars"></div>
      <div aria-hidden="true" className="stars2"></div>
      <div aria-hidden="true" className="stars3"></div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl" aria-hidden="true"
                 style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04))', boxShadow: 'inset 0 0 0 1px rgba(255, 211, 110, .4), 0 8px 20px rgba(0,0,0,.45)' }}>
              <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full p-1.5">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#FBDD96"/>
                    <stop offset="1" stopColor="#F2B807"/>
                  </linearGradient>
                </defs>
                <rect x="7" y="7" width="50" height="50" rx="10" fill="url(#g1)" opacity=".25" />
                <rect x="9" y="9" width="46" height="46" rx="9" fill="none" stroke="url(#g1)" strokeWidth="1.5" opacity=".85"/>
                <path d="M24 32 L32 22 L40 32 M32 22 L32 42" stroke="#FDE8A6" strokeWidth="2" fill="none"/>
                <circle cx="32" cy="32" r="13.5" fill="none" stroke="#8B5CF6" strokeWidth="1.6"/>
              </svg>
            </div>
            <div>
              <div className="text-xl sm:text-2xl tracking-tight font-extrabold gold-text">FinAgent Dashboard</div>
              <p className="text-xs sm:text-sm text-purple-100/80">Welcome back, {user?.name || user?.email || 'Trader'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileAssistants(!showMobileAssistants)}
              className="lg:hidden btn-ghost rounded-lg px-3 py-2 text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FDE7A9" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              Assistants
            </button>
            <button
              onClick={handleSignOut}
              className="btn-ghost rounded-lg px-3 py-2 text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#FFE9B3">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Assistants Selector */}
          <aside className="lg:col-span-4">
            <div className={`tarot-panel p-4 sm:p-5 relative ${showMobileAssistants ? '' : 'hidden lg:block'}`}>
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">AI Assistants</h2>
              </div>
              <p className="text-purple-100/70 text-sm mt-1">Select your financial expert</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3" role="radiogroup" aria-label="Assistants">
                {Object.entries(assistants).map(([key, assistant]) => (
                  <button
                    key={key}
                    className={`guide-card group p-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-300/40 ${selectedAssistant === key ? 'active' : ''}`}
                    role="radio"
                    aria-checked={selectedAssistant === key}
                    onClick={() => {
                      setSelectedAssistant(key)
                      if (window.innerWidth < 1024) {
                        setShowMobileAssistants(false)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-700/40 to-purple-900/70"></div>
                        <svg viewBox="0 0 64 96" className="absolute inset-0 w-full h-full">
                          <defs>
                            <linearGradient id={`cardG-${key}`} x1="0" x2="1">
                              <stop offset="0" stopColor="#FBDD96"/>
                              <stop offset="1" stopColor="#F2B807"/>
                            </linearGradient>
                          </defs>
                          <rect x="6" y="6" width="52" height="84" rx="10" fill={`url(#cardG-${key})`} opacity=".1"/>
                          <rect x="8" y="8" width="48" height="80" rx="9" fill="none" stroke={`url(#cardG-${key})`} strokeWidth="1.4" opacity=".7"/>
                          {assistant.icon === 'chart' && (
                            <>
                              <path d="M20 60 L30 45 L40 50 L50 35" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                              <circle cx="20" cy="60" r="2" fill="#FFEFBF"/>
                              <circle cx="30" cy="45" r="2" fill="#FFEFBF"/>
                              <circle cx="40" cy="50" r="2" fill="#FFEFBF"/>
                              <circle cx="50" cy="35" r="2" fill="#FFEFBF"/>
                            </>
                          )}
                          {assistant.icon === 'trade' && (
                            <>
                              <rect x="16" y="46" width="32" height="24" rx="4" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <path d="M24 58 L32 52 L40 58" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                            </>
                          )}
                          {assistant.icon === 'portfolio' && (
                            <>
                              <circle cx="32" cy="52" r="12" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <path d="M32 40 L32 52 L44 52" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                            </>
                          )}
                          {assistant.icon === 'risk' && (
                            <>
                              <path d="M32 35 L20 55 L44 55 Z" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <circle cx="32" cy="48" r="2" fill="#E9D5FF"/>
                            </>
                          )}
                          {assistant.icon === 'globe' && (
                            <>
                              <circle cx="32" cy="52" r="15" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <path d="M17 52 Q32 42 47 52" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                            </>
                          )}
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{assistant.name}</div>
                        <div className="text-xs text-purple-100/70">{assistant.description}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] text-purple-100/70">Mode • {assistant.tone}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-purple-100/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-80" viewBox="0 0 20 20" fill="#F2B807">
                  <path d="M10 .5a1 1 0 0 1 .894.553l2.381 4.762 5.258.764a1 1 0 0 1 .554 1.704l-3.8 3.702.897 5.231a1 1 0 0 1-1.451 1.054L10 15.347l-4.683 2.463a1 1 0 0 1-1.451-1.054l.897-5.231-3.8-3.702a1 1 0 0 1 .554-1.704l5.258-.764L9.106 1.053A1 1 0 0 1 10 .5z"/>
                </svg>
                Active: {assistants[selectedAssistant].name}
              </div>

              {/* Portfolio Summary */}
              <div className="mt-6 p-4 rounded-lg border border-yellow-200/20 bg-white/5">
                <h3 className="text-sm font-semibold mb-3">Portfolio Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-100/70">Total Value</span>
                    <span className="font-medium">$125,420</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-100/70">Day Change</span>
                    <span className="text-green-400">+2.34%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-100/70">Week Performance</span>
                    <span className="text-green-400">+5.67%</span>
                  </div>
                </div>
                <div className="mt-3 w-full h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-purple-100/70 mt-2">Risk Level: Moderate</p>
              </div>
            </div>
          </aside>

          {/* Right: Chat Console */}
          <section className={`lg:col-span-8 ${showMobileAssistants ? 'hidden lg:block' : ''}`}>
            <div className="tarot-panel p-0 relative h-[600px] lg:h-[700px] overflow-hidden">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <SmartChatInterface assistant={assistants[selectedAssistant]} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage