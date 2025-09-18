import { useNavigate } from 'react-router-dom'
import { TrendingUp, LineChart, PieChart } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="baroque-bg"></div>

      {/* Ornate Flourishes */}
      <div className="ornate-flourish" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
      <div className="ornate-flourish" style={{ top: '20%', right: '10%', animationDelay: '-5s' }}></div>
      <div className="ornate-flourish" style={{ bottom: '15%', left: '15%', animationDelay: '-10s' }}></div>
      <div className="ornate-flourish" style={{ bottom: '25%', right: '5%', animationDelay: '-15s' }}></div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="skateboard-deck"></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <div className="text-center max-w-6xl mx-auto">
          <div className="graffiti-tag street-art-text mb-8">
            FinAgent
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 text-glow-animation font-playfair">
            Beyond the
            <span className="street-art-text"> Markets</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-Powered Financial Intelligence for <span className="street-art-text font-semibold">Real-World Trading</span>
            <br />Where luxury analytics meets street-smart execution
          </p>

          <div className="ornate-border inline-block">
            <button
              onClick={() => navigate('/sign-up')}
              className="interactive-btn text-black font-bold py-4 px-12 rounded-2xl text-lg"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 street-art-text font-playfair">
            Revolutionary Trading
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="luxury-card p-8 rounded-3xl neon-glow transform hover:scale-105 transition-all duration-300">
              <div className="feature-icon mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Market Analysis</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Real-time AI-powered market insights with predictive analytics
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="luxury-card p-8 rounded-3xl neon-glow transform hover:scale-105 transition-all duration-300">
              <div className="feature-icon mx-auto mb-6">
                <LineChart className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Smart Trading</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Execute strategies with confidence using advanced AI guidance
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="luxury-card p-8 rounded-3xl neon-glow transform hover:scale-105 transition-all duration-300">
              <div className="feature-icon mx-auto mb-6">
                <PieChart className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Portfolio Optimization</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Maximize returns with intelligent asset allocation strategies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Personas Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 street-art-text font-playfair">
            For Traders & Investors
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Traders Card */}
            <div className="luxury-card p-10 rounded-3xl neon-glow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="graffiti-tag text-2xl street-art-text">TRADERS</div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-6 font-playfair">
                Day Trading Excellence
              </h3>

              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Real-time market analysis and alerts
                </li>
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Advanced technical indicators and charts
                </li>
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Risk management and position sizing
                </li>
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Backtesting and strategy optimization
                </li>
              </ul>

              <div className="ornate-border inline-block mt-8">
                <button
                  onClick={() => navigate('/sign-up')}
                  className="interactive-btn text-black font-bold py-3 px-8 rounded-xl"
                >
                  Start Trading
                </button>
              </div>
            </div>

            {/* Investors Card */}
            <div className="luxury-card p-10 rounded-3xl neon-glow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="graffiti-tag text-2xl street-art-text">INVESTORS</div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-6 font-playfair">
                Long-term Wealth Building
              </h3>

              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Portfolio diversification strategies
                </li>
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Fundamental analysis and valuations
                </li>
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Asset allocation recommendations
                </li>
                <li className="flex items-center">
                  <span className="street-art-text mr-3">→</span>
                  Tax-optimized investment planning
                </li>
              </ul>

              <div className="ornate-border inline-block mt-8">
                <button
                  onClick={() => navigate('/sign-up')}
                  className="interactive-btn text-black font-bold py-3 px-8 rounded-xl"
                >
                  Build Wealth
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 street-art-text font-playfair">
            Rebellious Luxury Trading
          </h2>

          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Where sophisticated analytics meets street-smart execution.
            <br />Experience trading that's both elegant and revolutionary.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="ornate-border">
              <button
                onClick={() => navigate('/sign-up')}
                className="interactive-btn text-black font-bold py-4 px-12 rounded-2xl text-lg"
              >
                Start Free Trial
              </button>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="text-white border-2 border-gray-600 hover:border-yellow-400 py-4 px-12 rounded-2xl text-lg font-semibold transition-all duration-300 hover:bg-yellow-400 hover:text-black"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}