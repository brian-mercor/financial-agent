import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
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
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl" aria-hidden="true"
                 style={{background: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04))',
                         boxShadow: 'inset 0 0 0 1px rgba(255, 211, 110, .4), 0 8px 20px rgba(0,0,0,.45)'}}>
              <DollarSign className="absolute inset-0 w-full h-full p-2 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl tracking-tight font-extrabold gold-text">FinAgent</div>
              <p className="text-xs sm:text-sm text-purple-100/80">Your AI Financial Genius Bar</p>
            </div>
          </Link>

          <Link to="/signup" className="btn-ghost rounded-lg px-3 py-2 text-sm">
            Don't have an account?
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Login Form */}
          <div className="tarot-panel p-6 sm:p-8 relative">
            <span aria-hidden="true" className="corner tl"></span>
            <span aria-hidden="true" className="corner tr"></span>
            <span aria-hidden="true" className="corner bl"></span>
            <span aria-hidden="true" className="corner br"></span>

            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-purple-100/80">Sign in to access your AI financial assistants</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-100/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full px-4 py-3 pl-11 text-white"
                    placeholder="you@example.com"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-100/60" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-100/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full px-4 py-3 pl-11 text-white"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-100/60" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-purple-100/80">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-yellow-400/80 hover:text-yellow-400">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3 rounded-xl text-base font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 12h14m-7-7l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-purple-100/70">
                New to FinAgent?{' '}
                <Link to="/signup" className="text-yellow-400/80 hover:text-yellow-400 font-medium">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-8 p-4 rounded-lg border border-yellow-200/20 bg-white/5">
              <p className="text-xs text-purple-100/70 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-sm text-purple-100/90">
                <p>Email: demo@finagent.ai</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </div>

          {/* Right: Feature showcase */}
          <div className="space-y-6">
            <div className="tarot-panel p-6 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <h2 className="text-xl font-semibold mb-4">What Awaits You Inside</h2>

              <div className="space-y-4">
                <div className="guide-card p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Real-Time Market Analysis</h3>
                      <p className="text-sm text-purple-100/70">
                        Get instant technical analysis and market insights powered by GPT-4 and real-time data feeds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="guide-card p-4">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">6 Specialized AI Assistants</h3>
                      <p className="text-sm text-purple-100/70">
                        From Market Analyst to Risk Manager, each AI expert provides domain-specific insights.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="guide-card p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Portfolio Management</h3>
                      <p className="text-sm text-purple-100/70">
                        Connect your brokerage via Plaid and get AI-powered portfolio optimization suggestions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="tarot-panel p-6 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="flex items-start gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="#F2B807">
                    <path d="M10 .5a1 1 0 0 1 .894.553l2.381 4.762 5.258.764a1 1 0 0 1 .554 1.704l-3.8 3.702.897 5.231a1 1 0 0 1-1.451 1.054L10 15.347l-4.683 2.463a1 1 0 0 1-1.451-1.054l.897-5.231-3.8-3.702a1 1 0 0 1 .554-1.704l5.258-.764L9.106 1.053A1 1 0 0 1 10 .5z"/>
                  </svg>
                ))}
              </div>

              <blockquote className="text-purple-100/90 italic mb-3">
                "FinAgent transformed my trading. The AI assistants feel like having a team of Wall Street experts available 24/7."
              </blockquote>

              <p className="text-sm text-purple-100/70">— Sarah Chen, Day Trader</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}