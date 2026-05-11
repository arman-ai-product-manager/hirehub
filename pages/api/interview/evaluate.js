// AI Mock Interview — evaluates a candidate's answer to a question
// Returns score, feedback, sample_answer, follow_up
function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const question    = clip(req.body?.question, 500)
  const answer      = clip(req.body?.answer, 3000)
  const role        = clip(req.body?.role, 100)
  const category    = clip(req.body?.category, 60)  // Behavioral / Technical / HR / Situational
  const jd          = clip(req.body?.jd, 2000)

  if (!question) return res.status(400).json({ error: 'Question is required' })
  if (!answer || answer.length < 10) return res.status(400).json({ error: 'Please provide a longer answer' })

  const prompt = `You are an expert interviewer evaluating a candidate's interview answer. Be honest, helpful, and specific.

ROLE: ${role || 'Software professional'}
QUESTION TYPE: ${category || 'General'}
${jd ? `JOB CONTEXT:\n${jd}\n` : ''}

INTERVIEW QUESTION:
${question}

CANDIDATE'S ANSWER:
${answer}

Return ONLY valid JSON (no markdown):
{
  "score": <number 0-100, be honest — a mediocre answer should score 40-60, excellent 80-95>,
  "grade": "<A / B / C / D>",
  "verdict": "<one punchy sentence: overall assessment>",
  "strengths": ["<what was good in their answer>", "<another strength if present>"],
  "improvements": ["<specific thing to fix>", "<another thing>"],
  "missing": ["<key point they forgot to mention>"],
  "sample_answer": "<an ideal answer to this question in 80-120 words — the STAR format where applicable>",
  "follow_up": "<a likely follow-up question the interviewer would ask next, based on their answer>",
  "coaching_tip": "<1 actionable tip for this type of question going forward>"
}

Scoring guide:
- 90-100: Outstanding — specific, structured, concise, directly answers with strong examples
- 75-89: Good — clear and relevant, minor gaps or verbosity
- 55-74: Average — partially answers, lacks structure or specifics
- 35-54: Weak — vague, off-topic, or missing key elements
- 0-34: Poor — very short, irrelevant, or missed the question entirely`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1200,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) {
      console.error('[interview/evaluate] groq', r.status)
      return res.status(500).json({ error: 'AI service error. Try again.' })
    }
    const data = await r.json()
    let raw = data.choices?.[0]?.message?.content || '{}'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(raw)
    return res.json({ ok: true, ...parsed })
  } catch (err) {
    console.error('[interview/evaluate] exception', err.message)
    return res.status(500).json({ error: 'Could not evaluate answer.' })
  }
}
