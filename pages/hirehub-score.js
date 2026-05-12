import Head from 'next/head'

const BULLETS = [
  { icon: '📊', text: 'Score built from attendance, ratings, punctuality & skill tests' },
  { icon: '🚀', text: 'High score = higher pay + premium jobs unlocked automatically' },
  { icon: '🛂', text: 'Portable work passport — follows you across every employer' },
  { icon: '⚡', text: 'Real-time score updates after every completed job' },
]

const HOW = [
  { step: '01', title: 'Complete Jobs', desc: 'Every job you finish adds verified data — ratings, attendance, punctuality, output quality.' },
  { step: '02', title: 'Score is Calculated', desc: 'Our algorithm weights 12 factors in real time. Transparent breakdown always visible to you.' },
  { step: '03', title: 'Unlock Higher Pay', desc: 'Score 750+ and premium job listings appear. Companies see your score before calling you.' },
  { step: '04', title: 'Take It Everywhere', desc: 'Your score is yours forever. Switch jobs, switch cities — your reputation travels with you.' },
]

export default function HireHubScore() {
  return (
    <>
      <Head>
        <title>HireHub Score — India's First Work Reputation System | HireHub360</title>
        <meta name="description" content="Every worker gets a verified HireHub Score built from attendance, ratings, punctuality and skill tests. Like CIBIL but for your career." />
        <meta property="og:title" content="HireHub Score — India's First Work Reputation System" />
        <meta property="og:description" content="Like CIBIL but for your career. Your score unlocks higher pay and premium jobs automatically." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirehub360.in/hirehub-score" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0a0a0a;color:#fff}
        .nav{background:rgba(10,10,10,.9);backdrop-filter:blur(12px);border-bottom:1px solid #222;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        .logo{font-weight:900;font-size:20px;letter-spacing:-.04em;color:#fff;text-decoration:none}
        .logo span{color:#f59e0b}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">Hire<span>Hub</span><sup style={{fontSize:'0.55em',color:'#f59e0b',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'#f59e0b',color:'#000',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Get Started →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0a0a0a 0%,#1a1200 60%,#0a0a0a 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #1a1a1a'}}>
        <div style={{display:'inline-block',background:'rgba(245,158,11,.12)',border:'1px solid rgba(245,158,11,.3)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#f59e0b',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>India's First Work Reputation System</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          Your Work Score.<br/><span style={{color:'#f59e0b'}}>Your Superpower.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#999',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          Every worker gets a verified HireHub Score built from attendance, ratings, punctuality, and skill tests. Like CIBIL — but for your career.
        </p>
        {/* Score display mock */}
        <div style={{display:'inline-block',background:'#111',border:'1px solid #2a2a2a',borderRadius:24,padding:'32px 48px',marginBottom:40}}>
          <div style={{fontSize:13,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'.08em'}}>Your HireHub Score</div>
          <div style={{fontSize:96,fontWeight:900,color:'#f59e0b',lineHeight:1,letterSpacing:'-.06em'}}>812</div>
          <div style={{fontSize:13,color:'#4ade80',marginTop:8,fontWeight:700}}>● Excellent — Premium Jobs Unlocked</div>
          <div style={{display:'flex',gap:4,marginTop:16,justifyContent:'center'}}>
            {[['Attendance','98%','#4ade80'],['Ratings','4.8★','#f59e0b'],['Punctuality','96%','#60a5fa'],['Skills','A+','#a78bfa']].map(([l,v,c])=>(
              <div key={l} style={{background:'#1a1a1a',borderRadius:10,padding:'8px 12px',textAlign:'center',minWidth:70}}>
                <div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
                <div style={{fontSize:10,color:'#555',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'#f59e0b',color:'#000',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Build My Score →</a>
          <a href="/features" style={{background:'transparent',color:'#fff',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #333'}}>See All Features</a>
        </div>
      </div>

      {/* Bullets */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#ccc',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div style={{background:'linear-gradient(135deg,#1a1200,#2a1800)',border:'1px solid rgba(245,158,11,.25)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#f59e0b',marginBottom:8}}>Like CIBIL — but for your career.</div>
          <div style={{fontSize:15,color:'#999',lineHeight:1.7}}>India has 500M+ workers. Zero trusted way to prove reliability. Banks solved this for money with CIBIL. HireHub360 is solving it for work. Your score is the most valuable thing you'll ever build.</div>
        </div>

        {/* How it works */}
        <h2 style={{fontSize:32,fontWeight:900,letterSpacing:'-.03em',marginBottom:32,textAlign:'center'}}>How Your Score is Built</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {HOW.map((h,i)=>(
            <div key={i} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#f59e0b',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#777',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        {/* Score bands */}
        <h2 style={{fontSize:28,fontWeight:900,letterSpacing:'-.03em',marginBottom:24,textAlign:'center'}}>What Your Score Unlocks</h2>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:72}}>
          {[
            ['300–499','Starter','Basic job listings','#ef4444'],
            ['500–649','Good','More job matches + salary transparency','#f97316'],
            ['650–749','Very Good','Priority shortlisting + company ratings visible','#eab308'],
            ['750–849','Excellent','Premium jobs + AI Salary Agent activated','#22c55e'],
            ['850–950','Elite','Featured profile + guaranteed company applications','#3b82f6'],
          ].map(([range,label,perks,color])=>(
            <div key={range} style={{background:'#111',border:`1px solid ${color}33`,borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
              <div style={{fontWeight:900,fontSize:18,color,minWidth:80}}>{range}</div>
              <div style={{background:`${color}22`,color,padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:700,flexShrink:0}}>{label}</div>
              <div style={{fontSize:13,color:'#999',flex:1}}>{perks}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>🏆</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>Start Building Your Score Today</h3>
          <p style={{color:'#777',marginBottom:28,fontSize:15}}>It's free. Takes 2 minutes. And it's the most valuable career asset you'll ever own.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#f59e0b',color:'#000',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Create Free Account →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #111',color:'#444',fontSize:12}}>
        <a href="/" style={{color:'#f59e0b',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#666'}}>All Features</a>
      </div>
    </>
  )
}
