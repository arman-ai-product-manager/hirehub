// AI Salary Estimator — role + experience + city → salary range, city comparison, tips
// Uses Groq llama-3.3-70b-versatile

function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const role = clip(req.body?.role, 100)
  const city = clip(req.body?.city, 60)
  const years = Number(req.body?.years)
  const skills = Array.isArray(req.body?.skills) ? req.body.skills.slice(0, 8).map(s => clip(s, 40)).filter(Boolean) : []
  const companySize = clip(req.body?.companySize, 40) // 'startup' | 'mid' | 'mnc' | ''

  if (!role) return res.status(400).json({ error: 'Role is required' })
  if (!city) return res.status(400).json({ error: 'City is required' })
  if (!Number.isFinite(years) || years < 0 || years > 40) return res.status(400).json({ error: 'Years of experience required (0-40)' })

  const prompt = `You are a senior compensation analyst with deep knowledge of Indian salary benchmarks across cities, sectors, and experience levels. Estimate realistic salary for this role in 2026.

INPUT:
Role: ${role}
City: ${city}
Years of experience: ${years}
${skills.length ? `Key skills: ${skills.join(', ')}` : ''}
${companySize ? `Company type: ${companySize}` : ''}

Return ONLY valid JSON (no markdown, no explanation):
{
  "current_estimate": {
    "min_lpa": <number, lakhs per annum>,
    "median_lpa": <number>,
    "max_lpa": <number>,
    "monthly_in_hand_min": <number, in INR>,
    "monthly_in_hand_max": <number, in INR>
  },
  "confidence": "<High/Medium/Low>",
  "based_on": "<1-line: what this estimate is based on>",
  "city_comparison": [
    { "city": "Bangalore",  "median_lpa": <number>, "vs_input_pct": <signed percentage>, "note": "<short note>" },
    { "city": "Mumbai",     "median_lpa": <number>, "vs_input_pct": <signed percentage>, "note": "<short note>" },
    { "city": "Delhi NCR",  "median_lpa": <number>, "vs_input_pct": <signed percentage>, "note": "<short note>" },
    { "city": "Hyderabad",  "median_lpa": <number>, "vs_input_pct": <signed percentage>, "note": "<short note>" },
    { "city": "Pune",       "median_lpa": <number>, "vs_input_pct": <signed percentage>, "note": "<short note>" },
    { "city": "Chennai",    "median_lpa": <number>, "vs_input_pct": <signed percentage>, "note": "<short note>" }
  ],
  "high_paying_skills": [
    { "skill": "<skill>", "premium_pct": <number, percentage premium over base> },
    { "skill": "<skill>", "premium_pct": <number> },
    { "skill": "<skill>", "premium_pct": <number> },
    { "skill": "<skill>", "premium_pct": <number> }
  ],
  "next_level_target": {
    "years": <typical years to next jump>,
    "target_median_lpa": <number>,
    "what_to_learn": ["<skill 1>","<skill 2>","<skill 3>"]
  },
  "negotiation_tips": ["<tip 1>","<tip 2>","<tip 3>"],
  "market_signal": "<1-sentence: is this role hot, stable, or cooling in 2026?>"
}

Be realistic — Indian market 2026 numbers. Median LPA for ${role} (${years} yrs) in ${city} should match industry data.`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2000,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) {
      console.error('[salary/estimate] groq', r.status)
      return res.status(500).json({ error: 'AI service error. Try again.' })
    }
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)
    return res.json({ ok: true, input: { role, city, years, skills, companySize }, ...parsed })
  } catch (err) {
    console.error('[salary/estimate] exception', err.message)
    return res.status(500).json({ error: 'Could not generate estimate.' })
  }
}
