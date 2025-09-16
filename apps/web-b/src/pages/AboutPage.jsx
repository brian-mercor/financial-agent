export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 text-center">
          About <span className="gradient-text">Our Platform</span>
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            We're revolutionizing financial advisory services by combining cutting-edge AI technology
            with real-time market data to provide personalized investment insights and portfolio management.
          </p>
          <p className="text-gray-600">
            Our platform empowers both novice and experienced investors with professional-grade tools
            and expert analysis, making sophisticated financial strategies accessible to everyone.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>AI-powered financial assistants trained on vast market data</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Real-time TradingView charts with technical indicators</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Personalized portfolio optimization and risk management</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>24/7 market monitoring and instant alerts</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Comprehensive market analysis and trend predictions</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
          <p className="text-gray-600 mb-4">
            Built on state-of-the-art large language models and advanced financial algorithms,
            our platform processes millions of data points in real-time to deliver actionable insights.
          </p>
          <p className="text-gray-600">
            We integrate with leading financial data providers and utilize TradingView's powerful
            charting capabilities to ensure you have access to the most accurate and up-to-date
            market information available.
          </p>
        </div>

        <div className="text-center mt-12">
          <button className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  )
}