import Head from 'next/head'

const BULLETS = [
  { icon: '📣', text: 'Worker posts availability once — companies browse and apply to them' },
  { icon: '💰', text: 'Set your rate, location preference, and availability window upfront' },
  { icon: '📬', text: 'Premium workers receive 5+ company applications every single day' },
  { icon: '🛡️', text: 'Block unwanted companies — full control stays with the worker' },
]

const HOW = [
  { step: '01', title: 'Post Your Profile', desc: 'Skills, rate, availability, location. Takes 3 minutes. No lengthy CV needed.' },
  { step: '02', title: 'Companies Browse', desc: 'Verified employers search by skill, HireHub Score, location, and rate range.' },
  { step: '03', title: 'They Apply to You', desc: 'Companies send you job requests. You review them on your schedule. Accept or decline.' },
  { step: '04', title: 'You Decide', desc: 'Block, ignore, or negotiate. The power to say yes or no is always yours.' },
]

export default function WorkerFirst() {
  return (
    <>
      <Head>
        <title>WorkerFirst — Companies Apply to Workers | HireHub360</title>
        <meta name="description" content="Workers post their availability, skills, and rate. Companies browse and apply to them. Premium workers get 5+ company applications daily. Hiring flipped completely." />
        <meta property="og:title" content="WorkerFirst — Companies Apply to Workers, Not the Other Way" />
        <meta property="og:description" content="The entire power dynamic of hiring — flipped completely. Workers receive applications, not the other way around." />
        <meta property="og:url" content="https://hirehub360.in/workerfirst" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0f0a00;color:#fff}
        .nav{background:rgba(15,10,0,.9);backdrop-filter:blur(12px);border-bottom:1px solid #2a1a00;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav className="nav">
        <a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:'-.04em'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><sup style={{fontSize:'0.55em',color:'#ff6b00',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'#ff6b00',color:'#fff',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Post My Profile →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0f0a00 0%,#2a1500 60%,#0f0a00 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #2a1a00'}}>
        <div style={{display:'inline-block',background:'rgba(255,107,0,.1)',border:'1px solid rgba(255,107,0,.3)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#fb923c',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>Companies Apply to Workers — Not the Other Way</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          You Post Once.<br/><span style={{color:'#ff6b00'}}>Companies Chase You.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#fdba74',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          Workers post their availability, skills, and rate. Companies browse and apply to them. Premium workers get 5+ company applications daily. The entire power dynamic of hiring — flipped completely.
        </p>

        {/* Inbox mock */}
        <div style={{maxWidth:420,margin:'0 auto 40px',background:'#1a0a00',border:'1px solid #2a1a00',borderRadius:20,overflow:'hidden',textAlign:'left'}}>
          <div style={{padding:'14px 16px',background:'#2a1500',fontSize:13,color:'#fb923c',fontWeight:700}}>📬 Company Applications for Priya S.</div>
          {[
            {co:'Swiggy',role:'Senior React Dev',sal:'₹24 LPA',time:'2 min ago',hot:true},
            {co:'Zepto',role:'Frontend Engineer',sal:'₹20 LPA',time:'14 min ago',hot:true},
            {co:'PhonePe',role:'UI Developer',sal:'₹22 LPA',time:'1 hr ago',hot:false},
            {co:'CRED',role:'React Native Dev',sal:'₹18 LPA',time:'3 hr ago',hot:false},
          ].map((a,i)=>(
            <div key={i} style={{padding:'14px 16px',borderBottom:'1px solid #1a0a00',display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:36,height:36,borderRadius:10,background:'#2a1500',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🏢</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontWeight:700,fontSize:14}}>{a.co}</span>
                  {a.hot && <span style={{background:'#ef4444',color:'#fff',fontSize:9,fontWeight:800,padding:'2px 6px',borderRadius:4}}>HOT</span>}
                </div>
                <div style={{fontSize:12,color:'#fb923c'}}>{a.role} · {a.sal}</div>
              </div>
              <div style={{fontSize:10,color:'#5a3a00'}}>{a.time}</div>
            </div>
          ))}
          <div style={{padding:'12px 16px',fontSize:12,color:'#5a3a00',textAlign:'center'}}>+ 3 more applications today</div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'#ff6b00',color:'#fff',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Post My Profile →</a>
          <a href="/features" style={{background:'transparent',color:'#fb923c',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #2a1500'}}>See All Features</a>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#1a0a00',border:'1px solid #2a1500',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#fdba74',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        <div style={{background:'linear-gradient(135deg,#2a1500,#3a1f00)',border:'1px solid rgba(255,107,0,.2)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#ff6b00',marginBottom:8}}>Completely opposite of every job platform on earth.</div>
          <div style={{fontSize:15,color:'#fdba74',lineHeight:1.7}}>Every platform makes workers apply. Workers get rejected. Workers feel small. WorkerFirst reverses this entirely. Skilled workers are scarce. Companies should be competing for them. Now they are.</div>
        </div>

        <h2 style={{fontSize:32,fontWeight:900,letterSpacing:'-.03em',marginBottom:32,textAlign:'center'}}>How It Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {HOW.map((h,i)=>(
            <div key={i} style={{background:'#1a0a00',border:'1px solid #2a1500',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#ff6b00',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#7a4a00',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        <div style={{background:'#1a0a00',border:'1px solid #2a1500',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>👑</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>You Are the Prize. Act Like It.</h3>
          <p style={{color:'#7a4a00',marginBottom:28,fontSize:15}}>Post your profile once and let companies compete for your attention. Free to join.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#ff6b00',color:'#fff',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Post My Profile →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #2a1500',color:'#4a2a00',fontSize:12}}>
        <a href="/" style={{color:'#ff6b00',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#4a2a00'}}>All Features</a>
      </div>
    </>
  )
}
