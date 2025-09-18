import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // AUTO-LOGIN for testing - remove in production
      const testUser = { id: 'test-user-' + Date.now(), email: 'test@example.com', name: 'Test User' }
      localStorage.setItem('user', JSON.stringify(testUser))
      setUser(testUser)
      console.log('Auto-logged in with test user for development')
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    // Mock authentication - replace with actual API call
    const mockUser = { id: Date.now().toString(), email }
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    return { success: true }
  }

  const signUp = async (name, email, password) => {
    // Mock signup - replace with actual API call
    const mockUser = { id: Date.now().toString(), email, name }
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    return { success: true }
  }

  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)