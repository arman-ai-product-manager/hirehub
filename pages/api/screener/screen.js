const { supabaseService } = require('../../../lib/supabase')
const Anthropic = require('@anthropic-ai/sdk')

// Vercel: allow up to 300s — screening 500 resumes in batches of 10 can take ~100-150s
export const config = { maxDuration: 300 }

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function auth(req) {
  const jwt = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!jwt) return null
  const { data: { user }, error } = await supabaseService.auth.getUser(jwt)
  return error ? null : user
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

const SYSTEM = `You are an expert HR recruiter and resume evaluator.
Your task: score a resume against a job description and extract candidate details.
Rules:
- Return ONLY a raw JSON object. No markdown, no code fences, no explanation.
- Start your response with { and end with }
- All fields are required. Use empty string "" or 0 if data is not found.`

function buildPrompt(resume, job) {
  return `JOB TITLE: ${job.title}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS: ${(job.skills || []).join(', ') || 'See description above'}

RESUME TEXT:
${(resume.raw_text || '').slice(0, 8000) || '(no text extracted)'}

Return a JSON object with EXACTLY these keys and value types:
{
  "score": <integer 0-100 — overall match strength>,
  "name": <string — candidate's full name from resume, or "">,
  "email": <string — candidate's email from resume, or "">,
  "experience_years": <integer — total years of professional work experience, or 0>,
  "matched_skills": [<up to 6 short strings — required skills the candidate has>],
  "missing_skills": [<up to 4 short strings — required skills the candidate lacks>],
  "summary": <string — 1-2 sentence plain-English verdict on fit for this specific role>,
  "recommendation": <"SHORTLIST" if score>=70 | "MAYBE" if score 45-69 | "REJECT" if score<45>
}`
}

function parseResult(text) {
  // Strip markdown code fences if present
  let clean = text.trim()
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  // Extract outermost JSON object
  const start = clean.indexOf('{')
  const end   = clean.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found in response')

  const parsed = JSON.parse(clean.slice(start, end + 1))

  // Strict field validation
  if (typeof parsed.score !== 'number')          throw new Error('score must be a number')
  if (!['SHORTLIST','MAYBE','REJECT'].includes(parsed.recommendation))
    throw new Error(`Invalid recommendation "${parsed.recommendation}"`)

  return parsed
}

async function screenOne(resume, job) {
  const prompt    = buildPrompt(resume, job)
  const MAX_ATTEMPTS = 3
  let lastRawText = ''
  let lastWasParseError = false

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(1000 * attempt) // 1s then 2s backoff

    try {
      // Only do multi-turn correction when the previous failure was a JSON parse error
      // (not an API/network error where lastRawText is empty or meaningless)
      const messages = (attempt > 0 && lastWasParseError && lastRawText)
        ? [
            { role: 'user', content: prompt },
            { role: 'assistant', content: lastRawText },
            { role: 'user', content: 'Your previous response was not valid JSON or was missing required fields. Return ONLY the raw JSON object — no markdown, no code fences, no explanation. Start with { and end with }.' },
          ]
        : [{ role: 'user', content: prompt }]

      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        system: SYSTEM,
        messages,
      })

      lastRawText      = msg.content[0]?.type === 'text' ? msg.content[0].text : ''
      lastWasParseError = false
      return parseResult(lastRawText)
    } catch (e) {
      // Distinguish parse/validation errors (retry with correction) from API errors (retry fresh)
      lastWasParseError = e.message?.includes('JSON') || e.message?.includes('field') || e.message?.includes('recommendation')
      if (!lastWasParseError) lastRawText = '' // don't send broken API response as assistant turn
      if (attempt === MAX_ATTEMPTS - 1) {
        throw new Error(`Screening failed after ${MAX_ATTEMPTS} attempts: ${e.message}`)
      }
    }
  }
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

  // Fetch pending resumes (or specific IDs — both filtered to pending/error only)
  let query = supabaseService
    .from('screener_resumes')
    .select('id,file_name,raw_text,candidate_name,candidate_email,status')
    .eq('job_id', job_id)
    .eq('company_id', user.id)
    .in('status', ['pending', 'error'])
    .limit(500)

  if (resume_ids?.length > 0) {
    // Still filter by job_id + status — never re-screen completed resumes or cross-job resumes
    query = supabaseService
      .from('screener_resumes')
      .select('id,file_name,raw_text,candidate_name,candidate_email,status')
      .in('id', resume_ids)
      .eq('job_id', job_id)
      .eq('company_id', user.id)
      .in('status', ['pending', 'error'])
  }

  const { data: resumes } = await query
  if (!resumes?.length) return res.json({ ok: true, processed: 0 })

  // Mark all as processing
  await supabaseService
    .from('screener_resumes')
    .update({ status: 'processing', error_msg: null })
    .in('id', resumes.map(r => r.id))
    .eq('company_id', user.id)

  // Stream NDJSON progress — one line per resume
  res.setHeader('Content-Type', 'application/x-ndjson')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('X-Accel-Buffering', 'no') // disable Nginx buffering

  let processed = 0
  const BATCH = 10 // 10 concurrent Claude calls

  for (let i = 0; i < resumes.length; i += BATCH) {
    const batch = resumes.slice(i, i + BATCH)
    await Promise.all(batch.map(async resume => {
      try {
        if (!resume.raw_text?.trim()) {
          throw new Error('Could not extract text from this PDF — file may be scanned or image-only')
        }

        const result = await screenOne(resume, job)

        // Clamp and sanitise all fields before writing to DB
        const score   = Math.max(0, Math.min(100, Math.round(result.score)))
        const rec     = ['SHORTLIST','MAYBE','REJECT'].includes(result.recommendation)
                          ? result.recommendation : 'REJECT'
        const expYrs  = typeof result.experience_years === 'number'
                          ? Math.max(0, Math.min(60, Math.round(result.experience_years))) : 0

        // Use AI-extracted name/email if better than heuristic extraction
        const aiName  = (result.name  || '').trim().slice(0, 100)
        const aiEmail = (result.email || '').trim().slice(0, 200)

        // Ensure array fields are actually arrays before calling .slice/.map
        const matchedSkills = Array.isArray(result.matched_skills) ? result.matched_skills : []
        const missingSkills = Array.isArray(result.missing_skills) ? result.missing_skills : []

        await supabaseService.from('screener_resumes').update({
          score,
          recommendation:   rec,
          summary:          (result.summary || '').slice(0, 600),
          strengths:        matchedSkills.slice(0, 6).map(s => String(s).slice(0, 100)),
          gaps:             missingSkills.slice(0, 4).map(s => String(s).slice(0, 100)),
          experience_years: expYrs,
          // Override heuristic name/email only when AI found something better
          ...(aiName  && !resume.candidate_name  ? { candidate_name:  aiName  } : {}),
          ...(aiEmail && !resume.candidate_email ? { candidate_email: aiEmail } : {}),
          status:       'done',
          processed_at: new Date().toISOString(),
          error_msg:    null,
        }).eq('id', resume.id).eq('company_id', user.id)

        processed++
        res.write(JSON.stringify({
          id:   resume.id,
          ok:   true,
          score,
          rec,
          name: aiName || resume.candidate_name || resume.file_name,
        }) + '\n')
      } catch (e) {
        await supabaseService.from('screener_resumes').update({
          status:    'error',
          error_msg: (e.message || 'Unknown error').slice(0, 300),
        }).eq('id', resume.id).eq('company_id', user.id)
        res.write(JSON.stringify({ id: resume.id, ok: false, error: e.message }) + '\n')
      }
    }))
  }

  res.write(JSON.stringify({ done: true, processed }) + '\n')
  res.end()
}
