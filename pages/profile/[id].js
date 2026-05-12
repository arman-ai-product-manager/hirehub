// /profile/[id] — candidate public profile by UUID
// Looks up candidates table by id (UUID), falls back to auth user metadata
import Head from 'next/head'
import { useState } from 'react'
const { supabaseService } = require('../../lib/supabase')

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ProfilePage({ candidate, shareUrl }) {
  const [contactOpen, setContactOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const c = candidate

  function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : shareUrl
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: `${c.name} — Profile on HireHub360`, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
  }

  const schema = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: c.name, jobTitle: c.title,
    description: c.about,
    address: { '@type': 'PostalAddress', addressLocality: c.location },
    knowsAbout: c.skills,
    url: shareUrl,
  }

  const initials = (c.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <>
      <Head>
        <title>{c.name} — {c.title} | HireHub360</title>
        <meta name="description" content={`${c.name} is a ${c.title} based in ${c.location}. ${(c.about || '').slice(0, 140)}`} />
        <meta property="og:title" content={`${c.name} · ${c.title}`} />
        <meta property="og:description" content={(c.about || '').slice(0, 160)} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={shareUrl} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={shareUrl} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:rgba(255,255,255,.97);backdrop-filter:blur(12px);border-bottom:1px solid #e5e5ea;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .wrap{max-width:780px;margin:0 auto;padding:32px 5vw 80px}
        .card{background:#fff;border-radius:20px;border:1.5px solid #e5e5ea;overflow:hidden;margin-bottom:16px}
        .hero-card{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 100%);padding:32px;color:#fff}
        .avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#ff6b00,#ff9a3c);color:#fff;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:16px;flex-shrink:0;border:3px solid rgba(255,255,255,.15)}
        .name{font-size:clamp(22px,4vw,32px);font-weight:900;letter-spacing:-.04em;margin-bottom:4px}
        .title{font-size:16px;color:#ff9a3c;font-weight:600;margin-bottom:10px}
        .meta-row{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:#aaa}
        .meta-item{display:flex;align-items:center;gap:5px}
        .badge-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
        .badge{padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700}
        .badge-green{background:rgba(34,197,94,.15);color:#4ade80;border:1px solid rgba(34,197,94,.25)}
        .badge-orange{background:rgba(255,107,0,.15);color:#ff9a3c;border:1px solid rgba(255,107,0,.25)}
        .badge-blue{background:rgba(59,130,246,.15);color:#93c5fd;border:1px solid rgba(59,130,246,.25)}
        .action-row{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}
        .btn-primary{background:#ff6b00;color:#fff;border:none;border-radius:10px;padding:11px 22px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:opacity .15s}
        .btn-primary:hover{opacity:.88}
        .btn-sec{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:11px 18px;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit;transition:all .15s}
        .btn-sec:hover{background:rgba(255,255,255,.18)}
        .section-card{padding:24px}
        .section-title{font-size:12px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px}
        .skills{display:flex;flex-wrap:wrap;gap:8px}
        .skill{padding:6px 14px;background:#f5f5f7;border-radius:8px;font-size:13px;font-weight:600;color:#3d3d3f}
        .exp-item{padding:16px 0;border-bottom:1px solid #f5f5f7}
        .exp-item:last-child{border-bottom:none;padding-bottom:0}
        .exp-role{font-weight:800;font-size:15px;margin-bottom:2px}
        .exp-co{font-size:13px;color:#ff6b00;font-weight:600;margin-bottom:4px}
        .exp-period{font-size:12px;color:#aaa;margin-bottom:8px}
        .exp-desc{font-size:13px;color:#555;line-height:1.65}
        .edu-item{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #f5f5f7}
        .edu-item:last-child{border-bottom:none;padding-bottom:0}
        .edu-icon{width:38px;height:38px;background:#f0f9ff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .edu-degree{font-weight:700;font-size:14px}
        .edu-inst{font-size:13px;color:#6e6e73;margin-top:2px}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:flex-end;justify-content:center}
        .modal{background:#fff;border-radius:20px 20px 0 0;padding:28px 24px 44px;width:100%;max-width:480px;animation:slideUp .25s ease}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @media(max-width:480px){.action-row{flex-direction:column}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <a href="/hirehub.html" style={{fontSize:13,fontWeight:600,color:'#3d3d3f',padding:'7px 14px',border:'1px solid #e5e5ea',borderRadius:8}}>Sign In</a>
      </nav>

      <div className="wrap">
        {/* Hero */}
        <div className="card">
          <div className="hero-card">
            <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
              <div className="avatar">{initials}</div>
              <div style={{flex:1,minWidth:200}}>
                <div className="name">{c.name}</div>
                <div className="title">{c.title}</div>
                <div className="meta-row">
                  {c.location && <span className="meta-item">📍 {c.location}</span>}
                  {c.availability && <span className="meta-item">🕐 {c.availability}</span>}
                  {c.salary_expectation && <span className="meta-item">💰 {c.salary_expectation}</span>}
                </div>
                <div className="badge-row">
                  {c.availability && <span className="badge badge-green">{c.availability}</span>}
                  {c.salary_expectation && <span className="badge badge-orange">{c.salary_expectation}</span>}
                  {c.open_to && <span className="badge badge-blue">Open to: {c.open_to.split(',')[0]}</span>}
                </div>
              </div>
            </div>

            {c.about && (
              <p style={{fontSize:14,color:'#ccc',lineHeight:1.7,marginTop:18,maxWidth:580}}>{c.about}</p>
            )}

            <div className="action-row">
              <button className="btn-primary" onClick={() => setContactOpen(true)}>Hire {c.name.split(' ')[0]} →</button>
              <button className="btn-sec" onClick={handleShare}>{copied ? '✅ Copied!' : '🔗 Share Profile'}</button>
              {c.linkedin && (
                <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="btn-sec">LinkedIn ↗</a>
              )}
              {c.github && (
                <a href={c.github} target="_blank" rel="noopener noreferrer" className="btn-sec">GitHub ↗</a>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {c.skills?.length > 0 && (
          <div className="card">
            <div className="section-card">
              <div className="section-title">Skills</div>
              <div className="skills">
                {c.skills.map(s => <span key={s} className="skill">{s}</span>)}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {c.experience?.length > 0 && (
          <div className="card">
            <div className="section-card">
              <div className="section-title">Experience</div>
              {c.experience.map((e, i) => (
                <div key={i} className="exp-item">
                  <div className="exp-role">{e.role || e.title}</div>
                  <div className="exp-co">{e.company} {e.location ? `· ${e.location}` : ''}</div>
                  <div className="exp-period">{e.period || e.duration || ''}</div>
                  {e.desc && <div className="exp-desc">{e.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {c.education?.length > 0 && (
          <div className="card">
            <div className="section-card">
              <div className="section-title">Education</div>
              {c.education.map((e, i) => (
                <div key={i} className="edu-item">
                  <div className="edu-icon">🎓</div>
                  <div>
                    <div className="edu-degree">{e.degree}</div>
                    <div className="edu-inst">{e.institution} {e.year ? `· ${e.year}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div style={{textAlign:'center',padding:'24px 0',color:'#888',fontSize:13}}>
          Profile powered by <a href="/" style={{color:'#ff6b00',fontWeight:700}}>HireHub360</a> ·
          <a href="/hirehub.html" style={{color:'#ff6b00',fontWeight:700,marginLeft:6}}>Create your free profile →</a>
        </div>
      </div>

      {/* Contact modal */}
      {contactOpen && (
        <div className="modal-bg" onClick={() => setContactOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontWeight:800,fontSize:18}}>Contact {c.name.split(' ')[0]}</div>
              <button onClick={() => setContactOpen(false)} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#aaa'}}>×</button>
            </div>
            <div style={{background:'#f5f5f7',borderRadius:12,padding:'14px 16px',marginBottom:16}}>
              <div style={{fontSize:12,color:'#6e6e73',marginBottom:4}}>Sign in to your HireHub360 account to contact candidates.</div>
              <div style={{fontSize:13,fontWeight:600}}>Get unlimited candidate contacts with any paid plan.</div>
            </div>
            <a href="/hirehub.html" style={{display:'block',background:'#ff6b00',color:'#fff',padding:13,borderRadius:12,textAlign:'center',fontWeight:700,fontSize:15,textDecoration:'none',marginBottom:8}}>
              Sign In / Create Account →
            </a>
            <a href="/pricing" style={{display:'block',background:'#f5f5f7',color:'#1d1d1f',padding:12,borderRadius:12,textAlign:'center',fontWeight:600,fontSize:14,textDecoration:'none'}}>
              View Hiring Plans
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ params, req }) {
  const id = params.id || ''

  // Only accept valid UUIDs
  if (!UUID_RE.test(id)) return { notFound: true }

  const host = req.headers.host || 'hirehub360.in'
  const proto = host.includes('localhost') ? 'http' : 'https'
  const shareUrl = `${proto}://${host}/profile/${id}`

  let candidate = null

  // 1. Try candidates table by id (UUID primary key)
  try {
    const { data } = await supabaseService
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()
    if (data) {
      candidate = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : (data.skills ? String(data.skills).split(',').map(s => s.trim()) : []),
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],
      }
    }
  } catch (e) { /* no record */ }

  // 2. Try by user_id (auth UUID stored on candidate row)
  if (!candidate) {
    try {
      const { data } = await supabaseService
        .from('candidates')
        .select('*')
        .eq('user_id', id)
        .single()
      if (data) {
        candidate = {
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : (data.skills ? String(data.skills).split(',').map(s => s.trim()) : []),
          experience: Array.isArray(data.experience) ? data.experience : [],
          education: Array.isArray(data.education) ? data.education : [],
        }
      }
    } catch (e) { /* no record */ }
  }

  // 3. Try auth users table (get name/email from auth metadata)
  if (!candidate) {
    try {
      const { data: authData } = await supabaseService.auth.admin.getUserById(id)
      if (authData?.user) {
        const u = authData.user
        const meta = u.user_metadata || {}
        candidate = {
          id,
          name: meta.full_name || meta.name || u.email?.split('@')[0] || 'HireHub360 User',
          title: meta.title || meta.job_title || 'Professional',
          location: meta.location || 'India',
          about: meta.about || meta.bio || '',
          skills: meta.skills ? (Array.isArray(meta.skills) ? meta.skills : String(meta.skills).split(',').map(s => s.trim())) : [],
          experience: meta.experience || [],
          education: meta.education || [],
          linkedin: meta.linkedin_url || null,
          github: meta.github_url || null,
          availability: meta.availability || null,
          salary_expectation: meta.salary_expectation || null,
          open_to: meta.open_to || null,
        }
      }
    } catch (e) { /* auth lookup failed */ }
  }

  if (!candidate) return { notFound: true }

  return { props: { candidate, shareUrl } }
}
