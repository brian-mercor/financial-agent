import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, DollarSign, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <>
      <header className="py-4 px-6 md:px-12 bg-white border-b-4 border-dashed border-dark">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-accent border-4 border-dark flex items-center justify-center mr-3">
              <DollarSign className="h-6 w-6 text-dark" />
            </div>
            <div>
              <h1 className="folk-title text-3xl font-bold tracking-wide">FinAgent</h1>
              <p className="text-xs uppercase tracking-widest">Smart Money Moves</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="folk-text text-lg font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/#assistants" className="folk-text text-lg font-medium hover:text-primary transition-colors">
              AI Assistants
            </Link>
            <Link to="/#testimonials" className="folk-text text-lg font-medium hover:text-primary transition-colors">
              Success Stories
            </Link>
            <Link to="/#pricing" className="folk-text text-lg font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="folk-text text-lg font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="outsider-button px-6 py-2 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="outsider-button px-6 py-2">
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu fixed top-0 right-0 h-full w-4/5 bg-white z-50 p-6 border-l-4 border-dark shadow-lg ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="flex justify-end">
          <button onClick={() => setMobileMenuOpen(false)} className="text-2xl">
            <X className="h-8 w-8" />
          </button>
        </div>
        <nav className="mt-8 flex flex-col space-y-6">
          <Link to="/#features" className="folk-text text-2xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link to="/#assistants" className="folk-text text-2xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            AI Assistants
          </Link>
          <Link to="/#testimonials" className="folk-text text-2xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Success Stories
          </Link>
          <Link to="/#pricing" className="folk-text text-2xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="folk-text text-2xl font-medium" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="outsider-button px-6 py-2 text-center mt-4"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="outsider-button px-6 py-2 text-center mt-4" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </nav>
      </div>
    </>
  )
}