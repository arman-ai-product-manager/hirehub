/**
 * POST /api/cv/unlock
 * Deducts 1 CV credit from the company and records the unlock.
 * Returns the candidate's real phone + email.
 *
 * Body: { candidateId: string }   ← Supabase UUID of the candidate
 * Auth: Authorization: Bearer <supabase-jwt>
 */
const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ── Auth ──────────────────────────────────────────────────────
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })
  if (user.user_metadata?.role !== 'company')
    return res.status(403).json({ error: 'Only company accounts can unlock CVs' })

  const { candidateId } = req.body || {}
  if (!candidateId) return res.status(400).json({ error: 'candidateId required' })

  const companyId = user.id

  try {
    // ── Check existing unlock (idempotent) ────────────────────
    const { data: existing } = await supabaseService
      .from('cv_unlocks')
      .select('id')
      .eq('company_id', companyId)
      .eq('candidate_id', candidateId)
      .maybeSingle()

    if (!existing) {
      // ── Check + deduct credits atomically ─────────────────
      const { data: company, error: coErr } = await supabaseService
        .from('companies')
        .select('cv_credits')
        .eq('id', companyId)
        .single()

      if (coErr || !company) return res.status(404).json({ error: 'Company not found' })
      if ((company.cv_credits || 0) < 1)
        return res.status(402).json({ error: 'No credits remaining', code: 'NO_CREDITS' })

      // Deduct 1 credit
      const { error: deductErr } = await supabaseService
        .from('companies')
        .update({ cv_credits: company.cv_credits - 1 })
        .eq('id', companyId)
        .eq('cv_credits', company.cv_credits) // optimistic lock

      if (deductErr) return res.status(409).json({ error: 'Credit deduction failed, please retry' })

      // Record unlock
      await supabaseService.from('cv_unlocks').insert({
        company_id:   companyId,
        candidate_id: candidateId,
      })
    }

    // ── Fetch real contact info ───────────────────────────────
    const { data: candidate, error: cdErr } = await supabaseService
      .from('candidates')
      .select('name, phone, email')
      .eq('id', candidateId)
      .single()

    if (cdErr || !candidate)
      return res.status(404).json({ error: 'Candidate not found' })

    // Fetch updated credits
    const { data: updatedCo } = await supabaseService
      .from('companies')
      .select('cv_credits')
      .eq('id', companyId)
      .single()

    return res.json({
      ok:          true,
      phone:       candidate.phone || '',
      email:       candidate.email || '',
      name:        candidate.name  || '',
      creditsLeft: updatedCo?.cv_credits ?? 0,
    })
  } catch (err) {
    console.error('CV unlock error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
