const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })

  try {
    const { data, error } = await supabaseService
      .from('applications')
      .select('id,job_id,company,job_title,role,fit_score,status,applied_at,updated_at')
      .eq('candidate_id', user.id)
      .order('applied_at', { ascending: false })
      .limit(200)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, applications: data || [] })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
