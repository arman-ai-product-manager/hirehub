export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, phone, location, title, years, skills, summary, experience, education } = req.body || {}

  if (!name || !title) return res.status(400).json({ error: 'Name and title are required' })

  const expText = (experience || []).map((e, i) =>
    `${i + 1}. Company: ${e.company || 'N/A'}, Role: ${e.role || 'N/A'}, Duration: ${e.duration || 'N/A'}, Achievement: ${e.achievement || 'N/A'}`
  ).join('\n')

  const prompt = `You are India's top resume writer. Create a professional ATS-friendly resume for:
Name: ${name}
Role: ${title}
Experience Level: ${years || 'Fresher'}
Location: ${location || 'India'}
Skills: ${skills || 'N/A'}
Work Experience:
${expText || 'No experience provided (fresher)'}
Education: ${education ? `${education.degree || ''} from ${education.college || ''} (${education.year || ''})` : 'Not provided'}
User Summary (if provided, refine it; if empty, write a new one): ${summary || ''}

Return ONLY valid JSON with no markdown, no code blocks, no extra text:
{
  "summary": "3-4 line professional summary highlighting strengths, years of experience, and key value",
  "experience": [{"company": "company name", "role": "job title", "duration": "start - end", "bullets": ["quantified achievement 1", "quantified achievement 2", "quantified achievement 3"]}],
  "skills_formatted": "Technical: skill1, skill2 | Tools: tool1, tool2 | Soft Skills: skill3",
  "education_formatted": "Degree, College Name, Year"
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
        max_tokens: 1500,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!r.ok) {
      const err = await r.text()
      console.error('Groq API error:', r.status, err)
      return res.status(502).json({ error: 'AI service error. Please try again.' })
    }

    const data = await r.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    const raw = data.choices?.[0]?.message?.content || ''

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse failed. Raw:', raw)
      return res.status(500).json({ error: 'AI returned invalid format. Please try again.' })
    }

    return res.json(parsed)
  } catch (e) {
    console.error('Resume generate error:', e)
    return res.status(500).json({ error: e.message })
  }
}
