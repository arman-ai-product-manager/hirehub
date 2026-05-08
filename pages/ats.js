import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

const STAGES = [
  { id: 'applied',   label: 'Applied',      color: '#6b7280', icon: '📥' },
  { id: 'screening', label: 'Phone Screen', color: '#3b82f6', icon: '📞' },
  { id: 'interview', label: 'Interview',    color: '#8b5cf6', icon: '🎯' },
  { id: 'final',     label: 'Final Round',  color: '#f59e0b', icon: '⭐' },
  { id: 'offer',     label: 'Offer Sent',   color: '#10b981', icon: '📄' },
  { id: 'hired',     label: 'Hired ✅',     color: '#22c55e', icon: '🎉' },
  { id: 'rejected',  label: 'Rejected',     color: '#ef4444', icon: '✕'  },
]

const DEMO_APPS = [
  { id: 'd1', job_title: 'Senior Developer',   candidate_name: 'Rahul Sharma',  status: 'applied',   fit_score: 82,   applied_at: '2026-05-06T10:00:00Z', source: 'App',       candidate_email: 'rahul@example.com',   candidate_phone: '+91-9876543210', notes: '' },
  { id: 'd2', job_title: 'Senior Developer',   candidate_name: 'Priya Nair',    status: 'screening', fit_score: 91,   applied_at: '2026-05-05T09:00:00Z', source: 'WhatsApp',  candidate_email: 'priya@example.com',   candidate_phone: '+91-9876543211', notes: '' },
  { id: 'd3', job_title: 'Marketing Manager',  candidate_name: 'Amit Patel',    status: 'interview', fit_score: 74,   applied_at: '2026-05-04T11:00:00Z', source: 'Indeed',    candidate_email: 'amit@example.com',    candidate_phone: '+91-9876543212', notes: '' },
  { id: 'd4', job_title: 'Sales Executive',    candidate_name: 'Sneha Gupta',   status: 'final',     fit_score: 88,   applied_at: '2026-05-03T14:00:00Z', source: 'App',       candidate_email: 'sneha@example.com',   candidate_phone: '+91-9876543213', notes: '' },
  { id: 'd5', job_title: 'HR Executive',       candidate_name: 'Vikram Singh',  status: 'offer',     fit_score: 79,   applied_at: '2026-05-02T08:00:00Z', source: 'LinkedIn',  candidate_email: 'vikram@example.com',  candidate_phone: '+91-9876543214', notes: '' },
  { id: 'd6', job_title: 'Marketing Manager',  candidate_name: 'Kavitha Reddy', status: 'hired',     fit_score: 95,   applied_at: '2026-05-01T12:00:00Z', source: 'App',       candidate_email: 'kavitha@example.com', candidate_phone: '+91-9876543215', notes: '' },
  { id: 'd7', job_title: 'Sales Executive',    candidate_name: 'Rohit Kumar',   status: 'rejected',  fit_score: 42,   applied_at: '2026-05-01T15:00:00Z', source: 'Indeed',    candidate_email: 'rohit@example.com',   candidate_phone: '+91-9876543216', notes: '' },
  { id: 'd8', job_title: 'Senior Developer',   candidate_name: 'Anjali Menon',  status: 'applied',   fit_score: null, applied_at: '2026-05-07T09:30:00Z', source: 'WhatsApp',  candidate_email: 'anjali@example.com',  candidate_phone: '+91-9876543217', notes: '' },
]

function timeAgo(dateStr) {
  const now = new Date('2026-05-08T00:00:00Z')
  const then = new Date(dateStr)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMins > 0) return `${diffMins} min ago`
  return 'Just now'
}

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function scoreColor(score) {
  if (score == null) return '#9ca3af'
  if (score >= 70) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

function scoreBg(score) {
  if (score == null) return '#f3f4f6'
  if (score >= 70) return '#dcfce7'
  if (score >= 50) return '#fef3c7'
  return '#fee2e2'
}

const SOURCE_COLORS = {
  'WhatsApp': { bg: '#dcfce7', color: '#16a34a' },
  'App':      { bg: '#dbeafe', color: '#1d4ed8' },
  'LinkedIn': { bg: '#e0e7ff', color: '#4338ca' },
  'Indeed':   { bg: '#fef3c7', color: '#b45309' },
}

function sourceStyle(source) {
  return SOURCE_COLORS[source] || { bg: '#f3f4f6', color: '#374151' }
}

export default function ATSPage() {
  const [apps, setApps] = useState(DEMO_APPS)
  const [isDemo, setIsDemo] = useState(true)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [notesSaving, setNotesSaving] = useState(false)
  const [moveOpen, setMoveOpen] = useState(null)
  const [expandedMobile, setExpandedMobile] = useState({})
  const [filters, setFilters] = useState({ search: '', jobTitle: '', source: '', scoreMin: '', scoreMax: '', dateFrom: '', dateTo: '' })
  const notesTimer = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    fetch('/api/ats/applications')
      .then(r => r.json())
      .then(data => {
        setIsDemo(data.demo)
        setApps(data.applications || DEMO_APPS)
      })
      .catch(() => {
        setIsDemo(true)
        setApps(DEMO_APPS)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selected) setNotesDraft(selected.notes || '')
  }, [selected?.id])

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const cards = document.querySelectorAll('[data-card]')
        let inside = false
        cards.forEach(c => { if (c.contains(e.target)) inside = true })
        if (!inside) setSelected(null)
      }
    }
    if (selected) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [selected])

  function selectCard(app) {
    setSelected(app)
    setNotesDraft(app.notes || '')
    setMoveOpen(null)
  }

  function moveApp(appId, newStatus) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
    if (selected?.id === appId) setSelected(prev => ({ ...prev, status: newStatus }))
    setMoveOpen(null)
    fetch('/api/ats/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: appId, status: newStatus }),
    }).catch(() => {})
  }

  function handleNotesChange(val) {
    setNotesDraft(val)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      setNotesSaving(true)
      setApps(prev => prev.map(a => a.id === selected?.id ? { ...a, notes: val } : a))
      setSelected(prev => prev ? { ...prev, notes: val } : prev)
      fetch('/api/ats/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected?.id, notes: val }),
      }).finally(() => setNotesSaving(false))
    }, 800)
  }

  function triggerAIScore(app) {
    const mockScore = Math.floor(Math.random() * 40) + 55
    setApps(prev => prev.map(a => a.id === app.id ? { ...a, fit_score: mockScore } : a))
    if (selected?.id === app.id) setSelected(prev => ({ ...prev, fit_score: mockScore }))
    fetch('/api/ats/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: app.id, fit_score: mockScore }),
    }).catch(() => {})
  }

  // Filter logic
  const filteredApps = apps.filter(a => {
    if (filters.search && !a.candidate_name?.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.jobTitle && a.job_title !== filters.jobTitle) return false
    if (filters.source && a.source !== filters.source) return false
    if (filters.scoreMin !== '' && (a.fit_score == null || a.fit_score < Number(filters.scoreMin))) return false
    if (filters.scoreMax !== '' && (a.fit_score == null || a.fit_score > Number(filters.scoreMax))) return false
    if (filters.dateFrom && new Date(a.applied_at) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(a.applied_at) > new Date(filters.dateTo + 'T23:59:59Z')) return false
    return true
  })

  const uniqueJobs = [...new Set(apps.map(a => a.job_title).filter(Boolean))]
  const uniqueSources = [...new Set(apps.map(a => a.source).filter(Boolean))]

  // Stats
  const totalApps = apps.length
  const activePipelines = apps.filter(a => !['hired', 'rejected'].includes(a.status)).length
  const hiredCount = apps.filter(a => a.status === 'hired').length
  const avgTimeToHire = (() => {
    const hired = apps.filter(a => a.status === 'hired' && a.applied_at)
    if (!hired.length) return 'N/A'
    const avg = hired.reduce((s, a) => {
      return s + Math.floor((new Date('2026-05-08') - new Date(a.applied_at)) / 86400000)
    }, 0) / hired.length
    return Math.round(avg) + ' days'
  })()

  const stageForId = id => STAGES.find(s => s.id === id)
  const nextStages = (currentId) => {
    const idx = STAGES.findIndex(s => s.id === currentId)
    return STAGES.filter((s, i) => i !== idx && s.id !== 'rejected')
  }

  return (
    <>
      <Head>
        <title>Recruiter ATS Dashboard | HireHub360</title>
        <meta name="description" content="Free applicant tracking system for Indian recruiters. Kanban pipeline, AI scoring, WhatsApp integration." />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <header style={{ background: '#1d1d1f', color: '#fff', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href="/" style={{ textDecoration: 'none', color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>
                HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 10, color: '#ff6b00' }}>360</sup>
              </a>
              <span style={{ color: '#666', fontSize: 14 }}>|</span>
              <span style={{ color: '#e5e5e7', fontSize: 15, fontWeight: 600 }}>Recruiter ATS</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                + Post New Job
              </a>
              <a href="/hirehub.html" style={{ background: 'transparent', color: '#e5e5e7', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '1px solid #444', whiteSpace: 'nowrap' }}>
                Sign In
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 24, paddingBottom: 12, paddingTop: 4, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Applicants', value: totalApps },
              { label: 'Active Pipelines', value: activePipelines },
              { label: 'Hired This Month', value: hiredCount },
              { label: 'Avg Time to Hire', value: avgTimeToHire },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ color: '#ff6b00', fontWeight: 700, fontSize: 18 }}>{stat.value}</span>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </header>

        {/* ── Demo banner ── */}
        {isDemo && (
          <div style={{ background: '#fff7ed', borderBottom: '1px solid #fed7aa', padding: '10px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: '#92400e' }}>
              👋 You're viewing <strong>demo data</strong> — <a href="/hirehub.html" style={{ color: '#ff6b00', fontWeight: 600 }}>Sign in</a> to see your real pipeline.
            </span>
          </div>
        )}

        {/* ── Filter Bar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              placeholder="🔍 Search by name…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              style={inputStyle}
            />
            <select value={filters.jobTitle} onChange={e => setFilters(f => ({ ...f, jobTitle: e.target.value }))} style={inputStyle}>
              <option value="">All Job Titles</option>
              {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <select value={filters.source} onChange={e => setFilters(f => ({ ...f, source: e.target.value }))} style={inputStyle}>
              <option value="">All Sources</option>
              {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="number"
              placeholder="Min Score"
              value={filters.scoreMin}
              onChange={e => setFilters(f => ({ ...f, scoreMin: e.target.value }))}
              style={{ ...inputStyle, width: 90 }}
              min="0" max="100"
            />
            <input
              type="number"
              placeholder="Max Score"
              value={filters.scoreMax}
              onChange={e => setFilters(f => ({ ...f, scoreMax: e.target.value }))}
              style={{ ...inputStyle, width: 90 }}
              min="0" max="100"
            />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              style={inputStyle}
              title="From date"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              style={inputStyle}
              title="To date"
            />
            {(filters.search || filters.jobTitle || filters.source || filters.scoreMin || filters.scoreMax || filters.dateFrom || filters.dateTo) && (
              <button onClick={() => setFilters({ search: '', jobTitle: '', source: '', scoreMin: '', scoreMax: '', dateFrom: '', dateTo: '' })} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                ✕ Clear
              </button>
            )}
            <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>
              {filteredApps.length} of {apps.length} applicants
            </span>
          </div>
        </div>

        {/* ── Main layout: kanban + sidebar ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

          {/* ── Kanban Board ── */}
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '20px 16px 40px', minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', paddingTop: 80, color: '#9ca3af', fontSize: 16 }}>Loading pipeline…</div>
            ) : (
              <div style={{ display: 'flex', gap: 14, minWidth: STAGES.length * 254 + 'px' }}>
                {STAGES.map(stage => {
                  const stageApps = filteredApps.filter(a => a.status === stage.id)
                  const isCollapsed = expandedMobile[stage.id] === false
                  return (
                    <div key={stage.id} style={{ minWidth: 240, maxWidth: 260, flex: '0 0 250px', display: 'flex', flexDirection: 'column' }}>
                      {/* Column header */}
                      <div
                        style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', marginBottom: 10, border: `2px solid ${stage.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => setExpandedMobile(p => ({ ...p, [stage.id]: isCollapsed ? true : (p[stage.id] === false ? true : false) }))}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{stage.icon}</span>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#1d1d1f' }}>{stage.label}</span>
                        </div>
                        <span style={{ background: stage.color, color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                          {stageApps.length}
                        </span>
                      </div>

                      {/* Cards */}
                      {!isCollapsed && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {stageApps.length === 0 && (
                            <div style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', borderRadius: 10, padding: '24px 16px', textAlign: 'center', color: '#d1d5db', fontSize: 13 }}>
                              No candidates
                            </div>
                          )}
                          {stageApps.map(app => (
                            <CandidateCard
                              key={app.id}
                              app={app}
                              stage={stage}
                              isSelected={selected?.id === app.id}
                              onSelect={() => selectCard(app)}
                              onMove={moveApp}
                              onAIScore={() => triggerAIScore(app)}
                              moveOpen={moveOpen}
                              setMoveOpen={setMoveOpen}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Detail Sidebar ── */}
          {selected && (
            <div
              ref={panelRef}
              style={{ width: 340, background: '#fff', borderLeft: '1px solid #e5e7eb', overflowY: 'auto', padding: '20px', flexShrink: 0, position: 'relative' }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', lineHeight: 1 }}
                aria-label="Close panel"
              >✕</button>

              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: stageForId(selected.status)?.color || '#6b7280', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                  {initials(selected.candidate_name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#1d1d1f' }}>{selected.candidate_name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{selected.job_title}</div>
                </div>
              </div>

              {/* Stage badge */}
              <div style={{ marginBottom: 14 }}>
                <span style={{ background: stageForId(selected.status)?.color + '20', color: stageForId(selected.status)?.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                  {stageForId(selected.status)?.icon} {stageForId(selected.status)?.label}
                </span>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, fontSize: 13, color: '#374151' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Applied</span>
                  <span>{timeAgo(selected.applied_at)} · {new Date(selected.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Source</span>
                  <span style={{ ...sourceStyle(selected.source), borderRadius: 6, padding: '1px 8px', fontSize: 12, fontWeight: 500 }}>{selected.source || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af' }}>AI Fit Score</span>
                  <span style={{ background: scoreBg(selected.fit_score), color: scoreColor(selected.fit_score), borderRadius: 20, padding: '2px 10px', fontWeight: 700, fontSize: 13 }}>
                    {selected.fit_score != null ? `${selected.fit_score}%` : '?'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {selected.candidate_email && (
                  <a href={`mailto:${selected.candidate_email}`} style={{ flex: 1, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                    📧 Send Email
                  </a>
                )}
                {selected.candidate_phone && (
                  <a href={`tel:${selected.candidate_phone}`} style={{ flex: 1, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                    📞 Call
                  </a>
                )}
                <button
                  onClick={() => triggerAIScore(selected)}
                  style={{ flex: 1, background: '#faf5ff', color: '#7c3aed', border: '1px solid #ddd6fe', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  🤖 Re-score AI
                </button>
              </div>

              {/* Move stage */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Move to Stage</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {STAGES.filter(s => s.id !== selected.status).map(s => (
                    <button
                      key={s.id}
                      onClick={() => moveApp(selected.id, s.id)}
                      style={{ background: s.color + '15', color: s.color, border: `1px solid ${s.color}40`, borderRadius: 7, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Notes</span>
                  {notesSaving && <span style={{ color: '#22c55e', fontWeight: 500, textTransform: 'none' }}>Saving…</span>}
                </div>
                <textarea
                  value={notesDraft}
                  onChange={e => handleNotesChange(e.target.value)}
                  placeholder="Add notes about this candidate…"
                  rows={5}
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', color: '#1d1d1f', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function CandidateCard({ app, stage, isSelected, onSelect, onMove, onAIScore, moveOpen, setMoveOpen }) {
  const thisOpen = moveOpen === app.id
  const nextOpts = STAGES.filter(s => s.id !== app.status)

  return (
    <div
      data-card
      onClick={onSelect}
      style={{
        background: '#fff',
        border: `1px solid ${isSelected ? stage.color : '#e5e7eb'}`,
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        boxShadow: isSelected ? `0 0 0 2px ${stage.color}40` : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        position: 'relative',
      }}
    >
      {/* Name + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: stage.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {initials(app.candidate_name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#1d1d1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {app.candidate_name}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {app.job_title}
          </div>
        </div>
        {/* Fit score */}
        <span style={{ background: scoreBg(app.fit_score), color: scoreColor(app.fit_score), borderRadius: 20, padding: '2px 8px', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
          {app.fit_score != null ? `${app.fit_score}%` : '?'}
        </span>
      </div>

      {/* Applied date + source */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(app.applied_at)}</span>
        <span style={{ ...sourceStyle(app.source), borderRadius: 6, padding: '1px 7px', fontSize: 11, fontWeight: 500 }}>
          {app.source || '—'}
        </span>
      </div>

      {/* Actions row */}
      <div style={{ display: 'flex', gap: 6, position: 'relative' }} onClick={e => e.stopPropagation()}>
        {/* Move button */}
        <div style={{ position: 'relative', flex: 1 }}>
          <button
            onClick={() => setMoveOpen(thisOpen ? null : app.id)}
            style={{ width: '100%', background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 7, padding: '5px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            → Move
          </button>
          {thisOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 6, minWidth: 160, marginTop: 4 }}>
              {nextOpts.map(s => (
                <button
                  key={s.id}
                  onClick={() => onMove(app.id, s.id)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '7px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: s.color, fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = s.color + '12'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes button */}
        <button
          onClick={onSelect}
          style={{ flex: 1, background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 7, padding: '5px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          title="Open notes"
        >
          📝 Notes
        </button>

        {/* AI Score button */}
        <button
          onClick={onAIScore}
          style={{ flex: 1, background: '#faf5ff', color: '#7c3aed', border: '1px solid #ddd6fe', borderRadius: 7, padding: '5px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          title="Generate AI score"
        >
          🤖 Score
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '7px 12px',
  fontSize: 13,
  fontFamily: 'inherit',
  color: '#1d1d1f',
  outline: 'none',
  background: '#fff',
  minWidth: 120,
}
