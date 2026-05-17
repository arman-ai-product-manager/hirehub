import Head from 'next/head'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const REC_COLOR = { hire: '#16a34a', consider: '#d97706', reject: '#dc2626' }
const REC_BG    = { hire: '#dcfce7', consider: '#fef3c7', reject: '#fee2e2' }

function timeAgo(d) {
  const ms = Date.now() - new Date(d)
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m || 1}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ScreenerDashboard() {
  const [session, setSession] = useState(null)
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm]       = useState({ title: '', description: '', skills: '' })
  const [saving, setSaving]   = useState(false)
  const [err, setErr]         = useState('')

  useEffect(() => {
    if (!SB) return
    SB.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadJobs(data.session.access_token)
      else setLoading(false)
    })
  }, [])

  async function loadJobs(token) {
    setLoading(true)
    const r = await fetch('/api/screener/jobs', { headers: { Authorization: 'Bearer ' + token } })
    const d = await r.json()
    setJobs(d.jobs || [])
    setLoading(false)
  }

  async function createJob(e) {
    e.preventDefault()
    setErr('')
    if (!form.title.trim() || !form.description.trim()) { setErr('Title and description are required'); return }
    setSaving(true)
    const token = session?.access_token
    const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
    const r = await fetch('/api/screener/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ title: form.title, description: form.description, skills }),
    })
    const d = await r.json()
    setSaving(false)
    if (!r.ok) { setErr(d.error || 'Error'); return }
    setCreating(false)
    setForm({ title: '', description: '', skills: '' })
    loadJobs(token)
  }

  async function deleteJob(id) {
    if (!confirm('Delete this job and all its resumes?')) return
    const token = session?.access_token
    await fetch('/api/screener/jobs?id=' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>AI Resume Screener</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>Sign in to your HireHub360 company account to continue.</p>
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
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 5vw', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 18, color: '#1d1d1f', textDecoration: 'none', letterSpacing: '-.03em' }}>
              Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
            </a>
            <span style={{ color: '#d1d5db' }}>›</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#374151' }}>AI Resume Screener</span>
          </div>
          <a href="/hirehub.html" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Back to Dashboard</a>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 5vw' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-.04em', margin: 0, color: '#111827' }}>Resume Screener</h1>
              <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>Upload up to 500 PDFs — AI ranks every candidate against your JD in minutes.</p>
            </div>
            <button onClick={() => { setCreating(true); setErr('') }} style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              + New Job
            </button>
          </div>

          {/* Create Job Modal */}
          {creating && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div style={{ background: '#fff', borderRadius: 18, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 22, color: '#111827' }}>Create New Job</h2>
                <form onSubmit={createJob}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Job Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Senior React Developer" required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }} />

                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Job Description *</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Paste the full job description here — the AI will use this to evaluate every resume." required rows={7}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 13, marginBottom: 16, boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6, outline: 'none' }} />

                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Required Skills <span style={{ fontWeight: 400, color: '#9ca3af' }}>(comma separated)</span></label>
                  <input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                    placeholder="React, Node.js, AWS, SQL"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 14, marginBottom: 22, boxSizing: 'border-box', outline: 'none' }} />

                  {err && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{err}</div>}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={saving}
                      style={{ flex: 1, background: '#ff6b00', color: '#fff', border: 'none', padding: '12px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
                      {saving ? 'Creating…' : 'Create Job'}
                    </button>
                    <button type="button" onClick={() => setCreating(false)}
                      style={{ padding: '12px 20px', borderRadius: 9, border: '1.5px solid #d1d5db', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>
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
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#111827', marginBottom: 8 }}>No jobs yet</h3>
              <p style={{ color: '#6b7280', marginBottom: 22, fontSize: 14 }}>Create a job to start screening resumes with AI.</p>
              <button onClick={() => setCreating(true)} style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                + Create First Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
              {jobs.map(job => (
                <div key={job.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h3>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{timeAgo(job.created_at)}</div>
                    </div>
                    <button onClick={() => deleteJob(job.id)}
                      style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 18, padding: '0 0 0 8px', lineHeight: 1 }}>×</button>
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {job.skills.slice(0, 5).map(s => (
                        <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>{s}</span>
                      ))}
                      {job.skills.length > 5 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{job.skills.length - 5}</span>}
                    </div>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                    <span style={{ color: '#374151', fontWeight: 700 }}>{job.total}</span><span style={{ color: '#9ca3af' }}>uploaded</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>{job.done}</span><span style={{ color: '#9ca3af' }}>screened</span>
                    {job.total - job.done > 0 && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{job.total - job.done}</span>}
                    {job.total - job.done > 0 && <span style={{ color: '#9ca3af' }}>pending</span>}
                  </div>

                  <a href={`/screener/${job.id}`}
                    style={{ display: 'block', textAlign: 'center', background: job.total > 0 ? '#ff6b00' : '#f3f4f6', color: job.total > 0 ? '#fff' : '#374151', padding: '10px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                    {job.total === 0 ? 'Upload Resumes →' : job.done < job.total ? 'Continue Screening →' : 'View Results →'}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
