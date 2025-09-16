import React, { useEffect } from 'react'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import InterestSection from './components/InterestSection'
import ComparisonSection from './components/ComparisonSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    // Animate elements on scroll
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

    // Smooth scroll for navigation links
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll)
    })

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll)
      })
    }
  }, [])

  return (
    <div className="bg-gray-50">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <InterestSection />
      <ComparisonSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App