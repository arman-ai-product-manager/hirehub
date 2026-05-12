import Head from 'next/head'

const BULLETS = [
  { icon: '🎭', text: 'Apply with skills + HireHub Score only — name, photo, age, gender all hidden' },
  { icon: '🏆', text: 'Company shortlists on pure merit — zero bias, zero discrimination' },
  { icon: '🔓', text: 'Identity revealed only after company expresses genuine interest' },
  { icon: '⚖️', text: 'Legally compliant blind hiring framework for enterprise MNCs' },
]

const HOW = [
  { step: '01', title: 'Apply Anonymously', desc: 'One-click anonymous apply. Company sees only: skills, score, years of experience, work type.' },
  { step: '02', title: 'Pure Merit Shortlist', desc: 'Hiring managers evaluate candidates blind. No name, no photo, no age to bias their decision.' },
  { step: '03', title: 'Company Expresses Interest', desc: 'If shortlisted, company requests to "unlock" the candidate. You get notified.' },
  { step: '04', title: 'Identity Revealed', desc: 'You choose to accept or decline the reveal. Total control stays with you throughout.' },
]

const STATS = [
  ['56%', 'Of resumes rejected due to name bias (Harvard study)'],
  ['23%', 'Salary gap reduced when hiring is blind'],
  ['3×', 'More diverse shortlists with blind hiring'],
  ['100%', 'Of Fortune 500 MNCs have DEI mandates'],
]

export default function BlindHire() {
  return (
    <>
      <Head>
        <title>BlindHire — World's First Truly Blind Hiring Platform | HireHub360</title>
        <meta name="description" content="Worker applies anonymously. Company sees only skills, HireHub Score, and experience. Zero name, zero photo, zero age, zero gender. Identity revealed only after shortlist." />
        <meta property="og:title" content="BlindHire — Zero Bias Hiring" />
        <meta property="og:description" content="Apply anonymously. Be shortlisted on pure merit. Identity revealed only after company expresses interest. Every MNC's compliance dream." />
        <meta property="og:url" content="https://hirehub360.in/blindhire" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#050508;color:#fff}
        .nav{background:rgba(5,5,8,.9);backdrop-filter:blur(12px);border-bottom:1px solid #12121e;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav className="nav">
        <a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:'-.04em'}}>Hire<span style={{color:'#a78bfa'}}>Hub</span><sup style={{fontSize:'0.55em',color:'#a78bfa',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Apply Blind →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#050508 0%,#0e0e1f 60%,#050508 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #12121e'}}>
        <div style={{display:'inline-block',background:'rgba(167,139,250,.08)',border:'1px solid rgba(167,139,250,.25)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#a78bfa',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>World's First Truly Blind Hiring Platform</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          Be Judged by Your Work.<br/><span style={{color:'#8b5cf6'}}>Not Your Name.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#c4b5fd',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          Worker applies anonymously. Company sees only skills, HireHub Score, and experience. Zero name, zero photo, zero age, zero gender. Company shortlists on pure merit. Identity revealed only after interest expressed.
        </p>

        {/* Blind profile mock */}
        <div style={{maxWidth:400,margin:'0 auto 40px',background:'#0e0e1f',border:'1px solid #1a1a30',borderRadius:20,overflow:'hidden',textAlign:'left'}}>
          <div style={{background:'#1a1a30',padding:'12px 16px',display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontSize:11,color:'#a78bfa',fontWeight:700}}>🎭 Anonymous Candidate #4829</div>
            <div style={{marginLeft:'auto',background:'rgba(167,139,250,.2)',color:'#a78bfa',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:999}}>BLIND MODE</div>
          </div>
          <div style={{padding:'20px'}}>
            {/* Blurred avatar placeholder */}
            <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:20}}>
              <div style={{width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,#2a2a4a,#1a1a30)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,border:'2px solid #2a2a4a'}}>🎭</div>
              <div>
                <div style={{fontWeight:800,fontSize:16,color:'#6b6b8a'}}>████████</div>
                <div style={{fontSize:13,color:'#4a4a6a',marginTop:2}}>Identity Hidden</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
              {[['HireHub Score','834','#f59e0b'],['Experience','6 years','#60a5fa'],['Availability','Immediate','#4ade80'],['Work Type','Full-time','#a78bfa']].map(([l,v,c])=>(
                <div key={l} style={{background:'#1a1a30',borderRadius:10,padding:'10px 12px'}}>
                  <div style={{fontSize:10,color:'#3a3a5a',marginBottom:3}}>{l}</div>
                  <div style={{fontWeight:800,fontSize:14,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
              {['React','TypeScript','Node.js','AWS','System Design'].map(s=>(
                <span key={s} style={{background:'rgba(167,139,250,.1)',color:'#a78bfa',fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:7}}>{s}</span>
              ))}
            </div>
            <button style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:12,padding:'12px',fontWeight:800,fontSize:14,cursor:'pointer'}}>
              🔓 Request Identity Reveal
            </button>
          </div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Apply Blind Now →</a>
          <a href="/features" style={{background:'transparent',color:'#a78bfa',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #1a1a30'}}>See All Features</a>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#0e0e1f',border:'1px solid #1a1a30',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#c4b5fd',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        <div style={{background:'linear-gradient(135deg,#0e0e1f,#1a1a30)',border:'1px solid rgba(167,139,250,.2)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#8b5cf6',marginBottom:8}}>Zero bias hiring — every MNC's compliance dream.</div>
          <div style={{fontSize:15,color:'#c4b5fd',lineHeight:1.7}}>Harvard research shows resumes with "white-sounding" names get 50% more callbacks. BlindHire makes this structurally impossible. Companies get better talent. Workers get a fair shot. Regulators love it. Everyone wins — except bias.</div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:72}}>
          {STATS.map(([n,l])=>(
            <div key={n} style={{background:'#0e0e1f',border:'1px solid #1a1a30',borderRadius:16,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:36,fontWeight:900,color:'#8b5cf6',letterSpacing:'-.03em'}}>{n}</div>
              <div style={{fontSize:12,color:'#4a4a6a',marginTop:6,lineHeight:1.5}}>{l}</div>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:28,fontWeight:900,letterSpacing:'-.03em',marginBottom:24,textAlign:'center'}}>How BlindHire Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {HOW.map((h,i)=>(
            <div key={i} style={{background:'#0e0e1f',border:'1px solid #1a1a30',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#8b5cf6',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#3a3a6a',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        <div style={{background:'#0e0e1f',border:'1px solid #1a1a30',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>🎭</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>Let Your Work Speak For You</h3>
          <p style={{color:'#3a3a6a',marginBottom:28,fontSize:15}}>Apply to any job on HireHub360 with full anonymous mode. Your skills go first. Always.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Enable BlindHire →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #12121e',color:'#2a2a4a',fontSize:12}}>
        <a href="/" style={{color:'#8b5cf6',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#2a2a4a'}}>All Features</a>
      </div>
    </>
  )
}
