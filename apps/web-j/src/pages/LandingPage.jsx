import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { ArrowRight, HelpCircle, TrendingUp, AlertCircle, Copy, Shuffle, Sparkles } from 'lucide-react'

function LandingPage() {
  const canvasRef = useRef(null)
  const [activeMode, setActiveMode] = useState('socratic')
  const [intensity, setIntensity] = useState(3)
  const [inputText, setInputText] = useState('')
  const [results, setResults] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Copied to clipboard')

  // Initialize ink canvas effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      canvas.width = Math.floor(canvas.clientWidth * DPR)
      canvas.height = Math.floor(canvas.clientHeight * DPR)
      draw()
    }

    const strokes = []

    function addStroke() {
      const w = canvas.width, h = canvas.height
      const y = h * (0.35 + Math.random() * 0.4)
      const amp = h * (0.02 + Math.random() * 0.04)
      const len = w * (0.7 + Math.random() * 0.4)
      const x0 = -w * 0.2
      const x1 = x0 + len
      const thickness = (10 + Math.random() * 20) * DPR
      const roughness = 0.002 + Math.random() * 0.004
      strokes.push({
        x0, y, x1, amp, thickness, roughness,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.06 + Math.random() * 0.05
      })
    }

    function draw() {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.015)'
      ctx.fillRect(0, 0, w, h)

      strokes.forEach((s, i) => {
        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = i % 2 ? '#c2a563' : '#8a7444'
        ctx.beginPath()

        const steps = 140
        let prevX = s.x0, prevY = s.y
        for (let k = 0; k <= steps; k++) {
          const t = k / steps
          const x = s.x0 + (s.x1 - s.x0) * t
          const y = s.y + Math.sin(t * Math.PI + s.phase) * s.amp + (Math.random() - 0.5) * s.amp * 0.07
          if (k === 0) ctx.moveTo(x, y)
          else ctx.quadraticCurveTo(prevX, prevY, x, y)
          prevX = x; prevY = y
        }
        ctx.lineWidth = s.thickness
        ctx.stroke()

        // Dry brush effect
        const grains = 40
        for (let g = 0; g < grains; g++) {
          ctx.beginPath()
          ctx.globalAlpha = s.alpha * (0.25 + Math.random() * 0.35)
          ctx.strokeStyle = i % 2 ? '#d2b26d' : '#9d8652'
          ctx.lineWidth = s.thickness * (0.15 + Math.random() * 0.25)
          const t0 = Math.random() * 0.8
          const t1 = t0 + 0.1 + Math.random() * 0.2
          const xA = s.x0 + (s.x1 - s.x0) * t0
          const yA = s.y + Math.sin(t0 * Math.PI + s.phase) * s.amp + (Math.random() - 0.5) * s.amp * 0.1
          const xB = s.x0 + (s.x1 - s.x0) * t1
          const yB = s.y + Math.sin(t1 * Math.PI + s.phase) * s.amp + (Math.random() - 0.5) * s.amp * 0.1
          ctx.moveTo(xA, yA)
          ctx.lineTo(xB, yB)
          ctx.stroke()
        }
        ctx.restore()
      })
    }

    function rebuild() {
      strokes.length = 0
      for (let i = 0; i < 3; i++) addStroke()
      draw()
    }

    window.addEventListener('resize', resize, { passive: true })
    resize()
    rebuild()

    return () => window.removeEventListener('resize', resize)
  }, [])

  // Ticker data
  const tickerSymbols = [
    { t: "AAPL", name: "Apple", p: 195.11, d: 1 },
    { t: "NVDA", name: "NVIDIA", p: 888.20, d: -1 },
    { t: "MSFT", name: "Microsoft", p: 467.54, d: 1 },
    { t: "GOOGL", name: "Google", p: 173.90, d: -1 },
    { t: "AMZN", name: "Amazon", p: 181.02, d: 1 },
    { t: "TSLA", name: "Tesla", p: 233.33, d: 1 },
    { t: "META", name: "Meta", p: 514.08, d: 1 },
    { t: "BTC", name: "Bitcoin", p: 94776, d: -1 },
    { t: "ETH", name: "Ethereum", p: 3110, d: 1 },
    { t: "SPY", name: "S&P 500", p: 577.77, d: 1 },
    { t: "QQQ", name: "NASDAQ", p: 419.84, d: -1 },
    { t: "DIA", name: "Dow Jones", p: 458.66, d: 1 },
    { t: "GLD", name: "Gold", p: 261.42, d: -1 }
  ]

  function buildTickerHTML(offset = 0) {
    const items = []
    for (let i = 0; i < 24; i++) {
      const n = (i + offset) % tickerSymbols.length
      const s = tickerSymbols[n]
      const chg = ((Math.random() * 2 - 1) * 2).toFixed(2)
      const cls = Math.random() > .5 ? 'text-[#a7e685]' : 'text-[#ff9c9c]'
      const arrow = cls === 'text-[#a7e685]' ? '▲' : '▼'
      const price = (s.p + Math.random() * 3 - 1.5).toFixed(2)
      items.push(
        `<span class="inline-flex gap-2 items-center mr-9 px-2.5 py-1 rounded-[10px] bg-[rgba(210,178,109,.06)] border border-[rgba(210,178,109,.16)]">
          <span>${s.t}</span>
          <span class="text-[rgba(255,255,255,.3)]">•</span>
          <span>$${price}</span>
          <span class="${cls}">${arrow}${Math.abs(chg)}%</span>
        </span>`
      )
    }
    return items.join('') + items.join('')
  }

  // Generate questions based on input
  function generateQuestions() {
    if (!inputText.trim()) {
      setResults([{
        tag: 'Hint',
        question: 'Enter an investment thesis or market analysis to begin.'
      }])
      return
    }

    const questions = []
    const sentences = inputText.match(/[^.!?]+[.!?]?/g) || []
    
    sentences.slice(0, 3).forEach(sentence => {
      if (activeMode === 'socratic') {
        questions.push(
          { tag: 'Define', question: `What specific metrics support this investment thesis?` },
          { tag: 'Risk Analysis', question: `What are the primary risks that could invalidate this position?` },
          { tag: 'Evidence', question: `What historical data or market indicators validate this approach?` },
          { tag: 'Time Horizon', question: `Over what timeframe is this strategy expected to perform?` },
          { tag: 'Alternatives', question: `What alternative investment strategies might outperform this one?` }
        )
      } else if (activeMode === 'devil') {
        questions.push(
          { tag: 'Counterargument', question: `What market conditions would cause this strategy to fail?` },
          { tag: 'Black Swan', question: `What unexpected event could completely invalidate this thesis?` },
          { tag: 'Competition', question: `How might competitors or market dynamics erode this advantage?` },
          { tag: 'Valuation', question: `Why might the current valuation already price in these expectations?` }
        )
      } else if (activeMode === 'steelman') {
        questions.push(
          { tag: 'Best Case', question: `Under optimal conditions, what returns could this generate?` },
          { tag: 'Catalysts', question: `What upcoming events could accelerate this investment thesis?` },
          { tag: 'Moat', question: `What sustainable competitive advantages support this position?` },
          { tag: 'Validation', question: `Which successful investors have taken similar positions?` }
        )
      }
    })

    setResults(questions.slice(0, Math.min(12, questions.length)))
  }

  function showToastMessage(msg) {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1500)
  }

  function copyQuestion(question) {
    navigator.clipboard.writeText(question)
    showToastMessage('Question copied')
  }

  function copyAllQuestions() {
    const allQuestions = results.map(r => '- ' + r.question).join('\n')
    if (!allQuestions) {
      showToastMessage('Nothing to copy')
      return
    }
    navigator.clipboard.writeText(allQuestions)
    showToastMessage('All questions copied')
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden min-h-[88vh] grid place-items-center border-b border-white/[0.06]"
               style={{
                 background: `radial-gradient(1200px 700px at 10% 20%, rgba(210,178,109,.10), transparent 70%),
                            radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,.06), transparent 60%),
                            radial-gradient(800px 400px at 80% 80%, rgba(255,255,255,.04), transparent 60%),
                            linear-gradient(180deg, #0a0b0c 0%, #0a0b0c 100%)`
               }}>
        
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-65 mix-blend-overlay pointer-events-none" />
        
        {/* Grid lines effect */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(to right, rgba(255,255,255,.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,.03) 1px, transparent 1px)`,
               backgroundSize: '80px 80px',
               maskImage: 'radial-gradient(70% 60% at 50% 40%, rgba(0,0,0,1), rgba(0,0,0,0))'
             }} />

        {/* Brush stroke SVG */}
        <svg className="absolute inset-auto auto 5% -5% w-full max-w-[1200px] h-auto z-[2] opacity-[0.16] contrast-[110%] brightness-95 -rotate-2"
             viewBox="0 0 1200 420" aria-hidden="true">
          <defs>
            <filter id="inkify" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="f1"/>
              <feColorMatrix type="saturate" values="0.2"/>
              <feDisplacementMap in="SourceGraphic" in2="f1" scale="6" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#c8b07a"/>
              <stop offset="1" stopColor="#68542e"/>
            </linearGradient>
          </defs>
          <path d="M60 260C220 150 370 130 540 200C720 274 860 210 1150 140"
                stroke="url(#strokeGrad)" strokeOpacity=".65" filter="url(#inkify)"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="42" fill="none"/>
          <path d="M40 306C260 196 420 180 620 246C820 310 960 250 1180 188"
                stroke="#c2a563" strokeOpacity=".3" filter="url(#inkify)"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" fill="none"/>
          <path d="M80 320C200 260 360 260 520 300C660 336 820 328 1000 280"
                stroke="#9a834d" strokeOpacity=".25" filter="url(#inkify)"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" fill="none"/>
        </svg>

        <div className="relative z-[3] py-20 px-6 max-w-[1200px] mx-auto">
          <span className="inline-flex items-center gap-2.5 bg-[rgba(210,178,109,.08)] border border-[rgba(210,178,109,.25)] text-[#e8d7a1] px-3 py-2 rounded-full text-[0.85rem] tracking-[0.08em] uppercase shadow-[inset_0_0_14px_rgba(210,178,109,.12)]">
            Active Investing • AI-Powered Analysis
          </span>

          <h1 className="font-cormorant font-semibold leading-[1.1] tracking-wider text-[clamp(2rem,4.2vw+0.8rem,4.1rem)] mt-[18px] mb-[14px] text-balance drop-shadow-[0_10px_40px_rgba(0,0,0,.45)]">
            The End of Passive Investing: Engage, Question, and Challenge Every Trade
          </h1>

          <p className="text-muted max-w-[790px] text-[clamp(1rem,1.1vw+0.8rem,1.25rem)]">
            FinAgent transforms passive portfolio watching into active wealth building. Build strategies with AI that interrogates assumptions, analyzes markets, and pressure-tests every investment decision until alpha emerges.
          </p>

          <div className="flex flex-wrap gap-3.5 mt-[26px]">
            <Link to="/login" className="inline-flex items-center gap-2.5 px-[18px] py-3.5 rounded-[14px] font-semibold transition-all duration-150 gradient-gold text-[#101113] shadow-[0_18px_40px_rgba(210,178,109,.20),inset_0_1px_0_rgba(255,255,255,.55)] hover:translate-y-[-1px] hover:brightness-[1.06]">
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
              Start Trading
            </Link>
            <Link to="#how" className="inline-flex items-center gap-2.5 px-[18px] py-3.5 rounded-[14px] font-semibold transition-all duration-150 bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.10)] text-text hover:translate-y-[-1px] hover:bg-[rgba(255,255,255,.08)]">
              <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
              How it Works
            </Link>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute inset-auto inset-x-0 bottom-0 z-[4] pointer-events-none grid gap-1.5 pb-2.5">
          {[0, 4, 8].map((offset, i) => (
            <div key={i} className="relative overflow-hidden h-7 opacity-75" style={{
              maskImage: 'linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)'
            }}>
              <div className="absolute whitespace-nowrap animate-scroll-x font-mono text-[0.92rem] tracking-[0.04em] text-[#d8c38a] drop-shadow-[0_0_6px_rgba(210,178,109,.18)]"
                   style={{ animationDuration: `${28 + i * 8}s`, opacity: 0.85 - i * 0.15 }}
                   dangerouslySetInnerHTML={{ __html: buildTickerHTML(offset) }} />
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-[72px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-cormorant font-semibold text-[clamp(1.6rem,1.6vw+1rem,2.2rem)] mb-3">
            From Passive Watching to Active Wealth Building
          </h2>
          <p className="text-muted mb-7 max-w-[840px]">
            Every trade hides assumptions, risks, and opportunities. FinAgent surfaces them. Practice active investing, cultivate strategic thinking, and convert market noise into profitable signals.
          </p>

          <div className="grid grid-cols-12 gap-[18px]">
            {[
              { title: 'Analyze Markets', desc: 'Skip the noise, focus on signals. Identify trends, locate opportunities, and spot where consensus misses the mark.' },
              { title: 'Question Strategies', desc: 'Test assumptions, validate theses, and seek edge. Ask what must be true—or false—for positions to profit.' },
              { title: 'Challenge Positions', desc: 'Stress-test and refine. Generate alternatives and hedges. Build conviction that survives volatility.' }
            ].map((card, i) => (
              <article key={i} className="col-span-12 md:col-span-6 lg:col-span-4 glass-card rounded-[16px] p-[22px] card-shadow transition-all duration-200 hover:translate-y-[-2px] hover:bg-gradient-to-b hover:from-[rgba(255,255,255,.08)] hover:to-[rgba(255,255,255,.04)] hover:border-[rgba(255,255,255,.14)]">
                <h3 className="font-cormorant font-semibold mb-2">{card.title}</h3>
                <p className="text-muted">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engine Section */}
      <section id="socratic" className="py-[72px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-cormorant font-semibold text-[clamp(1.6rem,1.6vw+1rem,2.2rem)] mb-3">
            AI Trading Engine
          </h2>
          <p className="text-muted mb-7 max-w-[840px]">
            Paste your investment thesis. Choose your analysis mode. Generate insights that turn market analysis into profitable trades.
          </p>

          <div className="grid grid-cols-12 gap-[18px] items-start">
            {/* Input Panel */}
            <div className="col-span-12 lg:col-span-6 glass-card rounded-[16px] p-[18px] card-shadow">
              <h4 className="font-cormorant mt-1.5 mb-3">1. Provide investment thesis</h4>
              <textarea
                className="textarea-dark"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste an investment thesis here (e.g., 'Tech stocks will outperform in 2025 because AI adoption is accelerating...')"
              />

              <div className="flex flex-wrap gap-3 items-center mt-3.5">
                <span className="text-dim">Mode:</span>
                {['socratic', 'devil', 'steelman'].map(mode => (
                  <button
                    key={mode}
                    className="chip-button"
                    data-active={activeMode === mode}
                    onClick={() => setActiveMode(mode)}
                  >
                    {mode === 'socratic' ? 'Analytical' : mode === 'devil' ? "Devil's Advocate" : 'Bull Case'}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 items-center mt-3">
                <span className="text-dim">Depth:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="appearance-none w-[180px] h-1.5 rounded-full bg-white/10 outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:gradient-gold [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#151515] [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(210,178,109,.5)]"
                />
                <span className="text-muted font-semibold">{intensity}</span>
              </div>

              <div className="flex gap-2.5 mt-3">
                <button onClick={generateQuestions} className="inline-flex items-center gap-2.5 gradient-gold text-[#111] px-[18px] py-3.5 rounded-[14px] font-semibold transition-all duration-150 shadow-[0_10px_22px_rgba(210,178,109,.18),inset_0_1px_0_rgba(255,255,255,.4)] hover:translate-y-[-1px] hover:brightness-[1.06] active:translate-y-0">
                  <Sparkles className="w-[18px] h-[18px]" strokeWidth={2} />
                  Generate Analysis
                </button>
                <button onClick={() => { setInputText(''); setResults([]) }} className="btn-ghost">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M6 6l1.5 12h9L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Clear
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="col-span-12 lg:col-span-6 glass-card rounded-[16px] p-[18px] card-shadow">
              <h4 className="font-cormorant mt-1.5 mb-3">2. Analysis Results</h4>
              
              <div className="grid gap-2.5 mt-2 max-h-[420px] overflow-auto pr-1.5">
                {results.length === 0 ? (
                  <div className="bg-white/[0.06] border border-white/[0.09] rounded-[14px] p-3 grid gap-1.5">
                    <div className="font-mono text-xs text-gold opacity-95 tracking-[0.06em] uppercase">Hint</div>
                    <div className="font-semibold">Enter an investment thesis to generate AI-powered analysis</div>
                  </div>
                ) : (
                  results.map((result, i) => (
                    <div key={i} className="bg-white/[0.06] border border-white/[0.09] rounded-[14px] p-3 grid gap-1.5">
                      <div className="font-mono text-xs text-gold opacity-95 tracking-[0.06em] uppercase">{result.tag}</div>
                      <div className="font-semibold">{result.question}</div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => copyQuestion(result.question)}
                          className="px-2.5 py-1.5 rounded-full border border-white/[0.12] bg-black/25 text-text text-[0.85rem] cursor-pointer hover:bg-black/40"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setInputText(prev => (prev.trim() + '\n' + result.question).trim())}
                          className="px-2.5 py-1.5 rounded-full border border-white/[0.12] bg-black/25 text-text text-[0.85rem] cursor-pointer hover:bg-black/40"
                        >
                          Append to input
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2.5 mt-3">
                <button onClick={copyAllQuestions} className="btn-ghost">
                  <Copy className="w-[18px] h-[18px]" strokeWidth={2} />
                  Copy All
                </button>
                <button onClick={generateQuestions} className="btn-ghost">
                  <Shuffle className="w-[18px] h-[18px]" strokeWidth={2} />
                  Shuffle
                </button>
              </div>
            </div>
          </div>

          <div className="text-dim text-sm mt-3">
            <span>Keywords: active investing, AI trading, portfolio analysis, market intelligence, strategic trading, risk management.</span>
          </div>
        </div>
      </section>

      {/* Interactive Reader Section */}
      <section id="reader" className="py-[72px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="glass-card rounded-[16px] p-[18px] card-shadow">
            <h2 className="font-cormorant font-semibold text-[clamp(1.6rem,1.6vw+1rem,2.2rem)] mb-3">
              Highlight to Analyze
            </h2>
            <p className="text-muted mb-7 max-w-[840px]">
              Select text to surface trading insights. The goal isn't consensus—it's alpha.
            </p>

            <div className="bg-black/[0.28] border border-white/10 rounded-[14px] p-4 leading-[1.8] text-muted relative cursor-text">
              In an age of infinite market data, passive investing masquerades as wisdom. We confuse index tracking with strategy and diversification with risk management. But alpha grows where analysis begins—at the moment we ask what drives price, what creates inefficiency, and what could overturn consensus. The disciplined trader builds a thesis with data: they identify catalysts, isolate risks, test correlations, and seek asymmetric opportunities. This is not contrarianism for its own sake; it is strategic positioning in practice.
            </div>

            <div className="text-dim text-sm mt-3">
              <span>Tip: highlight a sentence and analyze it. Use the insights to refine your trading strategy or guide research.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between gap-3.5 flex-wrap">
            <div className="flex items-center gap-3 opacity-90">
              <div className="brand-mark">
                <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] opacity-95">
                  <path d="M4 16.5C7.5 14 11.5 9.5 13.5 6.5M10 19c2.5-2.2 5.8-6.2 8-11"
                        stroke="url(#g1b)" strokeWidth="2.2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="g1b" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0" stopColor="#d2b26d"/>
                      <stop offset="1" stopColor="#b2914d"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-semibold">FinAgent</span>
            </div>
            <span className="text-dim">© {new Date().getFullYear()} FinAgent. Trade actively. Think strategically.</span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <div className={`fixed left-1/2 -translate-x-1/2 bottom-[26px] z-50 bg-[rgba(210,178,109,.95)] text-[#171717] px-3.5 py-2.5 rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,.4)] transition-all duration-[250ms] ${
        showToast ? 'opacity-100 -translate-y-1.5' : 'opacity-0 pointer-events-none'
      }`}>
        {toastMessage}
      </div>
    </div>
  )
}

export default LandingPage