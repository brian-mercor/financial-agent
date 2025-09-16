import { useState, useEffect, useRef } from 'react'

function App() {
  const [currentRate, setCurrentRate] = useState(0)
  const targetRate = 95.00
  const increment = 0.95
  const metricSectionRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Set up intersection observer for slide-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.slide-in').forEach(el => {
      observer.observe(el)
    })

    // Metric animation observer
    const metricObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !hasAnimated) {
        animateMetric()
        setHasAnimated(true)
      }
    })

    if (metricSectionRef.current) {
      metricObserver.observe(metricSectionRef.current)
    }

    return () => {
      observer.disconnect()
      metricObserver.disconnect()
    }
  }, [hasAnimated])

  const animateMetric = () => {
    let rate = 0
    const interval = setInterval(() => {
      rate += increment
      if (rate >= targetRate) {
        setCurrentRate(targetRate)
        clearInterval(interval)
      } else {
        setCurrentRate(rate)
      }
    }, 20)
  }

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold gradient-text">YourApp</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="text-gray-700 hover:text-purple-600 transition">Features</a>
              <a href="#metrics" onClick={(e) => handleSmoothScroll(e, '#metrics')} className="text-gray-700 hover:text-purple-600 transition">Metrics</a>
              <a href="#compare" onClick={(e) => handleSmoothScroll(e, '#compare')} className="text-gray-700 hover:text-purple-600 transition">Compare</a>
              <a href="#download" onClick={(e) => handleSmoothScroll(e, '#download')} className="text-gray-700 hover:text-purple-600 transition">Get Started</a>
            </div>
            <button className="gradient-bg text-white px-6 py-2 rounded-full hover:shadow-lg transition">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 slide-in">
                Your Main <span className="gradient-text">Value Proposition</span> Here
              </h1>
              <p className="text-xl text-gray-600 mb-8 slide-in">
                A compelling description of your product or service that explains the key benefits and why users should care about what you're offering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 slide-in">
                <button className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition pulse">
                  Primary Action
                </button>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition">
                  Secondary Action
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center float-animation">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold gradient-text mb-2">Dashboard</div>
                      <div className="text-gray-600">Overview</div>
                      <div className="text-4xl font-bold text-gray-900">$0,000.00</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-4">
                      <div className="text-sm opacity-90">Key Metric</div>
                      <div className="text-3xl font-bold">+00.00%</div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-xl p-4 flex justify-between">
                        <span className="text-gray-700">Status Item</span>
                        <span className="text-green-500">Active</span>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-4 flex justify-between">
                        <span className="text-gray-700">Recent Activity</span>
                        <span className="text-gray-900">Value</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose <span className="gradient-text">YourApp</span>?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Feature One</h3>
              <p className="text-gray-600">Description of your first key feature and how it benefits users. Keep it concise and impactful.</p>
            </div>
            <div className="card-hover bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Feature Two</h3>
              <p className="text-gray-600">Explain your second major feature and why it matters to your target audience.</p>
            </div>
            <div className="card-hover bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Feature Three</h3>
              <p className="text-gray-600">Highlight your third key differentiator and the value it provides to users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" ref={metricSectionRef} className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Impressive Metrics That Matter</h2>
            <p className="text-xl opacity-90">Showcase your key performance indicators and growth</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-lg mb-2">Key Performance Metric</div>
              <div className="interest-counter text-white">{currentRate.toFixed(0)}%</div>
              <div className="text-lg opacity-90">Compared to industry average</div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">Before</div>
                <div className="opacity-90">Previous State</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">After</div>
                <div className="opacity-90">With YourApp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="compare" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">See the <span className="gradient-text">Difference</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="gradient-bg text-white">
                <tr>
                  <th className="p-6 text-left">Feature</th>
                  <th className="p-6 text-center">YourApp</th>
                  <th className="p-6 text-center">Competitor A</th>
                  <th className="p-6 text-center">Competitor B</th>
                  <th className="p-6 text-center">Traditional Solution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-6 font-semibold">Feature 1</td>
                  <td className="p-6 text-center text-green-500 font-bold">Best</td>
                  <td className="p-6 text-center text-red-500">Limited</td>
                  <td className="p-6 text-center text-red-500">Basic</td>
                  <td className="p-6 text-center text-red-500">None</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-6 font-semibold">Feature 2</td>
                  <td className="p-6 text-center text-green-500 font-bold">Excellent</td>
                  <td className="p-6 text-center text-gray-500">Good</td>
                  <td className="p-6 text-center text-gray-500">Fair</td>
                  <td className="p-6 text-center text-gray-500">Poor</td>
                </tr>
                <tr className="border-b">
                  <td className="p-6 font-semibold">Feature 3</td>
                  <td className="p-6 text-center">✅</td>
                  <td className="p-6 text-center">✅</td>
                  <td className="p-6 text-center">✅</td>
                  <td className="p-6 text-center">❌</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-6 font-semibold">Feature 4</td>
                  <td className="p-6 text-center">✅</td>
                  <td className="p-6 text-center">❌</td>
                  <td className="p-6 text-center">❌</td>
                  <td className="p-6 text-center">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started with <span className="gradient-text">YourApp</span>?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied users who have already transformed their experience with our solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="bg-black rounded-xl px-8 py-4 inline-flex items-center hover:shadow-xl transition cursor-pointer">
              <svg className="w-10 h-10 mr-4" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-white text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-xl font-semibold">App Store</div>
              </div>
            </div>
            <div className="bg-black rounded-xl px-8 py-4 inline-flex items-center hover:shadow-xl transition cursor-pointer">
              <svg className="w-10 h-10 mr-4" viewBox="0 0 24 24" fill="white">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-white text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-xl font-semibold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-bg text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-3xl font-bold mb-4 md:mb-0">YourApp</div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:opacity-80 transition">Privacy</a>
              <a href="#" className="hover:opacity-80 transition">Terms</a>
              <a href="#" className="hover:opacity-80 transition">Support</a>
              <a href="#" className="hover:opacity-80 transition">Contact</a>
            </div>
            <div className="text-sm opacity-80">© 2024 YourApp. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App