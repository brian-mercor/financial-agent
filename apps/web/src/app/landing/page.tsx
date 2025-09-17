'use client';

import Link from 'next/link';
import { TrendingUp, Shield, Zap, Sparkles, ArrowRight, LineChart, PieChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">Fin Agent</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Your AI-Powered <span className="text-blue-600">Financial Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get expert financial advice, market analysis, and portfolio management
              powered by advanced AI technology
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">Advanced AI models providing real-time market analysis and personalized advice</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Market Data</h3>
              <p className="text-gray-600">Interactive charts and real-time market data to make informed decisions</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Bank-level security with Supabase authentication to protect your data</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistants Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Your AI Financial Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Analyst</h3>
              <p className="text-gray-600 mb-4">Expert in market trends and technical analysis</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Technical Analysis</li>
                <li>• Market Trends</li>
                <li>• Chart Patterns</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trading Advisor</h3>
              <p className="text-gray-600 mb-4">Specialized in trading strategies and risk management</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Trading Strategies</li>
                <li>• Risk Management</li>
                <li>• Position Sizing</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Portfolio Manager</h3>
              <p className="text-gray-600 mb-4">Focused on portfolio optimization and asset allocation</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Asset Allocation</li>
                <li>• Diversification</li>
                <li>• Rebalancing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Trading Smarter?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already using AI to make better financial decisions
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">Fin Agent</div>
            <div className="flex gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-blue-400 transition">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition">Terms</a>
              <a href="#" className="hover:text-blue-400 transition">Support</a>
              <a href="#" className="hover:text-blue-400 transition">Contact</a>
            </div>
            <div className="text-sm opacity-80">© 2024 Fin Agent. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}