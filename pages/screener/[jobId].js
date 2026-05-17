import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const REC_COLOR = { hire: '#16a34a', consider: '#d97706', reject: '#dc2626' }
const REC_BG    = { hire: '#dcfce7', consider: '#fef3c7', reject: '#fee2e2' }
const REC_LABEL = { hire: '✓ Hire', consider: '~ Consider', reject: '✗ Reject' }

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#16a34a' : score >= 45 ? '#d97706' : '#dc2626'
  const bg    = score >= 70 ? '#dcfce7' : score >= 45 ? '#fef3c7' : '#fee2e2'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: bg, color, fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
      {score}
    </div>
  )
}

function Toast({ msg, type = 'info', onClose }) {
  useEffect(() => { if (msg) { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) } }, [msg])
  if (!msg) return null
  const bg = type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#f0f9ff'
  const color = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#0369a1'
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: bg, color, padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,.12)', maxWidth: '90vw', textAlign: 'center', whiteSpace: 'pre-line' }}>
      {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', marginLeft: 10, cursor: 'pointer', color, fontWeight: 900, fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
    </div>
  )
}

export default function JobDetail() {
  const [jobId, setJobId]           = useState(null)
  const [session, setSession]       = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [job, setJob]               = useState(null)
  const [resumes, setResumes]       = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [uploading, setUploading]   = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadSummary, setUploadSummary]   = useState(null)
  const [screening, setScreening]   = useState(false)
  const [screenProgress, setScreenProgress] = useState({ done: 0, total: 0 })
  const [exporting, setExporting]   = useState(false)
  const [filter, setFilter]         = useState('all')
  const [expanded, setExpanded]     = useState(null)
  const [toast, setToast]           = useState({ msg: '', type: 'info' })
  const fileRef  = useRef()
  const pollRef  = useRef()
  const tokenRef = useRef('')

  const showToast = useCallback((msg, type = 'info') => setToast({ msg, type }), [])

  // Get jobId from URL (pages router dynamic segments aren't available client-side without useRouter,
  // but this page is under /screener/[jobId] so we parse pathname)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parts = window.location.pathname.split('/').filter(Boolean)
    // pathname: /screener/<jobId>
    const id = parts[parts.length - 1]
    if (id && id !== 'screener') setJobId(id)
  }, [])

  useEffect(() => {
    if (!SB) return
    SB.auth.getSession().then(({ data }) => {
      const s = data.session
      setSession(s)
      setAuthLoading(false)
      if (s) {
        tokenRef.current = s.access_token
        if (jobId) loadResults(s.access_token, jobId, false)
        else setLoading(false)
      } else {
        setLoading(false)
      }
    })
  }, [jobId])

  // loadResults: silent=true skips the loading spinner (used for polls)
  async function loadResults(token, jid, silent = false) {
    if (!silent) setLoading(true)
    try {
      const r = await fetch(`/api/screener/results?job_id=${jid}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        if (!silent) showToast(d.error || 'Failed to load results', 'error')
        return
      }
      const d = await r.json()
      setJob(d.job)
      setResumes(d.resumes || [])
      setStats(d.stats)
    } catch {
      if (!silent) showToast('Network error — could not load results', 'error')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Auto-poll every 4s while pending/processing resumes exist (silent refresh, no loading flash)
  useEffect(() => {
    if (!session || !jobId) return
    const hasPending = resumes.some(r => r.status === 'pending' || r.status === 'processing')
    if (hasPending && !screening) {
      clearInterval(pollRef.current)
      pollRef.current = setInterval(() => {
        loadResults(tokenRef.current, jobId, true)
      }, 4000)
    } else {
      clearInterval(pollRef.current)
    }
    return () => clearInterval(pollRef.current)
  }, [resumes, screening, session, jobId])

  async function handleUpload(files) {
    if (!files || files.length === 0) return
    if (!session) { showToast('Session expired — please sign in again', 'error'); return }

    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (pdfs.length === 0) { showToast('Please select PDF files only.', 'error'); return }
    if (pdfs.length > 500) { showToast('Maximum 500 files per batch.', 'error'); return }

    // Reset file input so same files can be re-selected
    if (fileRef.current) fileRef.current.value = ''

    setUploading(true)
    setUploadSummary(null)
    setUploadProgress({ done: 0, total: pdfs.length, errors: 0 })

    const CHUNK = 20
    let done = 0, errors = 0
    const token = tokenRef.current

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
        const d = await r.json().catch(() => ({ results: [] }))
        if (!r.ok) {
          errors += batch.length
        } else {
          done   += d.results?.filter(x => x.ok).length  || 0
          errors += d.results?.filter(x => !x.ok).length || 0
        }
      } catch {
        errors += batch.length
      }
      setUploadProgress({ done: done + errors, total: pdfs.length, errors })
    }

    setUploading(false)
    setUploadProgress(null)

    if (errors > 0 && done === 0) {
      showToast(`Upload failed for all ${errors} file(s). Check file format and size.`, 'error')
    } else if (errors > 0) {
      setUploadSummary({ done, errors })
      showToast(`${done} uploaded, ${errors} failed`, 'error')
    } else {
      showToast(`${done} resume${done !== 1 ? 's' : ''} uploaded successfully`, 'success')
    }

    await loadResults(token, jobId, true)
  }

  async function startScreening() {
    if (screening || !session) return
    const pending = resumes.filter(r => r.status === 'pending' || r.status === 'error')
    if (pending.length === 0) { showToast('No pending resumes to screen.', 'info'); return }

    setScreening(true)
    setScreenProgress({ done: 0, total: pending.length })
    const token = tokenRef.current

    try {
      const resp = await fetch('/api/screener/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ job_id: jobId }),
      })

      if (!resp.ok) {
        const d = await resp.json().catch(() => ({}))
        showToast(d.error || `Screening failed (${resp.status})`, 'error')
        setScreening(false)
        return
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      let done = 0
      let finished = false

      outer: while (true) {
        const { value, done: streamDone } = await reader.read()
        if (streamDone) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() // keep incomplete last line
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const msg = JSON.parse(line)
            if (msg.done === true && msg.processed !== undefined) {
              finished = true
              break outer // correctly exits the while loop
            }
            if (msg.id) {
              done++
              setScreenProgress(p => ({ ...p, done }))
              setResumes(prev => prev.map(r =>
                r.id === msg.id
                  ? { ...r, status: msg.done ? 'done' : 'error', score: msg.score ?? r.score }
                  : r
              ))
            }
          } catch {}
        }
      }

      showToast(`Screening complete — ${done} resume${done !== 1 ? 's' : ''} processed`, 'success')
    } catch (e) {
      showToast('Screening error: ' + (e.message || 'Unknown error'), 'error')
    }

    setScreening(false)
    await loadResults(token, jobId, true)
  }

  async function exportExcel() {
    if (!session) return
    setExporting(true)
    try {
      const r = await fetch(`/api/screener/export?job_id=${jobId}`, {
        headers: { Authorization: 'Bearer ' + tokenRef.current }
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        showToast(d.error || 'Export failed', 'error')
        return
      }
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = (job?.title || 'screened').replace(/[^a-z0-9]/gi, '_') + '_results.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      showToast('Export failed — network error', 'error')
    } finally {
      setExporting(false)
    }
  }

  async function deleteResume(id) {
    if (!confirm('Remove this resume?')) return
    try {
      const r = await fetch(`/api/screener/resume?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + tokenRef.current }
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        showToast(d.error || 'Delete failed', 'error')
        return
      }
      setResumes(prev => prev.filter(r => r.id !== id))
      setStats(prev => {
        if (!prev) return prev
        const deleted = resumes.find(r => r.id === id)
        return {
          ...prev,
          total: prev.total - 1,
          done:    prev.done    - (deleted?.status === 'done' ? 1 : 0),
          pending: prev.pending - (deleted?.status === 'pending' ? 1 : 0),
          hire:    prev.hire    - (deleted?.recommendation === 'hire' ? 1 : 0),
          consider:prev.consider- (deleted?.recommendation === 'consider' ? 1 : 0),
          reject:  prev.reject  - (deleted?.recommendation === 'reject' ? 1 : 0),
        }
      })
    } catch {
      showToast('Delete failed — network error', 'error')
    }
  }

  // Pre-compute rank map to avoid O(n²) in render
  const doneResumes = resumes.filter(r => r.status === 'done')
  const rankMap = Object.fromEntries(doneResumes.map((r, i) => [r.id, i + 1]))

  const filtered = filter === 'all'
    ? resumes
    : resumes.filter(r => r.recommendation === filter || r.status === filter)

  const pendingCount = resumes.filter(r => r.status === 'pending' || r.status === 'error').length

  // Show loading spinner while auth is resolving
  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</div>
    </div>
  )

  // Auth gate — only shown after auth state is known
  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', background: '#f9fafb', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Sign in required</h2>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>Sign in to your HireHub360 company account to continue.</p>
        <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Sign In →</a>
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

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />

      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
        {/* Nav */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 5vw', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 17, color: '#1d1d1f', textDecoration: 'none', letterSpacing: '-.03em', flexShrink: 0 }}>
              Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
            </a>
            <span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span>
            <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Screener</a>
            {job && (
              <>
                <span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</span>
              </>
            )}
          </div>
          <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', flexShrink: 0, marginLeft: 8 }}>← Back</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>Loading…</div>
        ) : !job ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginBottom: 16 }}>Job not found</div>
            <a href="/screener" style={{ color: '#ff6b00', fontWeight: 700, textDecoration: 'none' }}>← Back to Dashboard</a>
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 5vw 60px' }}>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.04em', margin: '0 0 6px', color: '#111827' }}>{job.title}</h1>
              {job.skills?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {job.skills.slice(0, 8).map(s => (
                    <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>{s}</span>
                  ))}
                  {job.skills.length > 8 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{job.skills.length - 8}</span>}
                </div>
              )}
              {/* Action buttons — stacked on mobile via flexWrap */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {stats?.done > 0 && (
                  <button onClick={exportExcel} disabled={exporting}
                    style={{ background: '#fff', border: '1.5px solid #d1d5db', color: '#374151', padding: '9px 16px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? .6 : 1, whiteSpace: 'nowrap' }}>
                    {exporting ? 'Exporting…' : '⬇ Export Excel'}
                  </button>
                )}
                {pendingCount > 0 && (
                  <button onClick={startScreening} disabled={screening || uploading}
                    style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: (screening || uploading) ? 'not-allowed' : 'pointer', opacity: (screening || uploading) ? .7 : 1, whiteSpace: 'nowrap' }}>
                    {screening
                      ? `Screening ${screenProgress.done}/${screenProgress.total}…`
                      : `▶ Screen ${pendingCount} Resume${pendingCount !== 1 ? 's' : ''} with AI`}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Bar — flex wrap so they stack on very small screens */}
            {stats && stats.total > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total',    value: stats.total,    color: '#374151', bg: '#f3f4f6' },
                  { label: 'Screened', value: stats.done,     color: '#374151', bg: '#f3f4f6' },
                  { label: 'Hire',     value: stats.hire,     color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Consider', value: stats.consider, color: '#d97706', bg: '#fef3c7' },
                  { label: 'Reject',   value: stats.reject,   color: '#dc2626', bg: '#fee2e2' },
                  stats.pending > 0 && { label: 'Pending', value: stats.pending, color: '#6b7280', bg: '#f3f4f6' },
                  stats.error   > 0 && { label: 'Error',   value: stats.error,   color: '#dc2626', bg: '#fee2e2' },
                ].filter(Boolean).map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 60px', minWidth: 60 }}>
                    <span style={{ fontWeight: 900, fontSize: 20, color: s.color, lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, marginTop: 3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Screening progress bar */}
            {screening && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  <span>🤖 AI screening in progress…</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{screenProgress.done} / {screenProgress.total}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ background: '#ff6b00', height: '100%', borderRadius: 999, width: `${screenProgress.total ? (screenProgress.done / screenProgress.total) * 100 : 0}%`, transition: 'width .4s' }} />
                </div>
              </div>
            )}

            {/* Upload progress bar */}
            {uploading && uploadProgress && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  <span>📤 Uploading PDFs…</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{uploadProgress.done} / {uploadProgress.total}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ background: '#3b82f6', height: '100%', borderRadius: 999, width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`, transition: 'width .2s' }} />
                </div>
                {uploadProgress.errors > 0 && (
                  <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{uploadProgress.errors} file(s) failed</div>
                )}
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={e => e.preventDefault()}
              onDragEnter={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#ff6b00' }}
              onDragLeave={e => { e.currentTarget.style.borderColor = '#d1d5db' }}
              onDrop={e => {
                e.preventDefault()
                e.currentTarget.style.borderColor = '#d1d5db'
                if (!uploading && !screening) handleUpload(e.dataTransfer.files)
              }}
              onClick={() => { if (!uploading && !screening) fileRef.current?.click() }}
              style={{ background: '#fff', border: '2px dashed #d1d5db', borderRadius: 14, padding: '24px 16px', textAlign: 'center', marginBottom: 20, cursor: (uploading || screening) ? 'not-allowed' : 'pointer', opacity: (uploading || screening) ? .55 : 1, transition: 'border-color .15s, opacity .15s' }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>
                {uploading ? 'Upload in progress…' : 'Drop PDFs here or tap to browse'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Up to 500 PDFs per batch · Max 10 MB each</div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                style={{ display: 'none' }}
                onChange={e => { handleUpload(e.target.files) }}
              />
            </div>

            {/* Filter tabs */}
            {resumes.length > 0 && (
              <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
                {[
                  { key: 'all',      label: `All (${resumes.length})` },
                  { key: 'hire',     label: `Hire (${stats?.hire || 0})` },
                  { key: 'consider', label: `Consider (${stats?.consider || 0})` },
                  { key: 'reject',   label: `Reject (${stats?.reject || 0})` },
                  stats?.pending > 0 && { key: 'pending', label: `Pending (${stats.pending})` },
                  stats?.error   > 0 && { key: 'error',   label: `Errors (${stats.error})` },
                ].filter(Boolean).map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid ' + (filter === f.key ? '#ff6b00' : '#e5e7eb'), background: filter === f.key ? '#fff5ee' : '#fff', color: filter === f.key ? '#ff6b00' : '#374151', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Results list */}
            {resumes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '52px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 6 }}>No resumes yet</h3>
                <p style={{ color: '#6b7280', fontSize: 13 }}>Upload PDFs above to start screening candidates with AI.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 36, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 14 }}>
                No resumes match this filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(r => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>

                    {/* Main row — tap to expand if screened */}
                    <div
                      onClick={() => r.status === 'done' && setExpanded(expanded === r.id ? null : r.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: r.status === 'done' ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent' }}
                    >
                      {/* Score / status icon */}
                      {r.status === 'done' && r.score != null
                        ? <ScoreBadge score={r.score} />
                        : <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                            {r.status === 'processing' ? '⚙️' : r.status === 'error' ? '⚠️' : '⏳'}
                          </div>
                      }

                      {/* Name + contact */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {rankMap[r.id] && (
                            <span style={{ fontWeight: 900, fontSize: 11, color: '#d1d5db', flexShrink: 0 }}>#{rankMap[r.id]}</span>
                          )}
                          <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {r.candidate_name || r.file_name}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: '2px 8px' }}>
                          {r.candidate_email && <span>{r.candidate_email}</span>}
                          {r.candidate_phone && <span>{r.candidate_phone}</span>}
                          {!r.candidate_email && !r.candidate_phone && r.file_name !== r.candidate_name && (
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{r.file_name}</span>
                          )}
                        </div>
                      </div>

                      {/* Recommendation badge */}
                      <div style={{ flexShrink: 0 }}>
                        {r.recommendation ? (
                          <span style={{ background: REC_BG[r.recommendation], color: REC_COLOR[r.recommendation], fontWeight: 800, fontSize: 10, padding: '4px 8px', borderRadius: 6, letterSpacing: '.02em', whiteSpace: 'nowrap' }}>
                            {REC_LABEL[r.recommendation]}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>
                            {r.status === 'pending' ? 'Pending' : r.status === 'processing' ? 'Processing…' : r.status === 'error' ? 'Error' : ''}
                          </span>
                        )}
                      </div>

                      {/* Expand arrow (screened) or nothing */}
                      {r.status === 'done' && (
                        <div style={{ color: '#d1d5db', fontSize: 12, flexShrink: 0 }}>
                          {expanded === r.id ? '▲' : '▼'}
                        </div>
                      )}

                      {/* Delete button */}
                      <button
                        onClick={e => { e.stopPropagation(); deleteResume(r.id) }}
                        style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 18, padding: '4px', flexShrink: 0, lineHeight: 1, borderRadius: 4 }}
                        title="Remove resume"
                      >×</button>
                    </div>

                    {/* Expanded detail panel */}
                    {expanded === r.id && r.status === 'done' && (
                      <div style={{ borderTop: '1px solid #f3f4f6', padding: '16px 16px', background: '#fafafa' }}>
                        {r.summary && (
                          <p style={{ fontSize: 13, color: '#374151', margin: '0 0 14px', lineHeight: 1.65 }}>{r.summary}</p>
                        )}
                        {/* Flex wrap instead of CSS grid — single column on mobile, two columns on wider screens */}
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                          {r.strengths?.length > 0 && (
                            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 11, color: '#16a34a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>✓ Strengths</div>
                              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#374151', lineHeight: 1.9 }}>
                                {r.strengths.map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                          {r.gaps?.length > 0 && (
                            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 11, color: '#dc2626', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>✗ Gaps</div>
                              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#374151', lineHeight: 1.9 }}>
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

                    {/* Error message */}
                    {r.status === 'error' && r.error_msg && (
                      <div style={{ borderTop: '1px solid #fee2e2', padding: '8px 16px', background: '#fff5f5', fontSize: 12, color: '#dc2626' }}>
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
