/**
 * POST /api/cv/credits/add
 * Adds CV credits to a company's account after a successful payment.
 *
 * Body: { amount: number }   ← number of credits to add
 * Auth: Authorization: Bearer <supabase-jwt>
 */
const { supabaseService } = require('../../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ── Auth ──────────────────────────────────────────────────────
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return res.status(401).json({ error: 'Not authenticated' })

  const { data: { user }, error: authErr } = await supabaseService.auth.getUser(jwt)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' })
  if (user.user_metadata?.role !== 'company')
    return res.status(403).json({ error: 'Only company accounts can buy credits' })

  const { amount } = req.body || {}
  const creditsToAdd = parseInt(amount, 10)
  if (!creditsToAdd || creditsToAdd < 1 || creditsToAdd > 10000)
    return res.status(400).json({ error: 'Invalid amount' })

  try {
    // Fetch current credits then increment
    const { data: company, error: coErr } = await supabaseService
      .from('companies')
      .select('cv_credits')
      .eq('id', user.id)
      .single()

    if (coErr || !company) return res.status(404).json({ error: 'Company not found' })

    const newTotal = (company.cv_credits || 0) + creditsToAdd
    const { error: updErr } = await supabaseService
      .from('companies')
      .update({ cv_credits: newTotal })
      .eq('id', user.id)

    if (updErr) return res.status(500).json({ error: 'Failed to update credits' })

    return res.json({ ok: true, creditsAdded: creditsToAdd, creditsTotal: newTotal })
  } catch (err) {
    console.error('Credits add error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
