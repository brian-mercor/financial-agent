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
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    // MOCK AUTHENTICATION - Not connected to real backend
    // TODO: Replace with actual Supabase authentication
    try {
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0],
        isMockData: true // Clearly indicate this is mock data
      }

      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      console.warn('MOCK AUTH: Using mock authentication - not connected to real backend')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password) => {
    // MOCK SIGNUP - Not connected to real backend
    // TODO: Replace with actual Supabase signup
    return signIn(email, password)
  }

  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}