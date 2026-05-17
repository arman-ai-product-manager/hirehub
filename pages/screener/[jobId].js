import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const REC_COLOR = { SHORTLIST: '#16a34a', MAYBE: '#d97706', REJECT: '#dc2626' }
const REC_BG    = { SHORTLIST: '#dcfce7', MAYBE: '#fef3c7', REJECT: '#fee2e2' }
const REC_LABEL = { SHORTLIST: '✓ Shortlist', MAYBE: '~ Maybe', REJECT: '✗ Reject' }

const MAX_FILE_MB   = 4           // Vercel request body hard limit
const UPLOAD_CHUNK  = 5           // files per upload request (5 × 4 MB max = safe)

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
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [msg]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!msg) return null
  const bg    = type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#f0f9ff'
  const color = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#0369a1'
  return (
    <div role="alert" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: bg, color, padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,.12)', maxWidth: '92vw', textAlign: 'center', whiteSpace: 'pre-line', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color, fontWeight: 900, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }} aria-label="Dismiss">×</button>
    </div>
  )
}

export default function JobDetail() {
  const [jobId, setJobId]             = useState(null)
  const [session, setSession]         = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [job, setJob]                 = useState(null)
  const [resumes, setResumes]         = useState([])
  const [stats, setStats]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [uploading, setUploading]     = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [screening, setScreening]     = useState(false)
  const [screenProgress, setScreenProgress] = useState({ done: 0, total: 0 })
  const [exporting, setExporting]     = useState(false)
  const [filter, setFilter]           = useState('all')
  const [expanded, setExpanded]       = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // id of resume pending delete confirm
  const [toast, setToast]             = useState({ msg: '', type: 'info' })
  const fileRef      = useRef()
  const pollRef      = useRef()
  const tokenRef     = useRef('')
  const dragCounter  = useRef(0)     // fix: onDragLeave fires on child elements

  const showToast = useCallback((msg, type = 'info') => setToast({ msg, type }), [])

  // Parse jobId from the URL path (/screener/<uuid>)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parts = window.location.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    if (id && id !== 'screener') {
      setJobId(id)
    } else {
      // Truly no jobId — stop loading to show error state
      setLoading(false)
      setAuthLoading(false)
    }
  }, [])

  // Session + initial data load — only fires once jobId is known (dep: jobId)
  useEffect(() => {
    if (!SB || !jobId) return
    SB.auth.getSession().then(({ data }) => {
      const s = data.session
      setSession(s)
      tokenRef.current = s?.access_token || ''
      setAuthLoading(false)
      if (s) {
        loadResults(s.access_token, jobId, false)
      } else {
        // No session — stop loading so sign-in gate renders
        setLoading(false)
      }
    }).catch(() => {
      setAuthLoading(false)
      setLoading(false)
    })
  }, [jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get a fresh token (handles Supabase auto-refresh so long sessions don't break)
  async function getToken() {
    if (!SB) return ''
    const { data } = await SB.auth.getSession()
    const tok = data?.session?.access_token || ''
    tokenRef.current = tok
    if (!tok && session) setSession(null) // session expired — show sign-in
    return tok
  }

  // silent=true → no loading spinner, used for background polls
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

  // Silent background poll while resumes are pending/processing
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
  }, [resumes, screening, session, jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-cancel pending delete confirmation after 4s of inactivity
  useEffect(() => {
    if (!deleteConfirm) return
    const t = setTimeout(() => setDeleteConfirm(null), 4000)
    return () => clearTimeout(t)
  }, [deleteConfirm])

  async function handleUpload(files) {
    if (!files || files.length === 0) return

    const pdfs = Array.from(files).filter(f =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    )
    if (pdfs.length === 0) { showToast('Please select PDF files only.', 'error'); return }
    if (pdfs.length > 500) { showToast('Maximum 500 files per upload.', 'error'); return }

    // Client-side file size check
    const oversized = pdfs.filter(f => f.size > MAX_FILE_MB * 1024 * 1024)
    if (oversized.length > 0) {
      showToast(
        `${oversized.length} file${oversized.length > 1 ? 's' : ''} exceed ${MAX_FILE_MB} MB limit:\n${oversized.slice(0, 3).map(f => f.name).join(', ')}${oversized.length > 3 ? '…' : ''}`,
        'error'
      )
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    // Reset file input so same files can be re-selected after fix
    if (fileRef.current) fileRef.current.value = ''

    setUploading(true)
    setUploadProgress({ done: 0, total: pdfs.length, errors: 0 })

    const token = await getToken()
    if (!token) { setUploading(false); showToast('Session expired — please sign in again', 'error'); return }

    let done = 0, errors = 0

    for (let i = 0; i < pdfs.length; i += UPLOAD_CHUNK) {
      const batch = pdfs.slice(i, i + UPLOAD_CHUNK)
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

    if (done === 0 && errors > 0) {
      showToast(`Upload failed — ${errors} file${errors > 1 ? 's' : ''} could not be processed.`, 'error')
    } else if (errors > 0) {
      showToast(`${done} uploaded · ${errors} failed`, 'error')
    } else {
      showToast(`${done} resume${done !== 1 ? 's' : ''} uploaded`, 'success')
    }

    await loadResults(token, jobId, true)
  }

  async function startScreening() {
    if (screening) return
    const pending = resumes.filter(r => r.status === 'pending' || r.status === 'error')
    if (pending.length === 0) { showToast('No pending resumes to screen.', 'info'); return }

    const token = await getToken()
    if (!token) { showToast('Session expired — please sign in again', 'error'); return }

    setScreening(true)
    setScreenProgress({ done: 0, total: pending.length })

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

      const reader  = resp.body.getReader()
      const decoder = new TextDecoder()
      let buf    = ''
      let count  = 0

      outer: while (true) {
        const { value, done: streamDone } = await reader.read()
        if (streamDone) break

        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() // keep incomplete trailing line

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const msg = JSON.parse(line)
            // Terminal message — server finished
            if (msg.done === true && msg.processed !== undefined) break outer
            if (msg.id) {
              const success = msg.ok === true
              count++
              setScreenProgress(p => ({ ...p, done: count }))
              setResumes(prev => prev.map(r =>
                r.id === msg.id
                  ? { ...r, status: success ? 'done' : 'error', score: msg.score ?? r.score, recommendation: msg.rec ?? r.recommendation }
                  : r
              ))
            }
          } catch {} // malformed NDJSON line — skip
        }
      }

      showToast(`Screening complete — ${count} resume${count !== 1 ? 's' : ''} processed`, 'success')
    } catch (e) {
      showToast('Screening error: ' + (e.message || 'Unknown error'), 'error')
    } finally {
      setScreening(false)
      await loadResults(token, jobId, true)
    }
  }

  async function exportExcel() {
    const token = await getToken()
    if (!token) { showToast('Session expired — please sign in again', 'error'); return }
    setExporting(true)
    try {
      const r = await fetch(`/api/screener/export?job_id=${jobId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        showToast(d.error || 'Export failed', 'error')
        return
      }
      const blob = await r.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = (job?.title || 'screened').replace(/[^a-z0-9]/gi, '_').slice(0, 50) + '_results.xlsx'
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

  async function confirmDelete(id) {
    if (deleteConfirm !== id) {
      // First tap — show inline confirmation
      setDeleteConfirm(id)
      return
    }
    // Second tap — actually delete
    setDeleteConfirm(null)
    // Close expanded panel if this resume is open
    if (expanded === id) setExpanded(null)

    const token = await getToken()
    try {
      const r = await fetch(`/api/screener/resume?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + (token || tokenRef.current) }
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        showToast(d.error || 'Delete failed', 'error')
        return
      }
      const deleted = resumes.find(r => r.id === id)
      setResumes(prev => prev.filter(r => r.id !== id))
      // Keep stats in sync with new recommendation keys
      setStats(prev => {
        if (!prev || !deleted) return prev
        return {
          ...prev,
          total:     prev.total     - 1,
          done:      prev.done      - (deleted.status === 'done'      ? 1 : 0),
          pending:   prev.pending   - (deleted.status === 'pending'   ? 1 : 0),
          error:     prev.error     - (deleted.status === 'error'     ? 1 : 0),
          shortlist: prev.shortlist - (deleted.recommendation === 'SHORTLIST' ? 1 : 0),
          maybe:     prev.maybe     - (deleted.recommendation === 'MAYBE'     ? 1 : 0),
          reject:    prev.reject    - (deleted.recommendation === 'REJECT'    ? 1 : 0),
        }
      })
    } catch {
      showToast('Delete failed — network error', 'error')
    }
  }

  // Pre-compute rank map (avoids O(n²) findIndex inside render)
  const rankMap = Object.fromEntries(
    resumes.filter(r => r.status === 'done').map((r, i) => [r.id, i + 1])
  )

  const filtered = filter === 'all'
    ? resumes
    : resumes.filter(r => r.recommendation === filter || r.status === filter)

  const pendingCount = resumes.filter(r => r.status === 'pending' || r.status === 'error').length

  // Auth/loading gates
  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</div>
    </div>
  )

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
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 5vw', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 17, color: '#1d1d1f', textDecoration: 'none', letterSpacing: '-.03em', flexShrink: 0 }}>
              Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
            </a>
            <span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span>
            <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Screener</a>
            {job && (
              <>
                <span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</span>
              </>
            )}
          </div>
          <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', flexShrink: 0 }}>← Back</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>Loading…</div>
        ) : !job ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'system-ui,sans-serif' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 16 }}>Job not found or access denied</div>
            <a href="/screener" style={{ color: '#ff6b00', fontWeight: 700, textDecoration: 'none' }}>← Back to Dashboard</a>
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 5vw 72px' }}>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.04em', margin: '0 0 8px', color: '#111827' }}>{job.title}</h1>
              {job.skills?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {job.skills.slice(0, 8).map(s => (
                    <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>{s}</span>
                  ))}
                  {job.skills.length > 8 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{job.skills.length - 8} more</span>}
                </div>
              )}
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

            {/* Stats bar */}
            {stats && stats.total > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total',     value: stats.total,     color: '#374151', bg: '#f3f4f6' },
                  { label: 'Screened',  value: stats.done,      color: '#374151', bg: '#f3f4f6' },
                  stats.avg_score != null && stats.done > 0 && { label: 'Avg Score', value: stats.avg_score, color: '#374151', bg: '#f3f4f6' },
                  { label: 'Shortlist', value: stats.shortlist || 0, color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Maybe',     value: stats.maybe     || 0, color: '#d97706', bg: '#fef3c7' },
                  { label: 'Reject',    value: stats.reject    || 0, color: '#dc2626', bg: '#fee2e2' },
                  stats.pending > 0 && { label: 'Pending', value: stats.pending, color: '#6b7280', bg: '#f3f4f6' },
                  stats.error   > 0 && { label: 'Errors',  value: stats.error,   color: '#dc2626', bg: '#fee2e2' },
                ].filter(Boolean).map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 58px', minWidth: 58 }}>
                    <span style={{ fontWeight: 900, fontSize: 20, color: s.color, lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, marginTop: 3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Screening progress */}
            {screening && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  <span>🤖 AI screening in progress…</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{screenProgress.done} / {screenProgress.total}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ background: '#ff6b00', height: '100%', borderRadius: 999, transition: 'width .4s', width: `${screenProgress.total ? (screenProgress.done / screenProgress.total) * 100 : 0}%` }} />
                </div>
              </div>
            )}

            {/* Upload progress */}
            {uploading && uploadProgress && (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  <span>📤 Uploading PDFs…</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{uploadProgress.done} / {uploadProgress.total}</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ background: '#3b82f6', height: '100%', borderRadius: 999, transition: 'width .2s', width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%` }} />
                </div>
                {uploadProgress.errors > 0 && (
                  <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{uploadProgress.errors} file(s) failed</div>
                )}
              </div>
            )}

            {/* Drop zone — drag counter prevents onDragLeave firing on child elements */}
            <div
              onDragOver={e => e.preventDefault()}
              onDragEnter={e => {
                e.preventDefault()
                dragCounter.current++
                if (dragCounter.current === 1) e.currentTarget.style.borderColor = '#ff6b00'
              }}
              onDragLeave={e => {
                dragCounter.current--
                if (dragCounter.current === 0) e.currentTarget.style.borderColor = '#d1d5db'
              }}
              onDrop={e => {
                e.preventDefault()
                dragCounter.current = 0
                e.currentTarget.style.borderColor = '#d1d5db'
                if (!uploading && !screening) handleUpload(e.dataTransfer.files)
              }}
              onClick={() => { if (!uploading && !screening) fileRef.current?.click() }}
              style={{ background: '#fff', border: '2px dashed #d1d5db', borderRadius: 14, padding: '24px 16px', textAlign: 'center', marginBottom: 20, cursor: (uploading || screening) ? 'not-allowed' : 'pointer', opacity: (uploading || screening) ? .5 : 1, transition: 'border-color .15s, opacity .15s' }}
            >
              <div style={{ fontSize: 30, marginBottom: 6 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>
                {uploading ? 'Upload in progress…' : 'Drop PDFs here or tap to browse'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Up to 500 PDFs · Max {MAX_FILE_MB} MB per file</div>
              <input ref={fileRef} type="file" accept=".pdf,application/pdf" multiple style={{ display: 'none' }}
                onChange={e => handleUpload(e.target.files)} />
            </div>

            {/* Filter tabs — horizontally scrollable on very small screens */}
            {resumes.length > 0 && (
              <div style={{ display: 'flex', gap: 5, marginBottom: 14, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
                {[
                  { key: 'all',       label: `All (${resumes.length})` },
                  { key: 'SHORTLIST', label: `Shortlist (${stats?.shortlist || 0})` },
                  { key: 'MAYBE',     label: `Maybe (${stats?.maybe || 0})` },
                  { key: 'REJECT',    label: `Reject (${stats?.reject || 0})` },
                  stats?.pending > 0 && { key: 'pending', label: `Pending (${stats.pending})` },
                  stats?.error   > 0 && { key: 'error',   label: `Errors (${stats.error})` },
                ].filter(Boolean).map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid ' + (filter === f.key ? '#ff6b00' : '#e5e7eb'), background: filter === f.key ? '#fff5ee' : '#fff', color: filter === f.key ? '#ff6b00' : '#374151', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Results */}
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
                {filtered.map(r => {
                  const isPendingDelete = deleteConfirm === r.id
                  return (
                    <div key={r.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + (isPendingDelete ? '#fca5a5' : '#e5e7eb'), overflow: 'hidden', transition: 'border-color .15s' }}>

                      {/* Main row */}
                      <div
                        onClick={() => {
                          if (isPendingDelete) { setDeleteConfirm(null); return }
                          if (r.status === 'done') setExpanded(expanded === r.id ? null : r.id)
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px', cursor: r.status === 'done' ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent', minWidth: 0 }}
                      >
                        {/* Score or status icon */}
                        {r.status === 'done' && r.score != null
                          ? <ScoreBadge score={r.score} />
                          : <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                              {r.status === 'processing' ? '⚙️' : r.status === 'error' ? '⚠️' : '⏳'}
                            </div>
                        }

                        {/* Name + contact */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', minWidth: 0 }}>
                            {rankMap[r.id] && (
                              <span style={{ fontWeight: 900, fontSize: 11, color: '#d1d5db', flexShrink: 0 }}>#{rankMap[r.id]}</span>
                            )}
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                              {r.candidate_name || r.file_name}
                            </span>
                            {r.experience_years > 0 && (
                              <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, flexShrink: 0, whiteSpace: 'nowrap' }}>
                                {r.experience_years}yr
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: '2px 8px', minWidth: 0 }}>
                            {r.candidate_email && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.candidate_email}</span>}
                            {r.candidate_phone && <span style={{ flexShrink: 0 }}>{r.candidate_phone}</span>}
                            {!r.candidate_email && !r.candidate_phone && (
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.file_name}</span>
                            )}
                          </div>
                        </div>

                        {/* Recommendation badge */}
                        <div style={{ flexShrink: 0 }}>
                          {r.recommendation
                            ? <span style={{ background: REC_BG[r.recommendation] || '#f3f4f6', color: REC_COLOR[r.recommendation] || '#374151', fontWeight: 800, fontSize: 10, padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                                {REC_LABEL[r.recommendation] || r.recommendation}
                              </span>
                            : <span style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                                {r.status === 'pending' ? 'Pending' : r.status === 'processing' ? 'Screening…' : r.status === 'error' ? 'Error' : ''}
                              </span>
                          }
                        </div>

                        {/* Expand indicator */}
                        {r.status === 'done' && !isPendingDelete && (
                          <span style={{ color: '#d1d5db', fontSize: 11, flexShrink: 0 }}>
                            {expanded === r.id ? '▲' : '▼'}
                          </span>
                        )}

                        {/* Inline delete confirm — shows instead of arrow when pending */}
                        {isPendingDelete ? (
                          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                            <button
                              onClick={e => { e.stopPropagation(); confirmDelete(r.id) }}
                              style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              Delete
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setDeleteConfirm(null) }}
                              style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '5px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); confirmDelete(r.id) }}
                            disabled={screening}
                            style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: screening ? 'not-allowed' : 'pointer', fontSize: 18, padding: '4px', flexShrink: 0, lineHeight: 1, borderRadius: 4 }}
                            title="Remove resume"
                            aria-label="Remove resume"
                          >×</button>
                        )}
                      </div>

                      {/* Expanded detail */}
                      {expanded === r.id && r.status === 'done' && (
                        <div style={{ borderTop: '1px solid #f3f4f6', padding: '14px 14px', background: '#fafafa' }}>
                          {r.summary && (
                            <p style={{ fontSize: 13, color: '#374151', margin: '0 0 14px', lineHeight: 1.65 }}>{r.summary}</p>
                          )}
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {r.strengths?.length > 0 && (
                              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 10, color: '#16a34a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>✓ Matched Skills</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {r.strengths.map((s, i) => (
                                    <span key={i} style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999 }}>{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {r.gaps?.length > 0 && (
                              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 10, color: '#dc2626', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>✗ Missing Skills</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {r.gaps.map((g, i) => (
                                    <span key={i} style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999 }}>{g}</span>
                                  ))}
                                </div>
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
                        <div style={{ borderTop: '1px solid #fee2e2', padding: '8px 14px', background: '#fff5f5', fontSize: 12, color: '#dc2626' }}>
                          {r.error_msg}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
