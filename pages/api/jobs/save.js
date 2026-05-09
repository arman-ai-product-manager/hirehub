const { createClient } = require('@supabase/supabase-js')
const { supabaseService, supabaseUrl, supabaseAnon } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const job = req.body
  if (!job || !job.id || !job.title) {
    return res.status(400).json({ error: 'Missing required job fields' })
  }

  // Auth required — verify user owns the company_id they're posting for
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'Authentication required' })

  let userId = null
  try {
    const { data: { user }, error: authErr } = await supabaseService.auth.getUser(token)
    if (authErr || !user) return res.status(401).json({ error: 'Invalid auth token' })
    userId = user.id
  } catch (e) {
    return res.status(401).json({ error: 'Auth check failed' })
  }

  // Owner check — company_id must match the authenticated user's id
  if (job.company_id && job.company_id !== userId) {
    return res.status(403).json({ error: 'Cannot post jobs for another company' })
  }

  // Field length limits — prevent DB bloat / abuse
  const trim = (s, n) => typeof s === 'string' ? s.slice(0, n) : s
  const VALID_STATUS = ['active', 'paused', 'closed']
  const status = VALID_STATUS.includes(job.status) ? job.status : 'active'

  // Use user's auth token so RLS policies apply correctly
  const client = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  try {
    const { error } = await client.from('jobs').upsert({
      id:            job.id,
      company_id:    userId,
      company_name:  trim(job.company_name, 200),
      title:         trim(job.title, 200),
      location:      trim(job.location, 200),
      salary_min:    job.salary_min   || null,
      salary_max:    job.salary_max   || null,
      salary_hidden: !!job.salary_hidden,
      salary_label:  trim(job.salary_label, 100) || null,
      currency:      trim(job.currency, 10) || 'INR',
      experience:    trim(job.experience, 100) || null,
      job_type:      trim(job.job_type, 50) || 'Full-time',
      sector:        trim(job.sector, 100) || null,
      skills:        Array.isArray(job.skills) ? job.skills.slice(0, 30).map(s => trim(String(s), 50)) : [],
      description:   trim(job.description, 5000) || null,
      remote_policy: trim(job.remote_policy, 30) || 'Any',
      visa_sponsor:  !!job.visa_sponsor,
      status,
      slug:          trim(job.slug, 200) || null,
      created_at:    job.created_at   || new Date().toISOString(),
    }, { onConflict: 'id' })

    if (error) {
      console.error('Job save error:', error)
      return res.status(500).json({ error: error.message })
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error('Job save error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
