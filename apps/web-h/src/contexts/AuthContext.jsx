import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      // AUTO-LOGIN for testing when Supabase not configured
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        const testUser = { id: 'test-user-' + Date.now(), email: 'test@example.com' }
        localStorage.setItem('user', JSON.stringify(testUser))
        setUser(testUser)
        console.log('Auto-logged in with test user (no Supabase configured)')
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!supabase) {
      console.warn('Supabase not configured - using mock authentication')
      const mockUser = { id: Date.now().toString(), email }
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { success: true }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  const signUp = async (email, password, name) => {
    if (!supabase) {
      console.warn('Supabase not configured - using mock authentication')
      const mockUser = { id: Date.now().toString(), email, name }
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { success: true }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem('user')
      setUser(null)
      return
    }

    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}