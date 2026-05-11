// AI Skill Gap Analyzer — current role + target role → gap analysis + learning roadmap
function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const currentRole = clip(req.body?.currentRole, 120)
  const targetRole  = clip(req.body?.targetRole, 120)
  const currentSkills = Array.isArray(req.body?.currentSkills) ? req.body.currentSkills.slice(0, 25).map(s => clip(s, 40)).filter(Boolean) : []
  const years       = Number(req.body?.years) || 0
  const targetCompany = clip(req.body?.targetCompany, 100)
  const timeline    = clip(req.body?.timeline, 30) // '3 months' | '6 months' | '1 year'

  if (!currentRole) return res.status(400).json({ error: 'Current role is required' })
  if (!targetRole)  return res.status(400).json({ error: 'Target role is required' })

  const prompt = `You are a senior career coach specializing in tech career transitions in India. Analyze the gap between this candidate's current role and their target role, then provide a concrete learning roadmap.

CANDIDATE:
Current role: ${currentRole}
Current skills: ${currentSkills.join(', ') || 'Not specified'}
Years of experience: ${years}
${targetCompany ? `Target company: ${targetCompany}` : ''}

TARGET:
Target role: ${targetRole}
Timeline to achieve: ${timeline || '6 months'}

Return ONLY valid JSON (no markdown):
{
  "readiness_score": <0-100, how ready is the candidate today?>,
  "verdict": "<one punchy sentence assessing the gap>",
  "transition_difficulty": "<Easy / Moderate / Hard / Very Hard>",
  "realistic_timeline": "<honest assessment, e.g. '4-6 months with focused effort'>",
  "salary_jump_expected": "<expected salary delta, e.g. '+40-60% (₹X to ₹Y LPA)'>",
  "transferable_skills": [
    { "skill": "<existing skill that helps>", "relevance": "<how it applies>" }
  ],
  "skills_to_learn": [
    { "skill": "<skill name>", "priority": "Critical | Important | Nice-to-have", "weeks_to_learn": <number>, "why": "<1-line why this matters for target role>" }
  ],
  "skills_to_deepen": [
    { "skill": "<skill they have but need deeper>", "current_level": "Beginner | Intermediate", "target_level": "Intermediate | Advanced | Expert" }
  ],
  "learning_path": [
    { "month": 1, "focus": "<main focus area>", "skills": ["<skill 1>","<skill 2>"], "milestone": "<what you should be able to do by end of month>", "hours_per_week": <number> },
    { "month": 2, "focus": "<...>", "skills": [], "milestone": "", "hours_per_week": 0 },
    { "month": 3, "focus": "<...>", "skills": [], "milestone": "", "hours_per_week": 0 }
  ],
  "free_resources": [
    { "name": "<course/resource name>", "provider": "<freeCodeCamp/YouTube/MDN etc>", "topic": "<what it covers>", "type": "Course | YouTube | Doc | Book" }
  ],
  "paid_resources": [
    { "name": "<course name>", "provider": "<Coursera/Udemy/etc>", "topic": "<topic>", "price_inr": "<approx price>" }
  ],
  "projects_to_build": [
    { "title": "<project name>", "description": "<1-line>", "skills_demonstrated": ["<skill>"], "github_difficulty": "Beginner | Intermediate | Advanced" }
  ],
  "certifications": ["<cert 1 worth doing>", "<cert 2>"],
  "people_to_follow": ["<role model 1 with handle if possible>", "<role model 2>"],
  "common_mistakes": ["<mistake people make when transitioning>", "<another>"],
  "first_30_days_action": ["<concrete action 1>", "<action 2>", "<action 3>"]
}

Rules:
- 6-10 entries in skills_to_learn, ranked by priority
- learning_path: ${timeline === '3 months' ? '3' : timeline === '1 year' ? '12 (just show first 6 + summarize months 7-12)' : '6'} months
- Be honest — if the transition is unrealistic in the timeline, say so in verdict
- 4-6 free_resources, 2-4 paid_resources
- 3-5 projects_to_build
- Use real, specific resources and projects, not generic placeholders
- Indian context where relevant (₹ for salary, Indian companies for benchmarking)`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3500,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) {
      console.error('[skills/gap] groq', r.status)
      return res.status(500).json({ error: 'AI service error. Try again.' })
    }
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)
    return res.json({ ok: true, input: { currentRole, targetRole, years, timeline }, ...parsed })
  } catch (err) {
    console.error('[skills/gap] exception', err.message)
    return res.status(500).json({ error: 'Could not analyze skill gap.' })
  }
}
