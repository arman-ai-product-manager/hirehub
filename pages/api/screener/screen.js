const { supabaseService } = require('../../../lib/supabase')
const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

const SYSTEM = `You are an expert HR recruiter. Evaluate whether a resume matches a job description.
Return ONLY valid JSON, no markdown, no explanation outside the JSON.`

async function screenOne(resume, job) {
  const prompt = `JOB TITLE: ${job.title}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS: ${(job.skills || []).join(', ') || 'See description'}

RESUME TEXT:
${resume.raw_text?.slice(0, 8000) || '(empty)'}

Return JSON with exactly these keys:
{
  "score": <integer 0-100>,
  "recommendation": <"hire" | "consider" | "reject">,
  "summary": <1-2 sentence plain-English verdict>,
  "strengths": [<up to 4 short strings>],
  "gaps": [<up to 4 short strings>]
}`

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = msg.content[0]?.type === 'text' ? msg.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')
  return JSON.parse(jsonMatch[0])
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { job_id, resume_ids } = req.body || {}
  if (!job_id) return res.status(400).json({ error: 'job_id required' })

  // Verify job ownership
  const { data: job } = await supabaseService
    .from('screener_jobs').select('*').eq('id', job_id).eq('company_id', user.id).single()
  if (!job) return res.status(403).json({ error: 'Job not found' })

  // Fetch pending resumes (or specific IDs)
  let query = supabaseService
    .from('screener_resumes')
    .select('id,file_name,raw_text,candidate_name,status')
    .eq('job_id', job_id)
    .eq('company_id', user.id)
    .eq('status', 'pending')
    .limit(500)

  if (resume_ids?.length > 0) {
    query = supabaseService
      .from('screener_resumes')
      .select('id,file_name,raw_text,candidate_name,status')
      .in('id', resume_ids)
      .eq('company_id', user.id)
  }

  const { data: resumes } = await query
  if (!resumes?.length) return res.json({ ok: true, processed: 0 })

  // Mark all as processing — ignore errors (RLS may already block some; they'll get error status)
  await supabaseService
    .from('screener_resumes')
    .update({ status: 'processing' })
    .in('id', resumes.map(r => r.id))
    .eq('company_id', user.id)

  // Stream progress via JSON lines (process in batches of 5)
  res.setHeader('Content-Type', 'application/x-ndjson')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('X-Accel-Buffering', 'no') // disable Nginx buffering on Vercel

  let processed = 0
  const BATCH = 5

  for (let i = 0; i < resumes.length; i += BATCH) {
    const batch = resumes.slice(i, i + BATCH)
    await Promise.all(batch.map(async resume => {
      try {
        if (!resume.raw_text?.trim()) throw new Error('Empty resume — could not extract text from PDF')
        const result = await screenOne(resume, job)

        // Validate AI returned sane values
        const score = typeof result.score === 'number'
          ? Math.max(0, Math.min(100, Math.round(result.score)))
          : 0
        const rec = ['hire', 'consider', 'reject'].includes(result.recommendation)
          ? result.recommendation : 'reject'

        await supabaseService.from('screener_resumes').update({
          score,
          recommendation: rec,
          summary:        (result.summary   || '').slice(0, 500),
          strengths:      (result.strengths || []).slice(0, 4).map(s => String(s).slice(0, 120)),
          gaps:           (result.gaps      || []).slice(0, 4).map(s => String(s).slice(0, 120)),
          status:         'done',
          processed_at:   new Date().toISOString(),
          error_msg:      null,
        }).eq('id', resume.id).eq('company_id', user.id)

        processed++
        res.write(JSON.stringify({ id: resume.id, done: true, score, name: resume.candidate_name || resume.file_name }) + '\n')
      } catch (e) {
        await supabaseService.from('screener_resumes').update({
          status: 'error',
          error_msg: (e.message || 'Unknown error').slice(0, 200),
        }).eq('id', resume.id).eq('company_id', user.id)
        res.write(JSON.stringify({ id: resume.id, done: false, error: e.message }) + '\n')
      }
    }))
  }

  res.write(JSON.stringify({ done: true, processed }) + '\n')
  res.end()
}
