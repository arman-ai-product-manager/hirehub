/**
 * Instantly activates plan after user returns from Cashfree subscription mandate setup
 * Called client-side on the ?sub_success=1 return URL
 */
const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, plan, role } = req.body
  if (!userId || !plan || !role) return res.status(400).json({ error: 'userId, plan, role required' })

  const table = role === 'company' ? 'companies' : 'candidates'

  try {
    const { error } = await supabaseService
      .from(table)
      .update({ plan, plan_updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('verify-sub DB error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    console.log(`✅ Subscription plan '${plan}' activated for ${role} ${userId}`)
    return res.json({ ok: true, plan })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
