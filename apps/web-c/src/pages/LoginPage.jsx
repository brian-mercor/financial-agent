import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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
      }
    } catch (err) {
      setError('Invalid credentials. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brutal-bg font-grotesk text-brutal-fg">
      {/* Header */}
      <header className="border-b-4 border-brutal-line">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 brutal-card grid place-items-center">
              <span className="font-mono font-bold text-brutal-red">FA</span>
            </div>
            <span className="font-extrabold tracking-tight text-lg md:text-xl">FinAgent</span>
          </Link>
          <Link to="/signup" className="btn-ghost px-4 py-2 font-mono text-xs uppercase">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

        <div className="relative w-full max-w-md">
          <div className="brutal-card p-8">
            <h1 className="text-4xl font-extrabold mb-2">ACCESS SYSTEM</h1>
            <p className="text-sm font-mono text-brutal-red uppercase mb-8">Authentication Required</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brutal-ink border-3 border-brutal-line px-4 py-3 font-mono text-sm focus:outline-none focus:border-brutal-red transition-colors"
                  placeholder="trader@finagent.ai"
                  required
                  style={{ border: '2px solid #2A2A2A' }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brutal-ink border-3 border-brutal-line px-4 py-3 font-mono text-sm focus:outline-none focus:border-brutal-red transition-colors"
                  placeholder="••••••••"
                  required
                  style={{ border: '2px solid #2A2A2A' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-brutal-ink border-2 border-brutal-line checked:bg-brutal-red appearance-none"
                  />
                  <span className="text-xs font-mono uppercase">Remember Session</span>
                </label>
                <a href="#" className="text-xs font-mono uppercase text-brutal-red hover:underline">
                  Reset Access
                </a>
              </div>

              {error && (
                <div className="bg-brutal-red/20 border-2 border-brutal-red p-3 font-mono text-xs uppercase">
                  <span className="text-brutal-red">ERROR: </span>{error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-brutal py-4 font-mono text-sm uppercase font-bold disabled:opacity-50"
              >
                {loading ? 'AUTHENTICATING...' : 'GRANT ACCESS'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-brutal-line">
              <p className="text-center font-mono text-xs uppercase">
                New Trader?{' '}
                <Link to="/signup" className="text-brutal-red hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="font-mono text-xs uppercase text-gray-500">
              🔒 Secure Connection • 256-bit Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}