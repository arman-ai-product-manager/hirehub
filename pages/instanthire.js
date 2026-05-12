import Head from 'next/head'

const BULLETS = [
  { icon: '⚡', text: 'Post requirement → nearby verified workers alerted within seconds' },
  { icon: '📍', text: 'GPS-matched — closest available workers get first priority alert' },
  { icon: '✅', text: 'Worker confirmed and on-site within 60 minutes, guaranteed' },
  { icon: '🏗️', text: 'Covers construction, events, warehouses, hospitality, and more' },
]

const HOW = [
  { step: '01', title: 'Post the Need', desc: 'Job type, location, number of workers, start time. Takes under 90 seconds.' },
  { step: '02', title: 'Workers Alerted', desc: 'All verified workers within your radius get an instant push notification.' },
  { step: '03', title: 'First to Accept Wins', desc: 'Closest available worker accepts. You see their HireHub Score and photo before confirming.' },
  { step: '04', title: 'On-Site in 60 Min', desc: 'Worker navigates to your location via the app. Track arrival in real time.' },
]

const USECASES = [
  { icon: '🏗️', title: 'Construction', desc: 'Last-minute labour shortage. Site emergency. Worker no-show.' },
  { icon: '🎪', title: 'Events', desc: 'Event staff, setup crew, last-minute caterers, security.' },
  { icon: '📦', title: 'Warehouses', desc: 'Peak season surge, dispatch deadlines, stock counting.' },
  { icon: '🍽️', title: 'Hospitality', desc: 'Banquet surge, kitchen help, hotel housekeeping rush.' },
  { icon: '🏭', title: 'Manufacturing', desc: 'Production rush, quality check, machine operators.' },
  { icon: '🧹', title: 'Facility Mgmt', desc: 'Emergency cleaning, sanitisation, maintenance crew.' },
]

export default function InstantHire() {
  return (
    <>
      <Head>
        <title>InstantHire — Zomato Speed for Hiring People | HireHub360</title>
        <meta name="description" content="Client posts an emergency requirement. Platform alerts nearby workers instantly. Worker confirmed and on-site within 1 hour. Swiggy model for human talent." />
        <meta property="og:title" content="InstantHire — On-Site Worker in 60 Minutes" />
        <meta property="og:description" content="Post emergency requirement → workers alerted in seconds → on-site in 60 minutes. Zomato delivery speed for hiring." />
        <meta property="og:url" content="https://hirehub360.in/instanthire" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#0f0002;color:#fff}
        .nav{background:rgba(15,0,2,.9);backdrop-filter:blur(12px);border-bottom:1px solid #2a0008;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        a{text-decoration:none;color:inherit}
        @keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}
      `}</style>

      <nav className="nav">
        <a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:'-.04em'}}>Hire<span style={{color:'#ef4444'}}>Hub</span><sup style={{fontSize:'0.55em',color:'#ef4444',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'#ef4444',color:'#fff',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Get Started →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0f0002 0%,#2d0008 60%,#0f0002 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #2a0008'}}>
        <div style={{display:'inline-block',background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#fca5a5',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>Swiggy Model for Human Talent</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          Worker On-Site.<br/><span style={{color:'#ef4444'}}>In 60 Minutes.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#fca5a5',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          Client posts an emergency requirement. The platform alerts nearby verified workers instantly. Worker confirmed and on-site within 1 hour. Construction, events, warehouses — solved in 60 minutes.
        </p>

        {/* Timer mock */}
        <div style={{maxWidth:360,margin:'0 auto 40px',background:'#1a0005',border:'1px solid #2a0008',borderRadius:20,padding:'32px',textAlign:'center'}}>
          <div style={{fontSize:13,color:'#7a0020',marginBottom:8,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>Time Since Posted</div>
          <div style={{fontSize:72,fontWeight:900,color:'#ef4444',letterSpacing:'-.06em',lineHeight:1}}>00:47</div>
          <div style={{fontSize:12,color:'#5a0015',marginBottom:20}}>minutes</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              {icon:'✅',label:'Job Posted',time:'00:00',done:true},
              {icon:'⚡',label:'12 Workers Alerted',time:'00:08',done:true},
              {icon:'✅',label:'Ramesh K. Accepted',time:'00:14',done:true},
              {icon:'🔵',label:'En Route — 3.2km away',time:'Now',done:false},
              {icon:'⏳',label:'Expected On-Site',time:'~13 min',done:false},
            ].map((s,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'center',background:'#0a0002',borderRadius:10,padding:'10px 12px'}}>
                <span style={{fontSize:14}}>{s.icon}</span>
                <span style={{flex:1,fontSize:12,color:s.done?'#fca5a5':'#5a0015'}}>{s.label}</span>
                <span style={{fontSize:11,color:'#3a0010',fontWeight:700}}>{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'#ef4444',color:'#fff',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Post Emergency Need →</a>
          <a href="/features" style={{background:'transparent',color:'#fca5a5',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #2a0008'}}>See All Features</a>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#1a0005',border:'1px solid #2a0008',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#fca5a5',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        <div style={{background:'linear-gradient(135deg,#2d0008,#3d000a)',border:'1px solid rgba(239,68,68,.2)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#ef4444',marginBottom:8}}>Zomato delivery speed — for hiring people.</div>
          <div style={{fontSize:15,color:'#fca5a5',lineHeight:1.7}}>Zomato delivers food in 10 minutes. Swiggy delivers groceries in 10 minutes. Why does hiring a worker take 2 weeks? InstantHire fixes the last remaining industry that still runs on phone calls and WhatsApp groups.</div>
        </div>

        <h2 style={{fontSize:28,fontWeight:900,letterSpacing:'-.03em',marginBottom:24,textAlign:'center'}}>Works For Every Industry</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:72}}>
          {USECASES.map((u,i)=>(
            <div key={i} style={{background:'#1a0005',border:'1px solid #2a0008',borderRadius:14,padding:'20px 16px',textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:10}}>{u.icon}</div>
              <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>{u.title}</div>
              <div style={{fontSize:12,color:'#5a0015',lineHeight:1.5}}>{u.desc}</div>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:28,fontWeight:900,letterSpacing:'-.03em',marginBottom:24,textAlign:'center'}}>How It Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {HOW.map((h,i)=>(
            <div key={i} style={{background:'#1a0005',border:'1px solid #2a0008',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#ef4444',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#5a0015',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        <div style={{background:'#1a0005',border:'1px solid #2a0008',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>⚡</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>Next Emergency? We've Got You.</h3>
          <p style={{color:'#5a0015',marginBottom:28,fontSize:15}}>Hundreds of verified workers available in your city right now. Post your first job free.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#ef4444',color:'#fff',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Post Emergency Job →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #2a0008',color:'#3a0010',fontSize:12}}>
        <a href="/" style={{color:'#ef4444',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#3a0010'}}>All Features</a>
      </div>
    </>
  )
}
