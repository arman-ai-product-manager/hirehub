const { supabaseService } = require('../../../lib/supabase')

const VALID_STATUSES = ['applied', 'screening', 'interview', 'final', 'offer', 'hired', 'rejected']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })
  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })

  const { id, status } = req.body || {}
  if (!id || !status) return res.status(400).json({ error: 'id and status required' })
  if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' })

  try {
    // Verify the application belongs to this company
    const { data: app } = await supabaseService
      .from('applications').select('company_id').eq('id', id).maybeSingle()
    if (!app || app.company_id !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const { error } = await supabaseService
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    return res.status(200).json({ ok: true, id, status })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
