import Head from 'next/head'
import { useState } from 'react'

const SCORE_COLORS = { high: '#10b981', mid: '#f59e0b', low: '#ef4444' }
function scoreColor(s) { return s >= 70 ? SCORE_COLORS.high : s >= 45 ? SCORE_COLORS.mid : SCORE_COLORS.low }

function ScoreBar({ label, score }) {
  const color = scoreColor(score)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color }}>{score}/100</span>
      </div>
      <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4, transition: 'width .6s' }} />
      </div>
    </div>
  )
}

const ISSUE_COLORS = {
  bias:    { bg: '#fef2f2', border: '#fca5a5', badge: '#ef4444', label: 'Bias' },
  clarity: { bg: '#fffbeb', border: '#fcd34d', badge: '#d97706', label: 'Clarity' },
  quality: { bg: '#eff6ff', border: '#93c5fd', badge: '#2563eb', label: 'Quality' },
}

const DEMO_JD = `We're looking for a rockstar software engineer to join our fast-paced startup. The ideal candidate must be a young, energetic self-starter who can hit the ground running.

Requirements:
- 5+ years experience (we prefer candidates from top tier colleges)
- Must be a ninja coder with superior skills
- Dominant personality who can handle the pressure
- Must be passionate about technology
- Experience with React, Node.js required
- Must be able to work long hours and weekends when needed
- Looking for someone who bleeds the company colors

Responsibilities:
- Build stuff
- Work on various projects
- Collaborate with team
- Other duties as assigned

We offer competitive salary.`

export default function JDOptimizer() {
  const [jd, setJd]           = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole]       = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState('optimized') // optimized | issues | original
  const [copied, setCopied]   = useState('')

  const optimize = async (e) => {
    e?.preventDefault()
    setError(''); setResult(null); setLoading(true)
    try {
      const r = await fetch('/api/jobs/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd, company, role }),
      })
      const data = await r.json()
      if (!r.ok || !data.ok) { setError(data.error || 'Failed'); setLoading(false); return }
      setResult(data); setTab('optimized')
    } catch { setError('Network error. Try again.') }
    setLoading(false)
  }

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000) })
  }

  const download = () => {
    if (!result?.optimized_jd) return
    const blob = new Blob([result.optimized_jd], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(role || 'job-description').replace(/\s+/g, '-').toLowerCase()}-optimized.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  const overall = result?.scores?.overall || 0

  return (
    <>
      <Head>
        <title>AI Job Description Optimizer — Remove Bias, Attract Better Candidates | HireHub360</title>
        <meta name="description" content="Free AI job description optimizer. Scores your JD for clarity, inclusion, and quality. Removes biased language, rewrites weak sections, and helps you attract 2× more qualified candidates." />
        <link rel="canonical" href="https://hirehub360.in/jd-optimizer" />
        <meta property="og:title" content="AI JD Optimizer | HireHub360" />
        <meta property="og:description" content="Paste your JD → AI scores and rewrites it to remove bias and attract better candidates." />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+JD+Optimizer&s=Remove+bias+%C2%B7+Attract+2%C3%97+more+candidates" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, system-ui; background: #f5f5f7; }
        .input { width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 14px; font-family: inherit; outline: none; transition: border-color .15s; }
        .input:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,.1); }
        .tab-btn { padding: 8px 18px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; background: transparent; color: #666; }
        .tab-btn.on { background: #fff; color: #1d1d1f; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
        .action-btn { background: rgba(255,255,255,.18); color: #fff; border: 1px solid rgba(255,255,255,.25); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .action-btn:hover { background: rgba(255,255,255,.3); }
        @media(max-width:700px) { .two-col { grid-template-columns: 1fr !important; } }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <nav className="no-print" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10 }}>360</sup></a>
        <div style={{ display: 'flex', gap: 14 }}>
          <a href="/cv-screener"  style={{ textDecoration: 'none', fontSize: 13, color: '#666' }}>CV Screener</a>
          <a href="/companies"    style={{ textDecoration: 'none', fontSize: 13, color: '#666' }}>Companies</a>
          <a href="/post-job"     style={{ background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Post Job</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)', padding: '50px 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'inline-block', background: 'rgba(139,92,246,.3)', borderRadius: 20, padding: '5px 16px', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>✨ Free · AI-Powered · For Recruiters</div>
        <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 800 }}>AI Job Description Optimizer</h1>
        <p style={{ margin: 0, fontSize: 16, color: 'rgba(255,255,255,.82)', maxWidth: 580, marginInline: 'auto' }}>Paste your JD — AI scores it for clarity, inclusion & quality, flags biased language, and rewrites it to attract better candidates.</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Form */}
        {!result && (
          <form onSubmit={optimize} className="no-print" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 28 }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', marginBottom: 6 }}>Company Name (optional)</label>
                <input className="input" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Razorpay" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', marginBottom: 6 }}>Role Title (optional)</label>
                <input className="input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Job Description *</label>
                <button type="button" onClick={() => setJd(DEMO_JD)} style={{ fontSize: 12, color: '#8b5cf6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Load demo JD</button>
              </div>
              <textarea className="input" value={jd} onChange={e => setJd(e.target.value)} required rows={10}
                placeholder="Paste your full job description here…" style={{ resize: 'vertical', minHeight: 180, lineHeight: 1.6 }} />
              <p style={{ margin: '5px 0 0', fontSize: 12, color: '#aaa' }}>{jd.length} chars · minimum 80</p>
            </div>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '11px 14px', borderRadius: 10, marginBottom: 14, fontSize: 14 }}>❌ {error}</div>}

            <button type="submit" disabled={loading || jd.length < 80}
              style={{ width: '100%', background: (loading || jd.length < 80) ? '#9ca3af' : 'linear-gradient(135deg, #1e1b4b, #4c1d95)', color: '#fff', border: 'none', padding: 15, borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: (loading || jd.length < 80) ? 'not-allowed' : 'pointer' }}>
              {loading ? '🔍 Analyzing & Optimizing…' : '✨ Optimize Job Description'}
            </button>
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#888', textAlign: 'center' }}>Takes ~10 seconds · No signup · Free forever</p>

            {/* How it works */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 24 }}>
              {[
                { icon: '📊', t: 'Scores 4 dimensions', d: 'Clarity, Inclusion, Quality, Completeness' },
                { icon: '🚫', t: 'Flags biased language', d: 'Removes ninja, rockstar, young, dominant…' },
                { icon: '✍️', t: 'Full rewrite', d: 'Complete optimized JD ready to publish' },
                { icon: '🎯', t: 'Attracts better talent', d: 'Inclusive JDs get 2× more qualified applicants' },
              ].map((f, i) => (
                <div key={i} style={{ background: '#faf9ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '13px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                  <p style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 700, color: '#4c1d95' }}>{f.t}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#666', lineHeight: 1.4 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </form>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Score header */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', borderRadius: 14, padding: '24px 28px', marginBottom: 20, color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', fontWeight: 600 }}>Overall Score</p>
                  <p style={{ margin: '0 0 6px', fontSize: 48, fontWeight: 800, lineHeight: 1, color: scoreColor(overall) === SCORE_COLORS.high ? '#34d399' : scoreColor(overall) === SCORE_COLORS.mid ? '#fbbf24' : '#fb7185' }}>{overall}/100</p>
                  {result.candidate_persona && <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.75)' }}>🎯 {result.candidate_persona}</p>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="action-btn" onClick={() => copy(result.optimized_jd, 'jd')}>{copied === 'jd' ? '✅ Copied' : '📋 Copy JD'}</button>
                  <button className="action-btn" onClick={download}>⬇️ Download</button>
                  <button className="action-btn" onClick={() => window.print()}>🖨 Print</button>
                  <button className="action-btn" onClick={() => { setResult(null); setJd('') }}>↩ New JD</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {Object.entries(result.scores || {}).filter(([k]) => k !== 'overall').map(([k, v]) => (
                  <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} score={v} />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="no-print" style={{ display: 'flex', gap: 4, background: '#e5e7eb', padding: 4, borderRadius: 10, width: 'fit-content', marginBottom: 16 }}>
              {[['optimized','✨ Optimized JD'],['issues','⚠️ Issues Found'],['original','📄 Original']].map(([id, lbl]) => (
                <button key={id} onClick={() => setTab(id)} className={`tab-btn ${tab === id ? 'on' : ''}`}>{lbl} {id === 'issues' && result.issues?.length ? `(${result.issues.length})` : ''}</button>
              ))}
            </div>

            {/* Optimized JD */}
            {tab === 'optimized' && (
              <div>
                {result.seo_title && (
                  <div className="no-print" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '11px 16px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: 11, color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>SEO-Optimised Title</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>{result.seo_title}</p>
                    </div>
                    <button onClick={() => copy(result.seo_title, 'seo')} style={{ background: '#fff', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>{copied === 'seo' ? '✅' : '📋'}</button>
                  </div>
                )}

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '28px 32px', marginBottom: 16 }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.75, color: '#1d1d1f', margin: 0 }}>{result.optimized_jd}</pre>
                </div>

                {result.key_changes?.length > 0 && (
                  <div className="no-print" style={{ background: '#faf9ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: '18px 20px', marginBottom: 16 }}>
                    <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#4c1d95' }}>📝 Key changes made</p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#555', lineHeight: 1.8 }}>
                      {result.key_changes.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}

                {result.keywords_to_add?.length > 0 && (
                  <div className="no-print" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Keywords to include for SEO</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {result.keywords_to_add.map((k, i) => (
                        <span key={i} style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>{k}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Issues */}
            {tab === 'issues' && (
              <div>
                {result.biased_phrases?.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 18px', marginBottom: 14 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>🚫 Biased / exclusionary phrases detected</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.biased_phrases.map((p, i) => (
                        <span key={i} style={{ background: '#fff', border: '1px solid #fca5a5', color: '#dc2626', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>"{p}"</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.missing_sections?.length > 0 && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '14px 18px', marginBottom: 14 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>📋 Missing sections</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.missing_sections.map((s, i) => (
                        <span key={i} style={{ background: '#fff', border: '1px solid #fcd34d', color: '#92400e', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>+ {s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(result.issues || []).map((issue, i) => {
                    const c = ISSUE_COLORS[issue.type] || ISSUE_COLORS.clarity
                    return (
                      <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ background: c.badge, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>{c.label}</span>
                          <code style={{ fontSize: 13, background: 'rgba(0,0,0,.06)', padding: '2px 8px', borderRadius: 4, color: '#1d1d1f' }}>"{issue.text}"</code>
                        </div>
                        <p style={{ margin: '0 0 6px', fontSize: 13, color: '#444' }}>⚠️ {issue.reason}</p>
                        <p style={{ margin: 0, fontSize: 13, color: '#166534', fontWeight: 600 }}>✓ Better: {issue.fix}</p>
                      </div>
                    )
                  })}
                  {!result.issues?.length && <p style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: 20 }}>No major issues found — nice JD!</p>}
                </div>
              </div>
            )}

            {/* Original */}
            {tab === 'original' && (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '28px 32px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.75, color: '#555', margin: 0 }}>{jd}</pre>
              </div>
            )}

            {/* Upsell */}
            <div className="no-print" style={{ background: 'linear-gradient(135deg, #fff7ed, #fff)', border: '1px solid #fed7aa', borderRadius: 14, padding: 24, marginTop: 24, textAlign: 'center' }}>
              <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>Ready to post this job? 🚀</p>
              <p style={{ margin: '0 0 16px', fontSize: 14, color: '#666' }}>Post on HireHub360 and reach 50,000+ active job seekers in India.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/post-job" style={{ background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>Post Job Now →</a>
                <a href="/cv-screener" style={{ background: '#1d1d1f', color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>🤖 Screen CVs</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
