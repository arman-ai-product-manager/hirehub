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

  const { job_id } = req.query
  if (!job_id) return res.status(400).json({ error: 'job_id required' })

  // Verify ownership
  const { data: job } = await supabaseService
    .from('screener_jobs').select('*').eq('id', job_id).eq('company_id', user.id).single()
  if (!job) return res.status(403).json({ error: 'Job not found' })

  const { data: resumes, error } = await supabaseService
    .from('screener_resumes')
    .select('id,file_name,candidate_name,candidate_email,candidate_phone,score,recommendation,summary,strengths,gaps,status,error_msg,created_at,processed_at')
    .eq('job_id', job_id)
    .eq('company_id', user.id)
    .order('score', { ascending: false, nullsFirst: false })

  if (error) return res.status(500).json({ error: error.message })

  const stats = {
    total:      resumes.length,
    done:       resumes.filter(r => r.status === 'done').length,
    pending:    resumes.filter(r => r.status === 'pending').length,
    processing: resumes.filter(r => r.status === 'processing').length,
    error:      resumes.filter(r => r.status === 'error').length,
    hire:       resumes.filter(r => r.recommendation === 'hire').length,
    consider:   resumes.filter(r => r.recommendation === 'consider').length,
    reject:     resumes.filter(r => r.recommendation === 'reject').length,
  }

  return res.json({ job, resumes: resumes || [], stats })
}
