import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const PLANS = ['free', 'pro', 'enterprise']

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #f0f0f5', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#1d1d1f', letterSpacing: '-.04em' }}>{value ?? '—'}</div>
        <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [authed,  setAuthed]  = useState(false)
  const [pass,    setPass]    = useState('')
  const [msg,     setMsg]     = useState('')
  const [tab,     setTab]     = useState('dashboard')
  const [stats,   setStats]   = useState(null)
  const [audit,   setAudit]   = useState([])
  const [users,   setUsers]   = useState([])
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(false)

  function notify(m, dur = 3500) { setMsg(m); setTimeout(() => setMsg(''), dur) }

  // ── Auth ──────────────────────────────────────────────────────
  async function doLogin(e) {
    e.preventDefault()
    const r = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: pass }),
    })
    const d = await r.json()
    if (d.ok) { setAuthed(true); loadData('dashboard') }
    else { notify('❌ Wrong password') }
  }

  async function doLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' })
    setAuthed(false); setStats(null); setUsers([]); setJobs([])
  }

  // ── Data loaders ──────────────────────────────────────────────
  const loadData = useCallback(async (t) => {
    setLoading(true)
    try {
      if (t === 'dashboard') {
        const r = await fetch('/api/admin/stats', { credentials: 'include' })
        if (r.status === 401) { setAuthed(false); return }
        const d = await r.json()
        setStats(d.stats); setAudit(d.recentAudit || [])
      }
      if (t === 'users') {
        const r = await fetch('/api/admin/users?limit=50', { credentials: 'include' })
        const d = await r.json()
        setUsers(d.users || [])
      }
      if (t === 'jobs') {
        const { supabaseService: _ } = await import('../../lib/supabase').catch(() => ({}))
        // Fetch via stats endpoint (jobs are in stats)
        const r = await fetch('/api/admin/stats', { credentials: 'include' })
        const d = await r.json()
        setStats(d.stats); setAudit(d.recentAudit || [])
      }
    } catch (err) { notify('Error: ' + err.message) }
    finally { setLoading(false) }
  }, [])

  function switchTab(t) { setTab(t); loadData(t) }

  // ── Actions ───────────────────────────────────────────────────
  async function doAction(action, params) {
    const r = await fetch('/api/admin/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action, ...params }),
    })
    const d = await r.json()
    if (d.ok) { notify('✅ Done!'); loadData(tab) }
    else { notify('❌ ' + (d.error || 'Failed')) }
  }

  // ── Login screen ──────────────────────────────────────────────
  if (!authed) return (
    <>
      <Head><title>HireHub360 Admin</title></Head>
      <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
        <form onSubmit={doLogin} style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', width: 360, boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
            <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-.03em' }}>HireHub360 Admin</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Super Admin Panel</div>
          </div>
          <input
            type="password" placeholder="Admin password" value={pass}
            onChange={e => setPass(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e5ea', borderRadius: 10, fontSize: 15, boxSizing: 'border-box', marginBottom: 12 }}
          />
          <button type="submit" style={{ width: '100%', background: '#ff6b00', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
            Sign In →
          </button>
          {msg && <div style={{ marginTop: 12, textAlign: 'center', color: '#dc2626', fontSize: 13 }}>{msg}</div>}
        </form>
      </div>
    </>
  )

  const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users',     label: '👥 Users' },
    { id: 'audit',     label: '📋 Audit Log' },
    { id: 'blog',      label: '✍️ Blog', href: '/admin/blog' },
  ]

  return (
    <>
      <Head><title>Admin Dashboard · HireHub360</title></Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'system-ui,sans-serif' }}>

        {/* Top Nav */}
        <div style={{ background: '#0f0f0f', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ color: '#ff6b00', fontWeight: 900, fontSize: 16, letterSpacing: '-.02em' }}>🎯 Admin</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {TABS.map(t => t.href
                ? <a key={t.id} href={t.href} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#888', textDecoration: 'none' }}>{t.label}</a>
                : <button key={t.id} onClick={() => switchTab(t.id)}
                    style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: tab === t.id ? 'rgba(255,107,0,.15)' : 'transparent', color: tab === t.id ? '#ff6b00' : '#888', border: 'none', cursor: 'pointer' }}>
                    {t.label}
                  </button>
              )}
            </div>
          </div>
          <button onClick={doLogout} style={{ background: 'rgba(255,255,255,.08)', color: '#aaa', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>

        {/* Toast */}
        {msg && (
          <div style={{ position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)', background: '#1d1d1f', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
            {msg}
          </div>
        )}

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

          {/* ── DASHBOARD TAB ── */}
          {tab === 'dashboard' && (
            <>
              <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', marginBottom: 20 }}>Platform Overview</div>
              {loading && <div style={{ color: '#888', fontSize: 14 }}>Loading...</div>}
              {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 32 }}>
                  <StatCard icon="👤" label="Total Job Seekers"  value={stats.totalUsers}         color="#0891b2" />
                  <StatCard icon="🏢" label="Companies"          value={stats.totalCompanies}      color="#7c3aed" />
                  <StatCard icon="💼" label="Active Jobs"        value={stats.totalActiveJobs}     color="#ff6b00" />
                  <StatCard icon="📩" label="Applications"       value={stats.totalApplications}   color="#16a34a" />
                  <StatCard icon="🏛️"  label="Venue Bookings"    value={stats.totalVenueBookings}  color="#dc2626" />
                  <StatCard icon="🧑‍💼"  label="HR Members"        value={stats.totalHR}             color="#d97706" />
                </div>
              )}

              {/* Recent Audit */}
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Recent Activity</div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f0f0f5', overflow: 'hidden' }}>
                {audit.length === 0 && <div style={{ padding: 24, color: '#888', fontSize: 13 }}>No activity yet.</div>}
                {audit.slice(0, 10).map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < Math.min(9, audit.length - 1) ? '1px solid #f5f5f7' : 'none' }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>
                      {a.action === 'ban_user' ? '🚫' : a.action === 'invite_hr' ? '📧' : a.action === 'apply' ? '📩' : a.action === 'delete_job' ? '🗑️' : '📋'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#1d1d1f' }}>{a.action.replace(/_/g, ' ')}</span>
                      {a.target_type && <span style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>{a.target_type} · {String(a.target_id || '').slice(0, 20)}</span>}
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', flexShrink: 0 }}>
                      {new Date(a.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, background: a.actor_role === 'super_admin' ? '#ff6b0020' : '#f0f0f5', color: a.actor_role === 'super_admin' ? '#ff6b00' : '#666', borderRadius: 6, padding: '2px 8px', flexShrink: 0 }}>
                      {a.actor_role}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── USERS TAB ── */}
          {tab === 'users' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em' }}>Users</div>
                <button onClick={() => loadData('users')} style={{ background: '#fff', border: '1.5px solid #e5e5ea', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↺ Refresh</button>
              </div>
              {loading && <div style={{ color: '#888', fontSize: 14 }}>Loading...</div>}
              <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f0f0f5', overflow: 'hidden' }}>
                {users.length === 0 && !loading && <div style={{ padding: 24, color: '#888', fontSize: 13 }}>No users found.</div>}
                {users.map((u, i) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < users.length - 1 ? '1px solid #f5f5f7' : 'none', flexWrap: 'wrap' }}>
                    {/* Role badge */}
                    <span style={{ fontSize: 18 }}>{u.role === 'company' ? '🏢' : '👤'}</span>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1d1d1f' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{u.id.slice(0, 16)}… · {u.role} · {u.plan}</div>
                    </div>
                    {/* Ban status */}
                    {u.is_banned && (
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#fef2f2', color: '#dc2626', borderRadius: 6, padding: '3px 10px' }}>BANNED</span>
                    )}
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {u.is_banned
                        ? <button onClick={() => doAction('unban_user', { userId: u.id, table: u.table })}
                            style={{ background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #bbf7d0', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                            ✓ Unban
                          </button>
                        : <button onClick={() => { if (confirm('Ban ' + u.name + '?')) doAction('ban_user', { userId: u.id, table: u.table }) }}
                            style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                            🚫 Ban
                          </button>
                      }
                      {u.role === 'company' && (
                        <select onChange={e => { if (e.target.value) doAction('override_plan', { userId: u.id, plan: e.target.value }); e.target.value = '' }}
                          style={{ border: '1.5px solid #e5e5ea', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, color: '#444', cursor: 'pointer' }}>
                          <option value="">Plan: {u.plan}</option>
                          {PLANS.filter(p => p !== u.plan).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── AUDIT LOG TAB ── */}
          {tab === 'audit' && (
            <>
              <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', marginBottom: 20 }}>Audit Log</div>
              <button onClick={() => loadData('audit')} style={{ marginBottom: 16, background: '#fff', border: '1.5px solid #e5e5ea', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↺ Refresh</button>
              <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f0f0f5', overflow: 'hidden' }}>
                {audit.length === 0 && <div style={{ padding: 24, color: '#888', fontSize: 13 }}>No audit entries yet.</div>}
                {audit.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 20px', borderBottom: i < audit.length - 1 ? '1px solid #f5f5f7' : 'none' }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>
                      {a.action === 'ban_user' ? '🚫' : a.action === 'invite_hr' ? '📧' : a.action === 'apply' ? '📩' : a.action === 'delete_job' ? '🗑️' : a.action === 'override_plan' ? '💎' : '📋'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{a.action.replace(/_/g, ' ')}</div>
                      {a.target_type && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{a.target_type}: {String(a.target_id || '').slice(0, 40)}</div>}
                      {a.metadata && Object.keys(a.metadata).length > 0 && (
                        <div style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>{JSON.stringify(a.metadata).slice(0, 80)}</div>
                      )}
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#aaa' }}>{new Date(a.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</div>
                      <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 700, background: a.actor_role === 'super_admin' ? '#ff6b0020' : '#f5f5f7', color: a.actor_role === 'super_admin' ? '#ff6b00' : '#666', borderRadius: 6, padding: '1px 8px' }}>
                        {a.actor_role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}
