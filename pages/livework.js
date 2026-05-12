import Head from 'next/head'

const BULLETS = [
  { icon: '🎥', text: 'Freelancers stream their work session live — real screen, real output' },
  { icon: '👁️', text: 'Client watches in real time — zero doubt about what\'s being built' },
  { icon: '⏱️', text: 'Live billing meter — pay only for active working time, not idle hours' },
  { icon: '🖥️', text: 'Screen share + webcam + time tracker all in one seamless session' },
]

const HOW = [
  { step: '01', title: 'Freelancer Goes Live', desc: 'Start a session, share your screen, and the work timer begins. Clients join with one click.' },
  { step: '02', title: 'Client Watches', desc: 'Real-time screen feed. See every line of code, every design decision, every pixel as it happens.' },
  { step: '03', title: 'Meter Runs', desc: 'Billing ticks like a taxi meter — only during active work. Pause anytime. Total transparency.' },
  { step: '04', title: 'Session Recorded', desc: 'Full session recording stored automatically. Replay anytime. Dispute-proof and client-safe.' },
]

export default function LiveWork() {
  return (
    <>
      <Head>
        <title>LiveWork — Twitch Meets Upwork | HireHub360</title>
        <meta name="description" content="Freelancers go LIVE while they work. Clients watch in real time. Pay-per-hour billing ticks like a taxi meter. Complete transparency. Zero trust issues." />
        <meta property="og:title" content="LiveWork — Twitch Meets Upwork" />
        <meta property="og:description" content="Stream your work live. Client watches in real time. Pay only for active hours. A completely new category." />
        <meta property="og:url" content="https://hirehub360.in/livework" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#07021a;color:#fff}
        .nav{background:rgba(7,2,26,.9);backdrop-filter:blur(12px);border-bottom:1px solid #1a0d3a;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        a{text-decoration:none;color:inherit}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      <nav className="nav">
        <a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:'-.04em'}}>Hire<span style={{color:'#8b5cf6'}}>Hub</span><sup style={{fontSize:'0.55em',color:'#8b5cf6',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'#8b5cf6',color:'#fff',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Get Started →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#07021a 0%,#12063a 60%,#07021a 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #1a0d3a'}}>
        <div style={{display:'inline-block',background:'rgba(139,92,246,.12)',border:'1px solid rgba(139,92,246,.35)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#a78bfa',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>Twitch Meets Upwork</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          Work Live.<br/><span style={{color:'#8b5cf6'}}>Get Paid Live.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#c4b5fd',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          Freelancers go LIVE while they work. Clients watch in real time. Pay-per-hour billing ticks like a taxi meter. Complete transparency. Zero trust issues. A completely new category.
        </p>

        {/* Stream mock */}
        <div style={{maxWidth:520,margin:'0 auto 40px',background:'#0d0626',border:'1px solid #1e0f50',borderRadius:20,overflow:'hidden',textAlign:'left'}}>
          {/* Stream header */}
          <div style={{background:'#1e0f50',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#ef4444',animation:'pulse 2s infinite'}}></div>
              <span style={{fontSize:12,color:'#a78bfa',fontWeight:700}}>LIVE · Arjun M. — UI Design Session</span>
            </div>
            <div style={{background:'rgba(139,92,246,.2)',color:'#a78bfa',padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700}}>🕐 01:23:47</div>
          </div>
          {/* "Screen" */}
          <div style={{background:'#111',height:160,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#444',position:'relative'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:40,marginBottom:8}}>🎨</div>
              <div>Figma — Homepage Redesign</div>
              <div style={{fontSize:11,color:'#333',marginTop:4}}>Component Library · Frame 3 of 12</div>
            </div>
          </div>
          {/* Stats bar */}
          <div style={{padding:'12px 16px',display:'flex',gap:20,background:'#0a0420'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:'#8b5cf6'}}>₹2,450</div>
              <div style={{fontSize:10,color:'#5a4a8a'}}>Earned Today</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:'#4ade80'}}>● Active</div>
              <div style={{fontSize:10,color:'#5a4a8a'}}>Status</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:'#f59e0b'}}>3</div>
              <div style={{fontSize:10,color:'#5a4a8a'}}>Clients Watching</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:'#60a5fa'}}>98%</div>
              <div style={{fontSize:10,color:'#5a4a8a'}}>Active Time</div>
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'#8b5cf6',color:'#fff',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Go Live Now →</a>
          <a href="/features" style={{background:'transparent',color:'#a78bfa',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #2d1a6e'}}>See All Features</a>
        </div>
      </div>

      {/* Bullets */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#0d0626',border:'1px solid #1a0d3a',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#c4b5fd',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div style={{background:'linear-gradient(135deg,#12063a,#1e0f50)',border:'1px solid rgba(139,92,246,.25)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#8b5cf6',marginBottom:8}}>Twitch meets Upwork — a brand new category.</div>
          <div style={{fontSize:15,color:'#c4b5fd',lineHeight:1.7}}>The biggest trust problem in freelancing: "How do I know they're actually working?" LiveWork makes this question irrelevant. Real-time streaming is not a feature — it's the entire product. No other platform on earth does this.</div>
        </div>

        {/* How */}
        <h2 style={{fontSize:32,fontWeight:900,letterSpacing:'-.03em',marginBottom:32,textAlign:'center'}}>How a Session Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {HOW.map((h,i)=>(
            <div key={i} style={{background:'#0d0626',border:'1px solid #1a0d3a',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#8b5cf6',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#6b5a9a',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'#0d0626',border:'1px solid #1a0d3a',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>🔴</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>Ready to Go Live?</h3>
          <p style={{color:'#6b5a9a',marginBottom:28,fontSize:15}}>Join thousands of freelancers building trust and earning more with every live session.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#8b5cf6',color:'#fff',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Start LiveWork →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #1a0d3a',color:'#3a2a6a',fontSize:12}}>
        <a href="/" style={{color:'#8b5cf6',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#3a2a6a'}}>All Features</a>
      </div>
    </>
  )
}
