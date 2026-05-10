// AI Bulk CV Screener — scores N CVs against an optional JD.
// Uses Groq llama-3.3-70b-versatile, parallel per CV, capped at 30.

const MAX_CVS = 30
const MAX_CV_CHARS = 8000  // ~ first 2 pages
const MAX_JD_CHARS = 4000

function clip(s, max) {
  if (typeof s !== 'string') return ''
  return s.length > max ? s.slice(0, max) : s
}

async function scoreOne({ jd, cv, mode }) {
  const cvText = clip(cv.text || '', MAX_CV_CHARS)

  const jdBlock = mode === 'jd-fit'
    ? `JOB DESCRIPTION (the candidate must fit THIS):\n${clip(jd, MAX_JD_CHARS)}\n\n`
    : ''

  const criteria = mode === 'jd-fit'
    ? `Score how well THIS CV fits THIS job description.
- Skills match to JD requirements: 45%
- Experience level relevance: 25%
- Role/title alignment: 20%
- Education + extras: 10%
Be strict — a great engineer for a different role should score low.`
    : `Score the OVERALL QUALITY of this CV (no specific job).
- Clarity & structure: 25%
- Skills depth & relevance: 30%
- Experience progression: 25%
- Education & achievements: 20%
Score how strong this candidate looks in general.`

  const prompt = `You are an expert Indian recruiter with 15 years experience.

${jdBlock}CANDIDATE CV (filename: ${cv.name || 'cv.txt'}):
${cvText}

${criteria}

Return ONLY valid JSON (no markdown, no explanation):
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "candidate_name": "<best guess of name from CV, or 'Unknown'>",
  "current_role": "<current/most recent role>",
  "years_experience": <number>,
  "top_skills": ["<skill1>","<skill2>","<skill3>","<skill4>","<skill5>"],
  "strengths": ["<s1>","<s2>","<s3>"],
  "gaps": ["<g1>","<g2>"],
  "summary": "<2-sentence recruiter take>",
  "recommendation": "<Strong Hire / Hire / Maybe / No>"
}`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 700,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!r.ok) throw new Error('Groq ' + r.status)
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result = JSON.parse(raw)

    return {
      file: cv.name || 'cv.txt',
      ok: true,
      score: Number(result.score) || 50,
      grade: result.grade || 'C',
      candidate_name: result.candidate_name || 'Unknown',
      current_role: result.current_role || '',
      years_experience: Number(result.years_experience) || 0,
      top_skills: Array.isArray(result.top_skills) ? result.top_skills.slice(0, 5) : [],
      strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 3) : [],
      gaps: Array.isArray(result.gaps) ? result.gaps.slice(0, 2) : [],
      summary: result.summary || '',
      recommendation: result.recommendation || 'Maybe',
    }
  } catch (err) {
    console.error('[screen/bulk] cv error', cv.name, err.message)
    return {
      file: cv.name || 'cv.txt',
      ok: false,
      error: 'Could not analyze this CV',
      score: 0,
      grade: 'F',
      candidate_name: 'Unknown',
      current_role: '',
      years_experience: 0,
      top_skills: [],
      strengths: [],
      gaps: [],
      summary: '',
      recommendation: 'No',
    }
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  const { jd = '', cvs = [] } = req.body || {}
  if (!Array.isArray(cvs) || cvs.length === 0) {
    return res.status(400).json({ error: 'At least one CV is required' })
  }
  if (cvs.length > MAX_CVS) {
    return res.status(400).json({ error: `Max ${MAX_CVS} CVs per batch` })
  }

  const mode = jd && jd.trim().length > 30 ? 'jd-fit' : 'general'
  const validCvs = cvs
    .map(c => ({ name: String(c.name || 'cv').slice(0, 200), text: String(c.text || '').trim() }))
    .filter(c => c.text.length >= 100)

  if (validCvs.length === 0) {
    return res.status(400).json({ error: 'CVs are empty or too short. Each CV needs at least 100 characters of text.' })
  }

  // Parallel scoring with a small concurrency cap of 8 to avoid Groq rate limits
  const CONCURRENCY = 8
  const results = []
  for (let i = 0; i < validCvs.length; i += CONCURRENCY) {
    const chunk = validCvs.slice(i, i + CONCURRENCY)
    const scored = await Promise.all(chunk.map(cv => scoreOne({ jd, cv, mode })))
    results.push(...scored)
  }

  results.sort((a, b) => b.score - a.score)

  return res.json({
    ok: true,
    mode,
    total: results.length,
    results,
  })
}
