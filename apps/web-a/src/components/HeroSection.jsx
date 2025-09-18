import React from 'react'
import PhoneMockup from './PhoneMockup'

function HeroSection() {
  return (
    <section className="pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 slide-in">
              Your AI Partner for <span className="gradient-text">Smarter Trading</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 slide-in">
              Finagent combines advanced AI models with real-time market data—delivering instant analysis,
              portfolio optimization, and trading strategies. Built for traders, investors, and financial professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 slide-in">
              <a href="/login" className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition pulse inline-block text-center">
                Start Trading Now
              </a>
              <a href="#features" className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition inline-block text-center">
                See AI in Action
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center float-animation">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection