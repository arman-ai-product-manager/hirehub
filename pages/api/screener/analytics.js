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

  const days   = 7
  const cutoff = new Date(Date.now() - (days - 1) * 86400000)
  cutoff.setHours(0, 0, 0, 0)

  const { data: rows } = await supabaseService
    .from('screener_resumes')
    .select('created_at')
    .eq('company_id', user.id)
    .gte('created_at', cutoff.toISOString())

  // Build a map of YYYY-MM-DD → count
  const counts = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(cutoff.getTime() + i * 86400000)
    counts[d.toISOString().slice(0, 10)] = 0
  }
  for (const row of rows || []) {
    const key = row.created_at.slice(0, 10)
    if (key in counts) counts[key]++
  }

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const result = Object.entries(counts).map(([date, count]) => ({
    date,
    label: DAY_LABELS[new Date(date + 'T12:00:00').getDay()],
    count,
  }))

  return res.json({ days: result, total: (rows || []).length })
}
