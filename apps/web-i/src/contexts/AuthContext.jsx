import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check for existing session
    checkSession()

    // Set up auth state listener if Supabase is configured
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      // Fallback to localStorage for demo purposes
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // AUTO-LOGIN for testing - remove in production
        const testUser = { id: 'test-user-' + Date.now(), email: 'test@example.com' }
        localStorage.setItem('user', JSON.stringify(testUser))
        setUser(testUser)
        console.log('Auto-logged in with test user for development')
      }
      setLoading(false)
    }
  }, [])

  const checkSession = async () => {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }
    setLoading(false)
  }

  const signUp = async (email, password) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        return { user: data.user, error: null }
      } catch (error) {
        return { user: null, error }
      }
    } else {
      // Fallback for demo
      const mockUser = { id: Date.now().toString(), email }
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { user: mockUser, error: null }
    }
  }

  const signIn = async (email, password) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return { user: data.user, error: null }
      } catch (error) {
        return { user: null, error }
      }
    } else {
      // Fallback for demo
      const mockUser = { id: Date.now().toString(), email }
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { user: mockUser, error: null }
    }
  }

  const signOut = async () => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch (error) {
        console.error('Error signing out:', error)
      }
    } else {
      localStorage.removeItem('user')
    }
    setUser(null)
    setSession(null)
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    supabase
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}