const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization || ''
  const jwt = authHeader.replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })

  const { job_id, company_id } = req.body || {}
  if (!job_id) return res.status(400).json({ error: 'job_id required' })

  const uid = user.id

  try {
    // ── Check 1: Account banned ───────────────────────────────────
    const { data: cand } = await supabaseService
      .from('candidates')
      .select('id,name,skills,experience_years,bio,is_banned')
      .eq('id', uid)
      .maybeSingle()

    if (cand?.is_banned) {
      return res.json({ allowed: false, reason: 'account_banned' })
    }

    // ── Check 2: Profile completeness ─────────────────────────────
    const hasProfile = cand && cand.name &&
      cand.skills && (Array.isArray(cand.skills) ? cand.skills.length > 0 : cand.skills) &&
      cand.experience_years
    if (!hasProfile) {
      return res.json({ allowed: false, reason: 'profile_incomplete' })
    }

    // ── Check 3: Has CV (bio or resume) ──────────────────────────
    if (!cand.bio) {
      return res.json({ allowed: false, reason: 'no_cv' })
    }

    // ── Check 4: Daily limit ──────────────────────────────────────
    const today = new Date().toISOString().slice(0, 10)
    const { data: limitRow } = await supabaseService
      .from('apply_limits')
      .select('daily_count,apply_date')
      .eq('candidate_id', uid)
      .maybeSingle()

    const dailyUsed = (limitRow && limitRow.apply_date === today) ? (limitRow.daily_count || 0) : 0
    const FREE_LIMIT = 10
    // Determine if user has paid plan
    const dailyLimit = FREE_LIMIT   // TODO: check plan from companies/profiles when candidate upgrades

    if (dailyUsed >= dailyLimit) {
      return res.json({ allowed: false, reason: 'daily_limit', daily_used: dailyUsed, daily_limit: dailyLimit })
    }

    // ── Check 5: 30-day spam guard ────────────────────────────────
    if (company_id) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const { count: recentCount } = await supabaseService
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('candidate_id', uid)
        .eq('company_id', company_id)
        .gte('applied_at', thirtyDaysAgo)

      if (recentCount > 0) {
        return res.json({ allowed: false, reason: 'applied_recently' })
      }
    }

    return res.json({ allowed: true, daily_used: dailyUsed, daily_limit: dailyLimit })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
