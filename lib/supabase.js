const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV !== 'development') {
  console.error('═══════════════════════════════════════════════════════════════')
  console.error('[supabase] CRITICAL: SUPABASE_SERVICE_ROLE_KEY not set!')
  console.error('Service client falling back to anon key.')
  console.error('Privileged DB operations (admin auth, RLS bypass) WILL FAIL.')
  console.error('Set SUPABASE_SERVICE_ROLE_KEY in Vercel env vars.')
  console.error('═══════════════════════════════════════════════════════════════')
}

// Service role client — server-side only (API routes). Never expose to browser.
const supabaseService = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnon
)

module.exports = { supabaseService, supabaseUrl, supabaseAnon }
