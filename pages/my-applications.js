import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

const STATUS_META = {
  applied:      { label: 'Applied',       color: '#0ea5e9', bg: '#e0f2fe' },
  shortlisted:  { label: 'Shortlisted',   color: '#7c3aed', bg: '#ede9fe' },
  interview:    { label: 'Interview',     color: '#f59e0b', bg: '#fef3c7' },
  offered:      { label: 'Offered',       color: '#10b981', bg: '#d1fae5' },
  hired:        { label: 'Hired',         color: '#059669', bg: '#a7f3d0' },
  rejected:     { label: 'Not selected',  color: '#dc2626', bg: '#fee2e2' },
  withdrawn:    { label: 'Withdrawn',     color: '#6b7280', bg: '#f3f4f6' },
}

function relTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function MyApplications() {
  const [state, setState] = useState({ status: 'loading', apps: [], err: null, signedIn: false })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!supabase) {
      setState({ status: 'error', apps: [], err: 'Supabase not configured', signedIn: false })
      return
    }
    let cancelled = false
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (!cancelled) setState({ status: 'unauth', apps: [], err: null, signedIn: false })
        return
      }
      try {
        const r = await fetch('/api/applications/mine', {
          headers: { authorization: `Bearer ${session.access_token}` },
        })
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Failed to load')
        if (!cancelled) setState({ status: 'ready', apps: j.applications || [], err: null, signedIn: true })
      } catch (err) {
        if (!cancelled) setState({ status: 'error', apps: [], err: err.message, signedIn: true })
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = filter === 'all' ? state.apps : state.apps.filter(a => a.status === filter)
  const counts = state.apps.reduce((m, a) => { m[a.status] = (m[a.status] || 0) + 1; return m }, {})

  return (
    <>
      <Head>
        <title>My Applications — HireHub360</title>
        <meta name="description" content="Track all your job applications in one place. See status, interview invites, and offers from companies." />
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div style={{ minHeight:'100vh', background:'#f5f5f7', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui" }}>
        <header style={{ background:'#fff', borderBottom:'1px solid #e5e5e7', padding:'14px 20px', position:'sticky', top:0, zIndex:10 }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ fontSize:18, fontWeight:700, color:'#1d1d1f', textDecoration:'none' }}>
              HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10, color:'#ff6b00' }}>360</sup>
            </Link>
            <Link href="/" style={{ fontSize:14, color:'#0066cc', textDecoration:'none' }}>← Browse jobs</Link>
          </div>
        </header>

        <main style={{ maxWidth:1000, margin:'0 auto', padding:'24px 16px 80px' }}>
          <h1 style={{ fontSize:32, fontWeight:700, color:'#1d1d1f', marginBottom:6 }}>My Applications</h1>
          <p style={{ color:'#6e6e73', fontSize:15, marginBottom:24 }}>
            Track every job you've applied to and see live status updates from companies.
          </p>

          {state.status === 'loading' && (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'#6e6e73' }}>Loading your applications…</div>
          )}

          {state.status === 'unauth' && (
            <div style={{ background:'#fff', borderRadius:16, padding:'48px 24px', textAlign:'center', border:'1px solid #e5e5e7' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
              <h2 style={{ fontSize:22, fontWeight:600, color:'#1d1d1f', marginBottom:8 }}>Sign in to view applications</h2>
              <p style={{ color:'#6e6e73', marginBottom:24, maxWidth:420, margin:'0 auto 24px' }}>
                Your apply history, interview invites, and offers all live here once you sign in.
              </p>
              <Link href="/api/app" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'14px 32px', borderRadius:12, fontWeight:600, textDecoration:'none', fontSize:15 }}>
                Sign in / Create account
              </Link>
            </div>
          )}

          {state.status === 'error' && (
            <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12, padding:'16px 20px', color:'#991b1b' }}>
              Could not load applications: {state.err}
            </div>
          )}

          {state.status === 'ready' && state.apps.length === 0 && (
            <div style={{ background:'#fff', borderRadius:16, padding:'48px 24px', textAlign:'center', border:'1px solid #e5e5e7' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <h2 style={{ fontSize:22, fontWeight:600, color:'#1d1d1f', marginBottom:8 }}>No applications yet</h2>
              <p style={{ color:'#6e6e73', marginBottom:24 }}>Start applying to jobs and track them all here.</p>
              <Link href="/" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'14px 32px', borderRadius:12, fontWeight:600, textDecoration:'none', fontSize:15 }}>
                Browse jobs →
              </Link>
            </div>
          )}

          {state.status === 'ready' && state.apps.length > 0 && (
            <>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
                <FilterChip active={filter==='all'} onClick={()=>setFilter('all')} label={`All ${state.apps.length}`} />
                {Object.entries(STATUS_META).map(([k, m]) => counts[k] ? (
                  <FilterChip key={k} active={filter===k} onClick={()=>setFilter(k)} label={`${m.label} ${counts[k]}`} color={m.color} />
                ) : null)}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {filtered.map(a => {
                  const meta = STATUS_META[a.status] || STATUS_META.applied
                  return (
                    <div key={a.id} style={{ background:'#fff', borderRadius:14, padding:'16px 18px', border:'1px solid #e5e5e7' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:8 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <h3 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', marginBottom:4 }}>{a.job_title || 'Job'}</h3>
                          <p style={{ fontSize:14, color:'#6e6e73', margin:0 }}>{a.company || 'Company'}</p>
                        </div>
                        <span style={{ background:meta.bg, color:meta.color, padding:'4px 10px', borderRadius:8, fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>
                          {meta.label}
                        </span>
                      </div>
                      <div style={{ display:'flex', gap:14, fontSize:13, color:'#6e6e73', flexWrap:'wrap' }}>
                        <span>Applied {relTime(a.applied_at)}</span>
                        {a.fit_score ? <span>Fit score: <strong style={{ color:'#1d1d1f' }}>{a.fit_score}%</strong></span> : null}
                        {a.updated_at && a.updated_at !== a.applied_at ? <span>Updated {relTime(a.updated_at)}</span> : null}
                      </div>
                    </div>
                  )
                })}
              </div>

              <p style={{ textAlign:'center', color:'#6e6e73', fontSize:13, marginTop:32 }}>
                Showing {filtered.length} of {state.apps.length} applications · Last 200 are kept here.
              </p>
            </>
          )}
        </main>
      </div>
    </>
  )
}

function FilterChip({ active, onClick, label, color }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color || '#1d1d1f') : '#fff',
      color: active ? '#fff' : '#1d1d1f',
      border: '1px solid ' + (active ? (color || '#1d1d1f') : '#e5e5e7'),
      padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap',
    }}>{label}</button>
  )
}
