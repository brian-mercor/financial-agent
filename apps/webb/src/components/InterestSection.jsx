import React, { useState, useEffect, useRef } from 'react'

function InterestSection() {
  const [currentValue, setCurrentValue] = useState(0)
  const targetValue = 95
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
          <h2 className="text-4xl font-bold mb-6">Maximize Your Benefits</h2>
          <p className="text-xl opacity-90">Experience the power of our platform</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-lg mb-2">Performance Score</div>
            <div className="text-6xl font-bold text-white">{currentValue}%</div>
            <div className="text-lg opacity-90">Better than traditional solutions</div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10x</div>
              <div className="opacity-90">Faster Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="opacity-90">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InterestSection