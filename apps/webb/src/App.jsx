import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { HomePage } from './components/HomePage'

function App() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}

export default App