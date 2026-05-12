import Head from 'next/head'

const BULLETS = [
  { icon: '🎯', text: 'Worker sets desired salary — AI handles the entire negotiation' },
  { icon: '📈', text: 'Real-time negotiation with live market benchmarks and company budgets' },
  { icon: '🧠', text: 'Knows when to push harder and when to accept the best offer' },
  { icon: '📋', text: 'Full negotiation transcript shared with worker after every session' },
]

const STEPS = [
  { step: '01', title: 'Set Your Target', desc: 'Tell the AI your desired salary, experience, skills, and the role. Takes 60 seconds.' },
  { step: '02', title: 'AI Enters the Room', desc: 'Our agent analyses the company budget, market rates, and your HireHub Score before talking to the employer.' },
  { step: '03', title: 'Live Negotiation', desc: 'AI negotiates in real time. It knows when to push, when to counter, and when you have maximum leverage.' },
  { step: '04', title: 'You Win or Walk', desc: "You get the full transcript and the final offer. Accept or decline — you're always in control." },
]

export default function AiSalaryAgent() {
  return (
    <>
      <Head>
        <title>AI Salary Agent — A Personal HR Agent for Every Worker | HireHub360</title>
        <meta name="description" content="You set your desired salary. Our AI negotiates with the company on your behalf — analysing market data, your score, and company budget in real time." />
        <meta property="og:title" content="AI Salary Agent — A Personal HR for Every Indian Worker" />
        <meta property="og:description" content="AI negotiates salary on your behalf with real-time market data. No worker has ever had this power. Until now." />
        <meta property="og:url" content="https://hirehub360.in/ai-salary-agent" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#020d06;color:#fff}
        .nav{background:rgba(2,13,6,.9);backdrop-filter:blur(12px);border-bottom:1px solid #0d2a15;padding:0 5vw;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav className="nav">
        <a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:'-.04em'}}>Hire<span style={{color:'#10b981'}}>Hub</span><sup style={{fontSize:'0.55em',color:'#10b981',fontWeight:900,verticalAlign:'super'}}>360</sup></a>
        <a href="/hirehub.html" style={{background:'#10b981',color:'#000',padding:'8px 18px',borderRadius:999,fontWeight:700,fontSize:13}}>Get Started →</a>
      </nav>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#020d06 0%,#022d1a 60%,#020d06 100%)',padding:'80px 5vw 60px',textAlign:'center',borderBottom:'1px solid #0d2a15'}}>
        <div style={{display:'inline-block',background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.3)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:700,color:'#10b981',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:24}}>A Personal HR Agent for Every Worker</div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,marginBottom:20}}>
          AI Negotiates Your<br/><span style={{color:'#10b981'}}>Salary For You.</span>
        </h1>
        <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#6ee7b7',maxWidth:560,margin:'0 auto 40px',lineHeight:1.65}}>
          You set your desired salary. Our AI negotiates with the company — analysing market data, your HireHub Score, and the company's budget in real time. No worker has ever had this power. Until now.
        </p>

        {/* Chat mock */}
        <div style={{maxWidth:460,margin:'0 auto 40px',background:'#0a1f12',border:'1px solid #0d3320',borderRadius:20,overflow:'hidden',textAlign:'left'}}>
          <div style={{background:'#0d3320',padding:'12px 16px',fontSize:12,color:'#6ee7b7',fontWeight:700,display:'flex',alignItems:'center',gap:8}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'#10b981',display:'inline-block'}}></span>
            HireHub AI Agent · Negotiating on behalf of Rahul K.
          </div>
          {[
            {from:'AI',msg:'Good morning. Rahul has 4 years in React and a HireHub Score of 834. His expected CTC is ₹18 LPA.'},
            {from:'HR',msg:'We were thinking ₹14 LPA for this role.'},
            {from:'AI',msg:'Market median for this role in Bangalore is ₹16.2 LPA. Rahul's score is top 8% nationally. We'd accept ₹17 LPA with a 6-month review clause.'},
            {from:'HR',msg:'We can do ₹16 LPA + performance bonus.'},
            {from:'AI',msg:'Accepted. Sending Rahul the offer summary now. ✅'},
          ].map((m,i)=>(
            <div key={i} style={{padding:'10px 16px',borderBottom:'1px solid #0d2a15',display:'flex',gap:10,alignItems:'flex-start'}}>
              <div style={{fontSize:10,fontWeight:800,color:m.from==='AI'?'#10b981':'#6ee7b7',minWidth:24,paddingTop:2}}>{m.from}</div>
              <div style={{fontSize:13,color:'#ccc',lineHeight:1.55}}>{m.msg}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/hirehub.html" style={{background:'#10b981',color:'#000',padding:'14px 28px',borderRadius:12,fontWeight:800,fontSize:15}}>Activate AI Agent →</a>
          <a href="/negotiate" style={{background:'transparent',color:'#10b981',padding:'14px 28px',borderRadius:12,fontWeight:700,fontSize:15,border:'1px solid #10b981'}}>Try Salary Coach →</a>
        </div>
      </div>

      {/* Bullets */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 5vw'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {BULLETS.map((b,i)=>(
            <div key={i} style={{background:'#0a1f12',border:'1px solid #0d2a15',borderRadius:16,padding:'24px 20px'}}>
              <div style={{fontSize:32,marginBottom:12}}>{b.icon}</div>
              <div style={{fontSize:14,color:'#aaa',lineHeight:1.6}}>{b.text}</div>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div style={{background:'linear-gradient(135deg,#022d1a,#043d22)',border:'1px solid rgba(16,185,129,.2)',borderRadius:20,padding:'32px',marginBottom:72}}>
          <div style={{fontSize:28,marginBottom:12}}>💡</div>
          <div style={{fontSize:22,fontWeight:800,color:'#10b981',marginBottom:8}}>Like having a personal HR for every Indian worker.</div>
          <div style={{fontSize:15,color:'#6ee7b7',lineHeight:1.7}}>Top executives always had negotiation coaches. Fresh graduates and blue-collar workers never did. The AI Salary Agent democratises negotiation power — every Indian worker deserves the best deal possible.</div>
        </div>

        {/* How */}
        <h2 style={{fontSize:32,fontWeight:900,letterSpacing:'-.03em',marginBottom:32,textAlign:'center'}}>How It Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:72}}>
          {STEPS.map((h,i)=>(
            <div key={i} style={{background:'#0a1f12',border:'1px solid #0d2a15',borderRadius:16,padding:'24px'}}>
              <div style={{fontSize:12,color:'#10b981',fontWeight:800,letterSpacing:'.1em',marginBottom:12}}>{h.step}</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{h.title}</div>
              <div style={{fontSize:13,color:'#5a8a6a',lineHeight:1.6}}>{h.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:72}}>
          {[['₹3.2L','Average salary increase secured'],['87%','Workers who negotiate earn more'],['14 min','Average negotiation duration'],['2.1×','Better offers than self-negotiation']].map(([n,l])=>(
            <div key={n} style={{background:'#0a1f12',border:'1px solid #0d2a15',borderRadius:16,padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:32,fontWeight:900,color:'#10b981',letterSpacing:'-.03em'}}>{n}</div>
              <div style={{fontSize:12,color:'#5a8a6a',marginTop:6,lineHeight:1.5}}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'#0a1f12',border:'1px solid #0d2a15',borderRadius:24,padding:'48px',textAlign:'center'}}>
          <div style={{fontSize:42,marginBottom:16}}>🤖</div>
          <h3 style={{fontSize:28,fontWeight:900,marginBottom:12,letterSpacing:'-.03em'}}>Never Undersell Yourself Again</h3>
          <p style={{color:'#5a8a6a',marginBottom:28,fontSize:15}}>AI Salary Agent is free for all HireHub360 users. Your next offer will be the best one yet.</p>
          <a href="/hirehub.html" style={{display:'inline-block',background:'#10b981',color:'#000',padding:'16px 36px',borderRadius:14,fontWeight:800,fontSize:16}}>Activate Now →</a>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid #0d2a15',color:'#2d5a40',fontSize:12}}>
        <a href="/" style={{color:'#10b981',fontWeight:700}}>HireHub360</a> · India's AI Hiring Platform · <a href="/features" style={{color:'#2d5a40'}}>All Features</a>
      </div>
    </>
  )
}
