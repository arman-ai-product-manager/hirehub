import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const REC_COLOR = { SHORTLIST: '#16a34a', MAYBE: '#d97706', REJECT: '#dc2626' }
const REC_BG    = { SHORTLIST: '#dcfce7', MAYBE: '#fef3c7', REJECT: '#fee2e2' }
const REC_LABEL = { SHORTLIST: 'Shortlist', MAYBE: 'Maybe', REJECT: 'Reject' }

const MAX_FILE_MB  = 4
const UPLOAD_CHUNK = 5

// Score color system (80+ green, 50-79 amber, 0-49 red)
function scoreColor(s) { return s >= 80 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626' }
function scoreBg(s)    { return s >= 80 ? '#dcfce7' : s >= 50 ? '#fef3c7' : '#fee2e2' }
function scoreLabel(s) { return s >= 80 ? 'Strong Hire' : s >= 50 ? 'Maybe' : 'Reject' }
function fmtElapsed(s) { return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s` }
function fmtETA(r)     { return !isFinite(r)||r<=0?null:r<60?`~${Math.ceil(r)}s`:`~${Math.ceil(r/60)}m` }

// ─── Components ─────────────────────────────────────────────────────────────

function ScoreBadge({ score, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: scoreBg(score), color: scoreColor(score),
      fontWeight: 900, fontSize: Math.max(10, Math.round(size * 0.295)),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{score}</div>
  )
}

function Toast({ msg, type = 'info', onClose }) {
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (!msg) return; const t = setTimeout(onClose, 5000); return () => clearTimeout(t)
  }, [msg])
  if (!msg) return null
  const bg    = type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#f0f9ff'
  const color = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#0369a1'
  return (
    <div role="alert" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: bg, color, padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, zIndex: 3000, boxShadow: '0 4px 20px rgba(0,0,0,.14)', maxWidth: '92vw', textAlign: 'center', whiteSpace: 'pre-line', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color, fontWeight: 900, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }} aria-label="Dismiss">×</button>
    </div>
  )
}

function ResumePopup({ resume, rank, onClose, inQueue, onAddToQueue }) {
  const c = scoreColor(resume.score || 0), bg = scoreBg(resume.score || 0)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.52)', zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px 40px', overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 580, padding: '28px 24px 22px', position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
        <button onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#9ca3af', cursor: 'pointer', padding: '4px 9px', lineHeight: 1 }}
          aria-label="Close">×</button>

        {/* Header */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 18 }}>
          <ScoreBadge score={resume.score ?? 0} size={58} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
              {rank && <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, flexShrink: 0 }}>#{rank}</span>}
              <h2 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0, wordBreak: 'break-word' }}>{resume.candidate_name || resume.file_name}</h2>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 7, display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
              {resume.candidate_email && <span>{resume.candidate_email}</span>}
              {resume.candidate_phone && <span>{resume.candidate_phone}</span>}
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {resume.recommendation && (
                <span style={{ background: REC_BG[resume.recommendation], color: REC_COLOR[resume.recommendation], fontWeight: 700, fontSize: 11, padding: '3px 9px', borderRadius: 6 }}>
                  {REC_LABEL[resume.recommendation]}
                </span>
              )}
              <span style={{ background: bg, color: c, fontWeight: 700, fontSize: 11, padding: '3px 9px', borderRadius: 6 }}>{scoreLabel(resume.score || 0)}</span>
              {resume.experience_years > 0 && (
                <span style={{ background: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: 11, padding: '3px 9px', borderRadius: 6 }}>{resume.experience_years}yr exp</span>
              )}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
            <span style={{ fontWeight: 600, color: '#6b7280' }}>Match Score</span>
            <span style={{ fontWeight: 800, color: c }}>{resume.score ?? 0} / 100</span>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: 999, height: 9, overflow: 'hidden' }}>
            <div style={{ background: c, height: '100%', borderRadius: 999, width: `${resume.score || 0}%`, transition: 'width .5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#d1d5db' }}>
            <span>0 — Reject</span><span>50 — Maybe</span><span>80 — Strong Hire</span>
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
            {resume.summary}
          </div>
        )}

        {/* Skills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          {resume.strengths?.length > 0 && (
            <div style={{ flex: '1 1 175px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>✓ Matched Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {resume.strengths.map((s, i) => (
                  <span key={i} style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {resume.gaps?.length > 0 && (
            <div style={{ flex: '1 1 175px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>✗ Missing Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {resume.gaps.map((g, i) => (
                  <span key={i} style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999 }}>{g}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
          {resume.file_url && (
            <a href={resume.file_url} target="_blank" rel="noopener noreferrer"
              style={{ flexShrink: 0, display: 'block', textAlign: 'center', background: '#f3f4f6', color: '#374151', padding: '10px 16px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              📄 View PDF
            </a>
          )}
          <button onClick={onAddToQueue} disabled={inQueue}
            style={{ flex: 1, background: inQueue ? '#dcfce7' : '#ff6b00', color: inQueue ? '#16a34a' : '#fff', border: 'none', padding: '10px 14px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: inQueue ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
            {inQueue ? '✓ In Interview Queue' : '+ Add to Interview Queue'}
          </button>
        </div>

        {resume.processed_at && (
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#9ca3af' }}>
            Screened {new Date(resume.processed_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function JobDetail() {
  const [jobId, setJobId]             = useState(null)
  const [session, setSession]         = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [job, setJob]                 = useState(null)
  const [resumes, setResumes]         = useState([])
  const [stats, setStats]             = useState(null)
  const [loading, setLoading]         = useState(true)

  // Pipeline: 'idle' | 'uploading' | 'screening' | 'done'
  const [pipeline, setPipeline]       = useState('idle')
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0, errors: 0 })
  const [screenProgress, setScreenProgress] = useState({ done: 0, total: 0 })
  const [fileLog, setFileLog]         = useState([])
  const [scannedCount, setScannedCount] = useState(0)
  const [elapsed, setElapsed]         = useState(0)

  // Results dashboard
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all')
  const [sortBy, setSortBy]           = useState('score')
  const [sortDir, setSortDir]         = useState('desc')
  const [selected, setSelected]       = useState(new Set())
  const [interviewQueue, setInterviewQueue] = useState([])
  const [popup, setPopup]             = useState(null)
  const [isMobile, setIsMobile]       = useState(false)

  // UI
  const [exporting, setExporting]     = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast]             = useState({ msg: '', type: 'info' })

  const fileRef      = useRef()
  const pollRef      = useRef()
  const tokenRef     = useRef('')
  const dragCounter  = useRef(0)
  const startTimeRef = useRef(null)
  const timerRef     = useRef(null)

  const uploading = pipeline === 'uploading'
  const screening = pipeline === 'screening'
  const showToast = useCallback((msg, type = 'info') => setToast({ msg, type }), [])

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Parse jobId from URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parts = window.location.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    if (id && id !== 'screener') setJobId(id)
    else { setLoading(false); setAuthLoading(false) }
  }, [])

  // Session + initial load
  useEffect(() => {
    if (!SB || !jobId) return
    SB.auth.getSession().then(({ data }) => {
      const s = data.session
      setSession(s)
      tokenRef.current = s?.access_token || ''
      setAuthLoading(false)
      if (s) loadResults(s.access_token, jobId, false)
      else setLoading(false)
    }).catch(() => { setAuthLoading(false); setLoading(false) })
  }, [jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Elapsed timer
  useEffect(() => {
    if (pipeline === 'uploading' || pipeline === 'screening') {
      if (!startTimeRef.current) startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [pipeline])

  // Auto-cancel delete confirm
  useEffect(() => {
    if (!deleteConfirm) return
    const t = setTimeout(() => setDeleteConfirm(null), 4000)
    return () => clearTimeout(t)
  }, [deleteConfirm])

  async function getToken() {
    if (!SB) return ''
    const { data } = await SB.auth.getSession()
    const tok = data?.session?.access_token || ''
    tokenRef.current = tok
    if (!tok && session) setSession(null)
    return tok
  }

  async function loadResults(token, jid, silent = false) {
    if (!silent) setLoading(true)
    try {
      const r = await fetch(`/api/screener/results?job_id=${jid}`, { headers: { Authorization: 'Bearer ' + token } })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        if (!silent) showToast(d.error || 'Failed to load results', 'error')
        return null
      }
      const d = await r.json()
      setJob(d.job); setResumes(d.resumes || []); setStats(d.stats)
      return d
    } catch {
      if (!silent) showToast('Network error — could not load results', 'error')
      return null
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Background poll while pending/processing (only when pipeline is idle)
  useEffect(() => {
    if (!session || !jobId) return
    const hasPending = resumes.some(r => r.status === 'pending' || r.status === 'processing')
    if (hasPending && pipeline === 'idle') {
      clearInterval(pollRef.current)
      pollRef.current = setInterval(() => loadResults(tokenRef.current, jobId, true), 4000)
    } else {
      clearInterval(pollRef.current)
    }
    return () => clearInterval(pollRef.current)
  }, [resumes, pipeline, session, jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function doScreeningStream(token, total) {
    setScreenProgress({ done: 0, total })
    const resp = await fetch('/api/screener/screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ job_id: jobId }),
    })
    if (!resp.ok) {
      const d = await resp.json().catch(() => ({}))
      showToast(d.error || `Screening failed (${resp.status})`, 'error')
      return 0
    }
    const reader = resp.body.getReader(), decoder = new TextDecoder()
    let buf = '', count = 0
    outer: while (true) {
      const { value, done: streamDone } = await reader.read()
      if (streamDone) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n'); buf = lines.pop()
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const msg = JSON.parse(line)
          if (msg.done === true && msg.processed !== undefined) break outer
          if (msg.id) {
            count++
            setScreenProgress(p => ({ ...p, done: count }))
            setResumes(prev => prev.map(r =>
              r.id === msg.id ? { ...r, status: msg.ok ? 'done' : 'error', score: msg.score ?? r.score, recommendation: msg.rec ?? r.recommendation } : r
            ))
          }
        } catch {}
      }
    }
    return count
  }

  async function handleUpload(files) {
    if (!files || files.length === 0) return
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    if (pdfs.length === 0) { showToast('Please select PDF files only.', 'error'); return }
    if (pdfs.length > 500) { showToast('Maximum 500 files per upload.', 'error'); return }
    const oversized = pdfs.filter(f => f.size > MAX_FILE_MB * 1024 * 1024)
    if (oversized.length > 0) {
      showToast(`${oversized.length} file${oversized.length > 1 ? 's' : ''} exceed ${MAX_FILE_MB} MB:\n${oversized.slice(0, 3).map(f => f.name).join(', ')}${oversized.length > 3 ? '…' : ''}`, 'error')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (fileRef.current) fileRef.current.value = ''

    setPipeline('uploading'); startTimeRef.current = Date.now(); setElapsed(0)
    setFileLog([]); setScannedCount(0); setUploadProgress({ done: 0, total: pdfs.length, errors: 0 })

    const token = await getToken()
    if (!token) { startTimeRef.current = null; setElapsed(0); setPipeline('idle'); showToast('Session expired — please sign in again', 'error'); return }

    let uploadedOk = 0, uploadErrors = 0, localScanned = 0
    const log = []
    for (let i = 0; i < pdfs.length; i += UPLOAD_CHUNK) {
      const batch = pdfs.slice(i, i + UPLOAD_CHUNK)
      const fd = new FormData(); fd.append('job_id', jobId); batch.forEach(f => fd.append('resumes', f))
      try {
        const r = await fetch('/api/screener/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd })
        const d = await r.json().catch(() => ({ results: [] }))
        if (!r.ok) { uploadErrors += batch.length; batch.forEach(f => log.push({ name: f.name, ok: false })) }
        else {
          ;(d.results || []).forEach(x => {
            if (x.ok) { uploadedOk++; if (x.scanned) localScanned++; log.push({ name: x.file, ok: true, scanned: x.scanned }) }
            else { uploadErrors++; log.push({ name: x.file, ok: false }) }
          })
        }
      } catch { uploadErrors += batch.length; batch.forEach(f => log.push({ name: f.name, ok: false })) }
      setUploadProgress({ done: uploadedOk + uploadErrors, total: pdfs.length, errors: uploadErrors })
      setFileLog(log.slice(-8))
      if (localScanned > 0) setScannedCount(localScanned)
    }

    if (uploadedOk === 0 && uploadErrors > 0) {
      startTimeRef.current = null; setElapsed(0); setPipeline('idle')
      showToast(`Upload failed — ${uploadErrors} file${uploadErrors > 1 ? 's' : ''} could not be processed.`, 'error'); return
    }
    if (uploadErrors > 0) showToast(`${uploadedOk} uploaded · ${uploadErrors} failed`, 'error')

    const freshToken = await getToken()
    const freshData  = await loadResults(freshToken, jobId, true)
    if (!freshData) {
      showToast('Upload done but results failed to refresh. Tap "Screen Resumes" to run AI manually.', 'error')
      startTimeRef.current = null; setElapsed(0); setPipeline('idle'); return
    }
    const pendingCount = (freshData.resumes || []).filter(r => r.status === 'pending' || r.status === 'error').length
    if (pendingCount > 0) {
      setPipeline('screening')
      try {
        const screened = await doScreeningStream(freshToken, pendingCount)
        if (screened > 0) showToast(`${screened} resume${screened !== 1 ? 's' : ''} screened by AI`, 'success')
      } catch (e) { showToast('Screening error: ' + (e.message || 'Unknown error'), 'error') }
      await loadResults(freshToken, jobId, true)
    }
    setPipeline('done')
  }

  async function startScreening() {
    if (pipeline !== 'idle') return
    const pending = resumes.filter(r => r.status === 'pending' || r.status === 'error')
    if (pending.length === 0) { showToast('No pending resumes to screen.', 'info'); return }
    const token = await getToken()
    if (!token) { showToast('Session expired — please sign in again', 'error'); return }
    setPipeline('screening'); startTimeRef.current = Date.now(); setElapsed(0); setScannedCount(0)
    try {
      const count = await doScreeningStream(token, pending.length)
      showToast(`Screening complete — ${count} resume${count !== 1 ? 's' : ''} processed`, 'success')
    } catch (e) { showToast('Screening error: ' + (e.message || 'Unknown error'), 'error') }
    finally { await loadResults(token, jobId, true); setPipeline('done') }
  }

  function resetPipeline() { setPipeline('idle'); setFileLog([]); setScannedCount(0); setElapsed(0); startTimeRef.current = null }

  async function exportExcel() {
    const token = await getToken()
    if (!token) { showToast('Session expired — please sign in again', 'error'); return }
    setExporting(true)
    try {
      const r = await fetch(`/api/screener/export?job_id=${jobId}`, { headers: { Authorization: 'Bearer ' + token } })
      if (!r.ok) { const d = await r.json().catch(() => ({})); showToast(d.error || 'Export failed', 'error'); return }
      const blob = await r.blob(), url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = (job?.title || 'screened').replace(/[^a-z0-9]/gi, '_').slice(0, 50) + '_results.xlsx'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch { showToast('Export failed — network error', 'error') }
    finally { setExporting(false) }
  }

  async function confirmDelete(id) {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return }
    setDeleteConfirm(null)
    // Remove from selection and interview queue immediately
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
    setInterviewQueue(prev => prev.filter(r => r.id !== id))
    if (popup?.id === id) setPopup(null)
    const token = await getToken()
    try {
      const r = await fetch(`/api/screener/resume?id=${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (token || tokenRef.current) } })
      if (!r.ok) { const d = await r.json().catch(() => ({})); showToast(d.error || 'Delete failed', 'error'); return }
      const deleted = resumes.find(r => r.id === id)
      setResumes(prev => prev.filter(r => r.id !== id))
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
    } catch { showToast('Delete failed — network error', 'error') }
  }

  // ── Sort toggle ──────────────────────────────────────────────────────────
  function toggleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(col); setSortDir('desc') }
  }

  // ── Row selection ────────────────────────────────────────────────────────
  function toggleSelect(id, e) {
    e.stopPropagation()
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleSelectAll(checked) {
    setSelected(checked ? new Set(filteredDone.map(r => r.id)) : new Set())
  }

  // ── Interview queue ──────────────────────────────────────────────────────
  function addToQueue(resume) {
    if (interviewQueue.find(q => q.id === resume.id)) return
    setInterviewQueue(prev => [...prev, resume])
    showToast(`${resume.candidate_name || resume.file_name} added to interview queue`, 'success')
  }
  function shortlistSelected() {
    const toAdd = resumes.filter(r => selected.has(r.id) && !interviewQueue.find(q => q.id === r.id))
    if (!toAdd.length) { showToast('All selected candidates are already in the queue.', 'info'); return }
    setInterviewQueue(prev => [...prev, ...toAdd])
    setSelected(new Set())
    showToast(`${toAdd.length} candidate${toAdd.length !== 1 ? 's' : ''} added to interview queue`, 'success')
  }
  function exportQueueCSV() {
    const hdr = ['Rank', 'Name', 'Email', 'Phone', 'Score', 'Recommendation', 'Exp Years', 'Summary']
    const rows = interviewQueue.map(r => [
      rankMap[r.id] || '', r.candidate_name || r.file_name,
      r.candidate_email || '', r.candidate_phone || '',
      r.score || '', r.recommendation || '', r.experience_years || '',
      (r.summary || '').replace(/"/g, '""'),
    ])
    const csv = [hdr, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `interview_queue_${(job?.title || 'results').replace(/[^a-z0-9]/gi, '_').slice(0, 40)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const doneResumes = resumes.filter(r => r.status === 'done')

  // Rank by score across ALL done resumes (stable, not affected by current filter)
  const rankMap = Object.fromEntries(
    [...doneResumes].sort((a, b) => (b.score || 0) - (a.score || 0)).map((r, i) => [r.id, i + 1])
  )

  const searchLow = search.toLowerCase().trim()
  const filteredDone = doneResumes
    .filter(r => {
      if (filter === 'SHORTLIST') return r.recommendation === 'SHORTLIST'
      if (filter === 'MAYBE')     return r.recommendation === 'MAYBE'
      if (filter === 'REJECT')    return r.recommendation === 'REJECT'
      return true
    })
    .filter(r => {
      if (!searchLow) return true
      return (
        (r.candidate_name  || '').toLowerCase().includes(searchLow) ||
        (r.candidate_email || '').toLowerCase().includes(searchLow) ||
        (r.strengths || []).some(s => s.toLowerCase().includes(searchLow)) ||
        (r.summary   || '').toLowerCase().includes(searchLow)
      )
    })
    .sort((a, b) => {
      let v = 0
      if      (sortBy === 'score')      v = (b.score || 0) - (a.score || 0)
      else if (sortBy === 'experience') v = (b.experience_years || 0) - (a.experience_years || 0)
      else if (sortBy === 'name')       v = (a.candidate_name || '').localeCompare(b.candidate_name || '')
      return sortDir === 'desc' ? v : -v
    })

  const pendingResumes = resumes.filter(r => r.status === 'pending' || r.status === 'error')
  const pendingCount   = pendingResumes.length
  const allSelected    = filteredDone.length > 0 && filteredDone.every(r => selected.has(r.id))
  const someSelected   = filteredDone.some(r => selected.has(r.id))
  const selectedCount  = filteredDone.filter(r => selected.has(r.id)).length
  const screenETA      = screening && screenProgress.done > 0 && elapsed > 0
    ? fmtETA((elapsed / screenProgress.done) * (screenProgress.total - screenProgress.done))
    : null

  // ── Column header helper ─────────────────────────────────────────────────
  const TH = ({ label, col, style }) => {
    const active = sortBy === col
    return (
      <th onClick={() => toggleSort(col)} style={{ cursor: 'pointer', userSelect: 'none', padding: '10px 12px', fontWeight: 700, fontSize: 11, color: active ? '#ff6b00' : '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em', background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', ...style }}>
        {label} <span style={{ opacity: .7 }}>{active ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}</span>
      </th>
    )
  }
  const ThFixed = ({ children, style }) => (
    <th style={{ padding: '10px 12px', fontWeight: 700, fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em', background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', ...style }}>{children}</th>
  )

  // ── Auth / loading gates ─────────────────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>{job ? `${job.title} — AI Screener` : 'AI Resume Screener'} | HireHub360</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />
      {popup && (
        <ResumePopup
          resume={popup} rank={rankMap[popup.id]}
          onClose={() => setPopup(null)}
          inQueue={!!interviewQueue.find(q => q.id === popup.id)}
          onAddToQueue={() => addToQueue(popup)}
        />
      )}

      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
        {/* ── Nav ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 5vw', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 17, color: '#1d1d1f', textDecoration: 'none', letterSpacing: '-.03em', flexShrink: 0 }}>
              Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
            </a>
            <span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span>
            <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Screener</a>
            {job && (<><span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span><span style={{ fontSize: 13, color: '#374151', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</span></>)}
          </div>
          <a href="/screener" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', flexShrink: 0 }}>← Back</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>Loading…</div>
        ) : !job ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 16 }}>Job not found or access denied</div>
            <a href="/screener" style={{ color: '#ff6b00', fontWeight: 700, textDecoration: 'none' }}>← Back to Dashboard</a>
          </div>
        ) : (
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 5vw 72px' }}>

            {/* ── Job header ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <h1 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.04em', margin: '0 0 6px', color: '#111827' }}>{job.title}</h1>
                  {job.skills?.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {job.skills.slice(0, 8).map(s => (
                        <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>{s}</span>
                      ))}
                      {job.skills.length > 8 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{job.skills.length - 8} more</span>}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                  {stats?.done > 0 && (
                    <button onClick={exportExcel} disabled={exporting}
                      style={{ background: '#fff', border: '1.5px solid #d1d5db', color: '#374151', padding: '9px 15px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? .6 : 1, whiteSpace: 'nowrap' }}>
                      {exporting ? 'Exporting…' : '⬇ Export Excel'}
                    </button>
                  )}
                  {pendingCount > 0 && pipeline === 'idle' && (
                    <button onClick={startScreening}
                      style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      ▶ Screen {pendingCount} Resume{pendingCount !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats chips */}
              {stats && stats.total > 0 && (
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Total',     value: stats.total,          color: '#374151', bg: '#f3f4f6' },
                    { label: 'Screened',  value: stats.done,           color: '#374151', bg: '#f3f4f6' },
                    stats.done > 0 && { label: 'Avg Score', value: stats.avg_score, color: '#374151', bg: '#f3f4f6' },
                    { label: 'Shortlist', value: stats.shortlist || 0, color: '#16a34a', bg: '#dcfce7' },
                    { label: 'Maybe',     value: stats.maybe     || 0, color: '#d97706', bg: '#fef3c7' },
                    { label: 'Reject',    value: stats.reject    || 0, color: '#dc2626', bg: '#fee2e2' },
                    stats.pending > 0 && { label: 'Pending', value: stats.pending, color: '#6b7280', bg: '#f3f4f6' },
                    stats.error   > 0 && { label: 'Errors',  value: stats.error,   color: '#dc2626', bg: '#fee2e2' },
                  ].filter(Boolean).map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 9, padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 54 }}>
                      <span style={{ fontWeight: 900, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.value}</span>
                      <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Pipeline progress panel ── */}
            {pipeline !== 'idle' && (
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '16px 18px', marginBottom: 16 }}>
                {pipeline === 'uploading' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                      <span>📤 Uploading PDFs…</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6b7280' }}>{uploadProgress.done} / {uploadProgress.total}</span>
                    </div>
                    <div style={{ background: '#f3f4f6', borderRadius: 999, height: 7, overflow: 'hidden' }}>
                      <div style={{ background: '#3b82f6', height: '100%', borderRadius: 999, transition: 'width .2s', width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%` }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 5, fontSize: 11, color: '#9ca3af' }}>
                      {elapsed > 0 && <span>Elapsed: {fmtElapsed(elapsed)}</span>}
                      {uploadProgress.errors > 0 && <span style={{ color: '#dc2626' }}>{uploadProgress.errors} failed</span>}
                    </div>
                    {fileLog.length > 0 && (
                      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 110, overflowY: 'auto' }}>
                        {fileLog.slice(-6).map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                            <span style={{ flexShrink: 0, color: f.scanned ? '#d97706' : f.ok ? '#16a34a' : '#dc2626' }}>{f.scanned ? '📷' : f.ok ? '✓' : '✗'}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6b7280', flex: 1 }}>{f.name}</span>
                            {f.scanned && <span style={{ color: '#d97706', flexShrink: 0, fontSize: 10, fontWeight: 600 }}>no text</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {scannedCount > 0 && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 7, padding: '5px 10px', fontWeight: 600 }}>
                        ⚠ {scannedCount} scanned/image PDF{scannedCount > 1 ? 's' : ''} — no text could be extracted
                      </div>
                    )}
                  </>
                )}
                {pipeline === 'screening' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                      <span>🤖 Processing with AI…</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#6b7280' }}>{screenProgress.done} / {screenProgress.total}</span>
                    </div>
                    <div style={{ background: '#f3f4f6', borderRadius: 999, height: 7, overflow: 'hidden' }}>
                      <div style={{ background: '#ff6b00', height: '100%', borderRadius: 999, transition: 'width .4s', width: `${screenProgress.total ? (screenProgress.done / screenProgress.total) * 100 : 0}%` }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 5, fontSize: 11, color: '#9ca3af' }}>
                      {elapsed > 0 && <span>Elapsed: {fmtElapsed(elapsed)}</span>}
                      {screenETA && <span>ETA: {screenETA}</span>}
                    </div>
                  </>
                )}
                {pipeline === 'done' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 30 }}>✅</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#16a34a', marginBottom: 2 }}>
                        Done!{screenProgress.done > 0 ? ` ${screenProgress.done} resume${screenProgress.done !== 1 ? 's' : ''} screened` : ` ${uploadProgress.done} uploaded`}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {scannedCount > 0 && `${scannedCount} scanned PDF${scannedCount > 1 ? 's' : ''} skipped · `}
                        Total time: {fmtElapsed(elapsed)}
                      </div>
                    </div>
                    <button onClick={resetPipeline}
                      style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
                      View Results ↓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Drop zone ── */}
            <div
              onDragOver={e => e.preventDefault()}
              onDragEnter={e => { e.preventDefault(); dragCounter.current++; if (dragCounter.current === 1) e.currentTarget.style.borderColor = '#ff6b00' }}
              onDragLeave={e => { dragCounter.current--; if (dragCounter.current === 0) e.currentTarget.style.borderColor = '#d1d5db' }}
              onDrop={e => { e.preventDefault(); dragCounter.current = 0; e.currentTarget.style.borderColor = '#d1d5db'; if (pipeline === 'idle') handleUpload(e.dataTransfer.files) }}
              onClick={() => { if (pipeline === 'idle') fileRef.current?.click() }}
              style={{ background: '#fff', border: '2px dashed #d1d5db', borderRadius: 14, padding: '20px 16px', textAlign: 'center', marginBottom: 28, cursor: pipeline !== 'idle' ? 'not-allowed' : 'pointer', opacity: pipeline !== 'idle' ? .45 : 1, transition: 'border-color .15s, opacity .15s' }}
            >
              <div style={{ fontSize: 26, marginBottom: 5 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 3 }}>
                {uploading ? 'Upload in progress…' : screening ? 'AI screening in progress…' : 'Tap to browse or drag PDFs here'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Up to 500 PDFs · Max {MAX_FILE_MB} MB per file · AI screens automatically</div>
              <input ref={fileRef} type="file" accept=".pdf,application/pdf" multiple style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
            </div>

            {/* ── Results dashboard ── */}
            {doneResumes.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <h2 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>Results <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: 14 }}>({filteredDone.length}{search || filter !== 'all' ? ` of ${doneResumes.length}` : ''})</span></h2>
                </div>

                {/* Search + Filter + Sort bar */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Search */}
                  <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search name, skill, or summary…"
                      style={{ width: '100%', padding: '9px 10px 9px 32px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                    />
                    {search && (
                      <button onClick={() => setSearch('')}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div style={{ display: 'flex', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexShrink: 0 }}>
                    {[
                      { key: 'all',       label: `All (${doneResumes.length})` },
                      { key: 'SHORTLIST', label: `Shortlist (${stats?.shortlist || 0})`, color: '#16a34a' },
                      { key: 'MAYBE',     label: `Maybe (${stats?.maybe || 0})`,         color: '#d97706' },
                      { key: 'REJECT',    label: `Reject (${stats?.reject || 0})`,        color: '#dc2626' },
                    ].map(f => (
                      <button key={f.key} onClick={() => setFilter(f.key)}
                        style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid ' + (filter === f.key ? (f.color || '#ff6b00') : '#e5e7eb'), background: filter === f.key ? (f.key === 'all' ? '#fff5ee' : REC_BG[f.key] || '#fff5ee') : '#fff', color: filter === f.key ? (f.color || '#ff6b00') : '#374151', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bulk action bar */}
                {someSelected && (
                  <div style={{ background: '#fff', border: '1.5px solid #ff6b00', borderRadius: 10, padding: '10px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#374151', flex: 1 }}>{selectedCount} candidate{selectedCount !== 1 ? 's' : ''} selected</span>
                    <button onClick={shortlistSelected}
                      style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      + Shortlist Selected
                    </button>
                    <button onClick={() => setSelected(new Set())}
                      style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 12px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Clear
                    </button>
                  </div>
                )}

                {filteredDone.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 14 }}>
                    {search ? `No candidates match "${search}"` : 'No candidates in this category.'}
                  </div>
                ) : isMobile ? (
                  /* ── Mobile card list ── */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filteredDone.map(r => {
                      const isPendingDelete = deleteConfirm === r.id
                      const isSelected = selected.has(r.id)
                      return (
                        <div key={r.id} onClick={() => setPopup(r)}
                          style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${isPendingDelete ? '#fca5a5' : isSelected ? '#ff6b00' : '#e5e7eb'}`, padding: '14px 14px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', transition: 'border-color .15s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            {/* Checkbox */}
                            <input type="checkbox" checked={isSelected} onChange={e => toggleSelect(r.id, e)}
                              onClick={e => e.stopPropagation()}
                              style={{ width: 16, height: 16, flexShrink: 0, cursor: 'pointer', accentColor: '#ff6b00' }} />
                            {/* Rank */}
                            <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 700, flexShrink: 0 }}>#{rankMap[r.id]}</span>
                            {/* Name */}
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {r.candidate_name || r.file_name}
                            </span>
                            {/* Score badge */}
                            <ScoreBadge score={r.score || 0} size={40} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                            {r.recommendation && (
                              <span style={{ background: REC_BG[r.recommendation], color: REC_COLOR[r.recommendation], fontWeight: 700, fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{REC_LABEL[r.recommendation]}</span>
                            )}
                            {r.experience_years > 0 && (
                              <span style={{ background: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: 10, padding: '2px 7px', borderRadius: 6 }}>{r.experience_years}yr</span>
                            )}
                            {r.candidate_email && <span style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{r.candidate_email}</span>}
                          </div>
                          {r.strengths?.length > 0 && (
                            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 4 }}>
                              {r.strengths.slice(0, 3).map((s, i) => (
                                <span key={i} style={{ background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 999 }}>{s}</span>
                              ))}
                              {r.strengths.length > 3 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{r.strengths.length - 3}</span>}
                            </div>
                          )}
                          {isPendingDelete && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 10 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => confirmDelete(r.id)} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Confirm Delete</button>
                              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* ── Desktop table ── */
                  <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr>
                            <ThFixed style={{ width: 40, paddingLeft: 14 }}>
                              <input type="checkbox" checked={allSelected} onChange={e => toggleSelectAll(e.target.checked)}
                                style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#ff6b00' }} />
                            </ThFixed>
                            <ThFixed style={{ width: 44 }}>#</ThFixed>
                            <TH label="Candidate" col="name" style={{ minWidth: 170 }} />
                            <TH label="Score" col="score" style={{ width: 80 }} />
                            <TH label="Exp" col="experience" style={{ width: 68 }} />
                            <ThFixed style={{ width: 110 }}>Verdict</ThFixed>
                            <ThFixed style={{ minWidth: 160 }}>Skills Match</ThFixed>
                            <ThFixed style={{ width: 80 }}></ThFixed>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDone.map(r => {
                            const isPendingDelete = deleteConfirm === r.id
                            const isSelected = selected.has(r.id)
                            const tdBase = { padding: '11px 12px', verticalAlign: 'middle', borderBottom: '1px solid #f3f4f6' }
                            return (
                              <tr key={r.id}
                                onClick={() => !isPendingDelete && setPopup(r)}
                                style={{ cursor: 'pointer', background: isSelected ? '#fffbf7' : '#fff', transition: 'background .1s' }}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb' }}
                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? '#fffbf7' : '#fff' }}
                              >
                                {/* Checkbox */}
                                <td style={{ ...tdBase, paddingLeft: 14, width: 40 }} onClick={e => e.stopPropagation()}>
                                  <input type="checkbox" checked={isSelected} onChange={e => toggleSelect(r.id, e)}
                                    style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#ff6b00' }} />
                                </td>
                                {/* Rank */}
                                <td style={{ ...tdBase, width: 44 }}>
                                  <span style={{ fontWeight: 800, fontSize: 12, color: '#9ca3af' }}>{rankMap[r.id]}</span>
                                </td>
                                {/* Candidate */}
                                <td style={{ ...tdBase, minWidth: 170 }}>
                                  <div style={{ fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                                    {r.candidate_name || r.file_name}
                                  </div>
                                  {r.candidate_email && (
                                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{r.candidate_email}</div>
                                  )}
                                </td>
                                {/* Score */}
                                <td style={{ ...tdBase, width: 80 }}>
                                  <ScoreBadge score={r.score || 0} size={42} />
                                </td>
                                {/* Experience */}
                                <td style={{ ...tdBase, width: 68 }}>
                                  {r.experience_years > 0
                                    ? <span style={{ background: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: 11, padding: '3px 7px', borderRadius: 6, whiteSpace: 'nowrap' }}>{r.experience_years}yr</span>
                                    : <span style={{ color: '#d1d5db', fontSize: 11 }}>—</span>
                                  }
                                </td>
                                {/* Verdict */}
                                <td style={{ ...tdBase, width: 110 }}>
                                  {r.recommendation
                                    ? <span style={{ background: REC_BG[r.recommendation], color: REC_COLOR[r.recommendation], fontWeight: 700, fontSize: 11, padding: '4px 9px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                                        {REC_LABEL[r.recommendation]}
                                      </span>
                                    : <span style={{ color: '#d1d5db' }}>—</span>
                                  }
                                </td>
                                {/* Skills */}
                                <td style={{ ...tdBase, minWidth: 160 }}>
                                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    {(r.strengths || []).slice(0, 3).map((s, i) => (
                                      <span key={i} style={{ background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }}>{s}</span>
                                    ))}
                                    {(r.strengths || []).length > 3 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{r.strengths.length - 3}</span>}
                                    {!(r.strengths?.length) && <span style={{ color: '#d1d5db', fontSize: 11 }}>—</span>}
                                  </div>
                                </td>
                                {/* Action */}
                                <td style={{ ...tdBase, width: 80 }} onClick={e => e.stopPropagation()}>
                                  {isPendingDelete ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                      <button onClick={() => confirmDelete(r.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Delete</button>
                                      <button onClick={() => setDeleteConfirm(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      <button onClick={() => setPopup(r)}
                                        style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 7, padding: '6px 10px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                        View
                                      </button>
                                      <button onClick={() => confirmDelete(r.id)} disabled={pipeline !== 'idle'}
                                        style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: pipeline !== 'idle' ? 'not-allowed' : 'pointer', fontSize: 16, padding: '4px', lineHeight: 1, borderRadius: 4 }}
                                        title="Remove">×</button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Score legend */}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 14, fontSize: 11, color: '#9ca3af', flexWrap: 'wrap' }}>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>● 80-100 Strong Hire</span>
                      <span style={{ color: '#d97706', fontWeight: 600 }}>● 50-79 Maybe</span>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>● 0-49 Reject</span>
                      <span style={{ marginLeft: 'auto' }}>Click any row to see full analysis</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Interview Queue panel ── */}
            {interviewQueue.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #dcfce7', marginBottom: 28 }}>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: '#16a34a', margin: 0 }}>
                    🎯 Interview Queue <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: 13 }}>({interviewQueue.length})</span>
                  </h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={exportQueueCSV}
                      style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '7px 13px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      ⬇ Export CSV
                    </button>
                    <button onClick={() => setInterviewQueue([])}
                      style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '7px 12px', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      Clear
                    </button>
                  </div>
                </div>
                <div style={{ padding: '10px 18px 14px' }}>
                  {interviewQueue.map((r, i) => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < interviewQueue.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <ScoreBadge score={r.score || 0} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.candidate_name || r.file_name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.candidate_email || r.file_name}</div>
                      </div>
                      {r.experience_years > 0 && <span style={{ fontSize: 11, color: '#0369a1', background: '#f0f9ff', padding: '2px 7px', borderRadius: 6, fontWeight: 700, flexShrink: 0 }}>{r.experience_years}yr</span>}
                      <button onClick={() => setPopup(r)}
                        style={{ background: '#f3f4f6', border: 'none', color: '#374151', padding: '5px 10px', borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
                        View
                      </button>
                      <button onClick={() => setInterviewQueue(prev => prev.filter(q => q.id !== r.id))}
                        style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 18, padding: '3px 5px', lineHeight: 1, flexShrink: 0 }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Pending / Error section ── */}
            {pendingResumes.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 10 }}>
                  Pending / Errors <span style={{ color: '#9ca3af', fontWeight: 500 }}>({pendingResumes.length})</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {pendingResumes.map(r => {
                    const isPendingDelete = deleteConfirm === r.id
                    return (
                      <div key={r.id} style={{ background: '#fff', borderRadius: 11, border: '1px solid ' + (isPendingDelete ? '#fca5a5' : '#e5e7eb'), overflow: 'hidden', transition: 'border-color .15s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                            {r.status === 'processing' ? '⚙️' : r.status === 'error' ? '⚠️' : '⏳'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.candidate_name || r.file_name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.status === 'pending' ? 'Awaiting AI screening' : r.status === 'processing' ? 'Screening…' : 'Error'}</div>
                          </div>
                          {isPendingDelete ? (
                            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                              <button onClick={() => confirmDelete(r.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Delete</button>
                              <button onClick={() => setDeleteConfirm(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '5px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => confirmDelete(r.id)} disabled={pipeline !== 'idle'}
                              style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: pipeline !== 'idle' ? 'not-allowed' : 'pointer', fontSize: 18, padding: '4px 6px', lineHeight: 1, borderRadius: 4, flexShrink: 0 }}>×</button>
                          )}
                        </div>
                        {r.status === 'error' && r.error_msg && (
                          <div style={{ borderTop: '1px solid #fee2e2', padding: '7px 12px', background: '#fff5f5', fontSize: 11, color: '#dc2626' }}>{r.error_msg}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {resumes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '52px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 6 }}>No resumes yet</h3>
                <p style={{ color: '#6b7280', fontSize: 13 }}>Drop PDFs above — AI screens automatically after upload.</p>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  )
}
