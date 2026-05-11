import Head from 'next/head'
import { useState, useRef, useCallback } from 'react'

const SKILLS_COLORS = ['#ff6b00','#0ea5e9','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#84cc16']

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src; s.onload = resolve; s.onerror = reject
    document.head.appendChild(s)
  })
}

async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'txt') {
    return new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = e => res(e.target.result)
      r.onerror = rej
      r.readAsText(file)
    })
  }
  if (ext === 'pdf') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js')
    const pdfjsLib = window['pdfjs-dist/build/pdf']
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    const ab = await file.arrayBuffer()
    const doc = await pdfjsLib.getDocument({ data: ab }).promise
    let text = ''
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map(it => it.str).join(' ') + '\n'
    }
    return text
  }
  if (ext === 'docx') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js')
    const ab = await file.arrayBuffer()
    const result = await window.mammoth.extractRawText({ arrayBuffer: ab })
    return result.value
  }
  throw new Error('Unsupported file type. Use PDF, DOCX, or TXT.')
}

function SectionHeader({ title, color = '#ff6b00' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ width: 4, height: 20, background: color, borderRadius: 2 }} />
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>{title}</h3>
    </div>
  )
}

export default function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | extracting | parsing | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef()

  const processFile = useCallback(async (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf','docx','txt'].includes(ext)) {
      setError('Only PDF, DOCX, and TXT files are supported.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5 MB.')
      return
    }
    setFile(f)
    setError('')
    setResult(null)
    setStatus('extracting')
    let text
    try {
      text = await extractText(f)
    } catch (e) {
      setError(e.message || 'Could not read file.')
      setStatus('error')
      return
    }
    if (!text || text.trim().length < 50) {
      setError('Could not extract readable text. Try a text-based PDF or DOCX.')
      setStatus('error')
      return
    }
    setStatus('parsing')
    try {
      const resp = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await resp.json()
      if (!resp.ok || !data.ok) {
        setError(data.error || 'Parse failed.')
        setStatus('error')
        return
      }
      setResult(data)
      setStatus('done')
    } catch (e) {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) processFile(f)
  }, [processFile])

  const onDragOver = useCallback((e) => { e.preventDefault(); setDragging(true) }, [])
  const onDragLeave = useCallback(() => setDragging(false), [])

  const reset = () => {
    setFile(null); setResult(null); setError(''); setStatus('idle')
    if (inputRef.current) inputRef.current.value = ''
  }

  const copyJSON = () => {
    if (!result) return
    const { ok, ...data } = result
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareWhatsApp = () => {
    if (!result) return
    const skills = (result.skills || []).slice(0, 6).join(', ')
    const msg = `📄 *Resume Parsed via HireHub360*\n\n👤 ${result.name || 'N/A'}\n💼 ${result.current_title || 'N/A'} ${result.current_company ? `@ ${result.current_company}` : ''}\n📍 ${result.location || 'N/A'}\n⏱ ${result.years_experience || 0} yrs exp\n🛠 ${skills}\n\n${result.summary || ''}\n\nhttps://hirehub360.in`
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank')
  }

  const downloading = () => {
    if (!result) return
    const { ok, ...data } = result
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(result.name || 'resume').replace(/\s+/g, '_')}_parsed.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const busy = status === 'extracting' || status === 'parsing'

  return (
    <>
      <Head>
        <title>AI Resume Parser — Extract Skills & Profile Instantly | HireHub360</title>
        <meta name="description" content="Upload your PDF or DOCX resume. AI instantly extracts your name, skills, experience, education and builds your profile — no manual typing." />
        <link rel="canonical" href="https://hirehub360.in/resume-upload" />
        <meta property="og:title" content="AI Resume Parser | HireHub360" />
        <meta property="og:description" content="Upload resume → AI extracts structured profile in seconds." />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Resume+Parser&s=Upload+PDF+%E2%80%94+AI+builds+your+profile+instantly" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
        .skill-chip { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; margin: 3px; }
        .exp-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; }
        .action-btn { border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity .15s; }
        .action-btn:hover { opacity: .85; }
        @media(max-width:600px){ .result-grid { grid-template-columns: 1fr !important; } .hero-title { font-size: 28px !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>
          HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10 }}>360</sup>
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/cv-screener" style={{ textDecoration: 'none', fontSize: 13, color: '#666', fontWeight: 500 }}>CV Screener</a>
          <a href="/interview-prep" style={{ textDecoration: 'none', fontSize: 13, color: '#666', fontWeight: 500 }}>Interview Prep</a>
          <a href="/salary-calculator" style={{ textDecoration: 'none', fontSize: 13, color: '#666', fontWeight: 500 }}>Salary</a>
          <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Post Job</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2d1a0e 100%)', padding: '60px 24px 50px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(255,107,0,.15)', border: '1px solid rgba(255,107,0,.3)', borderRadius: 20, padding: '5px 16px', fontSize: 13, color: '#ff6b00', fontWeight: 600, marginBottom: 16 }}>
          ✨ AI-Powered • Instant • Free
        </div>
        <h1 className="hero-title" style={{ fontSize: 40, fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
          AI Resume Parser
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.7)', margin: '0 auto 12px', maxWidth: 500 }}>
          Upload your PDF or DOCX — AI extracts name, skills, experience & builds your complete profile in seconds.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', margin: 0 }}>No account needed. Your data never leaves your browser until parsed.</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Upload Zone */}
        {status !== 'done' && (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !busy && inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#ff6b00' : '#d1d5db'}`,
              borderRadius: 16,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: busy ? 'default' : 'pointer',
              background: dragging ? 'rgba(255,107,0,.04)' : '#fafafa',
              transition: 'all .2s',
              marginBottom: 24,
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => processFile(e.target.files?.[0])} />
            {busy ? (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', margin: '0 0 6px' }}>
                  {status === 'extracting' ? 'Extracting text from resume…' : 'AI is parsing your resume…'}
                </p>
                <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Usually takes 5–10 seconds</p>
                <div style={{ width: 200, height: 4, background: '#e5e7eb', borderRadius: 4, margin: '16px auto 0' }}>
                  <div style={{ height: '100%', background: '#ff6b00', borderRadius: 4, width: status === 'extracting' ? '40%' : '80%', transition: 'width 1s' }} />
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                <p style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: '0 0 6px' }}>
                  {file ? file.name : 'Drop your resume here or click to browse'}
                </p>
                <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>PDF, DOCX, or TXT · Max 5 MB</p>
                <button
                  style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                >
                  Choose File
                </button>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>❌</span>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#dc2626' }}>{error}</p>
              <button onClick={reset} style={{ fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Try another file</button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && status === 'done' && (
          <div>
            {/* Header card */}
            <div style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2d1a0e 100%)', borderRadius: 16, padding: '28px 28px 24px', marginBottom: 20, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800 }}>{result.name || 'Name not found'}</h2>
                <p style={{ margin: '0 0 10px', fontSize: 15, color: 'rgba(255,255,255,.75)' }}>
                  {[result.current_title, result.current_company].filter(Boolean).join(' @ ')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13 }}>
                  {result.location && <span style={{ background: 'rgba(255,255,255,.1)', padding: '4px 12px', borderRadius: 20 }}>📍 {result.location}</span>}
                  {result.years_experience > 0 && <span style={{ background: 'rgba(255,107,0,.25)', padding: '4px 12px', borderRadius: 20, color: '#ffa053' }}>⏱ {result.years_experience} yrs exp</span>}
                  {result.email && <span style={{ background: 'rgba(255,255,255,.1)', padding: '4px 12px', borderRadius: 20 }}>✉️ {result.email}</span>}
                  {result.phone && <span style={{ background: 'rgba(255,255,255,.1)', padding: '4px 12px', borderRadius: 20 }}>📞 {result.phone}</span>}
                  {result.open_to_remote && <span style={{ background: 'rgba(16,185,129,.25)', color: '#34d399', padding: '4px 12px', borderRadius: 20 }}>🌐 Open to Remote</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="action-btn" onClick={shareWhatsApp} style={{ background: '#25D366', color: '#fff' }}>📱 Share</button>
                <button className="action-btn" onClick={copyJSON} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>{copied ? '✅ Copied' : '📋 Copy JSON'}</button>
                <button className="action-btn" onClick={downloading} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>⬇️ Download</button>
                <button className="action-btn" onClick={reset} style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>↩ Parse Another</button>
              </div>
            </div>

            {/* Summary */}
            {result.summary && (
              <div style={{ background: '#fff8f3', border: '1px solid #fed7aa', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 14, color: '#92400e', lineHeight: 1.6 }}>💡 {result.summary}</p>
              </div>
            )}

            <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Skills */}
              {result.skills?.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 20px 16px' }}>
                  <SectionHeader title={`Skills (${result.skills.length})`} color="#ff6b00" />
                  <div>
                    {result.skills.map((s, i) => (
                      <span key={i} className="skill-chip" style={{ background: SKILLS_COLORS[i % SKILLS_COLORS.length] + '18', color: SKILLS_COLORS[i % SKILLS_COLORS.length] }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(result.linkedin || result.github || result.portfolio || result.notice_period || result.salary_expectation) && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 20px 16px' }}>
                  <SectionHeader title="Details" color="#8b5cf6" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.linkedin && <a href={result.linkedin} target="_blank" rel="noopener" style={{ fontSize: 13, color: '#0a66c2', textDecoration: 'none' }}>🔗 LinkedIn</a>}
                    {result.github && <a href={result.github} target="_blank" rel="noopener" style={{ fontSize: 13, color: '#333', textDecoration: 'none' }}>🐙 GitHub</a>}
                    {result.portfolio && <a href={result.portfolio} target="_blank" rel="noopener" style={{ fontSize: 13, color: '#ff6b00', textDecoration: 'none' }}>🌐 Portfolio</a>}
                    {result.notice_period && <p style={{ margin: 0, fontSize: 13, color: '#555' }}>📅 Notice: {result.notice_period}</p>}
                    {result.salary_expectation && <p style={{ margin: 0, fontSize: 13, color: '#555' }}>💰 Expected: {result.salary_expectation}</p>}
                    {result.languages?.length > 0 && <p style={{ margin: 0, fontSize: 13, color: '#555' }}>🗣 {result.languages.join(', ')}</p>}
                    {result.certifications?.length > 0 && (
                      <div>
                        <p style={{ margin: '4px 0 4px', fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>Certifications</p>
                        {result.certifications.map((c, i) => <p key={i} style={{ margin: '2px 0', fontSize: 13, color: '#555' }}>🏅 {c}</p>)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Experience */}
            {result.experience?.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px', marginTop: 20 }}>
                <SectionHeader title="Work Experience" color="#0ea5e9" />
                {result.experience.map((exp, i) => (
                  <div key={i} className="exp-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1d1d1f' }}>{exp.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, color: '#666' }}>{exp.company}</p>
                      </div>
                      {exp.duration && <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', marginLeft: 8, paddingTop: 2 }}>{exp.duration}</span>}
                    </div>
                    {exp.highlights?.length > 0 && (
                      <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                        {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {result.education?.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px', marginTop: 20 }}>
                <SectionHeader title="Education" color="#10b981" />
                {result.education.map((edu, i) => (
                  <div key={i} className="exp-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1d1d1f' }}>{edu.degree}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: '#666' }}>{edu.institution}</p>
                    </div>
                    {edu.year && <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', marginLeft: 8 }}>{edu.year}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Upsell */}
            <div style={{ background: 'linear-gradient(135deg, #fff7ed, #fff)', border: '1px solid #fed7aa', borderRadius: 14, padding: '24px', marginTop: 28, textAlign: 'center' }}>
              <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#1d1d1f' }}>Profile extracted! Now find your next role 🚀</p>
              <p style={{ margin: '0 0 18px', fontSize: 14, color: '#666' }}>Browse thousands of jobs or let companies discover you on HireHub360.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/" style={{ background: '#ff6b00', color: '#fff', textDecoration: 'none', padding: '11px 26px', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>Browse Jobs →</a>
                <a href="/hirehub.html" style={{ background: '#1d1d1f', color: '#fff', textDecoration: 'none', padding: '11px 26px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Create Profile</a>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        {status === 'idle' && (
          <div style={{ marginTop: 10 }}>
            <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: '#1d1d1f', marginBottom: 24 }}>How it works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { icon: '📤', title: 'Upload Resume', desc: 'PDF, DOCX, or plain text file' },
                { icon: '🤖', title: 'AI Parsing', desc: 'Groq AI reads and extracts all data' },
                { icon: '📊', title: 'Structured Profile', desc: 'Skills, exp, education, contacts' },
                { icon: '🚀', title: 'Apply Faster', desc: 'Use your parsed data everywhere' },
              ].map((step, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{step.icon}</div>
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>{step.title}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, background: '#f9fafb', borderRadius: 12, padding: '20px 24px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>What gets extracted</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {['Name & Contact', 'Current Role', 'Years of Experience', 'Skills (up to 20)', 'Work History', 'Education', 'Certifications', 'LinkedIn & GitHub', 'Salary Expectation', 'Notice Period', 'Languages', 'Remote Preference'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
