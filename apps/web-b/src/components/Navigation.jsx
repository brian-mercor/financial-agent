import { Link, useLocation } from 'react-router-dom'
import { Home, Info, MessageCircle, TrendingUp } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold gradient-text">FinanceAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 transition ${
                isActive('/') && !isActive('/chat') && !isActive('/about')
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/chat/market-analyst"
              className={`flex items-center gap-2 transition ${
                isActive('/chat')
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-2 transition ${
                isActive('/about')
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              <Info className="h-4 w-4" />
              About
            </Link>
          </div>

          <button className="gradient-bg text-white px-6 py-2 rounded-full hover:shadow-lg transition">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  )
}