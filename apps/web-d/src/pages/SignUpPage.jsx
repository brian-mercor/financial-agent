import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function SignUpPage() {
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
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreed) {
      setError('Please agree to the terms and conditions')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await signUp(formData.name, formData.email, formData.password)
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
    <div className="min-h-screen font-[Inter]">
      {/* Starfield layers */}
      <div aria-hidden="true" className="stars"></div>
      <div aria-hidden="true" className="stars2"></div>
      <div aria-hidden="true" className="stars3"></div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl" aria-hidden="true"
                 style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04))', boxShadow: 'inset 0 0 0 1px rgba(255, 211, 110, .4), 0 8px 20px rgba(0,0,0,.45)' }}>
              <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full p-1.5">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#FBDD96"/>
                    <stop offset="1" stopColor="#F2B807"/>
                  </linearGradient>
                </defs>
                <rect x="7" y="7" width="50" height="50" rx="10" fill="url(#g1)" opacity=".25" />
                <rect x="9" y="9" width="46" height="46" rx="9" fill="none" stroke="url(#g1)" strokeWidth="1.5" opacity=".85"/>
                <path d="M24 32 L32 22 L40 32 M32 22 L32 42" stroke="#FDE8A6" strokeWidth="2" fill="none"/>
                <circle cx="32" cy="32" r="13.5" fill="none" stroke="#8B5CF6" strokeWidth="1.6"/>
              </svg>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl tracking-tight font-extrabold gold-text">FinAgent</div>
              <p className="text-xs sm:text-sm text-purple-100/80">AI Financial Intelligence</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-[13px] text-purple-100/70">
            <span className="chip rounded-full px-3 py-1">Free Trial</span>
            <span className="chip rounded-full px-3 py-1">No Credit Card</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Benefits Panel */}
          <aside className="lg:col-span-5">
            <div className="tarot-panel p-6 sm:p-8 relative h-full flex flex-col justify-center">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join the Financial Intelligence Revolution</h2>
              <p className="text-purple-100/80 mb-6">
                Get instant access to AI-powered market analysis and transform your investment strategy.
              </p>

              <div className="space-y-4">
                <div className="guide-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="#F2B807">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">14-Day Free Trial</div>
                      <div className="text-xs text-purple-100/70">Full access, no credit card required</div>
                    </div>
                  </div>
                </div>

                <div className="guide-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="#F2B807">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">5 AI Assistants</div>
                      <div className="text-xs text-purple-100/70">Specialized experts at your service</div>
                    </div>
                  </div>
                </div>

                <div className="guide-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="#F2B807">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Advanced Analytics</div>
                      <div className="text-xs text-purple-100/70">Professional-grade tools & charts</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg border border-yellow-200/20 bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#F2B807">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-sm font-medium">Limited Time Offer</span>
                </div>
                <p className="text-xs text-purple-100/70">
                  Sign up now and get 3 months at 50% off after your trial ends.
                </p>
              </div>

              <div className="mt-6 text-sm text-purple-100/70">
                Already have an account?
                <Link to="/login" className="ml-2 text-yellow-300 hover:text-yellow-200">
                  Sign in
                </Link>
              </div>
            </div>
          </aside>

          {/* Right: Sign-up Form */}
          <section className="lg:col-span-7">
            <div className="tarot-panel p-6 sm:p-8 lg:p-10 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Create Your Account</h1>
                <p className="text-sm text-purple-100/80 mt-2">
                  Start your journey to smarter financial decisions
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-purple-100/80 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="input w-full px-4 py-3 pr-10 text-sm placeholder-purple-100/50"
                      placeholder="John Doe"
                      required
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100/60">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-100/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input w-full px-4 py-3 pr-10 text-sm placeholder-purple-100/50"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100/60">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-purple-100/80 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input w-full px-4 py-3 pr-10 text-sm placeholder-purple-100/50"
                        placeholder="Min. 8 characters"
                        required
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100/60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-100/80 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input w-full px-4 py-3 pr-10 text-sm placeholder-purple-100/50"
                        placeholder="Re-enter password"
                        required
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-100/60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-purple-100/30 bg-white/10 text-yellow-500 focus:ring-yellow-500/30"
                    />
                    <span className="text-sm text-purple-100/80">
                      I agree to the{' '}
                      <Link to="/terms" className="text-yellow-300 hover:text-yellow-200">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-yellow-300 hover:text-yellow-200">Privacy Policy</Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 rounded border-purple-100/30 bg-white/10 text-yellow-500 focus:ring-yellow-500/30"
                    />
                    <span className="text-sm text-purple-100/80">
                      Send me product updates and market insights (optional)
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !agreed}
                    className="btn-gold w-full rounded-xl px-6 py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-100/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-transparent text-purple-100/60">OR SIGN UP WITH</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-ghost w-full rounded-xl px-6 py-3 text-sm font-medium flex items-center justify-center gap-3"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#FFE9B3" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#FFE9B3" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FFE9B3" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#FFE9B3" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-purple-100/70">
                  Already have an account?
                  <Link to="/login" className="ml-2 text-yellow-300 hover:text-yellow-200 font-medium">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SignUpPage