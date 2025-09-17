import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, DollarSign, TrendingUp, Shield } from 'lucide-react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await signUp(name, email, password)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to create account. Please try again.')
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

          <Link to="/login" className="btn-ghost rounded-lg px-3 py-2 text-sm">
            Already have an account?
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Signup Form */}
          <div className="tarot-panel p-6 sm:p-8 relative">
            <span aria-hidden="true" className="corner tl"></span>
            <span aria-hidden="true" className="corner tr"></span>
            <span aria-hidden="true" className="corner bl"></span>
            <span aria-hidden="true" className="corner br"></span>

            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Start Your Journey</h1>
              <p className="text-purple-100/80">Join thousands using AI to make smarter investments</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-100/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full px-4 py-3 pl-11 text-white"
                    placeholder="John Doe"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-100/60" />
                </div>
              </div>

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

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-purple-100/80 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input w-full px-4 py-3 pl-11 text-white"
                    placeholder="••••••••"
                    required
                  />
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-100/60" />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded" required />
                <label className="text-sm text-purple-100/80">
                  I agree to the{' '}
                  <button type="button" className="text-yellow-400/80 hover:text-yellow-400">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-yellow-400/80 hover:text-yellow-400">
                    Privacy Policy
                  </button>
                </label>
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
                    Create Account
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 12h14m-7-7l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-purple-100/70">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-400/80 hover:text-yellow-400 font-medium">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          {/* Right: Benefits */}
          <div className="space-y-6">
            <div className="tarot-panel p-6 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <h2 className="text-xl font-semibold mb-4 gold-text">Free Trial Includes</h2>

              <div className="space-y-3">
                {[
                  'Access to all 6 AI financial assistants',
                  'Real-time market data and analysis',
                  'Unlimited questions and insights',
                  'Portfolio tracking and optimization',
                  'Technical charts with TradingView',
                  'Risk assessment and alerts',
                  'API access for automated trading',
                  'Priority customer support'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-purple-100/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust indicators */}
            <div className="tarot-panel p-6 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold gold-text">10K+</div>
                  <div className="text-xs text-purple-100/70 mt-1">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gold-text">$2.4M</div>
                  <div className="text-xs text-purple-100/70 mt-1">Daily Volume</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gold-text">92%</div>
                  <div className="text-xs text-purple-100/70 mt-1">Accuracy</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-yellow-200/20">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="font-semibold text-sm">Bank-Level Security</p>
                    <p className="text-xs text-purple-100/70">256-bit encryption • SOC2 compliant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing note */}
            <div className="p-4 rounded-lg border border-yellow-200/20 bg-white/5">
              <p className="text-sm text-purple-100/90 mb-2">
                <strong>Start with 7 days free</strong>
              </p>
              <p className="text-xs text-purple-100/70">
                No credit card required. After trial: $29/month or $290/year (save 20%)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}