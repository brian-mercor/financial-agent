import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, BarChart3, Brain, Shield, Zap, Target, ChevronRight, Check } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [heroEmail, setHeroEmail] = useState('')
  const [ctaEmail, setCtaEmail] = useState('')

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())
  }

  function handleHeroSignup(e) {
    e.preventDefault()
    const email = heroEmail.trim()
    if (!validateEmail(email)) {
      const input = e.target.querySelector('input')
      input.focus()
      input.style.boxShadow = '0 0 0 6px rgba(255,107,179,.15)'
      input.style.borderColor = 'rgba(255,107,179,.7)'
      setTimeout(() => {
        input.style.boxShadow = ''
        input.style.borderColor = 'rgba(255,255,255,.12)'
      }, 1400)
      return
    }
    navigate('/signup', { state: { email } })
  }

  function handleCtaSignup(e) {
    e.preventDefault()
    const email = ctaEmail.trim()
    if (!validateEmail(email)) {
      const input = e.target.querySelector('input')
      input.focus()
      input.style.boxShadow = '0 0 0 6px rgba(255,107,179,.15)'
      input.style.borderColor = 'rgba(255,107,179,.7)'
      setTimeout(() => {
        input.style.boxShadow = ''
        input.style.borderColor = 'rgba(255,255,255,.12)'
      }, 1400)
      return
    }
    navigate('/signup', { state: { email } })
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link to="/" className="brand" aria-label="Finagent Home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-text">Finagent</span>
          </Link>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#analysis">Analysis</a>
            <a href="#how">How it Works</a>
            <a href="#pricing">Pricing</a>
            <Link to="/login" className="btn">Start Trading</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container hero-inner">
            <div>
              <span className="eyebrow"><span className="dot"></span> AI-Powered Trading</span>
              <h1 className="title">
                Your AI Partner for <span className="gradient">Smarter</span> and <span className="gradient">Profitable</span> Trading
              </h1>
              <p className="subtitle">
                Finagent combines advanced AI models with real-time market data—delivering instant analysis, portfolio optimization, and trading strategies. Built for traders, investors, and financial professionals.
              </p>
              <form onSubmit={handleHeroSignup} className="hero-cta">
                <input
                  className="input"
                  type="email"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  placeholder="Enter your email to get started"
                  aria-label="Email address"
                />
                <button type="submit" className="btn">Get Started Free</button>
                <button type="button" onClick={() => document.getElementById('analysis').scrollIntoView({ behavior: 'smooth' })} className="btn secondary">
                  See it in action
                </button>
              </form>
              <div className="meta">
                <span>AI market analysis • portfolio optimization • risk management</span>
                <span>•</span>
                <span>Keywords: AI trading, financial assistant, portfolio management, market analysis</span>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="w-32 h-32 text-accent-2 mx-auto mb-4" />
                  <p className="text-muted">Real-time market visualization</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section">
          <div className="container">
            <div className="section-header">
              <div className="kicker">Analyze • Optimize • Execute</div>
              <h2 className="h2">From market insights to profitable trades</h2>
              <div className="space"></div>
              <div className="segmented" role="tablist" aria-label="Trading mode">
                <button className="segment active" role="tab" aria-selected="true" data-mode="all">All Features</button>
                <button className="segment" role="tab" aria-selected="false" data-mode="analysis">Analysis</button>
                <button className="segment" role="tab" aria-selected="false" data-mode="portfolio">Portfolio</button>
              </div>
            </div>

            <div className="feature-grid">
              <div className="card">
                <span className="pill">Market Analysis</span>
                <h3>Real-time market intelligence</h3>
                <p>Get instant analysis of stocks, crypto, and forex markets. AI processes news, technicals, and fundamentals to identify opportunities.</p>
              </div>
              <div className="card">
                <span className="pill">Smart Portfolio</span>
                <h3>Portfolio optimization—automatically</h3>
                <p>AI rebalances your portfolio, suggests diversification strategies, and monitors risk exposure across all your positions.</p>
              </div>
              <div className="card">
                <span className="pill">Trading Signals</span>
                <h3>Actionable trading strategies</h3>
                <p>Receive entry/exit signals, stop-loss levels, and position sizing recommendations based on your risk profile and market conditions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Demo */}
        <section id="analysis" className="section">
          <div className="container demo">
            <div className="panel">
              <h3>AI-powered market analysis</h3>
              <p>Experience our AI analyzing markets in real-time. Ask about any stock, get instant technical and fundamental insights.</p>
              <div className="mt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-accent mt-1" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">Multiple AI Models</p>
                      <p className="text-muted text-sm">GPT-4, Claude, and specialized financial models</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-accent-2 mt-1" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">Real-time Data</p>
                      <p className="text-muted text-sm">Live market prices, news, and social sentiment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-accent-3 mt-1" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">Personalized Strategies</p>
                      <p className="text-muted text-sm">Tailored to your risk profile and goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center">
                  <TrendingUp className="w-24 h-24 text-good mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Market Performance</h3>
                  <p className="text-muted">Interactive charts and analysis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works / CTA */}
        <section id="how" className="section">
          <div className="container cta">
            <div className="panel">
              <span className="pill">How it works</span>
              <h3 className="h2">From novice to pro—powered by AI assistance</h3>
              <p className="subtitle" style={{ marginTop: '6px' }}>
                - Connect: Link your brokerage or track portfolios manually<br />
                - Analyze: AI evaluates markets, news, and your positions<br />
                - Execute: Get signals, strategies, and risk management advice
              </p>
              <div className="checklist">
                <div className="check"><i></i> Technical analysis: patterns, indicators, trends</div>
                <div className="check"><i></i> Fundamental analysis: earnings, valuations, metrics</div>
                <div className="check"><i></i> Risk management: position sizing, stop-losses</div>
                <div className="check"><i></i> 24/7 monitoring: alerts for opportunities and risks</div>
              </div>
              <div className="space"></div>
              <form onSubmit={handleCtaSignup} className="hero-cta">
                <input
                  className="input"
                  type="email"
                  value={ctaEmail}
                  onChange={(e) => setCtaEmail(e.target.value)}
                  placeholder="Your work email"
                  aria-label="Email"
                />
                <button type="submit" className="btn">Start Free Trial</button>
              </form>
            </div>
            <div className="panel">
              <h3>Why Finagent leads the market</h3>
              <p>Not just another trading app. Finagent turns market complexity into profitable simplicity.</p>
              <div className="feature-grid" style={{ gridTemplateColumns: '1fr', gap: '12px', marginTop: '10px' }}>
                <div className="card">
                  <h3>Institutional-grade analysis</h3>
                  <p>Access the same AI models and data feeds used by hedge funds and banks.</p>
                </div>
                <div className="card">
                  <h3>Multi-asset coverage</h3>
                  <p>Trade stocks, crypto, forex, commodities—all with unified AI assistance.</p>
                </div>
                <div className="card">
                  <h3>Learn while you earn</h3>
                  <p>AI explains every recommendation, helping you become a better trader.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing teaser */}
        <section id="pricing" className="section">
          <div className="container">
            <div className="panel">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <h3 className="h2" style={{ margin: '0 0 6px' }}>Start trading smarter today</h3>
                  <p className="subtitle" style={{ margin: 0 }}>Free tier for beginners. Pro features for serious traders. Enterprise for institutions.</p>
                </div>
                <div className="hero-cta">
                  <Link to="/signup" className="btn">Create your account</Link>
                  <button className="btn secondary" onClick={() => alert('Contact sales: hello@finagent.ai')}>
                    Contact sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container grid">
          <div>
            <a className="brand" href="#">
              <span className="brand-mark"></span>
              <span className="brand-text">Finagent</span>
            </a>
            <p style={{ marginTop: '10px' }}>
              AI-powered trading intelligence for modern investors. Make smarter decisions with real-time analysis and portfolio optimization.
            </p>
          </div>
          <div>
            <strong>Product</strong>
            <ul style={{ paddingLeft: '16px', margin: '8px 0 0' }}>
              <li><a href="#features">Features</a></li>
              <li><a href="#analysis">Analysis</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <strong>Resources</strong>
            <ul style={{ paddingLeft: '16px', margin: '8px 0 0' }}>
              <li><a href="#">Trading Guides</a></li>
              <li><a href="#">Market Analysis</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>
          <div>
            <strong>Company</strong>
            <ul style={{ paddingLeft: '16px', margin: '8px 0 0' }}>
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="container" style={{ marginTop: '26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <small>© {new Date().getFullYear()} Finagent, Inc. All rights reserved.</small>
          <small>Made for traders and investors worldwide.</small>
        </div>
      </footer>
    </>
  )
}