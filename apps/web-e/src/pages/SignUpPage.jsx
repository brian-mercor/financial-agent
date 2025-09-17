import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, DollarSign, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp(name, email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError('Failed to create account')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ]

  return (
    <div className="min-h-screen handdrawn-bg flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="handdrawn-circle w-96 h-96 top-10 left-10 bg-white"></div>
        <div className="handdrawn-circle w-64 h-64 bottom-20 right-20 bg-pink-200"></div>

        <div className="relative z-10 text-center">
          <h2 className="folk-title text-5xl font-bold text-white mb-6">
            Start Your Financial Journey
          </h2>
          <p className="text-white text-xl mb-8 max-w-md mx-auto">
            Join thousands of investors using AI to build wealth smarter and faster.
          </p>
          <div className="folk-card bg-white/90 p-6 max-w-sm mx-auto">
            <h3 className="folk-text font-bold text-xl mb-4">What You'll Get:</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">6 Specialized AI Financial Assistants</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Real-time Market Analysis & Charts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Personalized Investment Strategies</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Risk Management & Portfolio Optimization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">14-Day Free Trial - No Credit Card</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent border-4 border-dark flex items-center justify-center mr-4">
              <DollarSign className="h-8 w-8 text-dark" />
            </div>
            <div>
              <h1 className="folk-title text-4xl font-bold tracking-wide">FinAgent</h1>
              <p className="text-sm uppercase tracking-widest">Join Today</p>
            </div>
          </Link>

          <div className="folk-card p-8">
            <h2 className="folk-title text-3xl font-bold text-center mb-2">Create Account</h2>
            <p className="text-center mb-8">Start your 14-day free trial</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="folk-text text-lg font-bold mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-3 border-dark rounded-lg folk-text text-lg focus:ring-4 focus:ring-secondary focus:border-secondary outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className={`h-4 w-4 mr-2 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="folk-text text-lg font-bold mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-3 border-dark rounded-lg folk-text text-lg focus:ring-4 focus:ring-secondary focus:border-secondary outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 border-2 border-dark rounded mt-0.5"
                />
                <label className="ml-3 folk-text text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
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
                    Create Free Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="folk-text">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}