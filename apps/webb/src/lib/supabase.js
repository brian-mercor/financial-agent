import { createClient } from '@supabase/supabase-js'

// Support both VITE_ prefixed and NEXT_PUBLIC_ prefixed env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ||
                   'https://fuaogvgmdgndldimnnrs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                       import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client with auth options for new publishable keys
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})