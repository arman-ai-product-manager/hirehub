const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization || ''
  const jwt = authHeader.replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })

  const { job_id, app } = req.body || {}
  if (!job_id || !app) return res.status(400).json({ error: 'job_id and app required' })

  const uid = user.id
  const today = new Date().toISOString().slice(0, 10)

  try {
    // ── Re-validate: banned ───────────────────────────────────────
    const { data: cand } = await supabaseService
      .from('candidates')
      .select('id,name,skills,experience_years,bio,is_banned')
      .eq('id', uid).maybeSingle()

    if (cand?.is_banned) return res.status(403).json({ error: 'Account suspended' })

    const hasProfile = cand && cand.name &&
      cand.skills && (Array.isArray(cand.skills) ? cand.skills.length > 0 : cand.skills) &&
      cand.experience_years
    if (!hasProfile) return res.status(400).json({ error: 'Profile incomplete' })
    if (!cand.bio)   return res.status(400).json({ error: 'CV required before applying' })

    // ── Re-validate: daily limit ──────────────────────────────────
    const { data: limitRow } = await supabaseService
      .from('apply_limits').select('daily_count,apply_date').eq('candidate_id', uid).maybeSingle()
    const dailyUsed = (limitRow && limitRow.apply_date === today) ? (limitRow.daily_count || 0) : 0
    if (dailyUsed >= 10) return res.status(429).json({ error: 'Daily apply limit reached' })

    // ── Fetch job details ─────────────────────────────────────────
    const { data: job } = await supabaseService
      .from('jobs').select('id,company_id,company_name,title,status').eq('id', job_id).maybeSingle()
    if (!job || job.status !== 'active') return res.status(404).json({ error: 'Job not found or no longer active' })

    // ── 30-day spam guard ─────────────────────────────────────────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { count: recentCount } = await supabaseService
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('candidate_id', uid)
      .eq('company_id', job.company_id)
      .gte('applied_at', thirtyDaysAgo)
    if (recentCount > 0) return res.status(400).json({ error: 'You applied to this company recently. Try again after 30 days.' })

    // ── Insert application ────────────────────────────────────────
    const appId = app.id || ('APP' + Date.now())
    const { error: insertErr } = await supabaseService.from('applications').upsert({
      id:             appId,
      job_id:         job_id,
      candidate_id:   uid,
      company_id:     job.company_id,
      company:        job.company_name,
      job_title:      job.title,
      candidate_name: cand.name,
      role:           app.role || '',
      skills:         cand.skills || [],
      fit_score:      app.fitScore || null,
      status:         'applied',
      applied_at:     new Date().toISOString(),
      updated_at:     new Date().toISOString(),
    }, { onConflict: 'id', ignoreDuplicates: false })

    if (insertErr) return res.status(500).json({ error: insertErr.message })

    // ── Increment daily counter ───────────────────────────────────
    if (limitRow && limitRow.apply_date === today) {
      await supabaseService.from('apply_limits')
        .update({ daily_count: dailyUsed + 1, updated_at: new Date().toISOString() })
        .eq('candidate_id', uid)
    } else {
      await supabaseService.from('apply_limits')
        .upsert({ candidate_id: uid, apply_date: today, daily_count: 1, updated_at: new Date().toISOString() },
          { onConflict: 'candidate_id' })
    }

    // ── Audit log ─────────────────────────────────────────────────
    await supabaseService.from('audit_log').insert({
      actor_id:    uid,
      actor_role:  'candidate',
      action:      'apply',
      target_type: 'job',
      target_id:   job_id,
      metadata:    { company_id: job.company_id, company: job.company_name, title: job.title },
    }).catch(() => {})

    return res.json({ ok: true, application_id: appId, daily_used: dailyUsed + 1, daily_limit: 10 })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
