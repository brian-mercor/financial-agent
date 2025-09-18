import React, { useState, useEffect, useRef } from 'react'

function InterestSection() {
  const [currentValue, setCurrentValue] = useState(0)
  const targetValue = 68
  const sectionRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        animateCounter()
      }
    })

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const animateCounter = () => {
    const increment = targetValue / 50
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        current = targetValue
        clearInterval(timer)
      }
      setCurrentValue(Math.floor(current))
    }, 30)
  }

  return (
    <section ref={sectionRef} id="benefits" className="py-20 gradient-bg text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Maximize Your Trading Profits</h2>
          <p className="text-xl opacity-90">AI-powered insights that outperform the market</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-lg mb-2">Average Win Rate</div>
            <div className="text-6xl font-bold text-white">{currentValue}%</div>
            <div className="text-lg opacity-90">Success rate with AI-powered signals</div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Market Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="opacity-90">Active Traders</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InterestSection