import { createClient } from '@supabase/supabase-js'

// Support both VITE_ prefixed and NEXT_PUBLIC_ prefixed env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ||
                   'https://fuaogvgmdgndldimnnrs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                       import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1YW9ndmdtZGduZGxkaW1ubnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY2ODQ0MjIsImV4cCI6MTk2MjI2MDQyMn0.dummy-key-for-build'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)