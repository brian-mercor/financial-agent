import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, DollarSign, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen handdrawn-bg flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent border-4 border-dark flex items-center justify-center mr-4">
              <DollarSign className="h-8 w-8 text-dark" />
            </div>
            <div>
              <h1 className="folk-title text-4xl font-bold tracking-wide">FinAgent</h1>
              <p className="text-sm uppercase tracking-widest">Welcome Back</p>
            </div>
          </Link>

          <div className="folk-card p-8">
            <h2 className="folk-title text-3xl font-bold text-center mb-2">Sign In</h2>
            <p className="text-center mb-8">Access your AI-powered financial dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="folk-text text-lg font-bold mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-3 border-dark rounded-lg folk-text text-lg focus:ring-4 focus:ring-secondary focus:border-secondary outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="folk-text text-lg font-bold mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-3 border-dark rounded-lg folk-text text-lg focus:ring-4 focus:ring-secondary focus:border-secondary outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 border-2 border-dark rounded" />
                  <span className="ml-2 folk-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="folk-text text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="folk-card bg-red-50 border-red-500 p-4">
                  <p className="text-red-600 folk-text">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full outsider-button py-3 text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-dark border-t-transparent"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="folk-text">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-bold hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-secondary via-accent to-primary p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="handdrawn-circle w-96 h-96 top-10 right-10 bg-white"></div>
        <div className="handdrawn-circle w-64 h-64 bottom-20 left-20 bg-yellow-200"></div>

        <div className="relative z-10 text-center">
          <h2 className="folk-title text-5xl font-bold text-white mb-6">
            Welcome Back to Financial Freedom
          </h2>
          <p className="text-white text-xl mb-8 max-w-md mx-auto">
            Your AI assistants are ready to help you make smarter investment decisions.
          </p>
          <div className="folk-card bg-white/90 p-6 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="folk-text font-bold">Portfolio Performance</span>
              <span className="text-green-500 folk-text font-bold">+24.3%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">AAPL</span>
                <span className="text-sm text-green-500">+5.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">TSLA</span>
                <span className="text-sm text-green-500">+8.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">BTC</span>
                <span className="text-sm text-green-500">+12.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}