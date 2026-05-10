import Head from 'next/head'
import { useState } from 'react'

const GRADE_COLORS = { A: '#22c55e', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444' }
const HIRE_COLORS = { High: '#22c55e', Medium: '#f59e0b', Low: '#f97316', 'Very Low': '#ef4444' }

const STEPS = [
  {
    num: '01',
    title: 'Paste the Job Description',
    desc: 'Enter job title, required skills, experience, and description.',
    icon: '📋',
  },
  {
    num: '02',
    title: 'Add Candidate Profile',
    desc: 'Enter the candidate\'s skills, experience, location, and summary.',
    icon: '👤',
  },
  {
    num: '03',
    title: 'AI Analyses in Seconds',
    desc: 'Our Llama 3.3 70B model scores skills, experience, role fit & location.',
    icon: '🧠',
  },
  {
    num: '04',
    title: 'Get Actionable Insights',
    desc: 'Receive a 0–100 score, A–F grade, strengths, gaps and hire probability.',
    icon: '✅',
  },
]

const DEMO_JOB = {
  title: 'Senior React Developer',
  skills: 'React, TypeScript, Node.js, REST APIs, Git',
  experience: '3–5 years',
  description: 'Build and maintain scalable web applications for our SaaS platform. Collaborate with design and backend teams.',
  location: 'Bangalore (Hybrid)',
}

const DEMO_CANDIDATE = {
  name: 'Priya Sharma',
  title: 'Frontend Developer',
  skills: 'React, JavaScript, CSS, Redux, Webpack',
  experience: '4 years',
  location: 'Bangalore',
  summary: 'Frontend developer with 4 years building React SPAs. Strong in component architecture and performance optimization. Learning TypeScript.',
}

function ScoreRing({ score }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 45 ? 'D' : 'F'
  const color = GRADE_COLORS[grade]
  return (
    <div style={{ position: 'relative', width: 110, height: 110 }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  )
}

function ScoreCard({ result }) {
  const grade = result.grade
  const gradeColor = GRADE_COLORS[grade] || '#9ca3af'
  const hireColor = HIRE_COLORS[result.hire_probability] || '#9ca3af'

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '32px 36px',
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)', border: '1px solid #e5e7eb',
      maxWidth: 640, margin: '0 auto'
    }}>
      {/* Top row: ring + grade + hire prob */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 28, flexWrap: 'wrap' }}>
        <ScoreRing score={result.score} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{
              background: gradeColor, color: '#fff', borderRadius: 10,
              padding: '4px 18px', fontSize: 22, fontWeight: 800, letterSpacing: 1
            }}>Grade {grade}</span>
            <span style={{
              background: hireColor + '22', color: hireColor, border: `1px solid ${hireColor}55`,
              borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600
            }}>
              {result.hire_probability} Fit
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{result.summary}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Strengths */}
        <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontWeight: 700, color: '#15803d', fontSize: 13, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Strengths</div>
          {(result.strengths || []).map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
              <span style={{ color: '#22c55e', fontSize: 15, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 13, color: '#166534', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Gaps */}
        <div style={{ background: '#fff7ed', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontWeight: 700, color: '#c2410c', fontSize: 13, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Gaps</div>
          {(result.gaps || []).map((g, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
              <span style={{ color: '#f97316', fontSize: 15, flexShrink: 0, marginTop: 1 }}>!</span>
              <span style={{ fontSize: 13, color: '#9a3412', lineHeight: 1.5 }}>{g}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline }) {
  const shared = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px',
    fontSize: 14, color: '#1d1d1f', background: '#fafafa',
    outline: 'none', fontFamily: 'inherit', resize: 'vertical',
    transition: 'border-color 0.2s'
  }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared} />
      }
    </div>
  )
}

export default function AIScoring() {
  const [job, setJob] = useState({ ...DEMO_JOB })
  const [candidate, setCandidate] = useState({ ...DEMO_CANDIDATE })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function setJobField(k) { return v => setJob(j => ({ ...j, [k]: v })) }
  function setCandField(k) { return v => setCandidate(c => ({ ...c, [k]: v })) }

  async function handleScore(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const r = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, candidate })
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Scoring failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setError(null)
    setJob({ ...DEMO_JOB })
    setCandidate({ ...DEMO_CANDIDATE })
  }

  return (
    <>
      <Head>
        <title>AI Candidate Scoring — HireHub360</title>
        <meta name="description" content="AI-powered candidate fit scoring for Indian recruiters. Get instant 0-100 scores, grade, strengths, gaps and hire probability for every applicant." />
        <link rel="canonical" href="https://hirehub360.in/ai-scoring" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="AI Candidate Scoring Tool — HireHub360" />
        <meta property="og:description" content="AI-powered fit scores for every candidate. 0-100 score, grade, strengths, gaps, hire probability. Free for Indian recruiters." />
        <meta property="og:url" content="https://hirehub360.in/ai-scoring" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Candidate+Scoring&s=Instant+fit+scores+for+every+CV+%E2%80%94+free+for+Indian+recruiters" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'HireHub360 AI Candidate Scoring',
          description: 'AI-powered fit score for every candidate vs job posting',
          url: 'https://hirehub360.in/ai-scoring',
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }
        })}} />
      </Head>

      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', background: '#f5f5f7', minHeight: '100vh' }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/" style={{ textDecoration: 'none', color: '#1d1d1f', fontWeight: 700, fontSize: 18 }}>
            HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10 }}>360</sup>
          </a>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a href="/features" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14 }}>Features</a>
            <a href="/pricing" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 14 }}>Pricing</a>
            <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '8px 18px', borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Open App</a>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #fff7f0 0%, #fff 60%, #f0f7ff 100%)', padding: '72px 24px 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#ff6b0015', color: '#ff6b00', borderRadius: 20, padding: '5px 16px', fontSize: 13, fontWeight: 600, letterSpacing: 0.5, marginBottom: 20, textTransform: 'uppercase' }}>
            AI-Powered Recruiting
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#1d1d1f', lineHeight: 1.15 }}>
            AI Candidate Scoring<br />
            <span style={{ color: '#ff6b00' }}>Hire the Right Person, First Time</span>
          </h1>
          <p style={{ margin: '0 auto 32px', maxWidth: 600, fontSize: 18, color: '#6b7280', lineHeight: 1.6 }}>
            Stop reading 200 CVs manually. Our AI scores each candidate against your job in seconds — giving you a 0–100 fit score, grade, strengths and gaps.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#demo" style={{ background: '#ff6b00', color: '#fff', padding: '14px 32px', borderRadius: 25, textDecoration: 'none', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px rgba(255,107,0,0.3)' }}>
              Try Free Demo
            </a>
            <a href="/ats" style={{ background: '#fff', color: '#1d1d1f', padding: '14px 32px', borderRadius: 25, textDecoration: 'none', fontSize: 16, fontWeight: 600, border: '1.5px solid #e5e7eb' }}>
              ATS Dashboard
            </a>
          </div>

          {/* Accuracy claim */}
          <p style={{ marginTop: 28, fontSize: 13, color: '#9ca3af' }}>
            Based on 50,000+ successful hires on HireHub360 &nbsp;·&nbsp; Powered by Llama 3.3 70B
          </p>
        </section>

        {/* How it works */}
        <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 48, fontSize: 16 }}>Four steps from job post to confident hire decision</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 24 }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ background: '#fff', borderRadius: 16, padding: '28px 22px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ color: '#ff6b00', fontWeight: 700, fontSize: 12, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>{s.num}</div>
                <div style={{ fontWeight: 700, color: '#1d1d1f', fontSize: 15, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring breakdown */}
        <section style={{ background: '#fff', padding: '64px 24px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>Scoring Breakdown</h2>
            <p style={{ color: '#6b7280', marginBottom: 40, fontSize: 16 }}>Weighted across four key dimensions — just like a senior recruiter</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              {[
                { label: 'Skills Match', pct: '40%', color: '#ff6b00' },
                { label: 'Experience Level', pct: '25%', color: '#6366f1' },
                { label: 'Role Alignment', pct: '20%', color: '#0ea5e9' },
                { label: 'Location Fit', pct: '15%', color: '#22c55e' },
              ].map(d => (
                <div key={d.label} style={{ background: '#f9fafb', borderRadius: 14, padding: '20px 16px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: d.color, marginBottom: 6 }}>{d.pct}</div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo section */}
        <section id="demo" style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>Try It Live</h2>
              <p style={{ color: '#6b7280', fontSize: 16 }}>Pre-filled with a demo — edit any field or paste your own data</p>
            </div>

            {!result ? (
              <form onSubmit={handleScore}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, marginBottom: 28 }}>
                  {/* Job column */}
                  <div style={{ background: '#fff', borderRadius: 18, padding: '28px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#ff6b0015', color: '#ff6b00', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>JOB</span>
                      Job Requirements
                    </div>
                    <Field label="Job Title" value={job.title} onChange={setJobField('title')} placeholder="e.g. Senior React Developer" />
                    <Field label="Required Skills" value={job.skills} onChange={setJobField('skills')} placeholder="React, TypeScript, Node.js" />
                    <Field label="Experience Required" value={job.experience} onChange={setJobField('experience')} placeholder="e.g. 3–5 years" />
                    <Field label="Location" value={job.location} onChange={setJobField('location')} placeholder="e.g. Bangalore (Hybrid)" />
                    <Field label="Job Description" value={job.description} onChange={setJobField('description')} placeholder="Describe responsibilities and requirements..." multiline />
                  </div>

                  {/* Candidate column */}
                  <div style={{ background: '#fff', borderRadius: 18, padding: '28px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#6366f115', color: '#6366f1', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>CANDIDATE</span>
                      Candidate Profile
                    </div>
                    <Field label="Full Name" value={candidate.name} onChange={setCandField('name')} placeholder="e.g. Priya Sharma" />
                    <Field label="Current / Target Role" value={candidate.title} onChange={setCandField('title')} placeholder="e.g. Frontend Developer" />
                    <Field label="Skills" value={candidate.skills} onChange={setCandField('skills')} placeholder="React, JavaScript, CSS" />
                    <Field label="Experience" value={candidate.experience} onChange={setCandField('experience')} placeholder="e.g. 4 years" />
                    <Field label="Location" value={candidate.location} onChange={setCandField('location')} placeholder="e.g. Bangalore" />
                    <Field label="Summary" value={candidate.summary} onChange={setCandField('summary')} placeholder="Brief profile summary..." multiline />
                  </div>
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 14 }}>
                    {error}
                  </div>
                )}

                <div style={{ textAlign: 'center' }}>
                  <button type="submit" disabled={loading} style={{
                    background: loading ? '#9ca3af' : '#ff6b00',
                    color: '#fff', border: 'none', borderRadius: 25, padding: '15px 48px',
                    fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(255,107,0,0.3)',
                    transition: 'all 0.2s'
                  }}>
                    {loading ? 'Scoring with AI...' : 'Score This Candidate'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <ScoreCard result={result} />
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button onClick={handleReset} style={{
                    background: 'transparent', color: '#ff6b00', border: '1.5px solid #ff6b00',
                    borderRadius: 20, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                  }}>
                    Score Another Candidate
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Grades legend */}
        <section style={{ background: '#fff', padding: '56px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', marginBottom: 36 }}>Grading Scale</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {[
                { grade: 'A', range: '90–100', label: 'Exceptional', color: '#22c55e' },
                { grade: 'B', range: '75–89', label: 'Strong Fit', color: '#84cc16' },
                { grade: 'C', range: '60–74', label: 'Moderate Fit', color: '#f59e0b' },
                { grade: 'D', range: '45–59', label: 'Weak Fit', color: '#f97316' },
                { grade: 'F', range: '0–44', label: 'Not Suitable', color: '#ef4444' },
              ].map(g => (
                <div key={g.grade} style={{ textAlign: 'center', minWidth: 100 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: g.color, color: '#fff', fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>{g.grade}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{g.range}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff8533 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 16px' }}>Ready to Hire Smarter?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            AI scoring is built into the HireHub360 ATS. Score every applicant automatically the moment they apply.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/ats" style={{ background: '#fff', color: '#ff6b00', padding: '14px 36px', borderRadius: 25, textDecoration: 'none', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              Open ATS Dashboard
            </a>
            <a href="/hirehub.html" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 36px', borderRadius: 25, textDecoration: 'none', fontSize: 16, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.4)' }}>
              Post a Job Free
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#1d1d1f', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
            &copy; 2026 HireHub360 &nbsp;·&nbsp; <a href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</a> &nbsp;·&nbsp;
            <a href="/features" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a> &nbsp;·&nbsp;
            <a href="/pricing" style={{ color: '#9ca3af', textDecoration: 'none' }}>Pricing</a> &nbsp;·&nbsp;
            <a href="/privacy.js" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</a>
          </p>
        </footer>

      </div>
    </>
  )
}
