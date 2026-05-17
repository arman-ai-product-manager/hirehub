const { supabaseService } = require('../../../lib/supabase')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const [{ data: sub }, { count: rawCount }] = await Promise.all([
    supabaseService
      .from('screener_subscriptions')
      .select('*')
      .eq('company_id', user.id)
      .maybeSingle(),
    supabaseService
      .from('screener_resumes')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', user.id)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])

  const used      = rawCount || 0
  const isActive  = sub?.status === 'active'
  const limit     = isActive ? (sub.resume_limit ?? 0) : 0
  const unlimited = isActive && limit === -1
  const atLimit   = !unlimited && used >= limit && limit > 0
  const percent   = unlimited || !limit ? 0 : Math.min(100, Math.round((used / limit) * 100))

  return res.json({
    subscription: sub || null,
    usage: { used, limit, unlimited, at_limit: atLimit, percent, active: isActive },
  })
}
