import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [selectedAssistant, setSelectedAssistant] = useState('market-analyst')

  const assistants = {
    'market-analyst': {
      name: 'Market Analyst',
      tone: 'Technical & Precise',
      description: 'Analyzes market trends with data-driven insights'
    },
    'trading-advisor': {
      name: 'Trading Advisor',
      tone: 'Strategic & Focused',
      description: 'Optimizes your trading strategies'
    },
    'portfolio-manager': {
      name: 'Portfolio Manager',
      tone: 'Balanced & Risk-aware',
      description: 'Manages asset allocation wisely'
    },
    'risk-analyst': {
      name: 'Risk Analyst',
      tone: 'Cautious & Thorough',
      description: 'Protects your investments from downside'
    },
    'economist': {
      name: 'Economist',
      tone: 'Macro & Insightful',
      description: 'Provides global economic perspective'
    },
  }

  return (
    <div className="min-h-screen font-[Inter]">
      {/* Starfield layers */}
      <div aria-hidden="true" className="stars"></div>
      <div aria-hidden="true" className="stars2"></div>
      <div aria-hidden="true" className="stars3"></div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo icon: financial symbol */}
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
              <div className="text-2xl sm:text-3xl tracking-tight font-extrabold gold-text">FinAgent</div>
              <p className="text-xs sm:text-sm text-purple-100/80">Your AI Financial Intelligence Platform</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[13px] text-purple-100/70">
            <span className="chip rounded-full px-3 py-1">AI-Powered</span>
            <span className="chip rounded-full px-3 py-1">Real-time Analysis</span>
            <span className="chip rounded-full px-3 py-1">Multi-Agent</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Assistants deck */}
          <aside className="lg:col-span-4">
            <div className="tarot-panel p-4 sm:p-5 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Choose Your Assistant</h2>
              </div>
              <p className="text-purple-100/70 text-sm mt-1">Pick an AI assistant. Each has specialized expertise for your financial needs.</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3" role="radiogroup" aria-label="Assistants">
                {Object.entries(assistants).map(([key, assistant]) => (
                  <button
                    key={key}
                    className={`guide-card group p-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-300/40 ${selectedAssistant === key ? 'active' : ''}`}
                    role="radio"
                    aria-checked={selectedAssistant === key}
                    onClick={() => setSelectedAssistant(key)}
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
                          {key === 'market-analyst' && (
                            <>
                              <path d="M20 60 L30 45 L40 50 L50 35" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                              <circle cx="20" cy="60" r="2" fill="#FFEFBF"/>
                              <circle cx="30" cy="45" r="2" fill="#FFEFBF"/>
                              <circle cx="40" cy="50" r="2" fill="#FFEFBF"/>
                              <circle cx="50" cy="35" r="2" fill="#FFEFBF"/>
                            </>
                          )}
                          {key === 'trading-advisor' && (
                            <>
                              <rect x="16" y="46" width="32" height="24" rx="4" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <path d="M24 58 L32 52 L40 58" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                            </>
                          )}
                          {key === 'portfolio-manager' && (
                            <>
                              <circle cx="32" cy="52" r="12" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <path d="M32 40 L32 52 L44 52" stroke="#E9D5FF" strokeWidth="2" fill="none"/>
                            </>
                          )}
                          {key === 'risk-analyst' && (
                            <>
                              <path d="M32 35 L20 55 L44 55 Z" fill="none" stroke="#C4B5FD" strokeWidth="2"/>
                              <circle cx="32" cy="48" r="2" fill="#E9D5FF"/>
                            </>
                          )}
                          {key === 'economist' && (
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
                    <div className="mt-3 text-[11px] text-purple-100/70">Expert Mode • {assistant.tone}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-purple-100/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-80" viewBox="0 0 20 20" fill="#F2B807">
                  <path d="M10 .5a1 1 0 0 1 .894.553l2.381 4.762 5.258.764a1 1 0 0 1 .554 1.704l-3.8 3.702.897 5.231a1 1 0 0 1-1.451 1.054L10 15.347l-4.683 2.463a1 1 0 0 1-1.451-1.054l.897-5.231-3.8-3.702a1 1 0 0 1 .554-1.704l5.258-.764L9.106 1.053A1 1 0 0 1 10 .5z"/>
                </svg>
                Pro tip: Market Analyst is perfect for technical market insights.
              </div>
            </div>
          </aside>

          {/* Right: Console */}
          <section className="lg:col-span-8">
            <div className="tarot-panel p-5 sm:p-6 lg:p-7 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Get instant AI-powered financial intelligence—without the complexity</h1>
                  <p className="text-sm text-purple-100/80 mt-1">Ask any financial question. FinAgent delivers expert analysis instantly.</p>
                </div>
                <div className="tooltip">
                  <Link to="/login" className="btn-ghost rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#FFE9B3">
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14.93a8.001 8.001 0 0 0 5.657-11.314L13 11v5.93ZM11 13H7.07A8 8 0 0 0 17 6.343L11 13Z"/>
                    </svg>
                    Try now
                  </Link>
                  <div className="tooltip-panel">Login to get started</div>
                </div>
              </div>

              {/* Demo Form */}
              <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label htmlFor="symbol" className="block text-xs font-medium text-purple-100/80 mb-1">Symbol/Asset</label>
                    <div className="relative">
                      <input
                        id="symbol"
                        className="input w-full px-3 py-3 pr-10 text-sm placeholder-purple-100/50"
                        placeholder="e.g., AAPL, BTC"
                        defaultValue="AAPL"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-100/60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="question" className="block text-xs font-medium text-purple-100/80 mb-1">Your question</label>
                    <div className="relative">
                      <textarea
                        id="question"
                        rows="2"
                        className="input w-full px-3 py-3 text-sm pr-[98px] placeholder-purple-100/50"
                        placeholder="Ask about market trends, trading strategies, risk analysis, portfolio optimization…"
                        defaultValue="What's the technical outlook for this stock? Should I buy or sell?"
                      />
                      <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <button type="button" className="btn-ghost rounded-md px-2.5 py-2 text-xs">Clear</button>
                        <Link to="/login" className="btn-gold rounded-md px-3 py-2 text-sm flex items-center gap-2">
                          <span>Analyze</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#3b2000">
                            <path d="M12 3l8 8-8 8-1.41-1.41L16.17 12 10.59 6.41 12 5l-8 8"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-purple-100/70">Get technical analysis, trading signals, and risk assessments instantly.</p>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Technical Analysis</button>
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Risk Assessment</button>
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Entry Points</button>
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Portfolio Impact</button>
                </div>
              </form>

              {/* Demo Answer */}
              <section className="mt-6">
                <div className="hidden">
                  <article className="relative overflow-hidden rounded-2xl border border-yellow-200/25 bg-gradient-to-b from-white/5 to-white/0 p-4 sm:p-5">
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent"></div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-12 rounded-md bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" className="w-7 h-9">
                            <rect x="8" y="8" width="48" height="80" rx="9" fill="none" stroke="#F2B807" strokeWidth="1.4" opacity=".9"/>
                            <path d="M20 60 L30 45 L40 50 L50 35" stroke="#A78BFA" strokeWidth="2" fill="none"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold">{assistants[selectedAssistant].name}'s Analysis</h3>
                          <p className="text-xs text-purple-100/75">Asset: AAPL</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to="/sign-up" className="btn-ghost rounded-md px-2.5 py-2 text-xs flex items-center gap-1.5">
                          Get Started
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 text-[15px]">
                      <p>Based on technical indicators and market conditions, here's my analysis for AAPL:</p>
                      <div className="mt-2 rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                        <div className="text-sm leading-6">
                          <strong>Technical Outlook:</strong> Bullish momentum with RSI at 65, MACD showing positive divergence.
                          Price above 50-day MA ($175) and approaching resistance at $195. Support established at $180.
                        </div>
                      </div>
                      <ul className="mt-3 list-disc ml-5 space-y-1">
                        <li>Entry point: $182-184 range on pullback</li>
                        <li>Target: $195 (short-term), $205 (medium-term)</li>
                        <li>Stop loss: $178 to manage downside risk</li>
                      </ul>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                        <div className="text-xs text-purple-100/70">Signal</div>
                        <div className="text-sm font-medium">Buy on Pullback</div>
                      </div>
                      <div className="rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                        <div className="text-xs text-purple-100/70">Confidence</div>
                        <div className="mt-1 w-full h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                        <div className="text-xs text-purple-100/70">Timeframe</div>
                        <div className="text-sm font-medium">2-4 weeks</div>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="tarot-panel p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-purple-100/80">
              AI meets Finance: sophisticated analysis, golden insights, and strategies that actually work.
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-100/70">
              <span className="chip rounded-full px-3 py-1">Professional</span>
              <span className="chip rounded-full px-3 py-1">Real-time</span>
              <span className="chip rounded-full px-3 py-1">Multi-Agent</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage