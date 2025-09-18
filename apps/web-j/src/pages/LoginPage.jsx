import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react'

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Invalid email or password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-3 text-text font-semibold tracking-wider mb-8">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] opacity-95">
                <path d="M4 16.5C7.5 14 11.5 9.5 13.5 6.5M10 19c2.5-2.2 5.8-6.2 8-11"
                      stroke="url(#g1)" strokeWidth="2.2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0" stopColor="#d2b26d"/>
                    <stop offset="1" stopColor="#b2914d"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>FinAgent</span>
          </Link>

          <h1 className="font-cormorant font-semibold text-4xl mb-3">
            Welcome Back
          </h1>
          <p className="text-muted mb-8">
            Enter your credentials to access your trading dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-text placeholder-dim focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="trader@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-text placeholder-dim focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-black/30 text-gold focus:ring-gold/50 focus:ring-2"
                />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-2">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-ink font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-[0_10px_22px_rgba(210,178,109,.18),inset_0_1px_0_rgba(255,255,255,.4)] hover:translate-y-[-1px] hover:brightness-[1.06] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-muted">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-gold hover:text-gold-2 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Gradient background with pattern */}
      <div className="hidden lg:block flex-1 relative overflow-hidden"
           style={{
             background: `radial-gradient(1200px 700px at 10% 20%, rgba(210,178,109,.15), transparent 70%),
                        radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,.08), transparent 60%),
                        radial-gradient(800px 400px at 80% 80%, rgba(255,255,255,.06), transparent 60%),
                        linear-gradient(180deg, #0a0b0c 0%, #0b0c0e 100%)`
           }}>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `linear-gradient(to right, rgba(255,255,255,.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,.03) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full brand-mark mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 opacity-95">
                <path d="M4 16.5C7.5 14 11.5 9.5 13.5 6.5M10 19c2.5-2.2 5.8-6.2 8-11"
                      stroke="url(#g2)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0" stopColor="#d2b26d"/>
                    <stop offset="1" stopColor="#b2914d"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2 className="font-cormorant font-semibold text-3xl mb-4">
            Trade Smarter, Not Harder
          </h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            Join thousands of traders using AI to analyze markets, identify opportunities, and build winning strategies.
          </p>

          <div className="grid gap-4 max-w-sm mx-auto">
            {[
              { value: '95%', label: 'Accuracy Rate' },
              { value: '24/7', label: 'Market Analysis' },
              { value: '500+', label: 'Trading Strategies' }
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="text-2xl font-bold gradient-gold-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage