import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      } else {
        setError(result.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="brand mb-8" aria-label="Finagent Home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-text">Finagent</span>
          </Link>

          <div className="mb-8">
            <h1 className="title text-4xl mb-2">Welcome back</h1>
            <p className="subtitle">Sign in to access your AI trading assistant</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-muted mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full pl-12"
                  style={{ minWidth: 'auto' }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-12"
                  style={{ minWidth: 'auto' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-panel text-accent focus:ring-accent focus:ring-offset-0"
                />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <a href="#" className="text-sm text-link hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-bg text-muted">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="btn secondary w-full justify-center"
              onClick={() => alert('OAuth providers can be configured in Supabase')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-link hover:underline font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Gradient Background */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <div className="brand-mark mx-auto mb-6" style={{ width: '80px', height: '80px', borderRadius: '20px' }}></div>
            <h2 className="title text-3xl mb-4">Trade Smarter with AI</h2>
            <p className="subtitle text-lg">
              Get real-time market analysis, portfolio optimization, and trading strategies powered by advanced AI models.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <span className="pill">GPT-4 Powered</span>
              <span className="pill">Real-time Data</span>
              <span className="pill">24/7 Monitoring</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 text-center text-sm text-white/60">
          Trusted by 10,000+ traders worldwide
        </div>
      </div>
    </div>
  )
}