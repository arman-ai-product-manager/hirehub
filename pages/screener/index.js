import Head from 'next/head'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

function timeAgo(d) {
  const ms = Date.now() - new Date(d)
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m || 1}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ScreenerDashboard() {
  const [session, setSession]         = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [jobs, setJobs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [creating, setCreating]       = useState(false)
  const [form, setForm]               = useState({ title: '', description: '', skills: '' })
  const [saving, setSaving]           = useState(false)
  const [err, setErr]                 = useState('')
  const [netErr, setNetErr]           = useState('')
  const [deleteJobConfirm, setDeleteJobConfirm] = useState(null) // job id pending inline confirm

  // Lock body scroll when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = creating ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [creating])

  // Auto-cancel delete confirmation after 4s of inactivity
  useEffect(() => {
    if (!deleteJobConfirm) return
    const t = setTimeout(() => setDeleteJobConfirm(null), 4000)
    return () => clearTimeout(t)
  }, [deleteJobConfirm])

  useEffect(() => {
    if (!SB) return
    SB.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
      if (data.session) loadJobs(data.session.access_token)
      else setLoading(false)
    }).catch(() => {
      // Supabase unreachable — stop spinner so user sees the sign-in gate
      setAuthLoading(false)
      setLoading(false)
    })
  }, [])

  async function getToken() {
    if (!SB) return ''
    const { data } = await SB.auth.getSession()
    return data?.session?.access_token || ''
  }

  async function loadJobs(token) {
    setLoading(true)
    setNetErr('')
    try {
      const r = await fetch('/api/screener/jobs', { headers: { Authorization: 'Bearer ' + token } })
      const d = await r.json()
      if (!r.ok) { setNetErr(d.error || 'Failed to load jobs'); setJobs([]); return }
      setJobs(d.jobs || [])
    } catch {
      setNetErr('Network error — could not load jobs')
    } finally {
      setLoading(false)
    }
  }

  async function createJob(e) {
    e.preventDefault()
    setErr('')
    if (!form.title.trim() || !form.description.trim()) {
      setErr('Title and description are required')
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) { setErr('Session expired — please sign in again'); return }
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
      const r = await fetch('/api/screener/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ title: form.title.trim(), description: form.description.trim(), skills }),
      })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Could not create job'); return }
      setCreating(false)
      setForm({ title: '', description: '', skills: '' })
      loadJobs(token)
    } catch {
      setErr('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  async function deleteJob(id) {
    if (deleteJobConfirm !== id) {
      // First tap — show inline confirmation
      setDeleteJobConfirm(id)
      return
    }
    // Second tap — actually delete
    setDeleteJobConfirm(null)
    const token = await getToken()
    try {
      const r = await fetch('/api/screener/jobs?id=' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        setNetErr(d.error || 'Delete failed')
        return
      }
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch {
      setNetErr('Network error — delete failed')
    }
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', background: '#f9fafb' }}>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</div>
    </div>
  )

  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', background: '#f9fafb', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>AI Resume Screener</h2>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>Sign in to your HireHub360 company account to continue.</p>
        <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>Sign In →</a>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>AI Resume Screener — HireHub360</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
        {/* Nav */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 5vw', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 18, color: '#1d1d1f', textDecoration: 'none', letterSpacing: '-.03em', flexShrink: 0 }}>
              Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
            </a>
            <span style={{ color: '#d1d5db', flexShrink: 0 }}>›</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI Resume Screener</span>
          </div>
          <a href="/hirehub.html" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', flexShrink: 0 }}>← Dashboard</a>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 5vw 60px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-.04em', margin: 0, color: '#111827' }}>Resume Screener</h1>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>Upload up to 500 PDFs — AI ranks every candidate against your JD in minutes.</p>
            </div>
            <button onClick={() => { setCreating(true); setErr('') }}
              style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + New Job
            </button>
          </div>

          {/* Network error banner */}
          {netErr && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: 1 }}>{netErr}</span>
              <button onClick={async () => { setNetErr(''); loadJobs(await getToken()) }} style={{ background: 'none', border: '1.5px solid #dc2626', color: '#dc2626', padding: '4px 12px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>Retry</button>
            </div>
          )}

          {/* Create Job Modal */}
          {creating && (
            <div
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
              onClick={e => { if (e.target === e.currentTarget) { setCreating(false); setErr(''); setForm({ title: '', description: '', skills: '' }) } }}
            >
              <div style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontWeight: 800, fontSize: 18, color: '#111827', margin: 0 }}>Create New Job</h2>
                  <button onClick={() => { setCreating(false); setErr(''); setForm({ title: '', description: '', skills: '' }) }} style={{ background: 'none', border: 'none', fontSize: 22, color: '#9ca3af', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }} aria-label="Close">×</button>
                </div>
                <form onSubmit={createJob}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 5 }}>Job Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Senior React Developer"
                    required
                    autoCapitalize="words"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 14, marginBottom: 14, boxSizing: 'border-box', outline: 'none' }}
                  />

                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 5 }}>Job Description *</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Paste the full job description — AI uses this to evaluate every resume."
                    required
                    rows={6}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 13, marginBottom: 14, boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6, outline: 'none' }}
                  />

                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 5 }}>
                    Required Skills <span style={{ fontWeight: 400, color: '#9ca3af' }}>(comma separated, optional)</span>
                  </label>
                  <input
                    value={form.skills}
                    onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                    placeholder="React, Node.js, AWS, SQL"
                    autoCapitalize="none"
                    autoCorrect="off"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 14, marginBottom: 20, boxSizing: 'border-box', outline: 'none' }}
                  />

                  {err && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{err}</div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={saving}
                      style={{ flex: 1, background: '#ff6b00', color: '#fff', border: 'none', padding: '12px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
                      {saving ? 'Creating…' : 'Create Job'}
                    </button>
                    <button type="button" onClick={() => { setCreating(false); setErr(''); setForm({ title: '', description: '', skills: '' }) }}
                      style={{ padding: '12px 18px', borderRadius: 9, border: '1.5px solid #d1d5db', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Jobs Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading…</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', marginBottom: 6 }}>No jobs yet</h3>
              <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 13 }}>Create a job to start screening resumes with AI.</p>
              <button onClick={() => { setCreating(true); setErr('') }}
                style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                + Create First Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
              {jobs.map(job => {
                const isPendingDelete = deleteJobConfirm === job.id
                return (
                  <div key={job.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + (isPendingDelete ? '#fca5a5' : '#e5e7eb'), padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color .15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 15, color: '#111827', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h3>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(job.created_at)}</div>
                      </div>

                      {/* Inline delete confirmation — two-tap on mobile */}
                      {isPendingDelete ? (
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <button onClick={() => deleteJob(job.id)}
                            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 11px', fontWeight: 700, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            Delete
                          </button>
                          <button onClick={() => setDeleteJobConfirm(null)}
                            style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 7, padding: '6px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => deleteJob(job.id)}
                          style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 18, padding: '6px 10px', lineHeight: 1, flexShrink: 0, borderRadius: 6 }}
                          title="Delete job"
                          aria-label="Delete job">×</button>
                      )}
                    </div>

                    {job.skills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {job.skills.slice(0, 5).map(s => (
                          <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>{s}</span>
                        ))}
                        {job.skills.length > 5 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{job.skills.length - 5}</span>}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap' }}>
                      <span><b style={{ color: '#374151' }}>{job.total}</b> <span style={{ color: '#9ca3af' }}>uploaded</span></span>
                      <span><b style={{ color: '#16a34a' }}>{job.done}</b> <span style={{ color: '#9ca3af' }}>screened</span></span>
                      {job.total - job.done > 0 && (
                        <span><b style={{ color: '#f59e0b' }}>{job.total - job.done}</b> <span style={{ color: '#9ca3af' }}>pending</span></span>
                      )}
                    </div>

                    <a href={`/screener/${job.id}`}
                      style={{ display: 'block', textAlign: 'center', background: job.total > 0 ? '#ff6b00' : '#f3f4f6', color: job.total > 0 ? '#fff' : '#374151', padding: '10px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                      {job.total === 0 ? 'Upload Resumes →' : job.done < job.total ? 'Continue Screening →' : 'View Results →'}
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
