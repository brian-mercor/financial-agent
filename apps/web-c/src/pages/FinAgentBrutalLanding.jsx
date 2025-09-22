import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function FinAgentBrutalLanding() {
  const [consoleText, setConsoleText] = useState('> Ready to analyze markets. Try: "Analyze AAPL" or "Show trending stocks".\n')
  const [prompt, setPrompt] = useState('')
  const [timer, setTimer] = useState('00:00')
  const [seconds, setSeconds] = useState(0)
  const [timerId, setTimerId] = useState(null)
  const [demoLog, setDemoLog] = useState('Start a trading session. Analyze positions in real-time.')

  useEffect(() => {
    // Set current year
    const yearEl = document.getElementById('year')
    if (yearEl) yearEl.textContent = new Date().getFullYear()
  }, [])

  const mockFinAgent = (q) => {
    if (/aapl|apple/i.test(q)) {
      return [
        'AI: Analyzing AAPL technical indicators...',
        'RSI: 58.3 (neutral)',
        'MACD: Bullish crossover detected',
        'Support: $175, Resistance: $182',
        'Recommendation: Hold with stop-loss at $173.'
      ]
    }
    if (/risk|portfolio/i.test(q)) {
      return [
        'AI: Calculating portfolio risk metrics...',
        'Sharpe Ratio: 1.42 (good)',
        'Max Drawdown: -12.3%',
        'Beta: 0.85 (less volatile than market)',
        'Risk Score: 6.5/10 (moderate risk).'
      ]
    }
    if (/trending|stocks/i.test(q)) {
      return [
        'AI: Top trending stocks today:',
        '1) NVDA +4.2% (AI sector momentum)',
        '2) TSLA +3.1% (delivery beat)',
        '3) META +2.8% (ad revenue growth)',
        'Volume leaders: SPY, QQQ, AAPL.'
      ]
    }
    return [
      'AI: Processing your request...',
      'Analyzing market conditions...',
      'Generating insights based on real-time data.',
      'Use specific tickers or ask about portfolio metrics.',
      'Try: "Analyze MSFT" or "Show my risk score".'
    ]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const newText = consoleText + '> ' + prompt + '\n'
    setConsoleText(newText)

    const reply = mockFinAgent(prompt)
    let i = 0
    const interval = setInterval(() => {
      if (i >= reply.length) {
        clearInterval(interval)
        return
      }
      setConsoleText(prev => prev + reply[i++] + '\n')
    }, 80)

    setPrompt('')
  }

  const formatTime = (s) => {
    const m = String(Math.floor(s/60)).padStart(2,'0')
    const ss = String(s%60).padStart(2,'0')
    return `${m}:${ss}`
  }

  const startSession = () => {
    if (timerId) return
    setSeconds(0)
    setTimer('00:00')
    setDemoLog('Session active. Execute trades and monitor positions in real-time.')

    const id = setInterval(() => {
      setSeconds(s => {
        const newSeconds = s + 1
        setTimer(formatTime(newSeconds))
        return newSeconds
      })
    }, 1000)
    setTimerId(id)
  }

  const analyzeNow = () => {
    if (!timerId) {
      setDemoLog(prev => prev + '\nStart a session first.')
      return
    }
    clearInterval(timerId)
    setTimerId(null)

    const performance = Math.max(50, 100 - Math.floor(seconds / 3))
    const feedback = performance > 85 ? 'Excellent timing. Optimal entry detected.' :
                     performance > 70 ? 'Good analysis. Consider tighter stops.' :
                     'Review needed. Check support levels.'
    setDemoLog(prev => prev + `\nPerformance: ${performance}/100 — ${feedback}`)
  }

  const resetSession = () => {
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }
    setSeconds(0)
    setTimer('00:00')
    setDemoLog('Start a trading session. Analyze positions in real-time.')
  }

  return (
    <div className="min-h-screen bg-brutal-bg text-brutal-fg font-grotesk">
      {/* Top Ticker */}
      <div className="w-full overflow-hidden border-b-4 border-brutal-line bg-brutal-ink scanline">
        <div className="flex whitespace-nowrap animate-[ticker_24s_linear_infinite]">
          <div className="flex gap-12 py-3 text-xs md:text-sm font-mono uppercase tracking-widest">
            <span className="px-6">S&P 500: +0.8%</span>
            <span className="px-6">NASDAQ: +1.2%</span>
            <span className="px-6 text-brutal-red">TRADE SMARTER</span>
            <span className="px-6">BTC: $48,234</span>
            <span className="px-6">VIX: 14.2</span>
            <span className="px-6">Gold: $1,982</span>
            <span className="px-6">S&P 500: +0.8%</span>
            <span className="px-6">NASDAQ: +1.2%</span>
            <span className="px-6 text-brutal-red">TRADE SMARTER</span>
            <span className="px-6">BTC: $48,234</span>
            <span className="px-6">VIX: 14.2</span>
            <span className="px-6">Gold: $1,982</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brutal-bg/90 backdrop-blur border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 brutal-card grid place-items-center">
              <span className="font-mono font-bold text-brutal-red">FA</span>
            </div>
            <span className="font-extrabold tracking-tight text-lg md:text-xl">FinAgent</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
            <a href="#features" className="hover:text-brutal-red">Features</a>
            <a href="#analytics" className="hover:text-brutal-red">Analytics</a>
            <a href="#demo" className="hover:text-brutal-red">Demo</a>
            <a href="#pricing" className="hover:text-brutal-red">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost px-4 py-2 font-mono text-xs uppercase hidden sm:inline-block">Sign In</Link>
            <Link to="/dashboard" className="btn-brutal px-4 py-2 font-mono text-xs uppercase">Launch App</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-brutal-line">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] font-extrabold">
                  <span className="block">TRADE</span>
                  <span className="block stroke-text">SMARTER</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl">
                  AI-powered market analysis. Real-time insights. No BS. FinAgent cuts through the noise to deliver actionable intelligence for serious traders.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link to="/dashboard" className="btn-brutal px-6 py-4 font-mono text-sm uppercase">Start Trading</Link>
                  <a href="#features" className="btn-ghost px-6 py-4 font-mono text-sm uppercase">See Features</a>
                </div>
                <div className="flex gap-6 pt-4">
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">87%</div>
                    Win Rate
                  </div>
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">$2.4M</div>
                    Analyzed Daily
                  </div>
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">24/7</div>
                    Market Monitoring
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Console */}
            <div className="lg:col-span-5">
              <div className="brutal-card concrete p-5 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>Trading Terminal</span>
                  <span className="text-brutal-red">Live</span>
                </div>
                <div className="bg-brutal-bg border-2 border-brutal-line p-4 h-48 overflow-auto text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {consoleText}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 bg-brutal-ink border-2 border-brutal-line px-3 py-3 focus:outline-none focus:border-brutal-red font-mono"
                    placeholder="Enter ticker or command…"
                  />
                  <button className="btn-brutal px-4 py-3 font-mono text-xs uppercase" type="submit">Execute</button>
                </form>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <button
                    className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red"
                    onClick={() => setPrompt('Analyze AAPL')}
                  >
                    AAPL
                  </button>
                  <button
                    className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red"
                    onClick={() => setPrompt('Show portfolio risk')}
                  >
                    Risk
                  </button>
                  <button
                    className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red"
                    onClick={() => setPrompt('Show trending stocks')}
                  >
                    Trending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">AI Analysis</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Realtime</span>
              </div>
              <p className="mt-3 text-sm">Machine learning models analyze millions of data points to identify opportunities before the market moves.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Pattern recognition</li>
                <li>› Sentiment analysis</li>
                <li>› Risk assessment</li>
              </ul>
            </div>
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">Smart Alerts</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Instant</span>
              </div>
              <p className="mt-3 text-sm">Get notified only when it matters. Custom triggers based on your strategy and risk tolerance.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Price movements</li>
                <li>› Volume spikes</li>
                <li>› News events</li>
              </ul>
            </div>
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">Portfolio Optimization</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Automated</span>
              </div>
              <p className="mt-3 text-sm">Continuously rebalance based on market conditions. Maximize returns while managing risk.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Asset allocation</li>
                <li>› Risk parity</li>
                <li>› Tax harvesting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics" className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Market Analytics</h2>
              <p className="text-sm md:text-base">Real-time performance tracking. Every metric that matters at your fingertips.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="brutal-card p-4">
                  <div className="text-xs font-mono uppercase text-brutal-red">Portfolio</div>
                  <div className="mt-2 text-3xl font-extrabold">+24.3%</div>
                  <div className="mt-3 h-10 bg-brutal-ink border-2 border-brutal-line"></div>
                </div>
                <div className="brutal-card p-4">
                  <div className="text-xs font-mono uppercase text-brutal-red">Win Rate</div>
                  <div className="mt-2 text-3xl font-extrabold">87%</div>
                  <div className="mt-3 h-10 bg-brutal-ink border-2 border-brutal-line"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="brutal-card p-5 h-full">
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>Portfolio Performance</span>
                  <span className="text-brutal-red">Live</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Tech</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '42%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">42% allocation</div>
                  </div>
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Finance</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '28%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">28% allocation</div>
                  </div>
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Energy</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '30%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">30% allocation</div>
                  </div>
                </div>
                <div className="mt-5 bg-brutal-bg border-2 border-brutal-line p-4">
                  <div className="w-full h-56 bg-brutal-ink border-2 border-brutal-line flex items-center justify-center">
                    <span className="font-mono text-xs text-gray-500 uppercase">Chart Visualization Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <div className="brutal-card p-6 flex flex-col">
              <h3 className="text-3xl font-extrabold">Live Trading Demo</h3>
              <p className="mt-3 text-sm max-w-lg">Experience the power of AI-driven trading. Real-time analysis, instant execution, and comprehensive risk management.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Real-time market data</li>
                <li>› AI-powered signals</li>
                <li>› Risk management tools</li>
              </ul>
              <div className="mt-auto pt-6">
                <Link to="/dashboard" className="btn-brutal px-6 py-3 font-mono text-xs uppercase">Open Platform</Link>
              </div>
            </div>
            <div className="brutal-card p-6 concrete">
              <div className="flex items-center justify-between font-mono text-xs uppercase">
                <span>Trading Session</span>
                <span className="text-brutal-red">{timer}</span>
              </div>
              <div className="mt-4 bg-brutal-bg border-2 border-brutal-line p-4 h-56 overflow-auto font-mono text-sm whitespace-pre-wrap">
                {demoLog}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button onClick={startSession} className="btn-brutal px-3 py-2 font-mono text-xs uppercase col-span-1">Start</button>
                <button onClick={analyzeNow} className="btn-ghost px-3 py-2 font-mono text-xs uppercase col-span-1">Analyze</button>
                <button onClick={resetSession} className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red col-span-1">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Transparent Pricing</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="brutal-card p-6 flex flex-col">
              <div className="font-mono text-xs uppercase text-brutal-red">Starter</div>
              <div className="mt-3 text-5xl font-extrabold">$0</div>
              <div className="text-sm opacity-80">Forever</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› 10 trades/month</li>
                <li>› Basic analytics</li>
                <li>› Email alerts</li>
              </ul>
              <Link to="/dashboard" className="btn-ghost mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Start Free</Link>
            </div>
            <div className="brutal-card p-6 flex flex-col border-brutal-red" style={{borderColor:'#FF2D2D'}}>
              <div className="font-mono text-xs uppercase text-brutal-red">Pro</div>
              <div className="mt-3 text-5xl font-extrabold">$99</div>
              <div className="text-sm opacity-80">per month</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› Unlimited trades</li>
                <li>› Advanced AI signals</li>
                <li>› Real-time alerts</li>
                <li>› API access</li>
              </ul>
              <Link to="/dashboard" className="btn-brutal mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Go Pro</Link>
            </div>
            <div className="brutal-card p-6 flex flex-col">
              <div className="font-mono text-xs uppercase text-brutal-red">Institution</div>
              <div className="mt-3 text-5xl font-extrabold">$999</div>
              <div className="text-sm opacity-80">per month</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› White-label solution</li>
                <li>› Custom models</li>
                <li>› Dedicated support</li>
              </ul>
              <a href="#" className="btn-ghost mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="brutal-card p-8 md:p-12 text-center">
            <div className="text-5xl md:text-7xl font-extrabold leading-none">Start Trading Smarter</div>
            <div className="mt-3 text-xl uppercase font-mono tracking-widest underline-red inline-block">AI-Powered. Data-Driven. Profit-Focused.</div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/dashboard" className="btn-brutal px-8 py-4 font-mono text-xs uppercase">Launch Platform</Link>
              <a href="#features" className="btn-ghost px-8 py-4 font-mono text-xs uppercase">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 brutal-card grid place-items-center">
                  <span className="font-mono font-bold text-brutal-red">FA</span>
                </div>
                <span className="font-extrabold">FinAgent</span>
              </div>
              <p className="mt-3 text-sm opacity-80 max-w-xs">Trade without compromise. We don't sugarcoat—we deliver results.</p>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-brutal-red">Product</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-brutal-red" href="#features">Features</a></li>
                <li><a className="hover:text-brutal-red" href="#analytics">Analytics</a></li>
                <li><a className="hover:text-brutal-red" href="#pricing">Pricing</a></li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-brutal-red">Resources</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-brutal-red" href="#">Documentation</a></li>
                <li><a className="hover:text-brutal-red" href="#">API</a></li>
                <li><a className="hover:text-brutal-red" href="#">Status</a></li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-brutal-red">Legal</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-brutal-red" href="#">Privacy</a></li>
                <li><a className="hover:text-brutal-red" href="#">Terms</a></li>
                <li><a className="hover:text-brutal-red" href="#">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t-4 border-brutal-line pt-4 text-xs font-mono uppercase flex flex-col sm:flex-row justify-between gap-3">
            <span>© <span id="year"></span> FinAgent</span>
            <span>Built for traders who don't settle</span>
          </div>
        </div>
      </footer>
    </div>
  )
}