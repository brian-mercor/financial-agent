import { AssistantCard } from '../components/AssistantCard'
import { assistants } from '../config/assistants'
import { Sparkles, Shield, Zap, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Your AI-Powered <span className="gradient-text">Financial Assistant</span>
            </h1>
            <p className="text-xl text-gray-600">
              Get expert financial advice, market analysis, and portfolio management with our AI assistants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {assistants.map((assistant) => (
              <AssistantCard key={assistant.id} assistant={assistant} />
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600 text-sm">Advanced AI models providing real-time market analysis</p>
              </div>
              <div className="text-center">
                <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Live Charts</h3>
                <p className="text-gray-600 text-sm">Interactive TradingView charts for technical analysis</p>
              </div>
              <div className="text-center">
                <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Risk Management</h3>
                <p className="text-gray-600 text-sm">Comprehensive risk assessment and portfolio protection</p>
              </div>
              <div className="text-center">
                <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Real-Time Analysis</h3>
                <p className="text-gray-600 text-sm">Instant market data and trend analysis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Trading Smarter?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose an assistant above to get personalized financial advice and market analysis
          </p>
          <button className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  )
}