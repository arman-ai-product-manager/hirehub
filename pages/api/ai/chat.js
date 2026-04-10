export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, maxTokens } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens || 800,
        temperature: 0.5,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await r.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    res.json({ text: data.choices?.[0]?.message?.content || '' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
