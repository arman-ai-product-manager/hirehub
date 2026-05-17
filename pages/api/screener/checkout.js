const { supabaseService } = require('../../../lib/supabase')
const { PLANS } = require('../../../lib/plans')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

async function razorpayPost(path, body) {
  const creds = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
  const r = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${creds}` },
    body: JSON.stringify(body),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.error?.description || `Razorpay error ${r.status}`)
  return d
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { plan } = req.body || {}
  const planConfig = PLANS[plan]
  if (!planConfig) return res.status(400).json({ error: 'Invalid plan' })
  if (!planConfig.razorpay_plan_id) {
    return res.status(500).json({ error: `Plan "${plan}" not configured — set RAZORPAY_PLAN_${plan.toUpperCase()} env var` })
  }

  // Block if already active (must cancel first)
  const { data: existing } = await supabaseService
    .from('screener_subscriptions')
    .select('status, plan')
    .eq('company_id', user.id)
    .maybeSingle()

  if (existing?.status === 'active') {
    return res.status(409).json({ error: 'You already have an active subscription. Cancel it before switching plans.' })
  }

  try {
    const rzpSub = await razorpayPost('/subscriptions', {
      plan_id:     planConfig.razorpay_plan_id,
      total_count: 120,   // 10-year cap; effectively perpetual auto-renewal
      quantity:    1,
      notes:       { company_id: user.id, plan },
    })

    // Upsert pending record (overwrite any previous cancelled/expired subscription)
    await supabaseService.from('screener_subscriptions').upsert({
      company_id:               user.id,
      plan,
      status:                   'pending',
      resume_limit:             planConfig.resumes,
      razorpay_subscription_id: rzpSub.id,
      updated_at:               new Date().toISOString(),
    }, { onConflict: 'company_id' })

    return res.json({ subscription_id: rzpSub.id, plan_name: planConfig.name })
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Failed to create subscription' })
  }
}
