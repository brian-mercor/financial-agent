import React from 'react'

function Footer() {
  return (
    <footer className="gradient-bg text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-3xl font-bold mb-4 md:mb-0">Finagent</div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:opacity-80 transition">Privacy</a>
            <a href="#" className="hover:opacity-80 transition">Terms</a>
            <a href="#" className="hover:opacity-80 transition">Support</a>
            <a href="#" className="hover:opacity-80 transition">Contact</a>
          </div>
          <div className="text-sm opacity-80">© 2025 Finagent AI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer