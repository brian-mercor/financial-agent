import { Outlet, useLocation } from 'react-router-dom'
import { Navigation } from './Navigation'

export function Layout() {
  const location = useLocation()
  const isChat = location.pathname.startsWith('/chat/')

  return (
    <div className="min-h-screen flex flex-col">
      {!isChat && <Navigation />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isChat && (
        <footer className="gradient-bg text-white py-8 mt-auto">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-xl font-bold mb-4 md:mb-0">FinanceAI</div>
              <div className="flex gap-6 mb-4 md:mb-0">
                <a href="#" className="hover:opacity-80 transition">Privacy</a>
                <a href="#" className="hover:opacity-80 transition">Terms</a>
                <a href="#" className="hover:opacity-80 transition">Support</a>
                <a href="#" className="hover:opacity-80 transition">Contact</a>
              </div>
              <div className="text-sm opacity-80">© 2024 FinanceAI. All rights reserved.</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}