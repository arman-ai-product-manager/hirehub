const { supabaseService } = require('../../../lib/supabase')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { job, candidates } = req.body || {}

  if (!job || !candidates || !Array.isArray(candidates)) {
    return res.status(400).json({ error: 'job and candidates array are required' })
  }

  // Cap at 10 candidates
  const batch = candidates.slice(0, 10)

  async function scoreOne(candidate) {
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
        throw new Error('Groq API error: ' + r.status)
      }

      const data = await r.json()
      let raw = data.choices?.[0]?.message?.content || '{}'
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
      const result = JSON.parse(raw)

      return {
        candidate_id: candidate.id || candidate.candidate_id || null,
        score: result.score ?? 50,
        grade: result.grade ?? 'C',
        hire_probability: result.hire_probability ?? 'Medium',
        summary: result.summary ?? '',
        strengths: result.strengths ?? [],
        gaps: result.gaps ?? []
      }
    } catch (e) {
      console.error('batch-score individual error:', e.message)
      return {
        candidate_id: candidate.id || candidate.candidate_id || null,
        score: 50,
        grade: 'C',
        hire_probability: 'Medium',
        summary: 'Unable to score at this time.',
        strengths: [],
        gaps: []
      }
    }
  }

  // Score all candidates in parallel
  const scores = await Promise.all(batch.map(scoreOne))

  // Update fit_score in Supabase applications table for each candidate that has an id
  const updates = scores.filter(s => s.candidate_id)
  if (updates.length > 0) {
    await Promise.all(
      updates.map(s =>
        supabaseService
          .from('applications')
          .update({ fit_score: s.score })
          .eq('candidate_id', s.candidate_id)
          .then(({ error }) => {
            if (error) console.error('fit_score update error for', s.candidate_id, error.message)
          })
      )
    )
  }

  return res.json({ scores })
}
