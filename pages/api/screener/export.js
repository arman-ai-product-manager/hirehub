const { supabaseService } = require('../../../lib/supabase')
const XLSX = require('xlsx')

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

const REC_LABEL = { SHORTLIST: 'SHORTLIST', MAYBE: 'MAYBE', REJECT: 'REJECT' }

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
    .select('candidate_name,candidate_email,candidate_phone,score,recommendation,experience_years,summary,strengths,gaps,status,file_name,processed_at')
    .eq('job_id', job_id).eq('company_id', user.id)
    .order('score', { ascending: false, nullsFirst: false })

  const rows = (resumes || []).map((r, i) => ({
    Rank:                r.status === 'done' ? i + 1 : '-',
    'Candidate Name':   r.candidate_name || r.file_name,
    Email:              r.candidate_email || '',
    Phone:              r.candidate_phone || '',
    Score:              r.score ?? '',
    Recommendation:     r.recommendation ? (REC_LABEL[r.recommendation] || r.recommendation) : '',
    'Exp. Years':       r.experience_years ?? '',
    Summary:            r.summary || '',
    'Matched Skills':   (r.strengths || []).join('; '),
    'Missing Skills':   (r.gaps     || []).join('; '),
    Status:             r.status,
    'File Name':        r.file_name,
    'Processed At':     r.processed_at ? new Date(r.processed_at).toLocaleString() : '',
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  ws['!cols'] = [
    { wch: 6 },  // Rank
    { wch: 26 }, // Candidate Name
    { wch: 28 }, // Email
    { wch: 16 }, // Phone
    { wch: 7 },  // Score
    { wch: 14 }, // Recommendation
    { wch: 10 }, // Exp. Years
    { wch: 60 }, // Summary
    { wch: 40 }, // Matched Skills
    { wch: 40 }, // Missing Skills
    { wch: 12 }, // Status
    { wch: 26 }, // File Name
    { wch: 20 }, // Processed At
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Screened Resumes')

  // Summary sheet
  const done = resumes?.filter(r => r.status === 'done') || []
  const avgScore = done.length
    ? Math.round(done.reduce((s, r) => s + (r.score || 0), 0) / done.length)
    : 0

  const summaryRows = [
    { Metric: 'Job Title',        Value: job.title },
    { Metric: 'Total Uploaded',   Value: resumes?.length || 0 },
    { Metric: 'Screened',         Value: done.length },
    { Metric: 'Shortlisted',      Value: done.filter(r => r.recommendation === 'SHORTLIST').length },
    { Metric: 'Maybe',            Value: done.filter(r => r.recommendation === 'MAYBE').length },
    { Metric: 'Rejected',         Value: done.filter(r => r.recommendation === 'REJECT').length },
    { Metric: 'Avg Score',        Value: avgScore },
    { Metric: 'Top Score',        Value: done.length ? Math.max(...done.map(r => r.score || 0)) : 0 },
    { Metric: 'Avg Exp. (years)', Value: done.length ? Math.round(done.reduce((s, r) => s + (r.experience_years || 0), 0) / done.length) : 0 },
    { Metric: 'Export Date',      Value: new Date().toLocaleString() },
  ]

  const summaryWs = XLSX.utils.json_to_sheet(summaryRows)
  summaryWs['!cols'] = [{ wch: 22 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const safeName = job.title.replace(/[^a-z0-9]/gi, '_').slice(0, 40)

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}_screened.xlsx"`)
  res.send(buf)
}
