const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV !== 'development') {
  console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY not set — service client using anon key, privileged DB operations will fail')
}

// Service role client — server-side only (API routes). Never expose to browser.
const supabaseService = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnon
)

module.exports = { supabaseService, supabaseUrl, supabaseAnon }
