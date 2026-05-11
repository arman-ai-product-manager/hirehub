// AI Interview Prep — generates likely interview questions + sample answers
// from a job description. Uses Groq llama-3.3-70b-versatile.

const MAX_JD_CHARS = 4000

function clip(s, max) { return typeof s === 'string' ? s.slice(0, max) : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  const { jd = '', role = '', experience = '' } = req.body || {}
  const jdText = clip(jd, MAX_JD_CHARS).trim()
  const roleText = clip(role, 100).trim()

  if (!jdText && !roleText) {
    return res.status(400).json({ error: 'Either a job description or a role title is required' })
  }

  const prompt = `You are a senior interview coach who has prepared 5,000+ Indian candidates for tech, sales, marketing, finance, and operations roles. Generate a realistic interview prep guide.

${jdText ? `JOB DESCRIPTION:\n${jdText}\n` : ''}${roleText ? `ROLE: ${roleText}\n` : ''}${experience ? `CANDIDATE EXPERIENCE LEVEL: ${experience}\n` : ''}

Generate a structured interview prep response.

Return ONLY valid JSON (no markdown, no explanation):
{
  "role_summary": "<1-line role summary>",
  "rounds": ["<typical round 1>","<typical round 2>","<typical round 3>"],
  "questions": [
    { "category": "Behavioral", "q": "<question>", "tip": "<how to answer in 1-2 lines>", "sample_answer": "<60-100 word sample answer that an Indian candidate could realistically give>" },
    { "category": "Technical/Role-specific", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" },
    { "category": "Technical/Role-specific", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" },
    { "category": "Technical/Role-specific", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" },
    { "category": "Situational", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" },
    { "category": "Situational", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" },
    { "category": "HR/Cultural", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" },
    { "category": "HR/Cultural", "q": "<question>", "tip": "<tip>", "sample_answer": "<sample>" }
  ],
  "questions_to_ask_them": ["<smart question 1>","<smart question 2>","<smart question 3>"],
  "red_flags_to_avoid": ["<red flag 1>","<red flag 2>","<red flag 3>"],
  "salary_negotiation_tip": "<2-sentence advice on negotiating salary for this role in India>"
}

Make questions ROLE-SPECIFIC, not generic. If JD mentions React, ask React questions. If it mentions B2B sales, ask B2B sales scenarios.`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3500,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!r.ok) {
      const errText = await r.text().catch(() => '')
      console.error('[interview/prep] Groq error', r.status, errText.slice(0, 200))
      return res.status(500).json({ error: 'AI service error. Try again in a moment.' })
    }

    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)

    return res.json({
      ok: true,
      prep: {
        role_summary: parsed.role_summary || '',
        rounds: Array.isArray(parsed.rounds) ? parsed.rounds : [],
        questions: Array.isArray(parsed.questions) ? parsed.questions : [],
        questions_to_ask_them: Array.isArray(parsed.questions_to_ask_them) ? parsed.questions_to_ask_them : [],
        red_flags_to_avoid: Array.isArray(parsed.red_flags_to_avoid) ? parsed.red_flags_to_avoid : [],
        salary_negotiation_tip: parsed.salary_negotiation_tip || '',
      },
    })
  } catch (err) {
    console.error('[interview/prep] exception', err.message)
    return res.status(500).json({ error: 'Could not generate prep. Try again.' })
  }
}
