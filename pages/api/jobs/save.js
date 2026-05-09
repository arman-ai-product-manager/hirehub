const { createClient } = require('@supabase/supabase-js')
const { supabaseService, supabaseUrl, supabaseAnon } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const job = req.body
  if (!job || !job.id || !job.title) {
    return res.status(400).json({ error: 'Missing required job fields' })
  }

  // Use user's auth token if provided — works even without service role key
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const client = token
    ? createClient(supabaseUrl, supabaseAnon, { global: { headers: { Authorization: `Bearer ${token}` } } })
    : supabaseService

  const VALID_STATUS = ['active', 'paused', 'closed']
  const status = VALID_STATUS.includes(job.status) ? job.status : 'active'

  try {
    const { error } = await client.from('jobs').upsert({
      id:            job.id,
      company_id:    job.company_id,
      company_name:  job.company_name,
      title:         job.title,
      location:      job.location,
      salary_min:    job.salary_min   || null,
      salary_max:    job.salary_max   || null,
      salary_hidden: !!job.salary_hidden,
      salary_label:  job.salary_label || null,
      currency:      job.currency     || 'INR',
      experience:    job.experience   || null,
      job_type:      job.job_type     || 'Full-time',
      sector:        job.sector       || null,
      skills:        Array.isArray(job.skills) ? job.skills : [],
      description:   job.description  || null,
      remote_policy: job.remote_policy || 'Any',
      visa_sponsor:  !!job.visa_sponsor,
      status,
      slug:          job.slug         || null,
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
