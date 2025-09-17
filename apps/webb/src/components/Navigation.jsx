import React from 'react'

function Navigation() {
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold gradient-text">FinanceAI</div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition">Features</a>
            <a href="#benefits" className="text-gray-700 hover:text-purple-600 transition">Benefits</a>
            <a href="#compare" className="text-gray-700 hover:text-purple-600 transition">Compare</a>
            <a href="#download" className="text-gray-700 hover:text-purple-600 transition">Get Started</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-gray-700 hover:text-purple-600 transition">
              Sign In
            </a>
            <a href="/login" className="gradient-bg text-white px-6 py-2 rounded-full hover:shadow-lg transition">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation