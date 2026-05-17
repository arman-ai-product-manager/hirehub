const { supabaseService } = require('../../../lib/supabase')
const XLSX = require('xlsx')

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

  const { data: job } = await supabaseService
    .from('screener_jobs').select('*').eq('id', job_id).eq('company_id', user.id).single()
  if (!job) return res.status(403).json({ error: 'Job not found' })

  const { data: resumes } = await supabaseService
    .from('screener_resumes')
    .select('candidate_name,candidate_email,candidate_phone,score,recommendation,summary,strengths,gaps,status,file_name,processed_at')
    .eq('job_id', job_id).eq('company_id', user.id)
    .order('score', { ascending: false, nullsFirst: false })

  const rows = (resumes || []).map((r, i) => ({
    Rank:            r.status === 'done' ? i + 1 : '-',
    'Candidate Name': r.candidate_name || r.file_name,
    Email:           r.candidate_email || '',
    Phone:           r.candidate_phone || '',
    Score:           r.score ?? '',
    Recommendation:  r.recommendation ? r.recommendation.toUpperCase() : '',
    Summary:         r.summary || '',
    Strengths:       (r.strengths || []).join('; '),
    Gaps:            (r.gaps || []).join('; '),
    Status:          r.status,
    'File Name':     r.file_name,
    'Processed At':  r.processed_at ? new Date(r.processed_at).toLocaleString('en-IN') : '',
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 6 }, { wch: 25 }, { wch: 28 }, { wch: 16 }, { wch: 8 },
    { wch: 14 }, { wch: 60 }, { wch: 40 }, { wch: 40 }, { wch: 12 }, { wch: 25 }, { wch: 20 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Screened Resumes')

  // Summary sheet
  const done = resumes?.filter(r => r.status === 'done') || []
  const summary = [
    { Metric: 'Job Title',      Value: job.title },
    { Metric: 'Total Uploaded', Value: resumes?.length || 0 },
    { Metric: 'Screened',       Value: done.length },
    { Metric: 'To Hire',        Value: done.filter(r => r.recommendation === 'hire').length },
    { Metric: 'Consider',       Value: done.filter(r => r.recommendation === 'consider').length },
    { Metric: 'Reject',         Value: done.filter(r => r.recommendation === 'reject').length },
    { Metric: 'Avg Score',      Value: done.length ? Math.round(done.reduce((s, r) => s + (r.score || 0), 0) / done.length) : 0 },
    { Metric: 'Export Date',    Value: new Date().toLocaleString('en-IN') },
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const safeName = job.title.replace(/[^a-z0-9]/gi, '_').slice(0, 40)

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}_screened.xlsx"`)
  res.send(buf)
}
