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

  // GET /api/screener/jobs — list jobs for this company
  if (req.method === 'GET') {
    const { data, error } = await supabaseService
      .from('screener_jobs')
      .select('id,title,skills,status,created_at') // description excluded — not shown in dashboard, can be large
      .eq('company_id', user.id)
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })

    // Attach resume counts
    const ids = (data || []).map(j => j.id)
    let counts = {}
    if (ids.length > 0) {
      const { data: totals } = await supabaseService
        .from('screener_resumes')
        .select('job_id,status')
        .in('job_id', ids)
      ;(totals || []).forEach(r => {
        if (!counts[r.job_id]) counts[r.job_id] = { total: 0, done: 0 }
        counts[r.job_id].total++
        if (r.status === 'done') counts[r.job_id].done++
      })
    }

    return res.json({ jobs: (data || []).map(j => ({ ...j, ...( counts[j.id] || { total: 0, done: 0 }) })) })
  }

  // POST /api/screener/jobs — create job
  if (req.method === 'POST') {
    const { title, description, skills } = req.body || {}
    if (!title?.trim() || !description?.trim())
      return res.status(400).json({ error: 'title and description required' })

    const { data, error } = await supabaseService
      .from('screener_jobs')
      .insert({ company_id: user.id, title: title.trim(), description: description.trim(), skills: skills || [] })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ job: data })
  }

  // DELETE /api/screener/jobs?id=xxx
  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabaseService
      .from('screener_jobs')
      .delete()
      .eq('id', id)
      .eq('company_id', user.id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
