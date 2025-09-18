import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn, user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }

    // Generate quantum particles
    const quantumField = document.getElementById('quantum-field-login')
    if (quantumField) {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.className = 'quantum-particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (15 + Math.random() * 10) + 's'
        quantumField.appendChild(particle)
      }
    }

    // Cleanup
    return () => {
      const particles = document.querySelectorAll('#quantum-field-login .quantum-particle')
      particles.forEach(p => p.remove())
    }
  }, [user, navigate])

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
    <div className="min-h-screen flex text-white relative">
      <div className="batik-pattern"></div>

      {/* Left Side - Login Form */}
      <div className="relative z-40 w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">FA</span>
            </div>
            <span className="text-xl font-semibold">FinAgent</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">Enter your credentials to access your AI trading assistant</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-700 text-purple-500 focus:ring-purple-500" />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</a>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="cta-button w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div id="quantum-field-login"></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="login-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#6b4423" strokeWidth="0.5" opacity="0.3"/>
              <path d="M 50 20 Q 80 50 50 80 Q 20 50 50 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-pattern)"/>
        </svg>

        <div className="relative z-10 text-center p-8">
          <h2 className="hero-text text-4xl font-bold mb-4">
            AI-Powered Trading
          </h2>
          <p className="text-gray-300 max-w-md">
            Experience the future of financial analysis with our advanced AI trading assistant that learns and adapts to your investment style.
          </p>
          <div className="mt-8 space-y-4">
            <div className="glass-card p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm">Real-time market analysis</span>
              </div>
            </div>
            <div className="glass-card p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-sm">Personalized trading strategies</span>
              </div>
            </div>
            <div className="glass-card p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                <span className="text-sm">Advanced risk management</span>
              </div>
            </div>
          </div>
        </div>

        <div className="batik-ornament top-20 right-20"></div>
        <div className="batik-ornament bottom-20 left-20"></div>
      </div>
    </div>
  )
}