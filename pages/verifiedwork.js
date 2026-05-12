import Head from 'next/head'

const BULLETS = [
  { icon: '🔗', text: 'Every project = blockchain-verified certificate issued automatically' },
  { icon: '📱', text: 'Employers scan QR code for instant full work history verification' },
  { icon: '🔒', text: 'Cannot be faked, edited, or removed — permanent on-chain record' },
  { icon: '🔗', text: 'Shareable link works on LinkedIn, WhatsApp, and email' },
]

const HOW = [
  { step: '01', title: 'Complete a Job', desc: 'Finish any job or project on HireHub360. Both parties confirm completion.' },
  { step: '02', title: 'Certificate Issued', desc: 'A tamper-proof certificate is minted automatically — job title, duration, client rating, skills used.' },
  { step: '03', title: 'QR Code Generated', desc: 'A unique QR code links to your public verification page. Share it anywhere.' },
  { step: '04', title: 'Employer Verifies', desc: 'Scan QR → instant verification. Cannot be altered. Verified in 3 seconds.' },
]

export default function VerifiedWork() {
  return (
    <>
      <Head>
        <title>VerifiedWork — World's First Unfakeable Work History | HireHub360</title>
        <meta name="description" content="Every completed project earns a blockchain-verified work certificate. Cannot be faked, altered, or deleted. Employers scan QR code for instant verification." />
        <meta property="og:title" content="VerifiedWork — Unfakeable Work History" />
        <meta property="og:description" content="Blockchain-verified work certificates. Resume fraud ends here." />
        <meta property="og:url" content="https://hirehub360.in/verifiedwork" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#01080f;color:#fff}
        .nav{background:rgba(1,8,15,.9);backdrop-filter:blur(12px);border-bottom:1px solid #0a2540;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav className="nav">
        <a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:'-.04em'}}>Hire<span style={{color:'#3b82f6'}}>Hub</span><sup style={{fontSize:'0.55em',color:'#3b82f6',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'#3b82f6',color:'#fff',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Get Started →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#01080f 0%,#03183a 60%,#01080f 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #0a2540'}}>
        <div style={{display:'inline-block',background:'rgba(59,130,246,.1)',border:'1px solid rgba(59,130,246,.3)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#60a5fa',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>World's First Unfakeable Work History</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          Your Work History.<br/><span style={{color:'#3b82f6'}}>Permanently Verified.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#93c5fd',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          Every completed project earns a blockchain-verified work certificate. Cannot be faked, altered, or deleted — ever. Employers scan a QR code and instantly verify your entire career. Resume fraud ends here.
        </p>

        {/* Certificate mock */}
        <div style={{maxWidth:380,margin:'0 auto 40px',background:'linear-gradient(135deg,#03183a,#04203f)',border:'1px solid #1a4a7a',borderRadius:20,padding:'28px',textAlign:'left',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,right:0,width:100,height:100,background:'rgba(59,130,246,.05)',borderRadius:'0 0 0 100%'}}></div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <div style={{width:36,height:36,background:'#3b82f6',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>✓</div>
            <div>
              <div style={{fontSize:11,color:'#60a5fa',fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase'}}>HireHub360 VerifiedWork</div>
              <div style={{fontSize:10,color:'#3b82f6',marginTop:1}}>Blockchain Certificate · #VW-2024-038291</div>
            </div>
          </div>
          <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>React Frontend Developer</div>
          <div style={{fontSize:13,color:'#93c5fd',marginBottom:16}}>E-commerce Platform Rebuild · 6 months</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
            {['React','TypeScript','Next.js','Supabase'].map(s=>(
              <span key={s} style={{background:'rgba(59,130,246,.15)',color:'#93c5fd',padding:'3px 8px',borderRadius:6,fontSize:11,fontWeight:600}}>{s}</span>
            ))}
          </div>
          <div style={{display:'flex',gap:16}}>
            <div>
              <div style={{fontSize:10,color:'#3b82f6',marginBottom:2}}>Client Rating</div>
              <div style={{fontWeight:800,color:'#f59e0b'}}>4.9 ★</div>
            </div>
            <div>
              <div style={{fontSize:10,color:'#3b82f6',marginBottom:2}}>Verified On</div>
              <div style={{fontWeight:700,fontSize:12}}>Apr 2024</div>
            </div>
            <div style={{marginLeft:'auto',width:48,height:48,background:'#fff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>
              QR
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'#3b82f6',color:'#fff',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Get Verified →</a>
          <a href="/features" style={{background:'transparent',color:'#60a5fa',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #0a2540'}}>See All Features</a>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#03183a',border:'1px solid #0a2540',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#93c5fd',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        <div style={{background:'linear-gradient(135deg,#03183a,#04203f)',border:'1px solid rgba(59,130,246,.2)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#3b82f6',marginBottom:8}}>Resume fraud is a ₹10,000 Cr problem. This ends it.</div>
          <div style={{fontSize:15,color:'#93c5fd',lineHeight:1.7}}>Studies show 56% of job applications contain inflated or false information. HireHub VerifiedWork makes fraud structurally impossible. A blockchain certificate cannot be photoshopped. It cannot be deleted. It cannot lie.</div>
        </div>

        <h2 style={{fontSize:32,fontWeight:900,letterSpacing:'-.03em',marginBottom:32,textAlign:'center'}}>How It Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {HOW.map((h,i)=>(
            <div key={i} style={{background:'#03183a',border:'1px solid #0a2540',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#3b82f6',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#4a7aaa',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        <div style={{background:'#03183a',border:'1px solid #0a2540',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>🔗</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>Build a Verified Work Record</h3>
          <p style={{color:'#4a7aaa',marginBottom:28,fontSize:15}}>Every job you complete adds another permanent, unfakeable credential to your profile.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#3b82f6',color:'#fff',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Start Building →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #0a2540',color:'#1a3a6a',fontSize:12}}>
        <a href="/" style={{color:'#3b82f6',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#1a3a6a'}}>All Features</a>
      </div>
    </>
  )
}
