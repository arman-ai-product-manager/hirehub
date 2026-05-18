import Head from 'next/head'
import Link from 'next/link'

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>AI Resume Screener — HireHub360 | Screen 500 CVs in 10 Minutes</title>
        <meta name="description" content="HireHub360 AI Resume Screener: upload resumes, paste job description, get AI-ranked shortlist in minutes. Plans from ₹1,499/month. Used by 500+ Indian companies." />
        <meta property="og:title" content="AI Resume Screener — HireHub360 | India's Fastest Hiring Tool" />
        <meta property="og:description" content="Screen 500 resumes in 10 minutes. AI scores every candidate 0-100 by fit. Plans from ₹1,499/month." />
        <meta property="og:url" content="https://hirehub360.in/features" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=AI+Resume+Screener&s=Screen+500+CVs+in+10+minutes+%C2%B7+Plans+from+%E2%82%B91%2C499%2Fmonth" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/features" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0a0a0a;color:#fff}
        a{text-decoration:none;color:inherit}
        .nav{background:rgba(10,10,10,.92);border-bottom:1px solid #1f1f1f;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .nav-r{display:flex;gap:10px;align-items:center}
        .nav-btn{padding:8px 18px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:opacity .15s;text-decoration:none;display:inline-block}
        .nav-btn:hover{opacity:.85}
        .nav-btn.ghost{background:rgba(255,255,255,.1);color:#fff}
        .nav-btn.primary{background:#ff6b00;color:#fff}
        @media(max-width:640px){.hide-mob{display:none}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><span style={{color:'#ff6b00',fontSize:'0.75em',fontWeight:900,verticalAlign:'super',marginLeft:1}}>360</span></a>
        <div className="nav-r">
          <a href="/" className="nav-btn ghost hide-mob">Browse Jobs</a>
          <a href="/pricing" className="nav-btn ghost hide-mob">Pricing</a>
          <a href="/screener" className="nav-btn primary">Try AI Screener →</a>
        </div>
      </nav>

      {/* Redirect visitors straight to the screener page */}
      <div style={{padding:'80px 5vw',textAlign:'center',background:'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(255,107,0,.15),transparent)'}}>
        <div style={{display:'inline-block',background:'rgba(255,107,0,.15)',color:'#ff6b00',padding:'6px 16px',borderRadius:999,fontSize:12,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24,border:'1px solid rgba(255,107,0,.3)'}}>
          🤖 Live Now
        </div>
        <h1 style={{fontSize:'clamp(32px,6vw,64px)',fontWeight:900,letterSpacing:'-.05em',lineHeight:1.05,marginBottom:20}}>
          AI Resume Screener<br /><span style={{color:'#ff6b00'}}>for Indian Companies</span>
        </h1>
        <p style={{fontSize:18,color:'#888',maxWidth:560,margin:'0 auto 36px',lineHeight:1.7}}>
          Stop spending days sorting CVs manually. Paste your JD, upload resumes, get a ranked shortlist in minutes.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:48}}>
          <a href="/screener" style={{display:'inline-block',background:'#ff6b00',color:'#fff',padding:'14px 32px',borderRadius:999,fontWeight:700,fontSize:16,textDecoration:'none'}}>Start Free Trial →</a>
          <a href="/screener#pricing" style={{display:'inline-block',background:'rgba(255,255,255,.08)',color:'#fff',padding:'14px 24px',borderRadius:999,fontWeight:600,fontSize:15,border:'1px solid rgba(255,255,255,.15)'}}>See Pricing</a>
        </div>

        {/* Feature grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,maxWidth:1100,margin:'0 auto',textAlign:'left'}}>
          {[
            {icon:'⚡',name:'10-Minute Screening',desc:'Upload 500 resumes and get a fully ranked shortlist before your next meeting. No waiting, no manual reading.'},
            {icon:'🎯',name:'AI Fit Score 0–100',desc:'Every candidate gets a score based on your specific job description — skills match, experience relevance, achievement quality.'},
            {icon:'📄',name:'Any Resume Format',desc:'PDF, Word, scanned docs — AI parses every format. Indian resume styles, mixed languages, all handled correctly.'},
            {icon:'📊',name:'Weekly Analytics',desc:'See how many resumes you screened, shortlist rates, and weekly trends right on your dashboard.'},
            {icon:'📧',name:'Email Notifications',desc:'Get notified when screening completes. Share results with your hiring team instantly.'},
            {icon:'👥',name:'Team Collaboration',desc:'Invite teammates to your account. Everyone sees the same ranked list. No more "which version is latest?"'},
            {icon:'🔒',name:'Data Privacy',desc:'Your candidate data stays private and secure. GDPR-aligned. Delete any data at any time.'},
            {icon:'💳',name:'No Setup Cost',desc:'Sign up, create a job, upload resumes. Done. No IT, no integration, no long onboarding. 5 minutes to first result.'},
          ].map(f => (
            <div key={f.name} style={{background:'#111',border:'1px solid #1f1f1f',borderRadius:18,padding:'24px',transition:'border-color .2s',cursor:'default'}}
              onMouseOver={e => e.currentTarget.style.borderColor='rgba(255,107,0,.4)'}
              onMouseOut={e => e.currentTarget.style.borderColor='#1f1f1f'}>
              <div style={{fontSize:32,marginBottom:12}}>{f.icon}</div>
              <div style={{fontSize:17,fontWeight:800,color:'#fff',marginBottom:8,letterSpacing:'-.02em'}}>{f.name}</div>
              <p style={{fontSize:14,color:'#777',lineHeight:1.7}}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{maxWidth:800,margin:'80px auto 0',textAlign:'center'}}>
          <div style={{background:'rgba(255,107,0,.15)',color:'#ff6b00',padding:'5px 14px',borderRadius:999,fontSize:11,fontWeight:700,display:'inline-block',marginBottom:20,textTransform:'uppercase',letterSpacing:'.06em'}}>
            How It Works
          </div>
          <h2 style={{fontSize:'clamp(24px,4vw,38px)',fontWeight:900,letterSpacing:'-.04em',marginBottom:40}}>
            3 Steps to Your Shortlist
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24,textAlign:'left'}}>
            {[
              {step:'1',title:'Create a Job',desc:'Paste your job description. AI automatically identifies required skills and sets scoring criteria.'},
              {step:'2',title:'Upload Resumes',desc:'Drag-drop PDF or Word files — single or bulk. AI parses every format instantly.'},
              {step:'3',title:'Get Ranked List',desc:'AI scores each resume 0–100. Shortlist appears ranked. Call the top candidates.'},
            ].map(s => (
              <div key={s.step} style={{background:'#111',borderRadius:16,padding:'24px',border:'1px solid #1f1f1f'}}>
                <div style={{width:36,height:36,borderRadius:999,background:'#ff6b00',color:'#fff',fontWeight:900,fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>{s.step}</div>
                <div style={{fontWeight:700,fontSize:16,color:'#fff',marginBottom:8}}>{s.title}</div>
                <p style={{fontSize:14,color:'#666',lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{background:'linear-gradient(135deg,#111 0%,#1a0800 100%)',border:'1px solid #2a1000',borderRadius:24,padding:'52px 40px',maxWidth:680,margin:'80px auto 0',textAlign:'center'}}>
          <h2 style={{fontSize:'clamp(24px,4vw,38px)',fontWeight:900,letterSpacing:'-.05em',marginBottom:12}}>
            Ready to Hire <span style={{color:'#ff6b00'}}>10× Faster?</span>
          </h2>
          <p style={{color:'#888',fontSize:16,marginBottom:32,lineHeight:1.6}}>Join 500+ Indian companies already using HireHub360 AI Screener. Plans from ₹1,499/month.</p>
          <a href="/screener" style={{display:'inline-block',background:'#ff6b00',color:'#fff',padding:'14px 36px',borderRadius:999,fontWeight:700,fontSize:16,textDecoration:'none'}}>
            Start Free Trial →
          </a>
          <p style={{fontSize:12,color:'#444',marginTop:16}}>No credit card required · 5-minute setup · Cancel anytime</p>
        </div>
      </div>

      <footer style={{borderTop:'1px solid #1a1a1a',padding:'32px 5vw',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <Link href="/" style={{fontWeight:900,fontSize:18,color:'#fff',letterSpacing:'-.04em'}}>
          Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span>
        </Link>
        <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
          <Link href="/" style={{color:'#555',fontSize:13}}>Find Jobs</Link>
          <Link href="/screener" style={{color:'#ff6b00',fontSize:13,fontWeight:600}}>AI Screener</Link>
          <Link href="/pricing" style={{color:'#555',fontSize:13}}>Pricing</Link>
          <Link href="/blog" style={{color:'#555',fontSize:13}}>Blog</Link>
        </div>
        <span style={{fontSize:12,color:'#333'}}>© 2026 HireHub360 · India's AI Hiring Platform</span>
      </footer>
    </>
  )
}
