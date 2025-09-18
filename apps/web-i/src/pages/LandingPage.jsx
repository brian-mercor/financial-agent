import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const [mode, setMode] = useState('analyst')
  const [deep, setDeep] = useState(false)
  const [level, setLevel] = useState(13)
  const [docInput, setDocInput] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [coverage, setCoverage] = useState(0)
  const [flashcards, setFlashcards] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [showFlashcards, setShowFlashcards] = useState(false)

  // Parallax effect for art layers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.width / 2) / rect.width
      const y = (e.clientY - rect.height / 2) / rect.height

      const jellies = document.querySelectorAll('.jelly')
      jellies.forEach((el, i) => {
        const dx = (i + 1) * 6 * x
        const dy = (i + 1) * 8 * y
        el.style.transform = `translate(${dx}px, ${dy}px)`
      })
    }

    const hero = heroRef.current
    if (hero) {
      hero.addEventListener('pointermove', handleMouseMove, { passive: true })
      return () => hero.removeEventListener('pointermove', handleMouseMove)
    }
  }, [])

  const handleAsk = () => {
    if (!docInput.trim() || !question.trim()) return

    setIsLoading(true)
    setAnswer('')

    // Simulate API call
    setTimeout(() => {
      const responses = {
        analyst: "Based on technical analysis, the current market momentum shows bullish divergence patterns. The RSI indicates oversold conditions while MACD is showing positive crossover signals. Volume analysis suggests accumulation phase with smart money positioning for an upward move.",
        trader: "Entry point identified at $150.25 with stop-loss at $148.50. Risk-reward ratio of 1:3 targeting $156.75. Position size should be 2% of portfolio based on your risk tolerance. Consider scaling in with 3 separate entries.",
        advisor: "Given your moderate risk profile, I recommend diversifying across sectors. Allocate 60% to growth stocks, 30% to value plays, and 10% to cash reserves. Current market conditions favor technology and healthcare sectors."
      }

      setAnswer(responses[mode] || responses.analyst)
      setCoverage(Math.min(100, Math.random() * 80 + 20))
      setIsLoading(false)
    }, 450)
  }

  const loadSample = () => {
    const sample = `Market Analysis Report: The S&P 500 has shown remarkable resilience in recent trading sessions, breaking above key resistance levels at 4,500. Technical indicators suggest continued bullish momentum with the 50-day moving average providing strong support. Volume patterns indicate institutional accumulation, particularly in technology and financial sectors. The VIX remains subdued below 15, suggesting low market volatility and risk-on sentiment among investors.`
    setDocInput(sample)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="flex items-center gap-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="logo" aria-hidden="true"></div>
              <span className="font-extrabold tracking-wide font-[Poppins]">FinAgent</span>
            </div>
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex gap-5 list-none p-0 m-0">
                <li><a href="#demo" className="px-3 py-2.5 rounded-[10px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]">Demo</a></li>
                <li><a href="#how" className="px-3 py-2.5 rounded-[10px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]">How it works</a></li>
                <li><a href="#features" className="px-3 py-2.5 rounded-[10px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]">Features</a></li>
                <li><a href="#pricing" className="px-3 py-2.5 rounded-[10px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]">Pricing</a></li>
                <li><a href="#faq" className="px-3 py-2.5 rounded-[10px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]">FAQ</a></li>
              </ul>
            </nav>
            <div className="ml-auto flex gap-3 items-center">
              <button className="btn btn-outline" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>Try the Demo</button>
              <button className="btn btn-primary" onClick={() => navigate('/sign-up')}>Start Free</button>
            </div>
            <button className="btn md:hidden ml-auto" aria-label="Toggle menu">☰</button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="home" aria-label="Hero" ref={heroRef}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="jelly j1"></div>
            <div className="jelly j2"></div>
            <div className="jelly j3"></div>
            <svg className="absolute inset-0 pointer-events-none opacity-75 mix-blend-screen" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="180" cy="120" r="50" fill="#ff3131" filter="url(#glow)" opacity="0.8"/>
              <circle cx="1040" cy="90" r="40" fill="#2d7dff" filter="url(#glow)" opacity="0.9"/>
              <rect x="520" y="60" width="18" height="120" fill="#ffc83a" filter="url(#glow)"/>
              <path d="M300,520 A160,160 0 0,1 620,520" fill="none" stroke="#2d7dff" strokeWidth="8" filter="url(#glow)" opacity="0.8"/>
              <path d="M620,520 A160,160 0 0,1 940,520" fill="none" stroke="#ff3131" strokeWidth="8" filter="url(#glow)" opacity="0.8"/>
              <path d="M100,260 h100 v100 h-100z" fill="none" stroke="#ffc83a" strokeWidth="5" filter="url(#glow)" opacity="0.8"/>
              <circle cx="900" cy="300" r="70" fill="none" stroke="#ffc83a" strokeWidth="6" filter="url(#glow)" />
              <line x1="760" y1="80" x2="1080" y2="80" stroke="#ff3131" strokeWidth="6" filter="url(#glow)" />
            </svg>
          </div>

          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 items-stretch">
              <div className="py-2 pr-0 lg:pr-8">
                <span className="eyebrow"><span className="dot"></span> AI Trading Intelligence</span>
                <h1 className="font-[Poppins] text-[clamp(34px,5.2vw,62px)] leading-[1.05] my-4 tracking-[-0.02em]" style={{ textShadow: '0 8px 35px rgba(0,0,0,0.6)' }}>
                  Master the Markets: Your Personal AI Trading Companion
                </h1>
                <p className="lead">
                  Trade with confidence using AI-powered analysis, real-time insights, and personalized strategies. Turn complex market data into profitable decisions.
                </p>
                <div className="flex gap-3 my-5 flex-wrap">
                  <button className="btn btn-primary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                    Try it free
                  </button>
                  <button className="btn" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                    Explore features
                  </button>
                </div>
                <div className="trust">
                  <div className="rating" aria-label="Rated 4.9 out of 5">
                    <span className="star"></span><span className="star"></span><span className="star"></span><span className="star"></span><span className="star"></span>
                  </div>
                  Trusted by professional traders and investors
                  <span className="tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Trade smarter
                  </span>
                </div>
              </div>

              {/* Demo Panel */}
              <div className="panel" id="demo">
                <div className="panel-head">
                  <div className="traffic" aria-hidden="true"><span className="dot-r"></span><span className="dot-y"></span><span className="dot-g"></span></div>
                  <strong>Live Demo: AI Financial Assistant</strong>
                  <span className="small">No sign‑in required</span>
                </div>
                <div className="panel-body">
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <div className="controls" role="group" aria-label="Modes">
                      <button className="chip" data-mode="analyst" aria-pressed={mode === 'analyst' ? "true" : "false"} onClick={() => setMode('analyst')}>Analyst</button>
                      <button className="chip" data-mode="trader" aria-pressed={mode === 'trader' ? "true" : "false"} onClick={() => setMode('trader')}>Trader</button>
                      <button className="chip" data-mode="advisor" aria-pressed={mode === 'advisor' ? "true" : "false"} onClick={() => setMode('advisor')}>Advisor</button>
                    </div>
                    <div className="toggle">
                      <span className="small">Deep analysis</span>
                      <div
                        className="switch"
                        role="switch"
                        aria-checked={deep}
                        tabIndex={0}
                        data-on={deep ? "true" : "false"}
                        onClick={() => setDeep(!deep)}
                        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setDeep(!deep) }}}
                      />
                    </div>
                  </div>

                  <label className="small block mt-2.5" htmlFor="docInput">Paste market data or financial text</label>
                  <textarea
                    id="docInput"
                    className="textarea"
                    placeholder="Paste financial data, market report, or stock information. Or load a sample..."
                    spellCheck="false"
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                  />
                  <div className="row" style={{ justifyContent: 'space-between', marginTop: '8px' }}>
                    <div className="controls">
                      <button className="chip" onClick={loadSample}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Load sample
                      </button>
                      <button className="chip" onClick={() => { setDocInput(''); setQuestion(''); setAnswer(''); setCoverage(0) }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 19L18 7M6 7l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Clear
                      </button>
                      <button className="chip" onClick={() => setShowFlashcards(!showFlashcards)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
                        Key insights
                      </button>
                    </div>
                    <div className="row">
                      <span className="small mr-2">Risk level:</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        id="level"
                        aria-label="Risk level"
                      />
                      <span className="small" id="lvlOut">{level}</span>
                    </div>
                  </div>

                  <div className="input-bar" style={{ marginTop: '12px' }}>
                    <input
                      id="question"
                      type="text"
                      placeholder="Ask about trading strategies, market analysis…"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() }}}
                    />
                    <button
                      className="send"
                      disabled={!docInput.trim() || !question.trim() || isLoading}
                      onClick={handleAsk}
                    >
                      Ask
                    </button>
                  </div>

                  <div className={`answer ${isLoading ? 'loading' : ''}`} aria-live="polite">
                    {answer || (isLoading ? 'Analyzing markets…' : '')}
                  </div>
                  <div className="progress" title="Analysis coverage">
                    <span style={{ width: `${coverage}%` }}></span>
                  </div>
                  <div className="suggestions">
                    <button onClick={() => setQuestion('What are the key support levels?')}>Support levels</button>
                    <button onClick={() => setQuestion('Best entry points?')}>Entry points</button>
                    <button onClick={() => setQuestion('Risk analysis')}>Risk analysis</button>
                    <button onClick={() => setQuestion('Market sentiment?')}>Sentiment</button>
                    <button onClick={() => setQuestion('Technical indicators')}>Indicators</button>
                    <button onClick={() => setQuestion('Exit strategy')}>Exit strategy</button>
                  </div>
                  <div className="doc-preview" aria-label="Market context">
                    <span className="small">Your market data and analysis will appear here with highlighted insights.</span>
                  </div>

                  {showFlashcards && (
                    <div style={{ marginTop: '12px' }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <strong>Key Trading Insights</strong>
                        <div className="controls">
                          <button className="chip" onClick={() => setCardIndex(Math.max(0, cardIndex - 1))}>Prev</button>
                          <button className="chip" onClick={() => setCardIndex(cardIndex + 1)}>Next</button>
                        </div>
                      </div>
                      <div className="panel" style={{ marginTop: '8px' }}>
                        <div className="panel-body">
                          <div className="flex flex-col gap-2.5">
                            <div className="font-bold">RSI Divergence</div>
                            <div className="small" style={{ color: 'var(--muted)' }}>Insight</div>
                            <div>When RSI shows lower highs while price makes higher highs, it signals potential reversal.</div>
                            <div className="small">Insight {cardIndex + 1} of 5</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works - blueprint section */}
        <section className="blueprint" id="how">
          <div className="container">
            <h2 className="section-title">How it works</h2>
            <p className="sub">Professional-grade trading intelligence with AI precision. Master the markets in three simple steps.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] relative z-[2]">
              <div className="step">
                <div className="num">1</div>
                <h3>Connect</h3>
                <p>Link your trading accounts or paste market data. FinAgent analyzes real-time price action and market conditions.</p>
              </div>
              <div className="step">
                <div className="num">2</div>
                <h3>Analyze</h3>
                <p>Ask questions in plain language. Get AI-powered technical analysis, risk assessment, and trading strategies.</p>
              </div>
              <div className="step">
                <div className="num">3</div>
                <h3>Execute</h3>
                <p>Receive actionable trading signals with entry/exit points, position sizing, and risk management parameters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-[70px] px-4" id="features">
          <div className="container">
            <h2 className="section-title">Professional trading tools</h2>
            <p className="sub">AI-powered analysis, real-time signals, and portfolio optimization in one platform.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="feature">
                <div className="ico" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b0d12"><path d="M3 4h18v14H3z"/><path d="M3 18l9 3 9-3" fill="#0b0d12"/></svg>
                </div>
                <div>
                  <h4>Market Analysis</h4>
                  <p>Real-time technical analysis with AI pattern recognition and predictive modeling.</p>
                </div>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b0d12"><path d="M12 2l9 4-9 4-9-4 9-4zm0 6v14"/></svg>
                </div>
                <div>
                  <h4>Risk Management</h4>
                  <p>Automated position sizing and stop-loss optimization based on your risk profile.</p>
                </div>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b0d12"><path d="M3 12h18M12 3v18"/></svg>
                </div>
                <div>
                  <h4>Trading Signals</h4>
                  <p>Precise entry and exit points with confidence scores and profit targets.</p>
                </div>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b0d12"><path d="M4 6h16v12H4z"/><path d="M8 10h8M8 14h5" stroke="#0b0d12" strokeWidth="2"/></svg>
                </div>
                <div>
                  <h4>Portfolio Tracking</h4>
                  <p>Real-time P&L monitoring with performance analytics and optimization suggestions.</p>
                </div>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b0d12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h4>Strategy Builder</h4>
                  <p>Create and backtest custom trading strategies with AI optimization.</p>
                </div>
              </div>
              <div className="feature">
                <div className="ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b0d12"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                </div>
                <div>
                  <h4>Market Scanner</h4>
                  <p>Scan thousands of instruments for trading opportunities matching your criteria.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-[70px] px-4 relative" id="pricing" style={{
          background: 'radial-gradient(900px 500px at 80% 50%, rgba(255,49,49,0.14), transparent 50%), radial-gradient(900px 600px at 10% 80%, rgba(255,200,58,0.14), transparent 50%)'
        }}>
          <div className="container">
            <h2 className="section-title">Simple, transparent pricing</h2>
            <p className="sub">Start free. Upgrade when you need professional features.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
              <div className="plan">
                <h3>Starter</h3>
                <div className="price">$0<span className="small">/mo</span></div>
                <ul>
                  <li><span className="tick"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span> Basic market analysis</li>
                  <li><span className="tick"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span> 10 AI queries per day</li>
                  <li><span className="tick"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span> Paper trading mode</li>
                </ul>
                <button className="btn btn-outline mt-3.5">Get started</button>
              </div>
              <div className="plan">
                <h3>Pro Trader</h3>
                <div className="price">$49<span className="small">/mo</span></div>
                <ul>
                  <li><span className="tick"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span> Advanced AI analysis</li>
                  <li><span className="tick"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span> Unlimited queries</li>
                  <li><span className="tick"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span> Real-time trading signals</li>
                </ul>
                <button className="btn btn-primary mt-3.5">Upgrade to Pro</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-[60px] px-4" id="faq">
          <div className="container">
            <h2 className="section-title">Frequently asked questions</h2>
            <details className="qa">
              <summary>Is this real AI trading? <span>+</span></summary>
              <p>Yes, FinAgent uses advanced AI models trained on millions of market patterns to provide professional-grade analysis and trading signals.</p>
            </details>
            <details className="qa">
              <summary>Which markets are supported? <span>+</span></summary>
              <p>We support stocks, forex, crypto, commodities, and indices across all major exchanges worldwide.</p>
            </details>
            <details className="qa">
              <summary>Is my trading data secure? <span>+</span></summary>
              <p>Your data is encrypted end-to-end. We never share your trading information and you can delete your data anytime.</p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.1)] bg-gradient-to-b from-[rgba(255,255,255,0.04)] to-transparent py-6 px-4 text-[var(--muted)]">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="logo w-7 h-7"></div>
              <span>© {new Date().getFullYear()} FinAgent</span>
            </div>
            <div className="flex gap-3">
              <a href="#features">Features</a> ·
              <a href="#pricing">Pricing</a> ·
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}