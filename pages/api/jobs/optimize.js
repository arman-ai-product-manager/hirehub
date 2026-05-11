// AI Job Description Optimizer — analyzes and rewrites JDs for quality, clarity, inclusion
function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const jd      = clip(req.body?.jd, 8000)
  const company = clip(req.body?.company, 100)
  const role    = clip(req.body?.role, 120)

  if (!jd || jd.length < 80) return res.status(400).json({ error: 'Paste a full job description (at least 80 characters)' })

  const prompt = `You are a senior talent acquisition specialist and inclusive hiring expert. Analyze this job description and rewrite it to be clearer, more compelling, and more inclusive — to attract better, more diverse candidates.

${role ? `Role: ${role}` : ''}
${company ? `Company: ${company}` : ''}

ORIGINAL JD:
${jd}

Return ONLY valid JSON (no markdown):
{
  "scores": {
    "clarity": <0-100, is the JD clear and easy to understand?>,
    "inclusion": <0-100, is it free from biased/exclusionary language?>,
    "quality": <0-100, does it sell the role and company well?>,
    "completeness": <0-100, are all important sections present?>,
    "overall": <average of the four>
  },
  "issues": [
    { "type": "bias", "text": "<exact phrase from original>", "reason": "<why it's problematic>", "fix": "<suggested replacement>" },
    { "type": "clarity", "text": "<exact phrase>", "reason": "<why unclear>", "fix": "<better version>" },
    { "type": "quality", "text": "<exact phrase>", "reason": "<why it's weak>", "fix": "<stronger version>" }
  ],
  "missing_sections": ["<section that should be added, e.g. Salary Range, Growth Path, DEI Statement>"],
  "biased_phrases": ["<phrase 1>", "<phrase 2>"],
  "optimized_jd": "<the complete rewritten JD — same structure but improved. 300-500 words. Compelling opening, clear responsibilities, required vs nice-to-have skills separated, inclusive language, salary range placeholder [₹X-Y LPA], team description, growth opportunity, benefits, EEO statement.>",
  "key_changes": ["<change 1 and why>", "<change 2 and why>", "<change 3 and why>"],
  "candidate_persona": "<1 sentence: who will this JD attract after optimization?>",
  "seo_title": "<an optimized job title for search engines, max 60 chars>",
  "keywords_to_add": ["<keyword 1>", "<keyword 2>", "<keyword 3>"]
}

Issue type rules:
- "bias": gendered words (ninja/rockstar/dominant), age (young/energetic/digital native), exclusionary requirements (must have degree when not essential)
- "clarity": jargon, vague phrases ("fast-paced", "wear many hats", "passionate"), undefined acronyms
- "quality": weak/unappealing language, missing selling points, no team context
- issues array: max 8 most impactful issues`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) {
      console.error('[jd-optimizer] groq', r.status)
      return res.status(500).json({ error: 'AI service error. Try again.' })
    }
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)
    return res.json({ ok: true, ...parsed })
  } catch (err) {
    console.error('[jd-optimizer] exception', err.message)
    return res.status(500).json({ error: 'Could not optimize JD.' })
  }
}
