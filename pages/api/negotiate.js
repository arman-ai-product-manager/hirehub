// AI Salary Negotiation Coach — stateful chat, AI plays the HR/hiring manager
// Each turn: candidate sends message, AI responds in-role + gives a coaching note
function clip(s, max) { return typeof s === 'string' ? s.slice(0, max).trim() : '' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const role        = clip(req.body?.role, 120)
  const offer       = Number(req.body?.offer) || 0        // current offer in LPA
  const target      = Number(req.body?.target) || 0       // target salary in LPA
  const company     = clip(req.body?.company, 100)
  const years       = Number(req.body?.years) || 0
  const scenario    = clip(req.body?.scenario, 40) || 'offer'  // 'offer' | 'raise' | 'counter'
  const history     = Array.isArray(req.body?.history) ? req.body.history.slice(-12) : []
  const userMessage = clip(req.body?.message, 1000)

  if (!userMessage) return res.status(400).json({ error: 'Message is required' })

  const systemPrompt = `You are playing a tough-but-fair ${scenario === 'raise' ? 'manager in a performance review' : 'HR recruiter / hiring manager'} at ${company || 'a mid-size tech company'}. Your job is to negotiate salary with the candidate.

CONTEXT:
- Role being discussed: ${role || 'Software Engineer'}
- ${scenario === 'raise' ? `Current salary: ₹${offer} LPA, candidate wants a raise` : `Initial offer extended: ₹${offer} LPA`}
- Candidate's target: ₹${target} LPA
- Candidate's experience: ${years} years

INSTRUCTIONS:
1. Stay in character as the HR/manager. Be realistic — push back on unreasonable demands, but be willing to negotiate if the candidate makes good arguments.
2. Use real HR tactics: budget constraints, band limits, equity/benefits as trade-offs, competing offers leverage, market data counter-arguments.
3. After your in-character response, add a JSON block EXACTLY like this on a new line:
{"coaching": "<1-2 sentence coaching note for the candidate about what they did well or should do differently>", "score": <0-100 for this candidate message>, "negotiation_phase": "<Opening | Anchoring | Counter | Closing | Won | Lost>"}

Start each response with your HR character dialogue, end with the JSON block.
Keep HR responses under 80 words. Be conversational, not robotic.`

  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ]

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        temperature: 0.7,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    })
    if (!r.ok) {
      console.error('[negotiate] groq', r.status)
      return res.status(500).json({ error: 'AI service error.' })
    }
    const data = await r.json()
    const raw = data.choices?.[0]?.message?.content || ''

    // Split dialogue from JSON coaching block
    const jsonMatch = raw.match(/\{[^{}]*"coaching"[^{}]*\}/)
    let coaching = '', score = 50, phase = 'Counter'
    let dialogue = raw

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        coaching = parsed.coaching || ''
        score    = Number(parsed.score) || 50
        phase    = parsed.negotiation_phase || 'Counter'
        dialogue = raw.slice(0, jsonMatch.index).trim()
      } catch {}
    }

    return res.json({ ok: true, dialogue, coaching, score, phase })
  } catch (err) {
    console.error('[negotiate] exception', err.message)
    return res.status(500).json({ error: 'Could not process message.' })
  }
}
