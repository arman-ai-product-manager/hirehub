export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { job, candidate } = req.body || {}

  if (!job || !candidate) {
    return res.status(400).json({ error: 'Both job and candidate are required' })
  }

  const prompt = `You are an expert Indian recruiter with 15 years experience. Score this candidate for the job.

JOB:
Title: ${job.title || ''}
Required Skills: ${Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || '')}
Experience Required: ${job.experience || ''}
Description: ${job.description || ''}
Location: ${job.location || ''}

CANDIDATE:
Name: ${candidate.name || ''}
Current/Target Role: ${candidate.title || ''}
Skills: ${Array.isArray(candidate.skills) ? candidate.skills.join(', ') : (candidate.skills || '')}
Experience: ${candidate.experience || ''}
Location: ${candidate.location || ''}
Summary: ${candidate.summary || ''}

Return ONLY valid JSON (no markdown, no explanation):
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "summary": "<2-sentence recruiter assessment>",
  "hire_probability": "<High/Medium/Low/Very Low>"
}

Scoring criteria (be strict and realistic):
- Skills match: 40% weight
- Experience level match: 25% weight
- Location/remote compatibility: 15% weight
- Role alignment: 20% weight`

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!r.ok) {
      const err = await r.text()
      console.error('Groq API error:', r.status, err)
      return res.status(500).json({
        error: 'AI service error',
        score: 50, grade: 'C', strengths: [], gaps: [],
        summary: 'Unable to score at this time.', hire_probability: 'Medium'
      })
    }

    const data = await r.json()
    if (data.error) {
      return res.status(500).json({
        error: data.error.message,
        score: 50, grade: 'C', strengths: [], gaps: [],
        summary: 'Unable to score at this time.', hire_probability: 'Medium'
      })
    }

    let raw = data.choices?.[0]?.message?.content || '{}'
    // Strip markdown code fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let result
    try {
      result = JSON.parse(raw)
    } catch (e) {
      console.error('JSON parse error from Groq:', e.message, raw)
      return res.status(500).json({
        error: 'Failed to parse AI response',
        score: 50, grade: 'C', strengths: [], gaps: [],
        summary: 'Unable to score at this time.', hire_probability: 'Medium'
      })
    }

    return res.json({
      score: result.score ?? 50,
      grade: result.grade ?? 'C',
      strengths: result.strengths ?? [],
      gaps: result.gaps ?? [],
      summary: result.summary ?? '',
      hire_probability: result.hire_probability ?? 'Medium'
    })
  } catch (e) {
    console.error('score.js error:', e)
    return res.status(500).json({
      error: e.message,
      score: 50, grade: 'C', strengths: [], gaps: [],
      summary: 'Unable to score at this time.', hire_probability: 'Medium'
    })
  }
}
