import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function IChatBookLanding() {
  const [consoleText, setConsoleText] = useState('> Ask me anything. Try: "Derivative of x^2 sin x" or "Explain mitosis like I\'m 12".\n')
  const [prompt, setPrompt] = useState('')
  const [timer, setTimer] = useState('00:00')
  const [seconds, setSeconds] = useState(0)
  const [timerId, setTimerId] = useState(null)
  const [demoLog, setDemoLog] = useState('Press Start. Solve the prompt. Get graded instantly.')

  useEffect(() => {
    // Set current year
    const yearEl = document.getElementById('year')
    if (yearEl) yearEl.textContent = new Date().getFullYear()
  }, [])

  const mockTutor = (q) => {
    if (/derivative|dx|differentiate/i.test(q)) {
      return [
        'AI: Power rule + product rule.',
        'd/dx[x^2 sin x] = 2x sin x + x^2 cos x',
        'Steps: (x^2)\' sin x + x^2 (sin x)\'',
        'Next: try integrate cos x · x^2 (by parts).'
      ]
    }
    if (/mitosis|cell/i.test(q)) {
      return [
        'AI: Think of copy → line up → split → separate.',
        'Phases: Prophase, Metaphase, Anaphase, Telophase (+Cytokinesis).',
        'Outcome: two identical cells for growth/repair.'
      ]
    }
    if (/redox|balance/i.test(q)) {
      return [
        'AI: Split into oxidation and reduction half-reactions.',
        'Balance atoms → O with H2O → H with H+ → charge with e− → combine.',
        'Check atoms and charge at the end.'
      ]
    }
    return [
      'AI: Breaking it down…',
      '1) Define the core terms.',
      '2) Identify relationships and rules.',
      '3) Apply with a concrete example.',
      '4) Summarize and set a next drill.'
    ]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const newText = consoleText + '> ' + prompt + '\n'
    setConsoleText(newText)

    const reply = mockTutor(prompt)
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
    setDemoLog('Prompt: Solve for x in 2x + 5 = 17. Type your steps on paper. Click Grade when done.')

    const id = setInterval(() => {
      setSeconds(s => {
        const newSeconds = s + 1
        setTimer(formatTime(newSeconds))
        return newSeconds
      })
    }, 1000)
    setTimerId(id)
  }

  const gradeNow = () => {
    if (!timerId) {
      setDemoLog(prev => prev + '\nStart a session first.')
      return
    }
    clearInterval(timerId)
    setTimerId(null)

    const score = Math.max(50, 100 - Math.floor(seconds / 2))
    const feedback = score > 85 ? 'Precision. Proceed to harder problems.' :
                     score > 70 ? 'Solid. Review step isolation.' :
                     'Gaps found. Revisit inverse operations.'
    setDemoLog(prev => prev + `\nGrade: ${score}/100 — ${feedback}`)
  }

  const resetSession = () => {
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }
    setSeconds(0)
    setTimer('00:00')
    setDemoLog('Press Start. Solve the prompt. Get graded instantly.')
  }

  return (
    <div className="min-h-screen bg-brutal-bg text-brutal-fg font-grotesk">
      {/* Top Ticker */}
      <div className="w-full overflow-hidden border-b-4 border-brutal-line bg-brutal-ink scanline">
        <div className="flex whitespace-nowrap animate-[ticker_24s_linear_infinite]">
          <div className="flex gap-12 py-3 text-xs md:text-sm font-mono uppercase tracking-widest">
            <span className="px-6">Realtime Analytics</span>
            <span className="px-6">Adaptive Learning Paths</span>
            <span className="px-6 text-brutal-red">CRUSH COMPLEXITY</span>
            <span className="px-6">Precision Feedback</span>
            <span className="px-6">Master Any Subject</span>
            <span className="px-6">iChatBook AI Tutor</span>
            <span className="px-6">Realtime Analytics</span>
            <span className="px-6">Adaptive Learning Paths</span>
            <span className="px-6 text-brutal-red">CRUSH COMPLEXITY</span>
            <span className="px-6">Precision Feedback</span>
            <span className="px-6">Master Any Subject</span>
            <span className="px-6">iChatBook AI Tutor</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brutal-bg/90 backdrop-blur border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 brutal-card grid place-items-center">
              <span className="font-mono font-bold text-brutal-red">AI</span>
            </div>
            <span className="font-extrabold tracking-tight text-lg md:text-xl">iChatBook</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
            <a href="#features" className="hover:text-brutal-red">Features</a>
            <a href="#analytics" className="hover:text-brutal-red">Analytics</a>
            <a href="#demo" className="hover:text-brutal-red">Demo</a>
            <a href="#pricing" className="hover:text-brutal-red">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost px-4 py-2 font-mono text-xs uppercase hidden sm:inline-block">Sign In</Link>
            <a href="#demo" className="btn-brutal px-4 py-2 font-mono text-xs uppercase">Try Tutor</a>
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
                  <span className="block">CRUSH</span>
                  <span className="block stroke-text">COMPLEXITY</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl">
                  Transform struggle into power. iChatBook's AI Tutor is a monolithic force that breaks down barriers, delivers precision feedback, and adapts in real time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a href="#demo" className="btn-brutal px-6 py-4 font-mono text-sm uppercase">Start Free Session</a>
                  <a href="#features" className="btn-ghost px-6 py-4 font-mono text-sm uppercase">Explore Features</a>
                </div>
                <div className="flex gap-6 pt-4">
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">98.7%</div>
                    Mastery Acceleration
                  </div>
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">12.3M</div>
                    Problems Solved
                  </div>
                  <div className="text-xs font-mono uppercase">
                    <div className="text-brutal-red">Real-time</div>
                    Adaptive Feedback
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Console */}
            <div className="lg:col-span-5">
              <div className="brutal-card concrete p-5 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>AI Tutor Console</span>
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
                    placeholder="Type a question…"
                  />
                  <button className="btn-brutal px-4 py-3 font-mono text-xs uppercase" type="submit">Engage</button>
                </form>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <button
                    className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red"
                    onClick={() => setPrompt('Explain the Chain Rule in one paragraph with an example.')}
                  >
                    Chain Rule
                  </button>
                  <button
                    className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red"
                    onClick={() => setPrompt('Summarize World War II causes in 5 bullets.')}
                  >
                    History
                  </button>
                  <button
                    className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 text-xs font-mono hover:border-brutal-red"
                    onClick={() => setPrompt('Walk me through balancing a redox reaction step-by-step.')}
                  >
                    Chemistry
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
                <h3 className="text-2xl font-extrabold">Adaptive Paths</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Dynamic</span>
              </div>
              <p className="mt-3 text-sm">Personalized learning tracks that reshape after every answer. mastery > monotony.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Real-time difficulty tuning</li>
                <li>› Targeted micro-lessons</li>
                <li>› Concept map progression</li>
              </ul>
            </div>
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">Precision Feedback</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Exact</span>
              </div>
              <p className="mt-3 text-sm">Explain, don't obscure. Receive surgical breakdowns with concrete next steps.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Stepwise hints</li>
                <li>› Misconception detection</li>
                <li>› Mastery checkpoints</li>
              </ul>
            </div>
            <div className="brutal-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold">Monolithic Focus</h3>
                <span className="font-mono text-xs text-brutal-red uppercase">Relentless</span>
              </div>
              <p className="mt-3 text-sm">Minimal UI. Maximum momentum. No distractions, only progress.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Distraction-free session</li>
                <li>› Keyboard-first controls</li>
                <li>› Offline-first cache</li>
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
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Realtime Analytics</h2>
              <p className="text-sm md:text-base">Concrete results, zero fluff. Monitor velocity, retention, and mastery in a single brutal panel.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="brutal-card p-4">
                  <div className="text-xs font-mono uppercase text-brutal-red">Velocity</div>
                  <div className="mt-2 text-3xl font-extrabold">+42%</div>
                  <div className="mt-3 h-10 bg-brutal-ink border-2 border-brutal-line"></div>
                </div>
                <div className="brutal-card p-4">
                  <div className="text-xs font-mono uppercase text-brutal-red">Retention</div>
                  <div className="mt-2 text-3xl font-extrabold">91%</div>
                  <div className="mt-3 h-10 bg-brutal-ink border-2 border-brutal-line"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="brutal-card p-5 h-full">
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>Adaptive Mastery Map</span>
                  <span className="text-brutal-red">Live Sync</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Algebra</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '78%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">78% mastery</div>
                  </div>
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Biology</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '64%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">64% mastery</div>
                  </div>
                  <div className="bg-brutal-bg border-2 border-brutal-line p-4">
                    <div className="text-sm font-bold">Chemistry</div>
                    <div className="mt-3 h-2 bg-brutal-ink relative">
                      <div className="h-full bg-brutal-red" style={{width: '86%'}}></div>
                    </div>
                    <div className="mt-2 text-xs font-mono">86% mastery</div>
                  </div>
                </div>
                <div className="mt-5 bg-brutal-bg border-2 border-brutal-line p-4">
                  <div className="w-full h-56 bg-brutal-ink border-2 border-brutal-line flex items-center justify-center">
                    <span className="font-mono text-xs text-gray-500 uppercase">Chart Visualization Disabled</span>
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
              <h3 className="text-3xl font-extrabold">Master Any Subject</h3>
              <p className="mt-3 text-sm max-w-lg">From calculus to classics, the tutor adapts to your pace and precision. Build unstoppable momentum with focused sessions and measurable gains.</p>
              <ul className="mt-5 space-y-2 text-sm font-mono">
                <li>› Context-aware explanations</li>
                <li>› Instant practice generation</li>
                <li>› Memory-optimized scheduling</li>
              </ul>
              <div className="mt-auto pt-6">
                <a href="#pricing" className="btn-brutal px-6 py-3 font-mono text-xs uppercase">View Pricing</a>
              </div>
            </div>
            <div className="brutal-card p-6 concrete">
              <div className="flex items-center justify-between font-mono text-xs uppercase">
                <span>Session Timer</span>
                <span className="text-brutal-red">{timer}</span>
              </div>
              <div className="mt-4 bg-brutal-bg border-2 border-brutal-line p-4 h-56 overflow-auto font-mono text-sm whitespace-pre-wrap">
                {demoLog}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button onClick={startSession} className="btn-brutal px-3 py-2 font-mono text-xs uppercase col-span-1">Start</button>
                <button onClick={gradeNow} className="btn-ghost px-3 py-2 font-mono text-xs uppercase col-span-1">Grade</button>
                <button onClick={resetSession} className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red col-span-1">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Uncompromising Plans</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="brutal-card p-6 flex flex-col">
              <div className="font-mono text-xs uppercase text-brutal-red">Starter</div>
              <div className="mt-3 text-5xl font-extrabold">$0</div>
              <div className="text-sm opacity-80">Always</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› 20 questions/day</li>
                <li>› Core subjects</li>
                <li>› Basic analytics</li>
              </ul>
              <a href="#" className="btn-ghost mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Begin Now</a>
            </div>
            <div className="brutal-card p-6 flex flex-col border-brutal-red" style={{borderColor:'#FF2D2D'}}>
              <div className="font-mono text-xs uppercase text-brutal-red">Pro</div>
              <div className="mt-3 text-5xl font-extrabold">$19</div>
              <div className="text-sm opacity-80">per month</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› Unlimited questions</li>
                <li>› All subjects</li>
                <li>› Advanced analytics</li>
                <li>› Priority support</li>
              </ul>
              <a href="#" className="btn-brutal mt-6 px-5 py-3 font-mono text-xs uppercase text-center">Upgrade</a>
            </div>
            <div className="brutal-card p-6 flex flex-col">
              <div className="font-mono text-xs uppercase text-brutal-red">Teams</div>
              <div className="mt-3 text-5xl font-extrabold">$49</div>
              <div className="text-sm opacity-80">per month</div>
              <ul className="mt-6 space-y-2 text-sm font-mono">
                <li>› Classroom dashboards</li>
                <li>› Cohort insights</li>
                <li>› LMS integrations</li>
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
            <div className="text-5xl md:text-7xl font-extrabold leading-none">Master Any Subject</div>
            <div className="mt-3 text-xl uppercase font-mono tracking-widest underline-red inline-block">Turn effort into outcome</div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a href="#demo" className="btn-brutal px-8 py-4 font-mono text-xs uppercase">Launch Tutor</a>
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
                  <span className="font-mono font-bold text-brutal-red">AI</span>
                </div>
                <span className="font-extrabold">iChatBook</span>
              </div>
              <p className="mt-3 text-sm opacity-80 max-w-xs">Education with teeth. We don't decorate knowledge—we break it open.</p>
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
            <span>© <span id="year"></span> iChatBook</span>
            <span>Built in a Neo‑Brutalist forge</span>
          </div>
        </div>
      </footer>
    </div>
  )
}