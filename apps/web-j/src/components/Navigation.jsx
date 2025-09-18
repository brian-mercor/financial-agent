import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Navigation() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-gradient-to-b from-[rgba(10,11,12,.7)] to-[rgba(10,11,12,.45)] border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center justify-between gap-4 py-3.5">
          <Link to="/" className="flex items-center gap-3 text-text font-semibold tracking-wider">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] opacity-95">
                <path d="M4 16.5C7.5 14 11.5 9.5 13.5 6.5M10 19c2.5-2.2 5.8-6.2 8-11"
                      stroke="url(#g1)" strokeWidth="2.2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0" stopColor="#d2b26d"/>
                    <stop offset="1" stopColor="#b2914d"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>FinAgent</span>
          </Link>

          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="text-muted hover:text-white text-sm">
              Dashboard
            </Link>
            <Link to="#how" className="text-muted hover:text-white text-sm">
              How it works
            </Link>
            <Link to="#socratic" className="text-muted hover:text-white text-sm">
              AI Engine
            </Link>
            {user ? (
              <Link to="/dashboard" className="btn-gold">
                Enter Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-gold">
                Start Investing
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}