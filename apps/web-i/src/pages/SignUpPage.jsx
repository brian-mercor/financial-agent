import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      const { error } = await signUp(formData.email, formData.password)
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with blueprint effect */}
      <div className="absolute inset-0 blueprint">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="jelly j1"></div>
          <div className="jelly j2"></div>
          <div className="jelly j3"></div>
        </div>
      </div>

      {/* Header */}
      <header className="header relative z-10">
        <div className="container">
          <div className="flex items-center gap-5 py-3.5">
            <Link to="/" className="flex items-center gap-3">
              <div className="logo" aria-hidden="true"></div>
              <span className="font-extrabold tracking-wide font-[Poppins]">FinAgent</span>
            </Link>
            <div className="ml-auto">
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sign Up Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="panel">
            <div className="panel-head">
              <div className="traffic" aria-hidden="true">
                <span className="dot-r"></span>
                <span className="dot-y"></span>
                <span className="dot-g"></span>
              </div>
              <strong>Create Account</strong>
              <span className="small">Start your trading journey</span>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-[rgba(255,49,49,0.1)] border border-[rgba(255,49,49,0.3)] text-[#ff3131] text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="text-input"
                    placeholder="John Trader"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="text-input"
                    placeholder="trader@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="text-input"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <p className="small mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="text-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 mt-1 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-[var(--muted)]">
                    I agree to the{' '}
                    <a href="#" className="text-[var(--primary)] hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[var(--primary)] hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <div className="text-center pt-4 border-t border-[rgba(255,255,255,0.1)]">
                  <span className="text-[var(--muted)]">Already have an account? </span>
                  <Link to="/login" className="text-[var(--primary)] hover:underline">
                    Sign in
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--panel)] text-[var(--muted)]">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="btn btn-outline flex items-center justify-center gap-2"
                    onClick={() => alert('Google signup coming soon')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline flex items-center justify-center gap-2"
                    onClick={() => alert('GitHub signup coming soon')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4 text-[var(--muted)] text-sm">
            Your data is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  )
}