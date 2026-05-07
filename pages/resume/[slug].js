import Head from 'next/head'
import { useState } from 'react'
import { supabaseService } from '../../lib/supabase'

function mkSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function slugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Demo candidate shown when no DB record found
const DEMO_CANDIDATE = {
  name: 'Priya Sharma',
  title: 'Senior Software Engineer',
  location: 'Bangalore, India',
  email: null,
  phone: null,
  about: 'Full-stack engineer with 6+ years building scalable products at high-growth startups. Passionate about clean architecture, developer experience, and shipping fast. Previously at Razorpay and Swiggy.',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'System Design', 'Python'],
  experience: [
    { role: 'Senior Software Engineer', company: 'Razorpay', period: '2022 – Present', location: 'Bangalore', desc: 'Led the Payment Links team. Scaled the system from 10K to 500K daily transactions. Reduced p99 latency by 60% through query optimization and caching layers.' },
    { role: 'Software Engineer', company: 'Swiggy', period: '2020 – 2022', location: 'Bangalore', desc: 'Built the real-time order tracking system used by 5M+ users daily. Owned the WebSocket infrastructure serving 100K concurrent connections.' },
    { role: 'Software Engineer', company: 'TechCorp India', period: '2018 – 2020', location: 'Pune', desc: 'Developed internal tooling and REST APIs for the logistics platform. Introduced CI/CD pipelines that cut deployment time by 40%.' },
  ],
  education: [
    { degree: 'B.Tech Computer Science', institution: 'IIT Bombay', year: '2018' },
  ],
  linkedin: null,
  github: null,
  open_to: 'Senior Engineer, Staff Engineer, Tech Lead',
  salary_expectation: '₹28–40 LPA',
  availability: 'Available in 30 days',
}

export default function ResumePage({ candidate, shareUrl }) {
  const [contactOpen, setContactOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const c = candidate
  const firstName = (c.name || 'Candidate').split(' ')[0]

  function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : shareUrl
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: `${c.name} — Resume on HireHub360`, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.name,
    jobTitle: c.title,
    description: c.about,
    address: { '@type': 'PostalAddress', addressLocality: c.location },
    knowsAbout: c.skills,
    url: shareUrl,
  }

  return (
    <>
      <Head>
        <title>{c.name} — {c.title} | Resume on HireHub360</title>
        <meta name="description" content={`${c.name} is a ${c.title} based in ${c.location}. ${c.about?.slice(0, 120)}…`} />
        <meta property="og:title" content={`${c.name} · ${c.title}`} />
        <meta property="og:description" content={c.about?.slice(0, 160)} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://hirehub360.in/favicon.svg" />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={shareUrl} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,.06)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .nav-r{display:flex;gap:10px;align-items:center}
        .nav-btn{padding:8px 18px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:opacity .15s}
        .nav-btn.ghost{background:#f5f5f7;color:#1d1d1f}
        .nav-btn.primary{background:#ff6b00;color:#fff}
        .nav-btn:hover{opacity:.85}
        /* Hero */
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 60%,#0f0f0f 100%);padding:48px 5vw 40px;color:#fff}
        .avatar{width:72px;height:72px;border-radius:20px;background:#ff6b00;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:#fff;flex-shrink:0;border:3px solid rgba(255,255,255,.15)}
        .hero-name{font-size:clamp(26px,5vw,40px);font-weight:900;letter-spacing:-.04em;margin-bottom:4px}
        .hero-title{font-size:18px;color:#ff6b00;font-weight:700;margin-bottom:8px}
        .hero-loc{font-size:14px;color:#888;margin-bottom:20px}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600;margin-right:6px;margin-bottom:6px}
        .badge.green{background:rgba(26,138,60,.2);color:#4ade80}
        .badge.blue{background:rgba(0,113,227,.2);color:#60a5fa}
        .badge.orange{background:rgba(255,107,0,.2);color:#ff6b00}
        .hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:11px 24px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;border:none;transition:opacity .15s;white-space:nowrap}
        .btn:hover{opacity:.88}
        .btn.primary{background:#ff6b00;color:#fff}
        .btn.ghost{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.2)}
        /* Body */
        .body{max-width:760px;margin:0 auto;padding:28px 16px 60px}
        .card{background:#fff;border-radius:16px;padding:24px 28px;margin-bottom:16px;border:1.5px solid #e5e5ea}
        .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6e6e73;margin-bottom:16px}
        /* Skills */
        .skills-wrap{display:flex;flex-wrap:wrap;gap:8px}
        .skill{padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;background:#f5f5f7;color:#3d3d3f;border:1.5px solid #e5e5ea}
        /* Experience */
        .exp-item{display:flex;gap:16px;margin-bottom:24px}
        .exp-item:last-child{margin-bottom:0}
        .exp-dot{width:10px;height:10px;border-radius:50%;background:#ff6b00;margin-top:6px;flex-shrink:0}
        .exp-line{width:1px;background:#e5e5ea;margin:16px 0 0 4.5px;flex-shrink:0}
        .exp-role{font-weight:800;font-size:16px;margin-bottom:2px}
        .exp-company{font-size:14px;color:#3d3d3f;font-weight:600;margin-bottom:2px}
        .exp-meta{font-size:12px;color:#6e6e73;margin-bottom:8px}
        .exp-desc{font-size:14px;color:#3d3d3f;line-height:1.7}
        /* Education */
        .edu-item{display:flex;gap:16px;align-items:flex-start}
        .edu-icon{width:40px;height:40px;border-radius:12px;background:#f5f5f7;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .edu-deg{font-weight:700;font-size:15px;margin-bottom:2px}
        .edu-inst{font-size:13px;color:#6e6e73}
        /* CTA Banner */
        .hire-banner{background:linear-gradient(135deg,#0f0f0f,#1a0800);border-radius:20px;padding:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:16px}
        .hire-banner h3{color:#fff;font-size:20px;font-weight:900;letter-spacing:-.03em;margin-bottom:4px}
        .hire-banner p{color:#888;font-size:13px}
        /* Contact modal */
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:flex-end;justify-content:center}
        .modal{background:#fff;border-radius:20px 20px 0 0;padding:28px 24px 44px;width:100%;max-width:480px;animation:slideUp .25s ease}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @media(max-width:640px){
          .card{padding:18px 16px}
          .hero{padding:36px 5vw 28px}
          .hire-banner{flex-direction:column;align-items:flex-start}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.75em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <div className="nav-r">
          <a href="/" className="nav-btn ghost hide-mob" style={{fontSize:13}}>Browse Jobs</a>
          <a href="/hirehub.html" className="nav-btn primary">Post a Job →</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <a href="/" style={{fontSize:12,color:'#666',marginBottom:16,display:'inline-block'}}>← Browse Jobs</a>
          <div style={{display:'flex',gap:20,alignItems:'flex-start',flexWrap:'wrap',marginBottom:8}}>
            <div className="avatar">{(c.name||'?').charAt(0).toUpperCase()}</div>
            <div style={{flex:1,minWidth:200}}>
              <h1 className="hero-name">{c.name}</h1>
              <div className="hero-title">{c.title}</div>
              <div className="hero-loc">📍 {c.location}</div>
              <div>
                {c.availability && <span className="badge green">✅ {c.availability}</span>}
                {c.open_to && <span className="badge blue">🎯 Open to: {c.open_to}</span>}
                {c.salary_expectation && <span className="badge orange">💰 {c.salary_expectation}</span>}
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => setContactOpen(true)}>
              📬 Hire {firstName}
            </button>
            <button className="btn ghost" onClick={handleShare}>
              {copied ? '✅ Copied!' : '📤 Share Profile'}
            </button>
            {c.linkedin && (
              <a href={c.linkedin} target="_blank" rel="noopener" className="btn ghost">LinkedIn →</a>
            )}
            {c.github && (
              <a href={c.github} target="_blank" rel="noopener" className="btn ghost">GitHub →</a>
            )}
          </div>
        </div>
      </div>

      <div className="body">

        {/* HIRE BANNER */}
        <div className="hire-banner">
          <div>
            <h3>Looking to hire {firstName}?</h3>
            <p>Post a job on HireHub360 and reach 10,000+ verified candidates like {firstName}.</p>
          </div>
          <button className="btn primary" onClick={() => setContactOpen(true)}>Contact Candidate →</button>
        </div>

        {/* ABOUT */}
        {c.about && (
          <div className="card">
            <div className="section-title">About</div>
            <p style={{fontSize:15,lineHeight:1.8,color:'#3d3d3f'}}>{c.about}</p>
          </div>
        )}

        {/* SKILLS */}
        {c.skills && c.skills.length > 0 && (
          <div className="card">
            <div className="section-title">Skills</div>
            <div className="skills-wrap">
              {c.skills.map((s, i) => <span key={i} className="skill">{s}</span>)}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {c.experience && c.experience.length > 0 && (
          <div className="card">
            <div className="section-title">Experience</div>
            {c.experience.map((exp, i) => (
              <div key={i} className="exp-item">
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div className="exp-dot" />
                  {i < c.experience.length - 1 && <div className="exp-line" style={{height:'100%',minHeight:40}} />}
                </div>
                <div style={{paddingBottom: i < c.experience.length - 1 ? 24 : 0}}>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">{exp.company}</div>
                  <div className="exp-meta">{exp.period}{exp.location ? ` · ${exp.location}` : ''}</div>
                  {exp.desc && <p className="exp-desc">{exp.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION */}
        {c.education && c.education.length > 0 && (
          <div className="card">
            <div className="section-title">Education</div>
            {c.education.map((edu, i) => (
              <div key={i} className="edu-item" style={{marginBottom: i < c.education.length - 1 ? 16 : 0}}>
                <div className="edu-icon">🎓</div>
                <div>
                  <div className="edu-deg">{edu.degree}</div>
                  <div className="edu-inst">{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER CREDIT */}
        <div style={{textAlign:'center',paddingTop:8}}>
          <a href="https://hirehub360.in" style={{fontSize:12,color:'#aaa'}}>
            Resume hosted on <strong style={{color:'#ff6b00'}}>HireHub360</strong> · India's AI Hiring Platform
          </a>
        </div>
      </div>

      {/* CONTACT MODAL */}
      {contactOpen && (
        <div className="modal-bg" onClick={() => setContactOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
              <div>
                <div style={{fontWeight:800,fontSize:18,letterSpacing:'-.03em',marginBottom:4}}>Contact {firstName}</div>
                <div style={{fontSize:13,color:'#6e6e73'}}>{c.title} · {c.location}</div>
              </div>
              <button onClick={() => setContactOpen(false)} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#aaa',marginTop:-4}}>×</button>
            </div>

            <div style={{background:'#f5f5f7',borderRadius:12,padding:'14px 16px',marginBottom:16}}>
              <div style={{fontSize:12,color:'#6e6e73',marginBottom:4}}>To reach candidates directly, sign in to your HireHub360 account.</div>
              <div style={{fontSize:13,fontWeight:600,color:'#1d1d1f'}}>Employers get unlimited candidate contact with any paid plan.</div>
            </div>

            <a href="/hirehub.html" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',padding:13,border:'1.5px solid #e5e5ea',borderRadius:12,background:'#fff',fontWeight:600,fontSize:15,textDecoration:'none',color:'#1d1d1f',marginBottom:10}}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </a>

            <div style={{display:'flex',gap:8}}>
              <a href="/hirehub.html" style={{flex:1,background:'#ff6b00',color:'#fff',padding:12,borderRadius:10,textAlign:'center',fontWeight:700,fontSize:15,textDecoration:'none'}}>
                Sign In
              </a>
              <a href="/hirehub.html" style={{flex:1,background:'#f5f5f7',color:'#1d1d1f',padding:12,borderRadius:10,textAlign:'center',fontWeight:700,fontSize:15,textDecoration:'none'}}>
                Create Account
              </a>
            </div>

            <p style={{fontSize:11,color:'#aaa',textAlign:'center',marginTop:14}}>
              By continuing you agree to our Terms &amp; Privacy Policy
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ params, query, req }) {
  const slug = params.slug
  const host = req.headers.host || 'hirehub360.in'
  const proto = host.includes('localhost') ? 'http' : 'https'
  const shareUrl = `${proto}://${host}/resume/${slug}`

  // Try Supabase for a real candidate profile
  let candidate = null
  try {
    const { data } = await supabaseService
      .from('candidates')
      .select('*')
      .eq('slug', slug)
      .single()
    if (data) {
      candidate = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : (data.skills ? String(data.skills).split(',').map(s => s.trim()) : []),
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],
      }
    }
  } catch (e) { console.error('resume page DB error:', e) }

  // Fall back: build from URL query params (name passed in via ?n=)
  if (!candidate) {
    const name = query.n ? decodeURIComponent(query.n) : slugToName(slug)
    const title = query.t ? decodeURIComponent(query.t) : DEMO_CANDIDATE.title
    const location = query.loc ? decodeURIComponent(query.loc) : DEMO_CANDIDATE.location
    const skills = query.skills ? decodeURIComponent(query.skills).split(',').map(s => s.trim()) : DEMO_CANDIDATE.skills
    // If the name wasn't in the URL and there's no DB record, show demo content
    const isDemo = !query.n
    candidate = isDemo ? { ...DEMO_CANDIDATE } : {
      ...DEMO_CANDIDATE,
      name,
      title,
      location,
      skills,
      about: query.about ? decodeURIComponent(query.about) : DEMO_CANDIDATE.about,
      availability: query.avail ? decodeURIComponent(query.avail) : DEMO_CANDIDATE.availability,
      salary_expectation: query.sal ? decodeURIComponent(query.sal) : DEMO_CANDIDATE.salary_expectation,
      open_to: query.open_to ? decodeURIComponent(query.open_to) : DEMO_CANDIDATE.open_to,
      linkedin: query.li ? decodeURIComponent(query.li) : null,
      github: query.gh ? decodeURIComponent(query.gh) : null,
    }
  }

  return { props: { candidate, shareUrl } }
}
