import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setLoading(true)
    setError('')

    try {
      const result = await signIn(email, password)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Invalid email or password')
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
            <span className="chip rounded-full px-3 py-1">Secure Login</span>
            <span className="chip rounded-full px-3 py-1">Protected</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Welcome Panel */}
          <aside className="lg:col-span-5">
            <div className="tarot-panel p-6 sm:p-8 relative h-full flex flex-col justify-center">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome Back to Your Financial Command Center</h2>
              <p className="text-purple-100/80 mb-6">
                Access your AI-powered financial assistants and get instant market intelligence.
              </p>

              <div className="space-y-4">
                <div className="guide-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="#F2B807">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Real-time Analysis</div>
                      <div className="text-xs text-purple-100/70">Live market data & AI insights</div>
                    </div>
                  </div>
                </div>

                <div className="guide-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="#F2B807">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Multi-Agent System</div>
                      <div className="text-xs text-purple-100/70">5 specialized AI assistants</div>
                    </div>
                  </div>
                </div>

                <div className="guide-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="#F2B807">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Bank-Level Security</div>
                      <div className="text-xs text-purple-100/70">Your data is encrypted & protected</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-purple-100/70">
                New to FinAgent?
                <Link to="/sign-up" className="ml-2 text-yellow-300 hover:text-yellow-200">
                  Create an account
                </Link>
              </div>
            </div>
          </aside>

          {/* Right: Login Form */}
          <section className="lg:col-span-7">
            <div className="tarot-panel p-6 sm:p-8 lg:p-10 relative">
              <span aria-hidden="true" className="corner tl"></span>
              <span aria-hidden="true" className="corner tr"></span>
              <span aria-hidden="true" className="corner bl"></span>
              <span aria-hidden="true" className="corner br"></span>

              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Sign In to Your Account</h1>
                <p className="text-sm text-purple-100/80 mt-2">
                  Enter your credentials to access your financial dashboard
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

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-100/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-purple-100/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input w-full px-4 py-3 pr-10 text-sm placeholder-purple-100/50"
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-purple-100/30 bg-white/10 text-yellow-500 focus:ring-yellow-500/30" />
                    <span className="text-sm text-purple-100/80">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-yellow-300 hover:text-yellow-200">
                    Forgot password?
                  </Link>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || !email.trim() || !password.trim()}
                    className="btn-gold w-full rounded-xl px-6 py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-100/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-transparent text-purple-100/60">OR CONTINUE WITH</span>
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
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-purple-100/70">
                  Don't have an account?
                  <Link to="/sign-up" className="ml-2 text-yellow-300 hover:text-yellow-200 font-medium">
                    Sign up for free
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

export default LoginPage