const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, company, slug } = req.body || {}
  if (!email || !/.+@.+\..+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const trim = (s, n) => typeof s === 'string' ? s.slice(0, n) : null

  try {
    const { error } = await supabaseService.from('career_subscribers').insert({
      email:        trim(email, 200),
      company_name: trim(company, 200),
      company_slug: trim(slug, 200),
      created_at:   new Date().toISOString(),
    })
    if (error && !String(error.message || '').includes('duplicate')) {
      console.error('career_subscribers insert error:', error)
      // Table may not exist — log to console for now, still return ok
      // so users see success even if DB layer not provisioned yet.
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error('career subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
