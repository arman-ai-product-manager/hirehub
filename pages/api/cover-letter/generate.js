// AI Cover Letter Generator — Groq llama-3.3-70b-versatile
function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const jd          = clip(req.body?.jd, 6000)
  const name        = clip(req.body?.name, 80)
  const currentRole = clip(req.body?.currentRole, 100)
  const years       = Number(req.body?.years) || 0
  const skills      = Array.isArray(req.body?.skills) ? req.body.skills.slice(0, 15).map(s => clip(s, 40)).filter(Boolean) : []
  const highlights  = clip(req.body?.highlights, 1500)
  const tone        = clip(req.body?.tone, 20) || 'professional' // professional | enthusiastic | confident | concise
  const company     = clip(req.body?.company, 100)
  const role        = clip(req.body?.role, 120)

  if (!jd || jd.length < 30) return res.status(400).json({ error: 'Paste the job description (at least 30 chars)' })
  if (!name) return res.status(400).json({ error: 'Your name is required' })

  const prompt = `You are an expert career coach. Write a compelling, personalized cover letter for the candidate below.

JOB DESCRIPTION:
${jd}

CANDIDATE PROFILE:
Name: ${name}
${currentRole ? `Current role: ${currentRole}` : ''}
${years ? `Experience: ${years} years` : ''}
${skills.length ? `Skills: ${skills.join(', ')}` : ''}
${highlights ? `Key achievements/notes: ${highlights}` : ''}
${company ? `Target company: ${company}` : ''}
${role ? `Target role: ${role}` : ''}

TONE: ${tone}

Return ONLY valid JSON (no markdown):
{
  "subject_line": "<email subject line, max 60 chars>",
  "salutation": "<e.g. Dear Hiring Manager, or Dear [Team] Team,>",
  "opening": "<1 strong opening paragraph, 2-3 sentences, hook the reader>",
  "body": "<2-3 paragraphs, ~220 words total. Connect the candidate's skills/experience to the JD's specific requirements. Use concrete examples if highlights provided. Show enthusiasm for THIS company/role specifically.>",
  "closing": "<1 short paragraph with clear CTA, 2 sentences max>",
  "signoff": "<e.g. Best regards,>",
  "full_letter": "<the complete cover letter as one formatted string with line breaks between sections, ready to copy-paste. Include name at the end.>",
  "linkedin_message": "<a 1-paragraph short version (max 280 chars) suitable for LinkedIn InMail or message>",
  "key_strengths_highlighted": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "match_score": <0-100, how well the candidate fits this JD>,
  "tips_to_strengthen": ["<actionable tip 1>", "<actionable tip 2>"]
}

Rules:
- Cover letter must be 250-350 words total (excluding salutation/signoff)
- Reference specific things from the JD — don't be generic
- ${tone === 'enthusiastic' ? 'Use energetic, passionate language' : tone === 'confident' ? 'Be assertive and direct about value' : tone === 'concise' ? 'Be sharp and tight, no fluff' : 'Be polished and professional'}
- NO clichés like "I am writing to apply for" — start with impact
- Indian English, but globally professional
- Match score should be honest — don't inflate it`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2500,
        temperature: 0.6,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) {
      console.error('[cover-letter] groq', r.status)
      return res.status(500).json({ error: 'AI service error. Try again.' })
    }
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)
    return res.json({ ok: true, ...parsed })
  } catch (err) {
    console.error('[cover-letter] exception', err.message)
    return res.status(500).json({ error: 'Could not generate cover letter.' })
  }
}
