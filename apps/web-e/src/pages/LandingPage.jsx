import { Link } from 'react-router-dom'
import { useState } from 'react'
import { TrendingUp, BarChart3, DollarSign, Shield, Brain, LineChart } from 'lucide-react'

export default function LandingPage() {
  const [selectedGuide, setSelectedGuide] = useState('analyst')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const assistants = {
    analyst: {
      name: 'Market Analyst',
      desc: 'Deep technical analysis & trends',
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
      tone: 'Comprehensive and predictive',
      conf: 0.86,
      icon: <Brain className="w-6 h-6" />
    },
  }

  return (
    <div className="min-h-screen font-['Inter']">
      {/* Starfield layers */}
      <div aria-hidden="true" className="stars"></div>
      <div aria-hidden="true" className="stars2"></div>
      <div aria-hidden="true" className="stars3"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className="relative w-10 h-10 rounded-xl" aria-hidden="true"
                 style={{background: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04))',
                         boxShadow: 'inset 0 0 0 1px rgba(255, 211, 110, .4), 0 8px 20px rgba(0,0,0,.45)'}}>
              <DollarSign className="absolute inset-0 w-full h-full p-2 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl tracking-tight font-extrabold gold-text">FinAgent</div>
              <p className="text-xs sm:text-sm text-purple-100/80">Your AI Financial Genius Bar</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[13px] text-purple-100/70">
            <span className="chip rounded-full px-3 py-1">GPT-4 Powered</span>
            <span className="chip rounded-full px-3 py-1">Real-time Data</span>
            <span className="chip rounded-full px-3 py-1">6 AI Assistants</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: AI Assistants deck */}
          <aside className="lg:col-span-4">
            <div className="tarot-panel p-4 sm:p-5 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Choose Your AI Assistant</h2>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden btn-ghost rounded-lg px-3 py-2 text-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FDE7A9" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  Assistants
                </button>
              </div>
              <p className="text-purple-100/70 text-sm mt-1">Pick your AI expert. Each specializes in different market aspects.</p>

              <div className={`drawer lg:max-h-[999px] ${mobileMenuOpen ? 'max-h-[600px]' : 'max-h-0'} lg:mt-4 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'} lg:opacity-100`}>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                  {Object.entries(assistants).map(([key, assistant]) => (
                    <button
                      key={key}
                      className={`guide-card group p-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-300/40 ${selectedGuide === key ? 'active' : ''}`}
                      onClick={() => setSelectedGuide(key)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-md overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-purple-700/40 to-purple-900/70 flex items-center justify-center">
                            {assistant.icon}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{assistant.name}</div>
                          <div className="text-xs text-purple-100/70">{assistant.desc}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-[11px] text-purple-100/70">AI Expert • {Math.round(assistant.conf * 100)}% Accuracy</div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-purple-100/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-80" viewBox="0 0 20 20" fill="#F2B807">
                    <path d="M10 .5a1 1 0 0 1 .894.553l2.381 4.762 5.258.764a1 1 0 0 1 .554 1.704l-3.8 3.702.897 5.231a1 1 0 0 1-1.451 1.054L10 15.347l-4.683 2.463a1 1 0 0 1-1.451-1.054l.897-5.231-3.8-3.702a1 1 0 0 1 .554-1.704l5.258-.764L9.106 1.053A1 1 0 0 1 10 .5z"/>
                  </svg>
                  Pro tip: Market Analyst is perfect for technical chart analysis.
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Main Console */}
          <section className="lg:col-span-8">
            <div className="tarot-panel p-5 sm:p-6 lg:p-7 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">AI-Powered Financial Intelligence—No Appointments Needed</h1>
                  <p className="text-sm text-purple-100/80 mt-1">Get instant market analysis, portfolio insights, and trading strategies from 6 specialized AI assistants.</p>
                </div>
                <div className="tooltip">
                  <Link to="/login" className="btn-ghost rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#FFE9B3">
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14.93a8.001 8.001 0 0 0 5.657-11.314L13 11v5.93ZM11 13H7.07A8 8 0 0 0 17 6.343L11 13Z"/>
                    </svg>
                    Try Demo
                  </Link>
                  <div className="tooltip-panel">Free trial available</div>
                </div>
              </div>

              {/* Demo Form */}
              <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label htmlFor="symbol" className="block text-xs font-medium text-purple-100/80 mb-1">Stock/Crypto Symbol</label>
                    <div className="relative">
                      <input
                        id="symbol"
                        className="input w-full px-3 py-3 pr-10 text-sm placeholder-purple-100/50 text-white"
                        placeholder="e.g., AAPL, BTC"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-100/60">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="question" className="block text-xs font-medium text-purple-100/80 mb-1">Your question</label>
                    <div className="relative">
                      <textarea
                        id="question"
                        rows="2"
                        className="input w-full px-3 py-3 text-sm pr-[98px] placeholder-purple-100/50 text-white"
                        placeholder="Ask about price predictions, technical analysis, portfolio allocation, risk assessment..."
                      />
                      <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <button type="button" className="btn-ghost rounded-md px-2.5 py-2 text-xs">Clear</button>
                        <Link to="/signup" className="btn-gold rounded-md px-3 py-2 text-sm flex items-center gap-2">
                          <span>Get Started</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#3b2000">
                            <path d="M5 12h14m-7-7l7 7-7 7"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-purple-100/70">Real-time market data • Institutional-grade analysis • 24/7 availability</p>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Technical Analysis</button>
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Price Prediction</button>
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Risk Assessment</button>
                  <button type="button" className="chip rounded-full px-3 py-1.5 text-xs">Portfolio Review</button>
                </div>
              </form>

              {/* Feature showcase */}
              <div className="mt-8">
                <article className="relative overflow-hidden rounded-2xl border border-yellow-200/25 bg-gradient-to-b from-white/5 to-white/0 p-4 sm:p-5">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent"></div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-12 rounded-md bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                        {assistants[selectedGuide].icon}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold">{assistants[selectedGuide].name}'s Analysis</h3>
                        <p className="text-xs text-purple-100/75">Specialization: {assistants[selectedGuide].desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-[15px]">
                    <p>Experience <strong>institutional-grade financial intelligence</strong> powered by GPT-4:</p>
                    <div className="mt-2 rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                      <div className="text-sm leading-6">
                        {selectedGuide === 'analyst' && "I analyze price action, volume trends, and technical indicators to identify high-probability trading opportunities. Using real-time data from Yahoo Finance and Polygon.io, I provide actionable insights on support/resistance levels, momentum shifts, and trend reversals."}
                        {selectedGuide === 'trader' && "I optimize your entry and exit points using advanced trading algorithms. By analyzing order flow, market microstructure, and sentiment indicators, I help you execute trades with precision timing for maximum profit potential."}
                        {selectedGuide === 'advisor' && "I create personalized investment strategies based on your goals, risk tolerance, and time horizon. Using modern portfolio theory and behavioral finance principles, I help you build wealth systematically while managing downside risk."}
                        {selectedGuide === 'risk' && "I monitor your portfolio exposure and identify potential threats before they materialize. Through stress testing, correlation analysis, and VaR calculations, I ensure your investments are protected against market volatility."}
                        {selectedGuide === 'economist' && "I analyze global economic trends, central bank policies, and geopolitical events to predict market movements. By connecting macro themes to micro opportunities, I help you position your portfolio ahead of major market shifts."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                      <div className="text-xs text-purple-100/70">Response Style</div>
                      <div className="text-sm font-medium">{assistants[selectedGuide].tone}</div>
                    </div>
                    <div className="rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                      <div className="text-xs text-purple-100/70">Accuracy</div>
                      <div className="mt-1 w-full h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500" style={{width: `${assistants[selectedGuide].conf * 100}%`}}></div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-yellow-200/20 bg-white/5 p-3">
                      <div className="text-xs text-purple-100/70">Availability</div>
                      <div className="text-sm font-medium">24/7 Real-time</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/signup" className="chip rounded-full px-3 py-1.5 text-xs">Start Free Trial</Link>
                    <Link to="/login" className="chip rounded-full px-3 py-1.5 text-xs">Sign In</Link>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="tarot-panel p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-purple-100/80">
              Where AI meets Wall Street: institutional intelligence, golden insights, and profits that actually materialize.
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-100/70">
              <span className="chip rounded-full px-3 py-1">Secure</span>
              <span className="chip rounded-full px-3 py-1">Fast</span>
              <span className="chip rounded-full px-3 py-1">Accurate</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}