import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const REC_COLOR = { hire: '#16a34a', consider: '#d97706', reject: '#dc2626' }
const REC_BG    = { hire: '#dcfce7', consider: '#fef3c7', reject: '#fee2e2' }
const REC_LABEL = { hire: 'HIRE', consider: 'CONSIDER', reject: 'REJECT' }

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#16a34a' : score >= 45 ? '#d97706' : '#dc2626'
  const bg    = score >= 70 ? '#dcfce7' : score >= 45 ? '#fef3c7' : '#fee2e2'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: bg, color, fontWeight: 900, fontSize: 14 }}>
      {score}
    </div>
  )
}

export default function JobDetail() {
  const [jobId, setJobId] = useState(null)
  const [session, setSession] = useState(null)
  const [job, setJob]         = useState(null)
  const [resumes, setResumes] = useState([])
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [screening, setScreening] = useState(false)
  const [screenProgress, setScreenProgress] = useState({ done: 0, total: 0 })
  const [exporting, setExporting]   = useState(false)
  const [filter, setFilter]         = useState('all')
  const [expanded, setExpanded]     = useState(null)
  const [tab, setTab]               = useState('resumes')
  const fileRef = useRef()
  const pollRef = useRef()

  // Get jobId from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/')
      setJobId(parts[parts.length - 1])
    }
  }, [])

  useEffect(() => {
    if (!SB || !jobId) return
    SB.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadResults(data.session.access_token, jobId)
      else setLoading(false)
    })
  }, [jobId])

  async function loadResults(token, jid) {
    setLoading(true)
    const r = await fetch(`/api/screener/results?job_id=${jid}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const d = await r.json()
    if (r.ok) {
      setJob(d.job)
      setResumes(d.resumes || [])
      setStats(d.stats)
    }
    setLoading(false)
  }

  // Auto-poll while pending/processing resumes exist
  useEffect(() => {
    if (!session || !jobId) return
    const hasPending = resumes.some(r => r.status === 'pending' || r.status === 'processing')
    if (hasPending && !screening) {
      pollRef.current = setInterval(() => loadResults(session.access_token, jobId), 4000)
    } else {
      clearInterval(pollRef.current)
    }
    return () => clearInterval(pollRef.current)
  }, [resumes, screening, session, jobId])

  async function handleUpload(files) {
    if (!files || files.length === 0) return
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (pdfs.length === 0) { alert('Please select PDF files only.'); return }
    if (pdfs.length > 500) { alert('Maximum 500 files per batch.'); return }

    setUploading(true)
    setUploadProgress({ done: 0, total: pdfs.length, errors: 0 })

    const CHUNK = 20
    let done = 0, errors = 0
    const token = session.access_token

    for (let i = 0; i < pdfs.length; i += CHUNK) {
      const batch = pdfs.slice(i, i + CHUNK)
      const fd = new FormData()
      fd.append('job_id', jobId)
      batch.forEach(f => fd.append('resumes', f))

      try {
        const r = await fetch('/api/screener/upload', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: fd,
        })
        const d = await r.json()
        done += d.results?.filter(x => x.ok).length || 0
        errors += d.results?.filter(x => !x.ok).length || 0
      } catch {
        errors += batch.length
      }
      setUploadProgress({ done: done + errors, total: pdfs.length, errors })
    }

    setUploading(false)
    setUploadProgress(null)
    await loadResults(token, jobId)
  }

  async function startScreening() {
    if (screening) return
    const pending = resumes.filter(r => r.status === 'pending' || r.status === 'error')
    if (pending.length === 0) { alert('No pending resumes to screen.'); return }

    setScreening(true)
    setScreenProgress({ done: 0, total: pending.length })
    const token = session.access_token

    try {
      const resp = await fetch('/api/screener/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ job_id: jobId }),
      })

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      let done = 0

      while (true) {
        const { value, done: streamDone } = await reader.read()
        if (streamDone) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop()
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const msg = JSON.parse(line)
            if (msg.done === true && msg.processed !== undefined) break
            if (msg.id) {
              done++
              setScreenProgress(p => ({ ...p, done }))
              setResumes(prev => prev.map(r => r.id === msg.id
                ? { ...r, status: msg.done ? 'done' : 'error', score: msg.score }
                : r
              ))
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error('Screening error:', e)
    }

    setScreening(false)
    await loadResults(token, jobId)
  }

  async function exportExcel() {
    setExporting(true)
    const token = session.access_token
    const r = await fetch(`/api/screener/export?job_id=${jobId}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    if (r.ok) {
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = (job?.title || 'screened').replace(/[^a-z0-9]/gi, '_') + '_results.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    }
    setExporting(false)
  }

  async function deleteResume(id) {
    if (!confirm('Remove this resume?')) return
    const token = session.access_token
    await fetch(`/api/screener/upload?id=${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
    setResumes(prev => prev.filter(r => r.id !== id))
  }

  const filtered = filter === 'all' ? resumes : resumes.filter(r => r.recommendation === filter || r.status === filter)
  const pendingCount = resumes.filter(r => r.status === 'pending' || r.status === 'error').length

  if (!session && !loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontWeight: 800 }}>Sign in required</h2>
        <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '10px 24px', borderRadius: 9, fontWeight: 700, textDecoration: 'none' }}>Sign In →</a>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>{job ? `${job.title} — AI Screener` : 'AI Resume Screener'} | HireHub360</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
        {/* Nav */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 5vw', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 18, color: '#1d1d1f', textDecoration: 'none', letterSpacing: '-.03em' }}>
              Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
            </a>
            <span style={{ color: '#d1d5db' }}>›</span>
            <a href="/screener" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 600 }}>Resume Screener</a>
            {job && <><span style={{ color: '#d1d5db' }}>›</span><span style={{ fontSize: 14, color: '#374151', fontWeight: 700 }}>{job.title}</span></>}
          </div>
          <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← All Jobs</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>Loading…</div>
        ) : (
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 5vw' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-.04em', margin: '0 0 4px', color: '#111827' }}>{job?.title}</h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {job?.skills?.slice(0, 6).map(s => (
                    <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>{s}</span>
                  ))}
                  {job?.skills?.length > 6 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{job.skills.length - 6}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {stats?.done > 0 && (
                  <button onClick={exportExcel} disabled={exporting}
                    style={{ background: '#fff', border: '1.5px solid #d1d5db', color: '#374151', padding: '10px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? .7 : 1 }}>
                    {exporting ? 'Exporting…' : '⬇ Export Excel'}
                  </button>
                )}
                {pendingCount > 0 && (
                  <button onClick={startScreening} disabled={screening || uploading}
                    style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: (screening || uploading) ? 'not-allowed' : 'pointer', opacity: (screening || uploading) ? .7 : 1 }}>
                    {screening ? `Screening… ${screenProgress.done}/${screenProgress.total}` : `▶ Screen ${pendingCount} Resume${pendingCount !== 1 ? 's' : ''} with AI`}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            {stats && stats.total > 0 && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total', value: stats.total, color: '#374151', bg: '#f3f4f6' },
                  { label: 'Screened', value: stats.done, color: '#374151', bg: '#f3f4f6' },
                  { label: 'Hire', value: stats.hire, color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Consider', value: stats.consider, color: '#d97706', bg: '#fef3c7' },
                  { label: 'Reject', value: stats.reject, color: '#dc2626', bg: '#fee2e2' },
                  stats.pending > 0 && { label: 'Pending', value: stats.pending, color: '#6b7280', bg: '#f9fafb' },
                ].filter(Boolean).map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '10px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
                    <span style={{ fontWeight: 900, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginTop: 2 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Screening progress bar */}
            {screening && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  <span>🤖 AI Screening in progress…</span>
                  <span>{screenProgress.done} / {screenProgress.total}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                  <div style={{ background: '#ff6b00', height: '100%', borderRadius: 999, width: `${screenProgress.total ? (screenProgress.done / screenProgress.total) * 100 : 0}%`, transition: 'width .3s' }} />
                </div>
              </div>
            )}

            {/* Upload progress */}
            {uploading && uploadProgress && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  <span>📤 Uploading PDFs…</span>
                  <span>{uploadProgress.done} / {uploadProgress.total}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                  <div style={{ background: '#3b82f6', height: '100%', borderRadius: 999, width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`, transition: 'width .2s' }} />
                </div>
                {uploadProgress.errors > 0 && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{uploadProgress.errors} file(s) failed to upload</div>}
              </div>
            )}

            {/* Upload Drop Zone */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (!uploading && !screening) handleUpload(e.dataTransfer.files) }}
              onClick={() => { if (!uploading && !screening) fileRef.current?.click() }}
              style={{ background: '#fff', border: '2px dashed #d1d5db', borderRadius: 14, padding: '28px 20px', textAlign: 'center', marginBottom: 24, cursor: (uploading || screening) ? 'not-allowed' : 'pointer', opacity: (uploading || screening) ? .6 : 1, transition: 'border-color .15s' }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginBottom: 4 }}>Drop PDF resumes here or click to browse</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>Up to 500 PDFs per batch · Max 10 MB each</div>
              <input ref={fileRef} type="file" accept=".pdf,application/pdf" multiple style={{ display: 'none' }}
                onChange={e => handleUpload(e.target.files)} />
            </div>

            {/* Filter Tabs */}
            {resumes.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: `All (${resumes.length})` },
                  { key: 'hire', label: `Hire (${stats?.hire || 0})` },
                  { key: 'consider', label: `Consider (${stats?.consider || 0})` },
                  { key: 'reject', label: `Reject (${stats?.reject || 0})` },
                  stats?.pending > 0 && { key: 'pending', label: `Pending (${stats.pending})` },
                  stats?.error > 0  && { key: 'error',   label: `Error (${stats.error})` },
                ].filter(Boolean).map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid ' + (filter === f.key ? '#ff6b00' : '#e5e7eb'), background: filter === f.key ? '#fff5ee' : '#fff', color: filter === f.key ? '#ff6b00' : '#374151', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Results Table */}
            {resumes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', marginBottom: 6 }}>No resumes yet</h3>
                <p style={{ color: '#6b7280', fontSize: 14 }}>Upload PDFs above to start screening candidates.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 14 }}>
                No resumes match this filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map((r, idx) => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    {/* Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: r.status === 'done' ? 'pointer' : 'default' }}
                      onClick={() => r.status === 'done' && setExpanded(expanded === r.id ? null : r.id)}>

                      {/* Rank */}
                      <div style={{ width: 28, textAlign: 'center', fontWeight: 900, fontSize: 13, color: '#9ca3af', flexShrink: 0 }}>
                        {r.status === 'done' ? (resumes.filter(x => x.status === 'done').findIndex(x => x.id === r.id) + 1) : '–'}
                      </div>

                      {/* Score circle */}
                      <div style={{ flexShrink: 0 }}>
                        {r.status === 'done' && r.score != null
                          ? <ScoreBadge score={r.score} />
                          : <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                              {r.status === 'processing' ? '⚙️' : r.status === 'error' ? '⚠️' : '⏳'}
                            </div>
                        }
                      </div>

                      {/* Name + file */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.candidate_name || r.file_name}
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', gap: 10 }}>
                          {r.candidate_email && <span>{r.candidate_email}</span>}
                          {r.candidate_phone && <span>{r.candidate_phone}</span>}
                          {!r.candidate_email && !r.candidate_phone && <span>{r.file_name}</span>}
                        </div>
                      </div>

                      {/* Recommendation badge */}
                      <div style={{ flexShrink: 0 }}>
                        {r.recommendation ? (
                          <span style={{ background: REC_BG[r.recommendation], color: REC_COLOR[r.recommendation], fontWeight: 800, fontSize: 11, padding: '4px 10px', borderRadius: 6, letterSpacing: '.03em' }}>
                            {REC_LABEL[r.recommendation]}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
                            {r.status === 'pending' ? 'Pending' : r.status === 'processing' ? 'Processing…' : r.status === 'error' ? 'Error' : ''}
                          </span>
                        )}
                      </div>

                      {/* Summary preview */}
                      {r.summary && (
                        <div style={{ flex: 2, minWidth: 0, fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'none' }} className="hide-mobile">
                          {r.summary}
                        </div>
                      )}

                      {/* Expand arrow */}
                      {r.status === 'done' && (
                        <div style={{ color: '#d1d5db', fontSize: 14, flexShrink: 0 }}>
                          {expanded === r.id ? '▲' : '▼'}
                        </div>
                      )}

                      {/* Delete */}
                      <button onClick={e => { e.stopPropagation(); deleteResume(r.id) }}
                        style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 16, padding: 0, flexShrink: 0, lineHeight: 1 }}>×</button>
                    </div>

                    {/* Expanded detail */}
                    {expanded === r.id && r.status === 'done' && (
                      <div style={{ borderTop: '1px solid #f3f4f6', padding: '18px 20px', background: '#fafafa' }}>
                        {r.summary && (
                          <p style={{ fontSize: 13, color: '#374151', margin: '0 0 14px', lineHeight: 1.6 }}>{r.summary}</p>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          {r.strengths?.length > 0 && (
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 12, color: '#16a34a', marginBottom: 6 }}>✓ Strengths</div>
                              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
                                {r.strengths.map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                          {r.gaps?.length > 0 && (
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 12, color: '#dc2626', marginBottom: 6 }}>✗ Gaps</div>
                              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
                                {r.gaps.map((g, i) => <li key={i}>{g}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                        {r.file_url && (
                          <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-block', marginTop: 14, fontSize: 12, color: '#ff6b00', fontWeight: 700, textDecoration: 'none' }}>
                            View Original PDF →
                          </a>
                        )}
                      </div>
                    )}

                    {/* Error detail */}
                    {r.status === 'error' && r.error_msg && (
                      <div style={{ borderTop: '1px solid #fee2e2', padding: '10px 18px', background: '#fff5f5', fontSize: 12, color: '#dc2626' }}>
                        {r.error_msg}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
