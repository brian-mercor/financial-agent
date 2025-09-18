import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, LineChart, PieChart, Brain, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  const [chatMessages, setChatMessages] = useState([])

  useEffect(() => {
    // Generate quantum particles
    const quantumField = document.getElementById('quantum-field')
    if (quantumField) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.className = 'quantum-particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (15 + Math.random() * 10) + 's'
        quantumField.appendChild(particle)
      }
    }

    // Generate memory nodes
    for (let i = 0; i < 10; i++) {
      const node = document.createElement('div')
      node.className = 'memory-node'
      node.style.left = Math.random() * 100 + '%'
      node.style.top = Math.random() * 100 + '%'
      node.style.animationDelay = Math.random() * 2 + 's'
      document.body.appendChild(node)
    }

    // Animated chat demo
    const messages = [
      { type: 'user', text: 'Analyze AAPL stock and show me the technical indicators' },
      { type: 'ai', text: 'I\'ll analyze Apple (AAPL) for you. Based on recent market data, AAPL is showing strong momentum with RSI at 65...', context: '📊 Building on 5 previous analyses' }
    ]

    let messageIndex = 0
    const interval = setInterval(() => {
      if (messageIndex < messages.length) {
        setChatMessages(prev => [...prev, messages[messageIndex]])
        messageIndex++
      }
    }, 3000)

    // Draw neural connections
    const svg = document.getElementById('memory-network')
    if (svg) {
      const width = 1000
      const height = 400

      for (let i = 0; i < 15; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const x1 = Math.random() * width
        const y1 = Math.random() * height
        const x2 = Math.random() * width
        const y2 = Math.random() * height
        const cx = (x1 + x2) / 2 + (Math.random() - 0.5) * 100
        const cy = (y1 + y2) / 2 + (Math.random() - 0.5) * 100

        line.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`)
        line.setAttribute('class', 'neural-connection')
        svg.appendChild(line)
      }
    }

    // Cleanup
    return () => {
      clearInterval(interval)
      const nodes = document.querySelectorAll('.memory-node')
      nodes.forEach(node => node.remove())
    }
  }, [])

  return (
    <div className="min-h-screen text-white relative">
      <div className="batik-pattern"></div>

      {/* Quantum Particles */}
      <div id="quantum-field"></div>

      {/* Neural Network Background */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20" id="neural-svg">
        <defs>
          <pattern id="batik-pattern-svg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#6b4423" strokeWidth="0.5" opacity="0.3"/>
            <path d="M 50 20 Q 80 50 50 80 Q 20 50 50 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#batik-pattern-svg)"/>
      </svg>

      {/* Navigation */}
      <nav className="relative z-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">FA</span>
            </div>
            <span className="text-xl font-semibold">FinAgent</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#technology" className="hover:text-purple-400 transition-colors">AI Technology</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
            <Link to="/login" className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105">
              Get Started
            </Link>
          </div>
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="hero-text text-5xl lg:text-7xl font-bold mb-6">
              AI-Powered Financial Intelligence
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your Personal AI Financial Partner That Evolves With Your Portfolio
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Experience persistent AI intelligence that learns from every market interaction, building a deeper understanding of your investment style, risk tolerance, and financial goals over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up" className="cta-button px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg font-semibold transform hover:scale-105 transition-all">
                Start Your Journey
              </Link>
              <Link to="/login" className="px-8 py-4 rounded-full border border-gray-600 hover:border-purple-400 text-lg font-semibold transition-all">
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Interactive Chat Demo */}
          <div className="glass-card p-8 max-w-4xl mx-auto relative">
            <div className="batik-ornament top-4 right-4"></div>
            <div className="batik-ornament bottom-4 left-4"></div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-gray-400">Active Trading Session</span>
              </div>
              <span className="text-xs text-purple-400">15,847 market insights analyzed</span>
            </div>

            <div className="space-y-4" id="chat-container">
              {chatMessages.map((message, idx) => (
                <div key={idx} className={`chat-bubble flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={message.type === 'user' ? 'bg-purple-500/20 rounded-2xl p-4 max-w-xs' : 'bg-blue-500/20 rounded-2xl p-4 max-w-md'}>
                    <p className="text-sm">{message.text}</p>
                    {message.context && (
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2">
                        <span>{message.context}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <input
                type="text"
                placeholder="Ask about market trends, portfolio analysis..."
                className="flex-1 bg-white/5 border border-gray-700 rounded-full px-6 py-3 focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-40 px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            AI-Enhanced Trading Intelligence
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
              <p className="text-gray-400 text-sm">Real-time analysis of market trends with predictive AI models trained on historical data.</p>
            </div>

            <div className="feature-card glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Technical Indicators</h3>
              <p className="text-gray-400 text-sm">Advanced charting with 100+ technical indicators and custom pattern recognition.</p>
            </div>

            <div className="feature-card glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Portfolio Optimization</h3>
              <p className="text-gray-400 text-sm">AI-driven portfolio rebalancing based on your risk profile and market conditions.</p>
            </div>

            <div className="feature-card glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-gray-400 text-sm">Real-time market sentiment analysis from news, social media, and financial reports.</p>
            </div>

            <div className="feature-card glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Agent System</h3>
              <p className="text-gray-400 text-sm">Specialized AI agents for different trading strategies and market sectors.</p>
            </div>

            <div className="feature-card glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-gray-400 text-sm">Advanced risk assessment with automated stop-loss and position sizing recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Memory Visualization */}
      <section id="technology" className="relative z-40 px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 lg:p-12 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-10" id="memory-network">
            </svg>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Your Trading Knowledge Graph</h2>
              <p className="text-gray-400 mb-8">Watch as your AI companion builds a comprehensive understanding of market patterns and your trading preferences</p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400 mb-2">25,847</div>
                  <div className="text-sm text-gray-400">Market Analyses</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400 mb-2">456</div>
                  <div className="text-sm text-gray-400">Trading Strategies</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.2%</div>
                  <div className="text-sm text-gray-400">Prediction Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-40 px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Start Building Your AI Trading Assistant Today
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of traders who've enhanced their strategies with persistent AI intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up" className="cta-button px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg font-semibold transform hover:scale-105 transition-all">
              Get Started Free
            </Link>
            <Link to="/login" className="px-10 py-4 rounded-full border border-gray-600 hover:border-purple-400 text-lg font-semibold transition-all">
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}