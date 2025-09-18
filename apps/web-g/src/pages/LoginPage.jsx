import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      <div className="baroque-bg"></div>

      {/* Ornate Flourishes */}
      <div className="ornate-flourish" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
      <div className="ornate-flourish" style={{ bottom: '15%', right: '10%', animationDelay: '-10s' }}></div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="graffiti-tag street-art-text text-4xl mb-4">FinAgent</div>
            <h2 className="text-3xl font-bold text-white font-playfair">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Enter your credentials to access your account</p>
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
              <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-600 bg-black/50 text-yellow-400 focus:ring-yellow-400" />
                <span className="ml-2 text-gray-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-yellow-400 hover:text-yellow-300">
                Forgot password?
              </Link>
            </div>

            <div className="ornate-border">
              <button
                type="submit"
                disabled={loading}
                className="interactive-btn w-full text-black font-bold py-3 rounded-2xl text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/sign-up" className="street-art-text font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="luxury-card p-12 rounded-3xl neon-glow max-w-md">
          <h3 className="text-4xl font-bold street-art-text mb-6 font-playfair">
            Trade with Intelligence
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Access powerful AI-driven market analysis, real-time trading signals, and portfolio optimization tools.
          </p>
          <div className="mt-8">
            <div className="skateboard-deck mx-auto" style={{ width: '60px', height: '200px' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}