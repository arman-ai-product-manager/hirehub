const { validateSession } = require('../../../lib/adminSession')
const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (!validateSession(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET')  return res.status(405).json({ error: 'Method not allowed' })

  const page  = Math.max(1, parseInt(req.query.page  || '1', 10))
  const limit = Math.min(50, parseInt(req.query.limit || '20', 10))
  const type  = req.query.type || 'all'   // 'all' | 'company' | 'candidate'
  const from  = (page - 1) * limit

  try {
    const results = []

    if (type !== 'candidate') {
      // Try with ban columns first; fall back to base columns if migration not yet run
      let coRes = await supabaseService
        .from('companies')
        .select('id,company_name,plan,is_banned,banned_at,created_at')
        .order('created_at', { ascending: false })
        .range(from, from + limit - 1)

      if (coRes.error) {
        coRes = await supabaseService
          .from('companies')
          .select('id,company_name,plan,created_at')
          .order('created_at', { ascending: false })
          .range(from, from + limit - 1)
      }

      ;(coRes.data || []).forEach(c => results.push({
        id:        c.id,
        name:      c.company_name,
        role:      'company',
        plan:      c.plan || 'free',
        is_banned: c.is_banned || false,
        banned_at: c.banned_at || null,
        created_at:c.created_at,
        table:     'companies',
      }))
    }

    if (type !== 'company') {
      let cdRes = await supabaseService
        .from('candidates')
        .select('id,name,is_banned,banned_at,created_at')
        .order('created_at', { ascending: false })
        .range(from, from + limit - 1)

      if (cdRes.error) {
        cdRes = await supabaseService
          .from('candidates')
          .select('id,name,created_at')
          .order('created_at', { ascending: false })
          .range(from, from + limit - 1)
      }

      ;(cdRes.data || []).forEach(c => results.push({
        id:        c.id,
        name:      c.name || '(no name)',
        role:      'candidate',
        plan:      'free',
        is_banned: c.is_banned || false,
        banned_at: c.banned_at || null,
        created_at:c.created_at,
        table:     'candidates',
      }))
    }

    // Sort combined results by created_at desc
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return res.json({ users: results.slice(0, limit), page, limit })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
