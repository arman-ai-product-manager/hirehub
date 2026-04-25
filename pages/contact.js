import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const NAV = () => (
  <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:100}}>
    <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
    <div style={{display:'flex',gap:24,alignItems:'center'}}>
      <Link href="/" style={{color:'#444',textDecoration:'none',fontSize:14}}>Browse Jobs</Link>
      <Link href="/blog" style={{color:'#444',textDecoration:'none',fontSize:14}}>Blog</Link>
      <Link href="/about" style={{color:'#444',textDecoration:'none',fontSize:14}}>About</Link>
    </div>
  </nav>
)

const FOOTER = () => (
  <footer style={{background:'#111',color:'#aaa',padding:'40px 24px',marginTop:80,fontSize:13}}>
    <div style={{maxWidth:900,margin:'0 auto',textAlign:'center',color:'#555',fontSize:12}}>
      © 2026 HireHub360. All rights reserved. |{' '}
      <Link href="/privacy" style={{color:'#aaa',textDecoration:'none'}}>Privacy</Link> ·{' '}
      <Link href="/terms" style={{color:'#aaa',textDecoration:'none'}}>Terms</Link> ·{' '}
      <Link href="/refund" style={{color:'#aaa',textDecoration:'none'}}>Refund Policy</Link>
    </div>
  </footer>
)

export default function Contact() {
  const [form, setForm] = useState({name:'',email:'',phone:'',subject:'',message:''})
  const [status, setStatus] = useState('')

  function handleChange(e){ setForm({...form,[e.target.name]:e.target.value}) }

  async function handleSubmit(e){
    e.preventDefault()
    setStatus('sending')
    try {
      const r = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      if(r.ok){ setStatus('done'); setForm({name:'',email:'',phone:'',subject:'',message:''}) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp = {width:'100%',padding:'12px 14px',borderRadius:10,border:'1.5px solid #e5e5ea',fontSize:15,fontFamily:'inherit',outline:'none',boxSizing:'border-box',marginBottom:14}

  return (
    <>
      <Head>
        <title>Contact Us | HireHub360</title>
        <meta name="description" content="Contact HireHub360 for support, partnerships, or any queries. We respond within 2 hours during business hours." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://hirehub360.in/contact" />
        <meta property="og:title" content="Contact HireHub360" />
        <meta property="og:url" content="https://hirehub360.in/contact" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <NAV />

      <main style={{maxWidth:900,margin:'0 auto',padding:'64px 24px'}}>
        <div style={{textAlign:'center',marginBottom:56}}>
          <p style={{fontSize:12,fontWeight:700,letterSpacing:'0.1em',color:'#ff6b00',textTransform:'uppercase',marginBottom:8}}>Get In Touch</p>
          <h1 style={{fontSize:'clamp(28px,5vw,44px)',fontWeight:900,color:'#111',letterSpacing:'-0.04em',marginBottom:12}}>We'd love to hear from you</h1>
          <p style={{color:'#666',fontSize:17}}>Support, partnerships, feedback — we respond within 2 hours.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,alignItems:'start'}}>

          {/* Contact Info */}
          <div>
            {[
              {e:'📧',t:'Email',v:'support@hirehub360.in',h:'mailto:support@hirehub360.in'},
              {e:'📱',t:'WhatsApp',v:'+91 98200 00000',h:'https://wa.me/919820000000'},
              {e:'🕐',t:'Response Time',v:'Within 2 hours (Mon–Sat, 9AM–7PM IST)',h:null},
              {e:'📍',t:'Location',v:'Mumbai, Maharashtra, India',h:null},
            ].map(c=>(
              <div key={c.t} style={{display:'flex',gap:14,padding:'18px 0',borderBottom:'1px solid #f0f0f5'}}>
                <div style={{fontSize:24,flexShrink:0}}>{c.e}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>{c.t}</div>
                  {c.h
                    ? <a href={c.h} style={{color:'#ff6b00',fontWeight:600,fontSize:15,textDecoration:'none'}}>{c.v}</a>
                    : <div style={{color:'#111',fontSize:15}}>{c.v}</div>
                  }
                </div>
              </div>
            ))}

            <div style={{marginTop:28,background:'#f9f9fb',borderRadius:14,padding:'20px'}}>
              <div style={{fontWeight:700,marginBottom:8,color:'#111'}}>Quick Links</div>
              {[['🏢 Post a Job','/'],['🔍 Browse Jobs','/'],['📖 Blog & Resources','/blog'],['💰 Pricing','/pricing']].map(([l,h])=>(
                <div key={l} style={{marginBottom:6}}>
                  <Link href={h} style={{color:'#ff6b00',textDecoration:'none',fontSize:14,fontWeight:500}}>{l}</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{background:'#fff',border:'1.5px solid #eee',borderRadius:20,padding:'32px'}}>
            <h2 style={{fontSize:20,fontWeight:800,color:'#111',marginBottom:24}}>Send us a message</h2>
            {status === 'done' ? (
              <div style={{textAlign:'center',padding:'40px 0'}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <div style={{fontWeight:700,fontSize:18,color:'#111',marginBottom:6}}>Message sent!</div>
                <div style={{color:'#666'}}>We'll get back to you within 2 hours.</div>
                <button onClick={()=>setStatus('')} style={{marginTop:20,background:'#ff6b00',color:'#fff',border:'none',borderRadius:999,padding:'10px 24px',fontWeight:700,cursor:'pointer',fontSize:14}}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <input style={inp} name="name" placeholder="Your name *" value={form.name} onChange={handleChange} required/>
                  <input style={inp} name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange}/>
                </div>
                <input style={inp} name="email" type="email" placeholder="Email address *" value={form.email} onChange={handleChange} required/>
                <select style={inp} name="subject" value={form.subject} onChange={handleChange} required>
                  <option value="">Select topic *</option>
                  <option>Job Posting Support</option>
                  <option>Account / Login Issue</option>
                  <option>Payment / Billing</option>
                  <option>Partnership / B2B</option>
                  <option>Venue Booking</option>
                  <option>Report a Bug</option>
                  <option>Other</option>
                </select>
                <textarea style={{...inp,resize:'vertical'}} name="message" rows={5} placeholder="Your message *" value={form.message} onChange={handleChange} required/>
                <button type="submit" disabled={status==='sending'}
                  style={{background:'#ff6b00',color:'#fff',border:'none',borderRadius:999,padding:'13px',fontWeight:700,fontSize:15,cursor:'pointer',width:'100%',opacity:status==='sending'?0.7:1}}>
                  {status==='sending' ? 'Sending...' : 'Send Message →'}
                </button>
                {status==='error' && <p style={{color:'red',fontSize:13,marginTop:10,textAlign:'center'}}>Something went wrong. Email us at support@hirehub360.in</p>}
              </form>
            )}
          </div>

        </div>
      </main>
      <FOOTER />

      <style>{`@media(max-width:640px){main>div>div:first-child,main>div>div:last-child{grid-column:1/-1}main>div{grid-template-columns:1fr!important}}`}</style>
    </>
  )
}
