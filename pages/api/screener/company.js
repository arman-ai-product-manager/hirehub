const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

export default async function handler(req, res) {
  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  if (req.method === 'GET') {
    const { data } = await supabaseService
      .from('screener_companies')
      .select('*')
      .eq('company_id', user.id)
      .maybeSingle()
    return res.json({ company: data || { company_id: user.id, name: '', logo_url: null } })
  }

  if (req.method === 'PUT') {
    const { name, logo_url } = req.body || {}
    const updates = {}
    if (typeof name     === 'string') updates.name     = name.trim().slice(0, 100)
    if (typeof logo_url === 'string') updates.logo_url = logo_url || null

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    const { data, error: dbErr } = await supabaseService
      .from('screener_companies')
      .upsert({ company_id: user.id, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'company_id' })
      .select()
      .single()

    if (dbErr) return res.status(500).json({ error: dbErr.message })
    return res.json({ ok: true, company: data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
