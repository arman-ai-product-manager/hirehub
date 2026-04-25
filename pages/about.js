import Head from 'next/head'
import Link from 'next/link'

const NAV = () => (
  <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:100}}>
    <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
    <div style={{display:'flex',gap:24,alignItems:'center'}}>
      <Link href="/" style={{color:'#444',textDecoration:'none',fontSize:14}}>Browse Jobs</Link>
      <Link href="/blog" style={{color:'#444',textDecoration:'none',fontSize:14}}>Blog</Link>
      <Link href="/contact" style={{color:'#444',textDecoration:'none',fontSize:14}}>Contact</Link>
    </div>
  </nav>
)

const FOOTER = () => (
  <footer style={{background:'#111',color:'#aaa',padding:'40px 24px',marginTop:80,fontSize:13}}>
    <div style={{maxWidth:900,margin:'0 auto',display:'flex',gap:32,flexWrap:'wrap',justifyContent:'space-between'}}>
      <div>
        <div style={{fontWeight:800,fontSize:18,color:'#fff',marginBottom:8}}>HireHub<span style={{color:'#ff6b00'}}>360</span></div>
        <div style={{color:'#666',fontSize:13}}>India's AI-powered job portal</div>
      </div>
      <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
        <div>
          <div style={{color:'#fff',fontWeight:700,marginBottom:10,fontSize:13}}>Company</div>
          {[['About Us','/about'],['Contact','/contact'],['Blog','/blog']].map(([l,h])=>(
            <div key={h} style={{marginBottom:6}}><Link href={h} style={{color:'#aaa',textDecoration:'none'}}>{l}</Link></div>
          ))}
        </div>
        <div>
          <div style={{color:'#fff',fontWeight:700,marginBottom:10,fontSize:13}}>Legal</div>
          {[['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Refund Policy','/refund']].map(([l,h])=>(
            <div key={h} style={{marginBottom:6}}><Link href={h} style={{color:'#aaa',textDecoration:'none'}}>{l}</Link></div>
          ))}
        </div>
      </div>
    </div>
    <div style={{maxWidth:900,margin:'32px auto 0',borderTop:'1px solid #333',paddingTop:24,textAlign:'center',color:'#555',fontSize:12}}>
      © 2026 HireHub360. All rights reserved. | Made with ❤️ in India
    </div>
  </footer>
)

const stats = [
  {n:'12,000+',l:'Active Job Listings'},
  {n:'3,500+',l:'Companies Hiring'},
  {n:'50,000+',l:'Job Seekers'},
  {n:'98%',l:'Satisfaction Rate'},
]

const team = [
  {name:'Arman Sheikh',role:'Founder & CEO',emoji:'👨‍💼',bio:'Serial entrepreneur passionate about fixing India\'s hiring problem using AI.'},
  {name:'Tech Team',role:'Engineering',emoji:'⚙️',bio:'Building AI-first tools that make hiring 10x faster and smarter.'},
  {name:'Growth Team',role:'Marketing',emoji:'📈',bio:'Helping companies reach the right talent and candidates land dream jobs.'},
]

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | HireHub360 — India's AI-Powered Job Portal</title>
        <meta name="description" content="HireHub360 is India's AI-powered job portal. We connect companies with top talent using smart matching, verified profiles, and instant indexing on Google." />
        <meta name="keywords" content="about hirehub360, india job portal, ai hiring platform, job search india, recruit candidates india" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/about" />
        <meta property="og:title" content="About HireHub360 — India's AI-Powered Job Portal" />
        <meta property="og:description" content="We're on a mission to make hiring in India faster, smarter, and fairer using AI." />
        <meta property="og:url" content="https://hirehub360.in/about" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <NAV />

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#1d1d1f,#2d1a00)',padding:'80px 24px',textAlign:'center'}}>
        <p style={{fontSize:12,fontWeight:700,letterSpacing:'0.1em',color:'#ff6b00',textTransform:'uppercase',marginBottom:12}}>About HireHub360</p>
        <h1 style={{fontSize:'clamp(32px,6vw,56px)',fontWeight:900,color:'#fff',letterSpacing:'-0.04em',lineHeight:1.1,marginBottom:16}}>
          Hiring should be <span style={{color:'#ff6b00'}}>faster, smarter,</span><br/>and fairer.
        </h1>
        <p style={{color:'#aaa',fontSize:18,maxWidth:560,margin:'0 auto'}}>
          We built HireHub360 because we were tired of slow, expensive, and broken hiring. So we fixed it — with AI.
        </p>
      </div>

      <main style={{maxWidth:900,margin:'0 auto',padding:'64px 24px'}}>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:20,marginBottom:64}}>
          {stats.map(s=>(
            <div key={s.n} style={{background:'#fff',border:'1.5px solid #eee',borderRadius:16,padding:'24px 20px',textAlign:'center'}}>
              <div style={{fontSize:32,fontWeight:900,color:'#ff6b00',letterSpacing:'-0.04em'}}>{s.n}</div>
              <div style={{fontSize:13,color:'#666',marginTop:4}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{marginBottom:64}}>
          <h2 style={{fontSize:28,fontWeight:800,color:'#111',marginBottom:16}}>Our Mission</h2>
          <p style={{fontSize:17,color:'#444',lineHeight:1.8,marginBottom:16}}>
            India has 500 million working people and thousands of companies growing every day. Yet hiring is still broken — slow job boards, fake profiles, resume black holes, and ghosting from both sides.
          </p>
          <p style={{fontSize:17,color:'#444',lineHeight:1.8,marginBottom:16}}>
            <strong>HireHub360</strong> is built to fix that. We use AI to match the right candidates with the right companies — instantly. Every job post is auto-indexed on Google within minutes. Every candidate profile gets an AI fit score. No more guessing.
          </p>
          <p style={{fontSize:17,color:'#444',lineHeight:1.8}}>
            From Bangalore startups to Dubai MNCs, from fresher jobs to C-suite roles — we're building the hiring platform India deserves.
          </p>
        </div>

        {/* What we offer */}
        <div style={{marginBottom:64}}>
          <h2 style={{fontSize:28,fontWeight:800,color:'#111',marginBottom:24}}>What We Offer</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
            {[
              {e:'🤖',t:'AI Job Matching',d:'Smart fit scores match candidates to jobs instantly.'},
              {e:'⚡',t:'Google Indexed in Minutes',d:'Every job post goes live on Google search in under 5 minutes.'},
              {e:'💼',t:'For Companies',d:'Post jobs, manage applications, invite HR teams.'},
              {e:'🎯',t:'For Candidates',d:'AI resume scan, fit score, application tracking.'},
              {e:'🏢',t:'Venue Booking',d:'Book corporate venues, team outings & celebrations.'},
              {e:'📊',t:'Analytics Dashboard',d:'Real-time insights on who applied and from where.'},
            ].map(f=>(
              <div key={f.t} style={{background:'#f9f9fb',borderRadius:14,padding:'20px'}}>
                <div style={{fontSize:28,marginBottom:8}}>{f.e}</div>
                <div style={{fontWeight:700,fontSize:15,color:'#111',marginBottom:4}}>{f.t}</div>
                <div style={{fontSize:13,color:'#666',lineHeight:1.6}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{marginBottom:64}}>
          <h2 style={{fontSize:28,fontWeight:800,color:'#111',marginBottom:24}}>Our Team</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
            {team.map(t=>(
              <div key={t.name} style={{background:'#fff',border:'1.5px solid #eee',borderRadius:16,padding:'24px 20px'}}>
                <div style={{fontSize:40,marginBottom:12}}>{t.emoji}</div>
                <div style={{fontWeight:800,fontSize:16,color:'#111'}}>{t.name}</div>
                <div style={{fontSize:12,color:'#ff6b00',fontWeight:700,marginBottom:8}}>{t.role}</div>
                <div style={{fontSize:13,color:'#666',lineHeight:1.6}}>{t.bio}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{background:'linear-gradient(135deg,#fff8f4,#fff)',border:'1.5px solid #ffe0c8',borderRadius:20,padding:'40px 32px',textAlign:'center'}}>
          <h3 style={{fontSize:24,fontWeight:800,color:'#111',marginBottom:8}}>Ready to get started?</h3>
          <p style={{color:'#666',marginBottom:24}}>Join 50,000+ people using HireHub360 to hire or find jobs.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/" style={{background:'#ff6b00',color:'#fff',padding:'12px 28px',borderRadius:999,textDecoration:'none',fontWeight:700,fontSize:15}}>Browse Jobs →</Link>
            <Link href="/contact" style={{background:'#111',color:'#fff',padding:'12px 28px',borderRadius:999,textDecoration:'none',fontWeight:700,fontSize:15}}>Contact Us</Link>
          </div>
        </div>

      </main>
      <FOOTER />
    </>
  )
}
