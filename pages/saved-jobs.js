import Head from 'next/head'
import Link from 'next/link'
import { useSavedJobs } from '../lib/savedJobs'

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function jobUrl(j) {
  if (j.slug) return `/jobs/${j.slug}`
  return `/jobs/${mkSlug(j.title)}-${mkSlug(j.company_name)}-${mkSlug(j.location)}`
}

function relTime(iso) {
  if (!iso) return ''
  const d = new Date(iso); if (isNaN(d)) return ''
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days < 1) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function SavedJobs() {
  const { items, hydrated, remove, clear, count } = useSavedJobs()

  return (
    <>
      <Head>
        <title>Saved Jobs — HireHub360</title>
        <meta name="description" content="Your bookmarked jobs on HireHub360. Apply later, track interesting roles, and never miss out." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://hirehub360.in/saved-jobs" />
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

        <main style={{ maxWidth:980, margin:'0 auto', padding:'24px 16px 80px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:30, fontWeight:700, color:'#1d1d1f', marginBottom:6 }}>
                ❤️ Saved Jobs {hydrated && count > 0 ? <span style={{ color:'#6e6e73', fontSize:18, fontWeight:400 }}>· {count}</span> : null}
              </h1>
              <p style={{ color:'#6e6e73', fontSize:14, margin:0 }}>
                Bookmarked from your browser. Stored locally — only on this device.
              </p>
            </div>
            {hydrated && count > 0 && (
              <button onClick={() => { if (confirm('Remove all saved jobs?')) clear() }}
                style={{ background:'#fff', color:'#dc2626', border:'1px solid #fca5a5', padding:'8px 14px', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer' }}>
                Clear all
              </button>
            )}
          </div>

          {!hydrated && (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'#6e6e73' }}>Loading…</div>
          )}

          {hydrated && count === 0 && (
            <div style={{ background:'#fff', borderRadius:16, padding:'48px 24px', textAlign:'center', border:'1px solid #e5e5e7' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📌</div>
              <h2 style={{ fontSize:22, fontWeight:600, color:'#1d1d1f', marginBottom:8 }}>No saved jobs yet</h2>
              <p style={{ color:'#6e6e73', marginBottom:24, maxWidth:420, margin:'0 auto 24px' }}>
                Tap the heart icon on any job to save it for later. Your saved list lives here.
              </p>
              <Link href="/" style={{ display:'inline-block', background:'#ff6b00', color:'#fff', padding:'14px 32px', borderRadius:12, fontWeight:600, textDecoration:'none', fontSize:15 }}>
                Browse jobs →
              </Link>
            </div>
          )}

          {hydrated && count > 0 && (
            <div style={{ display:'grid', gap:12 }}>
              {items.map(j => (
                <div key={j.id} style={{ background:'#fff', borderRadius:14, padding:'16px 18px', border:'1px solid #e5e5e7' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', gap:12, alignItems:'flex-start', marginBottom:8 }}>
                    <Link href={jobUrl(j)} style={{ flex:1, minWidth:0, textDecoration:'none', color:'inherit' }}>
                      <h3 style={{ fontSize:17, fontWeight:600, color:'#1d1d1f', margin:'0 0 4px' }}>{j.title}</h3>
                      <p style={{ fontSize:14, color:'#6e6e73', margin:0 }}>
                        {j.company_name} · {j.location}{j.job_type ? ` · ${j.job_type}` : ''}
                      </p>
                    </Link>
                    <button onClick={() => remove(j.id)} aria-label="Remove from saved"
                      style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#dc2626', lineHeight:1, padding:4 }}>
                      🗑️
                    </button>
                  </div>
                  {!j.salary_hidden && j.salary_label && (
                    <div style={{ color:'#ff6b00', fontWeight:600, fontSize:14, marginBottom:8 }}>{j.salary_label}</div>
                  )}
                  {j.skills && j.skills.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                      {j.skills.slice(0, 5).map((s, i) => (
                        <span key={i} style={{ background:'#f5f5f7', color:'#1d1d1f', padding:'3px 9px', borderRadius:6, fontSize:12 }}>{s}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:12, color:'#6e6e73' }}>Saved {relTime(j.saved_at)}</span>
                    <Link href={jobUrl(j)} style={{ background:'#ff6b00', color:'#fff', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                      Apply →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hydrated && count > 0 && (
            <p style={{ textAlign:'center', color:'#6e6e73', fontSize:12, marginTop:32 }}>
              Saved jobs are kept on this device only. Clearing browser data will remove them.
            </p>
          )}
        </main>
      </div>
    </>
  )
}
