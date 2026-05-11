// AI Resume Parser — extracts structured profile data from raw CV text
// Uses Groq llama-3.3-70b-versatile

function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const text = clip(req.body?.text, 12000)
  if (!text || text.length < 50) return res.status(400).json({ error: 'Resume text too short' })

  const prompt = `You are an expert resume parser. Extract structured data from the resume text below.

RESUME TEXT:
${text}

Return ONLY valid JSON (no markdown, no explanation):
{
  "name": "<full name or empty string>",
  "email": "<email or empty string>",
  "phone": "<phone number or empty string>",
  "location": "<city or city, state or empty string>",
  "current_title": "<current or most recent job title or empty string>",
  "current_company": "<current or most recent company or empty string>",
  "years_experience": <total years of professional experience as number, 0 if fresher>,
  "summary": "<2-3 sentence professional summary based on the resume, max 200 chars>",
  "skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "duration": "<e.g. Jan 2022 – Mar 2024>",
      "years": <approximate years in this role as number>,
      "highlights": ["<key achievement or responsibility>", "<another>"]
    }
  ],
  "education": [
    {
      "degree": "<e.g. B.Tech Computer Science>",
      "institution": "<college/university name>",
      "year": "<graduation year or range>"
    }
  ],
  "certifications": ["<cert 1>", "<cert 2>"],
  "languages": ["<language 1>"],
  "linkedin": "<linkedin URL or empty string>",
  "github": "<github URL or empty string>",
  "portfolio": "<portfolio/website URL or empty string>",
  "salary_expectation": "<if mentioned, e.g. 12 LPA, else empty string>",
  "notice_period": "<if mentioned, e.g. 30 days, else empty string>",
  "open_to_remote": <true if explicitly mentioned, else false>
}

Rules:
- skills: list ALL technical and soft skills mentioned, max 20
- experience: list all jobs, most recent first, max 6 entries
- education: list all degrees, most recent first
- certifications: only formal certs/courses, max 8
- years_experience: calculate from work history dates, round to 1 decimal
- Be accurate — only extract what's actually in the resume, don't invent data`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2500,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) {
      console.error('[resume/parse] groq', r.status)
      return res.status(500).json({ error: 'AI service error. Try again.' })
    }
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)
    return res.json({ ok: true, ...parsed })
  } catch (err) {
    console.error('[resume/parse] exception', err.message)
    return res.status(500).json({ error: 'Could not parse resume.' })
  }
}
