const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id, status } = req.body || {}
  if (!id || !status) return res.status(400).json({ error: 'id and status required' })

  const VALID_STATUSES = ['applied', 'screening', 'interview', 'final', 'offer', 'hired', 'rejected']
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
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
