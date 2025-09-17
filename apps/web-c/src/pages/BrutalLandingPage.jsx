import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Chart from 'chart.js/auto'

export default function BrutalLandingPage() {
  useEffect(() => {
    // Store chart instance for cleanup
    let chartInstance = null;
    // Year
    document.getElementById('year').textContent = new Date().getFullYear()

    // Hero console interactions
    const consoleEl = document.getElementById('console')
    const form = document.getElementById('promptForm')
    const input = document.getElementById('prompt')

    document.querySelectorAll('[data-snippet]').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.getAttribute('data-snippet')
        input.focus()
      })
    })

    function appendConsole(line) {
      consoleEl.innerHTML += line + '<br/>'
      consoleEl.scrollTop = consoleEl.scrollHeight
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const q = input.value.trim()
      if (!q) return
      appendConsole('&gt; ' + q)
      input.value = ''

      const reply = mockFinAgent(q)
      let i = 0
      const interval = setInterval(() => {
        if (i >= reply.length) return clearInterval(interval)
        appendConsole(reply[i++])
      }, 80)
    })

    function mockFinAgent(q) {
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

    // Demo session timer
    let timerId = null, seconds = 0
    const timerEl = document.getElementById('timer')
    const demoLog = document.getElementById('demoLog')
    const startBtn = document.getElementById('startSession')
    const analyzeBtn = document.getElementById('analyzeNow')
    const resetBtn = document.getElementById('resetSession')

    function fmt(s) {
      const m = String(Math.floor(s/60)).padStart(2,'0')
      const ss = String(s%60).padStart(2,'0')
      return `${m}:${ss}`
    }

    function tick() {
      seconds++
      timerEl.textContent = fmt(seconds)
    }

    startBtn.addEventListener('click', () => {
      if (timerId) return
      seconds = 0
      timerEl.textContent = fmt(0)
      demoLog.innerHTML = 'Session started. Market: OPEN. Scanning for opportunities...'
      timerId = setInterval(tick, 1000)
    })

    analyzeBtn.addEventListener('click', () => {
      if (!timerId) {
        demoLog.innerHTML += '<br/>Start a session first.'
        return
      }
      clearInterval(timerId)
      timerId = null
      const trades = Math.floor(Math.random() * 5) + 3
      const winRate = Math.floor(Math.random() * 30) + 60
      const profit = (Math.random() * 8 + 2).toFixed(2)
      demoLog.innerHTML += `<br/>Analysis complete: ${trades} trades, ${winRate}% win rate, +${profit}% profit.`
    })

    resetBtn.addEventListener('click', () => {
      if (timerId) { clearInterval(timerId); timerId = null }
      seconds = 0
      timerEl.textContent = '00:00'
      demoLog.innerHTML = 'Start a demo trading session. AI will analyze and suggest trades.'
    })

    // Sparklines
    function sparkline(canvasId, points) {
      const c = document.getElementById(canvasId)
      const ctx = c.getContext('2d')
      const w = c.clientWidth, h = c.clientHeight
      c.width = w * devicePixelRatio
      c.height = h * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      ctx.clearRect(0,0,w,h)
      const min = Math.min(...points), max = Math.max(...points)
      const pad = 4
      ctx.strokeStyle = '#FF2D2D'
      ctx.lineWidth = 2
      ctx.beginPath()
      points.forEach((p, i) => {
        const x = pad + (w - pad*2) * (i/(points.length-1))
        const y = h - pad - ( (p - min) / (max - min || 1) ) * (h - pad*2)
        if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y)
      })
      ctx.stroke()
    }

    sparkline('spark1', [100,105,103,108,112,115,114,118,122,120,125,128,130,135,138,142,145,148])
    sparkline('spark2', [60,62,65,63,68,70,72,74,73,75,74,76,74])

    // Main Chart
    const ctx = document.getElementById('chart')
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
        datasets: [{
          label: 'Portfolio Value',
          data: [10000,10500,10200,11000,11800,12200,12800,13500],
          borderColor: '#FF2D2D',
          backgroundColor: 'rgba(255,45,45,0.15)',
          tension: 0.25,
          fill: true,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: '#2A2A2A' },
            ticks: { color: '#F5F5F5', font: { family: 'Space Mono' } }
          },
          y: {
            min: 9000, max: 14000,
            grid: { color: '#2A2A2A' },
            ticks: {
              color: '#F5F5F5',
              font: { family: 'Space Mono' },
              callback: function(value) {
                return '$' + value.toLocaleString()
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#F5F5F5', font: { family: 'Space Mono' } }
          },
          tooltip: {
            backgroundColor: '#111111',
            borderColor: '#2A2A2A',
            borderWidth: 2,
            titleColor: '#F5F5F5',
            bodyColor: '#F5F5F5',
            titleFont: { family: 'Space Mono' },
            bodyFont: { family: 'Space Mono' },
            callbacks: {
              label: function(context) {
                return 'Value: $' + context.parsed.y.toLocaleString()
              }
            }
          }
        }
      }
    })
    
    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
  }, [])

  return (
    <div className="font-grotesk text-brutal-fg antialiased selection:bg-brutal-red selection:text-brutal-bg">
      {/* Top Ribbon Ticker */}
      <div className="w-full overflow-hidden border-b-4 border-brutal-line bg-brutal-ink scanline">
        <div className="flex whitespace-nowrap ticker">
          <div className="flex gap-12 py-3 text-xs md:text-sm font-mono uppercase tracking-widest">
            <span className="px-6">Real-time Market Analysis</span>
            <span className="px-6">AI-Powered Trading Signals</span>
            <span className="px-6 text-brutal-red">INTELLIGENT INVESTING</span>
            <span className="px-6">Portfolio Optimization</span>
            <span className="px-6">Risk Management</span>
            <span className="px-6">FinAgent AI Assistant</span>
            <span className="px-6">Real-time Market Analysis</span>
            <span className="px-6">AI-Powered Trading Signals</span>
            <span className="px-6 text-brutal-red">INTELLIGENT INVESTING</span>
            <span className="px-6">Portfolio Optimization</span>
            <span className="px-6">Risk Management</span>
            <span className="px-6">FinAgent AI Assistant</span>
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
            <a href="#demo" className="btn-brutal px-4 py-2 font-mono text-xs uppercase">Try Assistant</a>
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
                  <span className="block">INTELLIGENT</span>
                  <span className="block stroke-text">INVESTING</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl">
                  Transform market chaos into strategic opportunities. FinAgent's multi-agent AI system delivers real-time analysis, personalized trading strategies, and portfolio optimization.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a href="#demo" className="btn-brutal px-6 py-4 font-mono text-sm uppercase">Start Trading</a>
                  <a href="#features" className="btn-ghost px-6 py-4 font-mono text-sm uppercase">Explore Features</a>
                </div>
                <div className="flex gap-6 pt-4">
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">24/7</div>
                    Market Monitoring
                  </div>
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">5 AI</div>
                    Expert Agents
                  </div>
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">Real-time</div>
                    TradingView Charts
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Console */}
            <div className="lg:col-span-5">
              <div className="brutal-card concrete p-5 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>AI Trading Console</span>
                  <span className="text-brutal-red">Live</span>
                </div>
                <div className="bg-brutal-bg border-2 border-brutal-line p-4 h-48 overflow-auto text-sm font-mono leading-relaxed" id="console">
                  &gt; Ask me anything. Try: "Analyze AAPL" or "Show me risk metrics for my portfolio".<br/>
                </div>
                <form id="promptForm" className="flex gap-2">
                  <input id="prompt" className="flex-1 bg-brutal-ink border-2 border-brutal-line px-3 py-3 focus:outline-none focus:border-brutal-red font-mono" placeholder="Ask about markets..." />
                  <button className="btn-brutal px-4 py-3 font-mono text-xs uppercase" type="submit">Analyze</button>
                </form>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <button className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red" data-snippet="Analyze AAPL technical indicators">AAPL Analysis</button>
                  <button className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red" data-snippet="What's my portfolio risk score?">Risk Score</button>
                  <button className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red" data-snippet="Show trending stocks today">Trending</button>
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
                <h3 className="text-2xl font-extrabold">Multi-Agent AI</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">5 Experts</span>
              </div>
              <p className="mt-3 text-sm">Specialized AI agents for market analysis, trading advice, risk management, and economic insights.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Market Analyst</li>
                <li>› Trading Advisor</li>
                <li>› Risk Manager</li>
                <li>› Portfolio Optimizer</li>
                <li>› Macro Economist</li>
              </ul>
            </div>
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">Real-time Charts</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">TradingView</span>
              </div>
              <p className="mt-3 text-sm">Professional-grade charting with technical indicators, drawing tools, and real-time market data.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Advanced indicators</li>
                <li>› Multiple timeframes</li>
                <li>› Pattern recognition</li>
              </ul>
            </div>
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">Smart Portfolio</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Automated</span>
              </div>
              <p className="mt-3 text-sm">AI-driven portfolio management with risk assessment, rebalancing suggestions, and performance tracking.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Risk profiling</li>
                <li>› Auto-rebalancing</li>
                <li>› Tax optimization</li>
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
              <p className="text-sm md:text-base">Real-time market intelligence, portfolio metrics, and AI-powered insights in a unified dashboard.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="brutal-card p-4">
                  <div className="text-xs font-mono uppercase text-brutal-red">Portfolio Value</div>
                  <div className="mt-2 text-3xl font-extrabold">+18%</div>
                  <canvas id="spark1" className="spark mt-3 h-10 w-full"></canvas>
                </div>
                <div className="brutal-card p-4">
                  <div className="text-xs font-mono uppercase text-brutal-red">Win Rate</div>
                  <div className="mt-2 text-3xl font-extrabold">74%</div>
                  <canvas id="spark2" className="spark mt-3 h-10 w-full"></canvas>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="brutal-card p-5 h-full">
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>Portfolio Performance</span>
                  <span className="text-brutal-red">Live Data</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Stocks</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '65%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">65% allocation</div>
                  </div>
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Crypto</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '20%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">20% allocation</div>
                  </div>
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Bonds</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '15%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">15% allocation</div>
                  </div>
                </div>
                <div className="mt-5 bg-brutal-bg border-2 border-brutal-line p-4">
                  <canvas id="chart" className="w-full h-56"></canvas>
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
              <h3 className="text-3xl font-extrabold">Trade with Confidence</h3>
              <p className="mt-3 text-sm max-w-lg">From market analysis to execution, our AI agents guide every decision with data-driven insights and risk management.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Real-time market scanning</li>
                <li>› AI-powered trade signals</li>
                <li>› Automated risk management</li>
              </ul>
              <div className="mt-auto pt-6">
                <a href="#pricing" className="btn-brutal px-6 py-3 font-mono text-xs uppercase">View Pricing</a>
              </div>
            </div>
            <div className="brutal-card p-6 concrete">
              <div className="flex items-center justify-between font-mono text-xs uppercase">
                <span>Trading Session</span><span id="timer" className="text-brutal-red">00:00</span>
              </div>
              <div className="mt-4 bg-brutal-bg border-2 border-brutal-line p-4 h-56 overflow-auto font-mono text-sm" id="demoLog">
                Start a demo trading session. AI will analyze and suggest trades.
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button id="startSession" className="btn-brutal px-3 py-2 font-mono text-xs uppercase col-span-1">Start</button>
                <button id="analyzeNow" className="btn-ghost px-3 py-2 font-mono text-xs uppercase col-span-1">Analyze</button>
                <button id="resetSession" className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red col-span-1">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Professional Plans</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="brutal-card p-6 flex flex-col">
              <div className="font-mono text-xs uppercase text-brutal-red">Starter</div>
              <div className="mt-3 text-5xl font-extrabold">$0</div>
              <div className="text-sm opacity-80">Forever</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› 10 AI queries/day</li>
                <li>› Basic charts</li>
                <li>› Market news</li>
              </ul>
              <a href="#" className="btn-ghost mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Start Free</a>
            </div>
            <div className="brutal-card p-6 flex flex-col border-brutal-red" style={{borderColor:'#FF2D2D'}}>
              <div className="font-mono text-xs uppercase text-brutal-red">Pro</div>
              <div className="mt-3 text-5xl font-extrabold">$49</div>
              <div className="text-sm opacity-80">per month</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› Unlimited AI queries</li>
                <li>› All 5 AI agents</li>
                <li>› Advanced charts</li>
                <li>› Real-time data</li>
              </ul>
              <a href="#" className="btn-brutal mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Go Pro</a>
            </div>
            <div className="brutal-card p-6 flex flex-col">
              <div className="font-mono text-xs uppercase text-brutal-red">Enterprise</div>
              <div className="mt-3 text-5xl font-extrabold">$199</div>
              <div className="text-sm opacity-80">per month</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› API access</li>
                <li>› Custom models</li>
                <li>› Priority support</li>
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
            <div className="text-5xl md:text-7xl font-extrabold leading-none">Trade Smarter</div>
            <div className="mt-3 text-xl uppercase font-mono tracking-widest underline-red inline-block">AI-Powered Financial Intelligence</div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a href="#demo" className="btn-brutal px-8 py-4 font-mono text-xs uppercase">Launch Assistant</a>
              <a href="#features" className="btn-ghost px-8 py-4 font-mono text-xs uppercase">See How It Works</a>
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
              <p className="mt-3 text-sm opacity-80 max-w-xs">Professional trading intelligence. We don't predict markets—we analyze them.</p>
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
              <div className="font-mono text-xs uppercase text-brutal-red">Company</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-brutal-red" href="#">About</a></li>
                <li><a className="hover:text-brutal-red" href="#">Blog</a></li>
                <li><a className="hover:text-brutal-red" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-xs uppercase text-brutal-red">Legal</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-brutal-red" href="#">Privacy</a></li>
                <li><a className="hover:text-brutal-red" href="#">Terms</a></li>
                <li><a className="hover:text-brutal-red" href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t-4 border-brutal-line pt-4 text-xs font-mono uppercase flex flex-col sm:flex-row justify-between gap-3">
            <span>© <span id="year"></span> FinAgent</span>
            <span>Built with Neo‑Brutalist precision</span>
          </div>
        </div>
      </footer>
    </div>
  )
}