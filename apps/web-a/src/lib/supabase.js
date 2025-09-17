import { createClient } from '@supabase/supabase-js'

// Support both VITE_ prefixed and NEXT_PUBLIC_ prefixed env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ||
                   'https://fuaogvgmdgndldimnnrs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                       import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging to check env vars
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key exists:', !!supabaseAnonKey)
console.log('Supabase Anon Key length:', supabaseAnonKey?.length)

if (!supabaseAnonKey) {
  console.error('Missing Supabase Anon Key! Check your .env.local file')
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Create client with auth options for new publishable keys
// Note: Publishable keys (sb_publishable_*) require specific auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Required for publishable keys
  }
})