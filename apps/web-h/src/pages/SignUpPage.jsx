import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp, user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }

    // Generate quantum particles
    const quantumField = document.getElementById('quantum-field-signup')
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
      const particles = document.querySelectorAll('#quantum-field-signup .quantum-particle')
      particles.forEach(p => p.remove())
    }
  }, [user, navigate])

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
    const result = await signUp(email, password, name)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Failed to create account')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex text-white relative">
      <div className="batik-pattern"></div>

      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div id="quantum-field-signup"></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="signup-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#6b4423" strokeWidth="0.5" opacity="0.3"/>
              <path d="M 50 20 Q 80 50 50 80 Q 20 50 50 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signup-pattern)"/>
        </svg>

        <div className="relative z-10 text-center p-8">
          <h2 className="hero-text text-4xl font-bold mb-4">
            Start Your Journey
          </h2>
          <p className="text-gray-300 max-w-md mb-8">
            Join thousands of traders using AI to enhance their investment strategies and maximize returns.
          </p>

          <div className="glass-card p-6 text-left space-y-4">
            <h3 className="font-semibold text-lg mb-3">What you'll get:</h3>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0 mt-1"></div>
              <p className="text-sm">Advanced AI market analysis with real-time insights</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0 mt-1"></div>
              <p className="text-sm">Personalized trading strategies based on your risk profile</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0 mt-1"></div>
              <p className="text-sm">Portfolio optimization with automated rebalancing</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0 mt-1"></div>
              <p className="text-sm">24/7 AI assistant that learns from your trading patterns</p>
            </div>
          </div>
        </div>

        <div className="batik-ornament top-20 left-20"></div>
        <div className="batik-ornament bottom-20 right-20"></div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="relative z-40 w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">FA</span>
            </div>
            <span className="text-xl font-semibold">FinAgent</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-400 mb-8">Start your AI-powered trading journey today</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-700 text-purple-500 focus:ring-purple-500"
              />
              <label className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
              </label>
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}