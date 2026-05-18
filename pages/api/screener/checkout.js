const { supabaseService } = require('../../../lib/supabase')
const { PLANS } = require('../../../lib/plans')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

async function cashfreePost(path, body) {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error('Cashfree credentials not configured — set CASHFREE_APP_ID and CASHFREE_SECRET_KEY')
  }
  const r = await fetch(`https://api.cashfree.com/pg${path}`, {
    method:  'POST',
    headers: {
      'Content-Type':    'application/json',
      'x-client-id':     process.env.CASHFREE_APP_ID,
      'x-client-secret': process.env.CASHFREE_SECRET_KEY,
      'x-api-version':   '2023-08-01',
    },
    body: JSON.stringify(body),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.message || `Cashfree error ${r.status}`)
  return d
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { plan } = req.body || {}
  const planConfig = PLANS[plan]
  if (!planConfig) return res.status(400).json({ error: 'Invalid plan' })
  if (!planConfig.cashfree_plan_id) {
    return res.status(500).json({
      error: `Plan "${plan}" not configured — set CASHFREE_PLAN_${plan.toUpperCase()} env var`,
    })
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
    const subId     = `hh_${user.id.replace(/-/g, '').slice(0, 8)}_${Date.now()}`
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL || 'https://hirehub360.in'
    const returnUrl = `${appUrl}/screener?sub_activated=1`

    const cfSub = await cashfreePost('/subscriptions', {
      subscription_id: subId,
      plan_id:         planConfig.cashfree_plan_id,
      customer_details: {
        customer_phone: '9000000000', // Cashfree requires a phone; customer fills real details during auth
        customer_email: user.email || '',
        customer_name:  user.user_metadata?.full_name || 'HireHub User',
      },
      subscription_meta: {
        return_url:  returnUrl,
        notify_url:  `${appUrl}/api/screener/webhook`,
        description: `${planConfig.name} — ₹${planConfig.price.toLocaleString('en-IN')}/month`,
      },
    })

    const cfSubId = cfSub.subscription_id || subId

    // Upsert pending record (overwrites any previous cancelled/expired subscription)
    await supabaseService.from('screener_subscriptions').upsert({
      company_id:               user.id,
      plan,
      status:                   'pending',
      resume_limit:             planConfig.resumes,
      cashfree_subscription_id: cfSubId,
      updated_at:               new Date().toISOString(),
    }, { onConflict: 'company_id' })

    return res.json({
      subscription_id:    cfSubId,
      authorization_link: cfSub.authorization_link || cfSub.data?.authorization_link || null,
      plan_name:          planConfig.name,
    })
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Failed to create subscription' })
  }
}
