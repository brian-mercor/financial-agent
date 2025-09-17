import { Link } from 'react-router-dom'
import { TrendingUp, BarChart3, Shield, ArrowRight, Brain, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold">FinAgent</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
            Sign In
          </Link>
          <Link to="/signup" className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="gradient-text">Intelligent</span> Financial
            <br />Assistant Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Harness the power of AI-driven market analysis, real-time trading insights,
            and portfolio optimization with our multi-agent financial system.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/signup" className="gradient-bg px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition">
              Start Free Trial
            </Link>
            <Link to="/login" className="px-8 py-4 border border-purple-500 rounded-xl font-semibold text-lg hover:bg-purple-900/30 transition">
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/15 transition">
            <Brain className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">5 AI Agents</h3>
            <p className="text-gray-300">
              Specialized agents for analysis, trading, risk management, and portfolio optimization.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/15 transition">
            <BarChart3 className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Charts</h3>
            <p className="text-gray-300">
              Professional TradingView integration with advanced technical indicators.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/15 transition">
            <Shield className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
            <p className="text-gray-300">
              Intelligent risk assessment and portfolio protection strategies.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/15 transition">
            <Zap className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-300">
              Real-time streaming responses and instant market data updates.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/15 transition">
            <TrendingUp className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
            <p className="text-gray-300">
              Deep market insights powered by advanced AI models and real-time data.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/15 transition">
            <ArrowRight className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trade Signals</h3>
            <p className="text-gray-300">
              AI-generated entry and exit points with confidence scores.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Trading?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of traders using AI to make smarter investment decisions.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition">
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}