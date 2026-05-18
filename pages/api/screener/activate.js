const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

async function cashfreeGet(path) {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error('Cashfree credentials not configured')
  }
  const r = await fetch(`https://api.cashfree.com/pg${path}`, {
    method:  'GET',
    headers: {
      'x-client-id':     process.env.CASHFREE_APP_ID,
      'x-client-secret': process.env.CASHFREE_SECRET_KEY,
      'x-api-version':   '2023-08-01',
    },
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.message || `Cashfree error ${r.status}`)
  return d
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { subscription_id } = req.body || {}
  if (!subscription_id) return res.status(400).json({ error: 'subscription_id required' })

  // Verify this subscription belongs to the authenticated user
  const { data: dbSub } = await supabaseService
    .from('screener_subscriptions')
    .select('cashfree_subscription_id, status')
    .eq('company_id', user.id)
    .eq('cashfree_subscription_id', subscription_id)
    .maybeSingle()

  if (!dbSub) return res.status(403).json({ error: 'Subscription not found for your account' })

  // Already active — return current state (idempotent)
  if (dbSub.status === 'active') {
    const { data: sub } = await supabaseService
      .from('screener_subscriptions')
      .select('*')
      .eq('company_id', user.id)
      .single()
    return res.json({ ok: true, subscription: sub })
  }

  try {
    const cfSub = await cashfreeGet(`/subscriptions/${subscription_id}`)
    const cfStatus = cfSub.subscription_status

    // AUTHORIZED = mandate approved; ACTIVE = first charge also collected
    if (cfStatus !== 'AUTHORIZED' && cfStatus !== 'ACTIVE') {
      return res.status(400).json({
        error: `Subscription not yet authorized (status: ${cfStatus || 'unknown'}). Please complete the payment.`,
      })
    }

    const now       = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const { error: dbErr, count } = await supabaseService
      .from('screener_subscriptions')
      .update({
        status:               'active',
        current_period_start: now.toISOString(),
        current_period_end:   periodEnd.toISOString(),
        updated_at:           now.toISOString(),
      })
      .eq('company_id', user.id)
      .eq('cashfree_subscription_id', subscription_id)

    if (dbErr) return res.status(500).json({ error: 'Failed to activate subscription in database' })

    const { data: sub } = await supabaseService
      .from('screener_subscriptions')
      .select('*')
      .eq('company_id', user.id)
      .single()

    return res.json({ ok: true, subscription: sub })
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Verification failed' })
  }
}
