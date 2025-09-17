import { Link } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { TrendingUp, Shield, Brain, ChartBar, Zap, Users, Star, Check, ArrowRight, DollarSign, BarChart, PieChart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen handdrawn-bg">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="handdrawn-circle w-64 h-64 top-24 left-10 bg-pink-200"></div>
        <div className="handdrawn-circle w-48 h-48 bottom-12 right-20 bg-blue-200"></div>

        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="folk-title text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Your <span className="rainbow-gradient">Financial Future</span>
            </h1>
            <p className="text-xl mb-8 max-w-lg">
              AI-powered financial intelligence that transforms complex market data into clear, actionable insights. Your personal team of expert advisors, available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="outsider-button px-8 py-4 text-center text-lg">
                Start Free Trial
              </Link>
              <Link to="#how-it-works" className="outsider-button bg-white px-8 py-4 text-center text-lg">
                See How It Works
              </Link>
            </div>

            <div className="mt-10 flex items-center space-x-6">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-12 h-12 rounded-full border-3 border-white" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-12 h-12 rounded-full border-3 border-white" />
                <img src="https://randomuser.me/api/portraits/men/68.jpg" alt="User" className="w-12 h-12 rounded-full border-3 border-white" />
                <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="User" className="w-12 h-12 rounded-full border-3 border-white" />
              </div>
              <p className="text-sm font-medium">Trusted by <span className="font-bold">10,000+</span> investors</p>
            </div>
          </div>

          <div className="relative">
            <div className="outsider-border bg-white p-6 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Trading Dashboard"
                className="rounded-lg w-full h-auto"
              />

              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg outsider-border transform rotate-3">
                <div className="folk-text font-bold text-xl">Portfolio +24.3%</div>
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Live Trading</span>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-lg outsider-border transform -rotate-6">
                <div className="folk-text font-bold">AI Analysis</div>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative scribbles */}
            <svg className="absolute -z-10 left-0 top-1/2 w-full" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,50 C30,20 50,80 70,50 C90,20 110,80 130,50 C150,20 170,80 190,50 C210,20 230,80 250,50 C270,20 290,80 310,50" fill="none" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,10" />
            </svg>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 px-6 md:px-12 bg-white border-t-4 border-b-4 border-dashed border-dark">
        <div className="container mx-auto">
          <p className="text-center folk-text text-xl mb-8">Trusted by leading investors and financial institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="grayscale hover:grayscale-0 transition-all">
              <img src="https://via.placeholder.com/150x50/4ECDC4/FFFFFF?text=WealthTech" alt="WealthTech" className="h-10" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all">
              <img src="https://via.placeholder.com/150x50/FF6B6B/FFFFFF?text=TradeFlow" alt="TradeFlow" className="h-10" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all">
              <img src="https://via.placeholder.com/150x50/FFD166/000000?text=InvestPro" alt="InvestPro" className="h-10" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all">
              <img src="https://via.placeholder.com/150x50/2E3440/FFFFFF?text=MarketIQ" alt="MarketIQ" className="h-10" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all">
              <img src="https://via.placeholder.com/150x50/F7F9FC/2E3440?text=FinanceAI" alt="FinanceAI" className="h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 relative">
        <div className="container mx-auto text-center mb-16">
          <h2 className="folk-title text-4xl md:text-5xl font-bold mb-4">Financial Intelligence Unleashed</h2>
          <p className="text-xl max-w-2xl mx-auto">Our AI combines institutional-grade analysis with personalized insights to help you make smarter investment decisions.</p>
        </div>

        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="folk-card p-8 flex flex-col items-center text-center float-animation">
            <div className="feature-icon">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="folk-text text-2xl font-bold mb-3">Real-Time Market Analysis</h3>
            <p className="mb-4">Advanced AI algorithms analyze market trends, patterns, and sentiment across global markets 24/7.</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Live price tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Technical indicators</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Market sentiment analysis</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="folk-card p-8 flex flex-col items-center text-center float-animation float-animation-delay-1">
            <div className="feature-icon" style={{ backgroundColor: 'var(--primary)' }}>
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="folk-text text-2xl font-bold mb-3">AI-Powered Insights</h3>
            <p className="mb-4">Multiple specialized AI assistants work together to provide comprehensive financial guidance.</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Personalized recommendations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Risk assessment</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Portfolio optimization</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="folk-card p-8 flex flex-col items-center text-center float-animation float-animation-delay-2">
            <div className="feature-icon" style={{ backgroundColor: 'var(--accent)' }}>
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="folk-text text-2xl font-bold mb-3">Risk Management</h3>
            <p className="mb-4">Sophisticated risk analysis tools help protect your capital and maximize returns.</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Position sizing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Stop-loss optimization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Hedging strategies</span>
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="folk-card p-8 flex flex-col items-center text-center float-animation float-animation-delay-3">
            <div className="feature-icon" style={{ backgroundColor: '#A3D9FF' }}>
              <ChartBar className="h-8 w-8" />
            </div>
            <h3 className="folk-text text-2xl font-bold mb-3">Professional Charting</h3>
            <p className="mb-4">TradingView integration provides institutional-grade charting and technical analysis tools.</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Advanced indicators</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Multi-timeframe analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Pattern recognition</span>
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="folk-card p-8 flex flex-col items-center text-center float-animation">
            <div className="feature-icon" style={{ backgroundColor: '#FFB6C1' }}>
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="folk-text text-2xl font-bold mb-3">Instant Execution</h3>
            <p className="mb-4">Lightning-fast trade recommendations and portfolio adjustments based on real-time data.</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Real-time alerts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Automated rebalancing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Quick trade signals</span>
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="folk-card p-8 flex flex-col items-center text-center float-animation float-animation-delay-1">
            <div className="feature-icon" style={{ backgroundColor: '#C8E6C9' }}>
              <Users className="h-8 w-8" />
            </div>
            <h3 className="folk-text text-2xl font-bold mb-3">Expert Community</h3>
            <p className="mb-4">Connect with experienced traders and learn from collective market intelligence.</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Strategy sharing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Live discussions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 mt-1" />
                <span>Performance tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Assistants Section */}
      <section id="assistants" className="py-20 px-6 md:px-12 bg-white border-t-4 border-dashed border-dark">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="folk-title text-4xl md:text-5xl font-bold mb-4">Your AI Financial Team</h2>
            <p className="text-xl max-w-2xl mx-auto">Six specialized AI assistants working together to maximize your financial success.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="folk-card p-6 text-center">
              <div className="feature-icon mx-auto bg-blue-500">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="folk-text text-xl font-bold mb-2">Market Analyst</h3>
              <p className="text-sm">Technical analysis, chart patterns, and market trend identification.</p>
            </div>

            <div className="folk-card p-6 text-center">
              <div className="feature-icon mx-auto bg-green-500">
                <BarChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="folk-text text-xl font-bold mb-2">Trading Advisor</h3>
              <p className="text-sm">Entry/exit strategies, position sizing, and trade management.</p>
            </div>

            <div className="folk-card p-6 text-center">
              <div className="feature-icon mx-auto bg-purple-500">
                <PieChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="folk-text text-xl font-bold mb-2">Portfolio Manager</h3>
              <p className="text-sm">Asset allocation, diversification, and rebalancing strategies.</p>
            </div>

            <div className="folk-card p-6 text-center">
              <div className="feature-icon mx-auto bg-yellow-500">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="folk-text text-xl font-bold mb-2">Financial Planner</h3>
              <p className="text-sm">Long-term planning, retirement, and tax optimization.</p>
            </div>

            <div className="folk-card p-6 text-center">
              <div className="feature-icon mx-auto bg-red-500">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="folk-text text-xl font-bold mb-2">Risk Manager</h3>
              <p className="text-sm">Risk assessment, hedging strategies, and capital protection.</p>
            </div>

            <div className="folk-card p-6 text-center">
              <div className="feature-icon mx-auto bg-indigo-500">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="folk-text text-xl font-bold mb-2">Economic Analyst</h3>
              <p className="text-sm">Macro trends, policy impact, and economic indicators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="folk-title text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl max-w-2xl mx-auto">See how FinAgent has transformed the investment journey for thousands of users.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="folk-card p-6 testimonial">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 italic">"FinAgent's AI helped me increase my portfolio returns by 35% in just 6 months. The real-time insights are invaluable."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="User" className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <p className="folk-text font-bold">Michael Chen</p>
                  <p className="text-sm text-gray-600">Day Trader</p>
                </div>
              </div>
            </div>

            <div className="folk-card p-6 testimonial">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 italic">"The risk management tools saved my portfolio during the last market correction. Absolutely essential for serious investors."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/67.jpg" alt="User" className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <p className="folk-text font-bold">Sarah Williams</p>
                  <p className="text-sm text-gray-600">Portfolio Manager</p>
                </div>
              </div>
            </div>

            <div className="folk-card p-6 testimonial">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 italic">"From a complete beginner to confident investor in 3 months. The AI assistants make complex strategies simple to understand."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="User" className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <p className="folk-text font-bold">James Rodriguez</p>
                  <p className="text-sm text-gray-600">New Investor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-white border-t-4 border-dashed border-dark">
        <div className="container mx-auto text-center">
          <h2 className="folk-title text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Trading?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of investors using AI to make smarter, more profitable decisions.</p>
          <Link to="/signup" className="outsider-button px-12 py-4 text-xl inline-flex items-center gap-2">
            Start Your Free Trial <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="mt-6 text-sm text-gray-600">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t-4 border-dashed border-dark">
        <div className="container mx-auto text-center">
          <p className="folk-text text-lg">&copy; 2024 FinAgent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}