import Head from 'next/head'
import { useState } from 'react'

const FEATURES = [
  {
    id: 'work-credit-score',
    icon: '⭐',
    badge: 'WORK CREDIT SCORE',
    name: 'HireHub Score',
    tagline: 'India\'s First Work Reputation System',
    color: '#ff6b00',
    desc: 'Every worker gets a verified HireHub Score — built from attendance, ratings, punctuality, and skill tests. Like CIBIL but for your career. Your score travels with you everywhere, unlocking higher pay and premium jobs automatically.',
    bullets: [
      'Score built from attendance, ratings, punctuality & skill tests',
      'High score = higher pay + premium jobs unlocked',
      'Portable work passport — follows you across every employer',
      'Real-time score updates after every job',
    ],
    label: 'First work reputation system in India',
  },
  {
    id: 'ai-salary-negotiator',
    icon: '🤖',
    badge: 'AI SALARY NEGOTIATOR',
    name: 'AI Salary Agent',
    tagline: 'A Personal HR Agent for Every Worker',
    color: '#6366f1',
    desc: 'You set your desired salary. Our AI negotiates with the company on your behalf — analysing market data, your score, and the company\'s budget in real time. No worker has ever had this power. Until now.',
    bullets: [
      'Worker sets desired salary — AI handles the rest',
      'Real-time negotiation with live market benchmarks',
      'Knows when to push and when to accept',
      'Full negotiation transcript shared with worker',
    ],
    label: 'Like having a personal HR for every Indian worker',
  },
  {
    id: 'live-work-streaming',
    icon: '📡',
    badge: 'LIVE WORK STREAMING',
    name: 'LiveWork',
    tagline: 'Twitch Meets Upwork',
    color: '#9333ea',
    desc: 'Freelancers go LIVE while they work. Clients watch in real time — designer designing, coder coding. Pay-per-hour billing ticks like a taxi meter. Complete transparency. Zero trust issues. Completely new concept.',
    bullets: [
      'Freelancers stream their work session live',
      'Client watches in real time — zero doubt about progress',
      'Live billing meter — pay only for active working time',
      'Screen share + webcam + time tracker in one',
    ],
    label: 'Twitch meets Upwork — a brand new category',
  },
  {
    id: 'job-nft',
    icon: '🔗',
    badge: 'JOB NFT / WORK CERTIFICATE',
    name: 'VerifiedWork',
    tagline: 'World\'s First Unfakeable Work History',
    color: '#0891b2',
    desc: 'Every completed project earns a blockchain-verified work certificate. Cannot be faked, altered, or deleted — ever. Employers scan a QR code and instantly verify your entire work history. Resume fraud ends here.',
    bullets: [
      'Every project = blockchain-verified certificate issued automatically',
      'Employers scan QR code for instant verification',
      'Cannot be faked, edited, or removed — permanent record',
      'Shareable link works on LinkedIn, WhatsApp, email',
    ],
    label: 'Resume fraud is a ₹10,000 Cr problem. This ends it.',
  },
  {
    id: 'reverse-hiring',
    icon: '🔄',
    badge: 'REVERSE HIRING',
    name: 'WorkerFirst',
    tagline: 'Companies Apply to Workers — Not the Other Way',
    color: '#059669',
    desc: 'Workers post their availability, skills, and rate. Companies browse and apply to them. Premium workers get 5+ company applications daily. The entire power dynamic of hiring — flipped completely.',
    bullets: [
      'Worker posts availability once — companies come to them',
      'Set your rate, location, and availability window',
      'Premium workers get 5+ company applications daily',
      'Block unwanted companies — full control stays with worker',
    ],
    label: 'Completely opposite of every job platform on earth',
  },
  {
    id: '1-hour-hire',
    icon: '⚡',
    badge: '1 HOUR HIRE',
    name: 'InstantHire',
    tagline: 'Swiggy Model for Human Talent',
    color: '#dc2626',
    desc: 'Client posts an emergency requirement. The platform alerts nearby available workers instantly. Worker confirmed and on-site within 1 hour. Construction emergency, last-minute event staff, urgent warehouse need — solved in 60 minutes.',
    bullets: [
      'Post requirement → nearby workers alerted in seconds',
      'GPS-matched — closest available workers get priority',
      'Worker confirmed + on-site within 60 minutes',
      'Covers construction, events, warehouses, hospitality',
    ],
    label: 'Zomato delivery speed — for hiring people',
  },
  {
    id: 'dark-apply',
    icon: '🕶️',
    badge: 'DARK APPLY',
    name: 'BlindHire',
    tagline: 'World\'s First Truly Blind Hiring Platform',
    color: '#1d1d1f',
    desc: 'Worker applies anonymously. Company sees only: Skills, HireHub Score, Experience. Zero name, zero photo, zero age, zero gender. Company likes the profile → identity is revealed. Every MNC will pay a premium for this — zero bias, pure merit.',
    bullets: [
      'Apply with skills + score only — name/photo hidden',
      'Company shortlists on pure merit, zero bias',
      'Identity revealed only after company expresses interest',
      'Legally compliant blind hiring for enterprise MNCs',
    ],
    label: 'Zero bias hiring — every MNC\'s compliance dream',
  },
]

export default function FeaturesPage() {
  const [waitlist, setWaitlist] = useState({})
  const [email, setEmail] = useState('')
  const [activeFeature, setActiveFeature] = useState(null)

  function joinWaitlist(featureId) {
    setWaitlist(w => ({ ...w, [featureId]: true }))
  }

  return (
    <>
      <Head>
        <title>HireHub360 Features — India's Most Innovative Hiring Platform</title>
        <meta name="description" content="HireHub Score, AI Salary Negotiator, Live Work Streaming, Blockchain Work Certificates, Reverse Hiring, 1-Hour Hire, Dark Apply — 7 world-first hiring innovations built for India." />
        <meta property="og:title" content="HireHub360 — 7 Features No Job Platform Has Built Yet" />
        <meta property="og:description" content="Work Credit Score. AI Salary Negotiator. Blind Hiring. Live Work Streaming. Blockchain certificates. All in one platform." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/features" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0a0a0a;color:#fff}
        a{text-decoration:none;color:inherit}
        /* NAV */
        .nav{background:rgba(10,10,10,.92);border-bottom:1px solid #1f1f1f;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .nav-r{display:flex;gap:10px;align-items:center}
        .nav-btn{padding:8px 18px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:opacity .15s;text-decoration:none;display:inline-block}
        .nav-btn:hover{opacity:.85}
        .nav-btn.ghost{background:rgba(255,255,255,.1);color:#fff}
        .nav-btn.primary{background:#ff6b00;color:#fff}
        /* HERO */
        .hero{padding:80px 5vw 60px;text-align:center;background:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(255,107,0,.15),transparent)}
        .hero-eyebrow{display:inline-block;background:rgba(255,107,0,.15);color:#ff6b00;padding:6px 16px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:24px;border:1px solid rgba(255,107,0,.3)}
        .hero h1{font-size:clamp(32px,6vw,68px);font-weight:900;letter-spacing:-.05em;line-height:1.05;margin-bottom:20px}
        .hero h1 span{color:#ff6b00}
        .hero-sub{font-size:18px;color:#888;max-width:560px;margin:0 auto 36px;line-height:1.7}
        .hero-stats{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin-top:40px;padding-top:40px;border-top:1px solid #1f1f1f}
        .hstat .n{font-size:28px;font-weight:900;color:#ff6b00;display:block;letter-spacing:-.04em}
        .hstat .l{font-size:12px;color:#555;margin-top:3px}
        /* FEATURE GRID */
        .features{padding:40px 5vw 80px}
        .feat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;max-width:1200px;margin:0 auto}
        .feat-card{background:#111;border:1px solid #1f1f1f;border-radius:20px;padding:28px;transition:all .25s;position:relative;overflow:hidden}
        .feat-card::before{content:'';position:absolute;inset:0;border-radius:20px;opacity:0;transition:opacity .3s;pointer-events:none}
        .feat-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.12)}
        .feat-card:hover::before{opacity:1}
        .feat-badge{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px;display:inline-block;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,.06);color:#666}
        .feat-icon{font-size:38px;margin-bottom:14px;display:block}
        .feat-name{font-size:22px;font-weight:900;letter-spacing:-.04em;margin-bottom:4px}
        .feat-tagline{font-size:13px;font-weight:600;margin-bottom:14px;opacity:.7}
        .feat-desc{font-size:14px;color:#888;line-height:1.75;margin-bottom:20px}
        .feat-bullets{list-style:none;margin-bottom:20px}
        .feat-bullets li{font-size:13px;color:#666;padding:5px 0;display:flex;gap:8px;align-items:flex-start}
        .feat-bullets li::before{content:'→';color:#ff6b00;flex-shrink:0;margin-top:1px}
        .feat-label{font-size:11px;font-style:italic;color:#444;border-top:1px solid #1f1f1f;padding-top:14px;margin-bottom:16px}
        .waitlist-btn{width:100%;padding:11px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .2s}
        .waitlist-btn.joined{background:rgba(26,138,60,.15);color:#4ade80;border:1px solid rgba(26,138,60,.3);cursor:default}
        /* CTA BANNER */
        .cta{background:linear-gradient(135deg,#111 0%,#1a0800 100%);border:1px solid #2a1000;border-radius:24px;padding:56px 40px;text-align:center;max-width:800px;margin:0 auto 80px}
        .cta h2{font-size:clamp(26px,4vw,42px);font-weight:900;letter-spacing:-.05em;margin-bottom:12px}
        .cta p{color:#888;font-size:16px;margin-bottom:32px;line-height:1.6}
        .cta-form{display:flex;gap:8px;max-width:440px;margin:0 auto;flex-wrap:wrap}
        .cta-form input{flex:1;min-width:200px;padding:13px 16px;border-radius:10px;border:1px solid #2a2a2a;background:#1a1a1a;color:#fff;font-size:15px;outline:none}
        .cta-form input:focus{border-color:#ff6b00}
        .cta-form input::placeholder{color:#555}
        .cta-form button{background:#ff6b00;color:#fff;border:none;border-radius:10px;padding:13px 24px;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;transition:opacity .15s}
        .cta-form button:hover{opacity:.9}
        /* FOOTER */
        footer{border-top:1px solid #1a1a1a;padding:32px 5vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
        footer a{color:#555;font-size:13px;transition:color .15s}
        footer a:hover{color:#ff6b00}
        @media(max-width:640px){
          .feat-grid{grid-template-columns:1fr}
          .hero{padding:56px 5vw 40px}
          .cta{padding:36px 24px}
          .cta-form{flex-direction:column}
          .hero-stats{gap:24px}
          .hide-mob{display:none}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.75em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <div className="nav-r">
          <a href="/" className="nav-btn ghost hide-mob">Browse Jobs</a>
          <a href="/pricing" className="nav-btn ghost hide-mob">Pricing</a>
          <a href="/hirehub.html" className="nav-btn primary">Post a Job →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">🚀 7 World-First Features</div>
        <h1>The Future of<br /><span>Work in India</span></h1>
        <p className="hero-sub">
          We didn't copy LinkedIn. We didn't copy Naukri. We built what no one has built yet — for India's 500 million workers.
        </p>
        <a href="/hirehub.html" className="nav-btn primary" style={{fontSize:15,padding:'13px 32px'}}>
          Join the Waitlist →
        </a>
        <div className="hero-stats">
          <div className="hstat"><span className="n">7</span><span className="l">World-First Features</span></div>
          <div className="hstat"><span className="n">500M+</span><span className="l">Indian Workers</span></div>
          <div className="hstat"><span className="n">₹0</span><span className="l">Bias in Hiring</span></div>
          <div className="hstat"><span className="n">1 hr</span><span className="l">Fastest Hire Ever</span></div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="features">
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div key={f.id} className="feat-card" style={{'--card-color': f.color}}>
              <span className="feat-badge">{f.badge}</span>
              <span className="feat-icon">{f.icon}</span>
              <div className="feat-name" style={{color: f.color === '#1d1d1f' ? '#fff' : f.color}}>{f.name}</div>
              <div className="feat-tagline">{f.tagline}</div>
              <p className="feat-desc">{f.desc}</p>
              <ul className="feat-bullets">
                {f.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <div className="feat-label">💡 {f.label}</div>
              {waitlist[f.id] ? (
                <button className="waitlist-btn joined">✅ You're on the waitlist!</button>
              ) : (
                <button
                  className="waitlist-btn"
                  style={{background: f.color === '#1d1d1f' ? '#ff6b00' : f.color, color:'#fff'}}
                  onClick={() => joinWaitlist(f.id)}
                >
                  Join Waitlist →
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div style={{padding:'0 5vw 80px'}}>
        <div className="cta">
          <div style={{background:'rgba(255,107,0,.15)',color:'#ff6b00',padding:'5px 14px',borderRadius:999,fontSize:11,fontWeight:700,display:'inline-block',marginBottom:20,textTransform:'uppercase',letterSpacing:'.06em'}}>
            Be First. Not Last.
          </div>
          <h2>Get Early Access to<br /><span style={{color:'#ff6b00'}}>All 7 Features</span></h2>
          <p>Join thousands of workers and companies already on the waitlist. Early users get free premium access for 6 months.</p>
          <div className="cta-form">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button onClick={() => { if(email) { setEmail(''); alert('You\'re on the list! We\'ll reach out soon.') } }}>
              Get Early Access
            </button>
          </div>
          <p style={{fontSize:12,color:'#444',marginTop:16}}>No spam. Early access only. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <a href="/" style={{fontWeight:900,fontSize:18,color:'#fff',letterSpacing:'-.04em'}}>
          Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span>
        </a>
        <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
          <a href="/">Find Jobs</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="/hirehub.html">Sign In</a>
        </div>
        <span style={{fontSize:12,color:'#333'}}>© 2026 HireHub360 · India's Future of Work</span>
      </footer>
    </>
  )
}
