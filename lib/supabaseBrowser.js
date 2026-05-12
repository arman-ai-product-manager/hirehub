import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co'
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Singleton browser client — anon key only, safe to expose
let _client = null
export function getBrowserClient() {
  if (!_client) _client = createClient(supabaseUrl, supabaseAnon)
  return _client
}
