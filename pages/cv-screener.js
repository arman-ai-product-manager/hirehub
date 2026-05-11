import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const MAX_FILES = 30
const MAX_FILE_MB = 5

// Lazy-load pdf.js + mammoth from CDN once
let pdfjsLib = null
let mammothLib = null

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('no document'))
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src; s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load ' + src))
    document.head.appendChild(s)
  })
}

async function ensurePdfJs() {
  if (pdfjsLib) return pdfjsLib
  await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs')
  // pdfjs-dist exposes window.pdfjsLib
  pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf']
  if (!pdfjsLib) {
    // Fallback: dynamic import
    const mod = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs')
    pdfjsLib = mod
  }
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'
  }
  return pdfjsLib
}

async function ensureMammoth() {
  if (mammothLib) return mammothLib
  await loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js')
  mammothLib = window.mammoth
  return mammothLib
}

async function extractText(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (ext === 'txt' || ext === 'md') {
    return await file.text()
  }
  if (ext === 'pdf') {
    const lib = await ensurePdfJs()
    const buf = await file.arrayBuffer()
    const doc = await lib.getDocument({ data: buf }).promise
    const parts = []
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p)
      const tc = await page.getTextContent()
      parts.push(tc.items.map(i => i.str).join(' '))
    }
    return parts.join('\n')
  }
  if (ext === 'docx') {
    const m = await ensureMammoth()
    const buf = await file.arrayBuffer()
    const r = await m.extractRawText({ arrayBuffer: buf })
    return r.value
  }
  if (ext === 'doc') {
    throw new Error('.doc not supported — please convert to .docx or .pdf')
  }
  throw new Error('Unsupported file type: ' + ext)
}

export default function CvScreener() {
  const [jd, setJd] = useState('')
  const [files, setFiles] = useState([])  // { id, file, status, text, error }
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const dropRef = useRef(null)

  function addFiles(list) {
    const arr = Array.from(list)
    const next = []
    for (const f of arr) {
      if (files.length + next.length >= MAX_FILES) break
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        next.push({ id: Math.random().toString(36).slice(2), file: f, status: 'error', text: '', error: `Too large (>${MAX_FILE_MB}MB)` })
      } else {
        next.push({ id: Math.random().toString(36).slice(2), file: f, status: 'pending', text: '', error: '' })
      }
    }
    setFiles(prev => [...prev, ...next])
  }

  useEffect(() => {
    const el = dropRef.current
    if (!el) return
    function onDrop(e) {
      e.preventDefault(); e.stopPropagation()
      el.classList.remove('drop-active')
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files)
    }
    function onDragOver(e) { e.preventDefault(); el.classList.add('drop-active') }
    function onDragLeave() { el.classList.remove('drop-active') }
    el.addEventListener('drop', onDrop)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('dragleave', onDragLeave)
    return () => {
      el.removeEventListener('drop', onDrop)
      el.removeEventListener('dragover', onDragOver)
      el.removeEventListener('dragleave', onDragLeave)
    }
  }, [files.length])

  async function parseAll() {
    const updates = [...files]
    for (let i = 0; i < updates.length; i++) {
      if (updates[i].status !== 'pending') continue
      updates[i] = { ...updates[i], status: 'parsing' }
      setFiles([...updates])
      try {
        const text = await extractText(updates[i].file)
        if (!text || text.trim().length < 100) {
          updates[i] = { ...updates[i], status: 'error', error: 'Empty or too short' }
        } else {
          updates[i] = { ...updates[i], status: 'ready', text: text.slice(0, 12000) }
        }
      } catch (err) {
        updates[i] = { ...updates[i], status: 'error', error: err.message || 'Parse failed' }
      }
      setFiles([...updates])
    }
    return updates.filter(f => f.status === 'ready')
  }

  async function run() {
    setError(''); setResults(null); setRunning(true)
    try {
      const ready = await parseAll()
      if (ready.length === 0) {
        setError('No readable CVs. Add PDF/DOCX/TXT files with at least 100 characters of text.')
        setRunning(false); return
      }
      const r = await fetch('/api/screen/bulk', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jd: jd.trim(),
          cvs: ready.map(f => ({ name: f.file.name, text: f.text })),
        }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Screening failed')
      setResults(j)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  function reset() {
    setFiles([]); setResults(null); setError(''); setJd('')
  }

  function shareWhatsApp() {
    if (!results) return
    const top = results.results.slice(0, 5)
    const lines = top.map((r, i) =>
      `${['🥇','🥈','🥉','4️⃣','5️⃣'][i]} ${r.candidate_name} — ${r.score}/100 (${r.recommendation})\n   ${r.current_role || 'Unknown role'} · ${r.years_experience || 0} yrs\n   ${r.summary ? r.summary.slice(0, 100) + '…' : ''}`
    ).join('\n\n')
    const mode = results.mode === 'jd-fit' ? 'JD-fit screening' : 'quality screening'
    const text = `📊 *AI CV Screening Results* (${results.total} CVs · ${mode})\n\nTop ${top.length} candidates:\n\n${lines}\n\n_Screened by HireHub360 AI — hirehub360.in/cv-screener_`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener')
  }

  function exportCSV() {
    if (!results) return
    const header = ['Rank','Candidate','File','Score','Grade','Current Role','Years Exp','Top Skills','Recommendation','Summary','Strengths','Gaps']
    const rows = results.results.map((r, i) => [
      i + 1,
      r.candidate_name || 'Unknown',
      r.file || '',
      r.score,
      r.grade,
      r.current_role || '',
      r.years_experience || 0,
      (r.top_skills || []).join(' | '),
      r.recommendation || '',
      (r.summary || '').replace(/"/g, "'"),
      (r.strengths || []).join(' | ').replace(/"/g, "'"),
      (r.gaps || []).join(' | ').replace(/"/g, "'"),
    ])
    const csv = [header, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `cv-screening-results-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Head>
        <title>AI Bulk CV Screener — Rank 30 Resumes in 60 Seconds | HireHub360</title>
        <meta name="description" content="Upload up to 30 resumes, paste a job description, and let AI rank candidates by fit instantly. The fastest CV screener for Indian HR teams." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="AI Bulk CV Screener — Rank 30 Resumes in 60 Seconds" />
        <meta property="og:description" content="Drop 30 resumes, paste a JD, and AI ranks candidates by fit in 60 seconds. Free for Indian HR teams." />
        <meta property="og:url" content="https://hirehub360.in/cv-screener" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Bulk+CV+Screener&s=Rank+30+resumes+against+your+JD+in+60+seconds+%E2%80%94+free+for+HR" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hirehub360.in/cv-screener" />
      </Head>

      <style jsx global>{`
        .drop-active { background:#fff7ed !important; border-color:#ff6b00 !important; }
        @media print {
          header, .no-print { display:none !important; }
          body { background:#fff !important; }
          .print-result { page-break-inside:avoid; border:1px solid #ccc !important; margin-bottom:12px !important; }
        }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f5f5f7', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui" }}>
        <header style={{ background:'#fff', borderBottom:'1px solid #e5e5e7', padding:'14px 20px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ fontSize:18, fontWeight:700, color:'#1d1d1f', textDecoration:'none' }}>
              HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10, color:'#ff6b00' }}>360</sup>
            </Link>
            <Link href="/" style={{ fontSize:14, color:'#0066cc', textDecoration:'none' }}>← Home</Link>
          </div>
        </header>

        <section style={{ background:'linear-gradient(135deg,#1d1d1f 0%,#2d2d30 100%)', color:'#fff', padding:'56px 20px 40px', textAlign:'center' }}>
          <div style={{ maxWidth:780, margin:'0 auto' }}>
            <div style={{ display:'inline-block', background:'rgba(255,107,0,0.15)', color:'#ffb380', padding:'6px 12px', borderRadius:999, fontSize:12, fontWeight:600, letterSpacing:0.5, marginBottom:14 }}>
              ⚡ INDIA-FIRST · FREE FOR HR
            </div>
            <h1 style={{ fontSize:'clamp(28px,5vw,44px)', fontWeight:700, margin:'0 0 14px', lineHeight:1.15 }}>
              AI Bulk CV Screener
            </h1>
            <p style={{ fontSize:'clamp(15px,2vw,18px)', opacity:0.85, lineHeight:1.55, maxWidth:640, margin:'0 auto' }}>
              Drop up to <strong>30 resumes</strong>, paste your job description, and AI ranks them in 60 seconds.
              No more reading 100 CVs. See the top fits first.
            </p>
          </div>
        </section>

        <main style={{ maxWidth:1100, margin:'0 auto', padding:'32px 16px 80px' }}>
          {!results && (
            <div style={{ display:'grid', gap:20, gridTemplateColumns:'1fr', alignItems:'start' }}>
              <Card title="Step 1 — Job description (optional)">
                <p style={{ fontSize:13, color:'#6e6e73', margin:'0 0 10px' }}>
                  Paste the JD to rank by <strong>fit</strong>. Skip it to rank by <strong>overall quality</strong>.
                </p>
                <textarea
                  value={jd} onChange={e=>setJd(e.target.value)}
                  placeholder={'Example:\n\nSenior React Developer — 4+ yrs\nMust have: React, TypeScript, Redux\nNice: Next.js, GraphQL\nLocation: Bangalore (hybrid)'}
                  rows={7}
                  style={{ width:'100%', padding:'12px 14px', fontSize:14, fontFamily:'inherit', borderRadius:10, border:'1px solid #d2d2d7', background:'#fff', resize:'vertical', boxSizing:'border-box', outline:'none' }}
                />
              </Card>

              <Card title="Step 2 — Upload CVs (PDF, DOCX, TXT)">
                <div ref={dropRef} style={{
                  border:'2px dashed #d2d2d7', borderRadius:14, padding:'28px 16px', textAlign:'center',
                  background:'#fafafa', transition:'all .15s', cursor:'pointer',
                }} onClick={() => document.getElementById('cv-input').click()}>
                  <div style={{ fontSize:36, marginBottom:6 }}>📄</div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#1d1d1f', marginBottom:4 }}>
                    Drag & drop CVs here, or click to choose
                  </div>
                  <div style={{ fontSize:12, color:'#6e6e73' }}>
                    Up to {MAX_FILES} files · {MAX_FILE_MB}MB each · PDF / DOCX / TXT
                  </div>
                  <input id="cv-input" type="file" multiple accept=".pdf,.docx,.txt,.md"
                    onChange={e => { addFiles(e.target.files); e.target.value = '' }}
                    style={{ display:'none' }} />
                </div>

                {files.length > 0 && (
                  <div style={{ marginTop:14, display:'grid', gap:6 }}>
                    {files.map(f => (
                      <div key={f.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, background:'#f5f5f7', padding:'8px 12px', borderRadius:8, fontSize:13 }}>
                        <div style={{ flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          📎 {f.file.name} <span style={{ color:'#6e6e73', fontSize:11 }}>· {Math.round(f.file.size/1024)} KB</span>
                        </div>
                        <span style={{ fontSize:12, color:f.status==='error' ? '#dc2626' : '#6e6e73' }}>
                          {f.status === 'pending' && 'Ready'}
                          {f.status === 'parsing' && '⚙️ Parsing…'}
                          {f.status === 'ready' && '✓ Parsed'}
                          {f.status === 'error' && `⚠️ ${f.error}`}
                        </span>
                        <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                          style={{ background:'none', border:'none', color:'#dc2626', cursor:'pointer', fontSize:16 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {error && (
                <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', color:'#991b1b', padding:'12px 16px', borderRadius:10, fontSize:14 }}>
                  {error}
                </div>
              )}

              <button onClick={run} disabled={running || files.length === 0}
                style={{
                  background: files.length === 0 ? '#d2d2d7' : '#ff6b00',
                  color:'#fff', padding:'16px', borderRadius:14, border:'none',
                  fontSize:16, fontWeight:700, cursor: files.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: running ? 0.7 : 1,
                }}>
                {running ? '⚙️ Scoring CVs… (this takes 30-60 sec)' : `🚀 Rank ${files.length || ''} CV${files.length===1?'':'s'} with AI`}
              </button>

              <p style={{ textAlign:'center', fontSize:12, color:'#6e6e73', margin:0 }}>
                CV text is sent to our AI service for scoring only — not stored permanently. Free for now during launch.
              </p>
            </div>
          )}

          {results && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
                <div>
                  <h2 style={{ fontSize:24, fontWeight:700, color:'#1d1d1f', margin:'0 0 4px' }}>
                    {results.total} CV{results.total===1?'':'s'} ranked
                  </h2>
                  <p style={{ fontSize:13, color:'#6e6e73', margin:0 }}>
                    Mode: <strong>{results.mode === 'jd-fit' ? 'JD Fit' : 'Overall Quality'}</strong> · Sorted by AI score
                  </p>
                </div>
                <div className="no-print" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button onClick={exportCSV}
                    style={{ background:'#1d1d1f', color:'#fff', border:'none', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    ⬇️ Download CSV
                  </button>
                  <button onClick={shareWhatsApp}
                    style={{ background:'#25D366', color:'#fff', border:'none', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    💬 Share Top 5 on WhatsApp
                  </button>
                  <button onClick={() => window.print()}
                    style={{ background:'#fff', color:'#1d1d1f', border:'1px solid #d2d2d7', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    🖨️ Print / PDF
                  </button>
                  <button onClick={reset}
                    style={{ background:'#fff', color:'#6e6e73', border:'1px solid #d2d2d7', padding:'10px 16px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    🔄 New batch
                  </button>
                </div>
              </div>

              <div style={{ display:'grid', gap:14 }}>
                {results.results.map((r, i) => (
                  <ResultCard key={i} rank={i+1} r={r} />
                ))}
              </div>
              <p style={{ textAlign:'center', fontSize:12, color:'#6e6e73', marginTop:24 }}>
                Screened {results.total} CVs · {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })} · HireHub360 AI Screener
              </p>

              <div className="no-print" style={{ marginTop:32, background:'linear-gradient(135deg,#1d1d1f 0%,#2d2d30 100%)', borderRadius:18, padding:'28px 24px', textAlign:'center', color:'#fff' }}>
                <div style={{ fontSize:13, background:'rgba(255,107,0,0.2)', color:'#ffb380', display:'inline-block', padding:'4px 12px', borderRadius:999, marginBottom:12, fontWeight:600 }}>
                  🚀 Liked this? Go further
                </div>
                <h3 style={{ fontSize:22, fontWeight:700, margin:'0 0 8px' }}>Post your job + get applicants scored automatically</h3>
                <p style={{ opacity:0.8, maxWidth:520, margin:'0 auto 20px', fontSize:14, lineHeight:1.5 }}>
                  With HireHub360 Growth plan — post unlimited jobs, every new applicant gets AI-scored in seconds, you only review top fits.
                </p>
                <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  <a href="/pricing" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'14px 28px', borderRadius:12, fontWeight:600, textDecoration:'none', fontSize:15 }}>
                    See Pricing →
                  </a>
                  <a href="/hirehub.html" style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', color:'#fff', padding:'14px 28px', borderRadius:12, fontWeight:600, textDecoration:'none', fontSize:15, border:'1px solid rgba(255,255,255,0.2)' }}>
                    Post a Job Free
                  </a>
                </div>
                <p style={{ fontSize:12, opacity:0.5, marginTop:14 }}>₹999/mo · Cancel anytime · 3,400+ companies trust HireHub360</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, padding:'22px 22px', border:'1px solid #e5e5e7' }}>
      <h2 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', margin:'0 0 14px' }}>{title}</h2>
      {children}
    </div>
  )
}

function ResultCard({ rank, r }) {
  const recColor = {
    'Strong Hire': '#059669', 'Hire': '#10b981', 'Maybe': '#f59e0b', 'No': '#dc2626',
  }[r.recommendation] || '#6e6e73'
  const scoreColor = r.score >= 80 ? '#059669' : r.score >= 60 ? '#10b981' : r.score >= 40 ? '#f59e0b' : '#dc2626'

  return (
    <div className="print-result" style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #e5e5e7' }}>
      <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:10 }}>
        <div style={{ background: rank <= 3 ? '#fff7ed' : '#f5f5f7', color: rank <= 3 ? '#ff6b00' : '#1d1d1f', width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0 }}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : '#'+rank}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:10, alignItems:'flex-start', flexWrap:'wrap' }}>
            <div>
              <h3 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', margin:'0 0 2px' }}>
                {r.candidate_name || 'Unknown'}
              </h3>
              <p style={{ fontSize:13, color:'#6e6e73', margin:0 }}>
                {r.current_role || '—'} · {r.years_experience || 0} yrs · <span style={{ fontFamily:'monospace' }}>{r.file}</span>
              </p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:28, fontWeight:700, color:scoreColor, lineHeight:1 }}>{r.score}</div>
              <div style={{ fontSize:11, color:'#6e6e73' }}>Grade {r.grade}</div>
            </div>
          </div>
        </div>
      </div>

      {r.summary && (
        <p style={{ fontSize:14, color:'#1d1d1f', margin:'8px 0 10px', lineHeight:1.5 }}>{r.summary}</p>
      )}

      {r.top_skills && r.top_skills.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
          {r.top_skills.map((s, i) => (
            <span key={i} style={{ background:'#f5f5f7', color:'#1d1d1f', padding:'3px 9px', borderRadius:6, fontSize:12 }}>{s}</span>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:13 }}>
        {r.strengths && r.strengths.length > 0 && (
          <div>
            <div style={{ color:'#059669', fontWeight:600, marginBottom:4, fontSize:12 }}>✓ Strengths</div>
            <ul style={{ margin:0, paddingLeft:16, color:'#3d3d3f' }}>
              {r.strengths.map((s, i) => <li key={i} style={{ marginBottom:2 }}>{s}</li>)}
            </ul>
          </div>
        )}
        {r.gaps && r.gaps.length > 0 && (
          <div>
            <div style={{ color:'#dc2626', fontWeight:600, marginBottom:4, fontSize:12 }}>⚠ Gaps</div>
            <ul style={{ margin:0, paddingLeft:16, color:'#3d3d3f' }}>
              {r.gaps.map((s, i) => <li key={i} style={{ marginBottom:2 }}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginTop:12, display:'inline-block', background: recColor + '20', color: recColor, padding:'4px 12px', borderRadius:8, fontSize:12, fontWeight:600 }}>
        {r.recommendation}
      </div>
    </div>
  )
}
