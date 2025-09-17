import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    // For now, using localStorage auth like web-c
    // To enable Supabase, uncomment the supabase code and add @supabase/supabase-js to package.json

    const mockUser = { id: `user-${Date.now()}`, email }
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    return { success: true }

    /* Supabase implementation (requires @supabase/supabase-js in package.json):
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
    */
  }

  const signUp = async (name, email, password) => {
    // For now, using localStorage auth like web-c
    const mockUser = { id: `user-${Date.now()}`, name, email }
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    return { success: true }

    /* Supabase implementation:
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
    */
  }

  const signOut = async () => {
    localStorage.removeItem('user')
    setUser(null)

    /* Supabase implementation:
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
    }
    */
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)