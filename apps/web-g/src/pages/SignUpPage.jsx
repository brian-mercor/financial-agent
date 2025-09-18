import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await signUp(formData.email, formData.password, { name: formData.name })
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Failed to create account')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="baroque-bg"></div>

      {/* Ornate Flourishes */}
      <div className="ornate-flourish" style={{ top: '5%', right: '10%', animationDelay: '0s' }}></div>
      <div className="ornate-flourish" style={{ bottom: '10%', left: '5%', animationDelay: '-10s' }}></div>

      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="luxury-card p-12 rounded-3xl neon-glow max-w-md">
          <h3 className="text-4xl font-bold street-art-text mb-6 font-playfair">
            Join the Revolution
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Start your journey with AI-powered trading intelligence. Get access to:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="street-art-text mr-3">✓</span>
              Real-time market analysis
            </li>
            <li className="flex items-center">
              <span className="street-art-text mr-3">✓</span>
              Advanced trading signals
            </li>
            <li className="flex items-center">
              <span className="street-art-text mr-3">✓</span>
              Portfolio optimization
            </li>
            <li className="flex items-center">
              <span className="street-art-text mr-3">✓</span>
              Risk management tools
            </li>
          </ul>
          <div className="mt-8">
            <div className="skateboard-deck mx-auto" style={{ width: '60px', height: '200px' }}></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="graffiti-tag street-art-text text-4xl mb-4">FinAgent</div>
            <h2 className="text-3xl font-bold text-white font-playfair">Create Account</h2>
            <p className="text-gray-400 mt-2">Join thousands of smart traders</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="luxury-card p-4 rounded-lg border-red-500 border">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-600 bg-black/50 text-yellow-400 focus:ring-yellow-400"
                required
              />
              <label className="ml-2 text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="street-art-text hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="street-art-text hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="ornate-border">
              <button
                type="submit"
                disabled={loading}
                className="interactive-btn w-full text-black font-bold py-3 rounded-2xl text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="street-art-text font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}