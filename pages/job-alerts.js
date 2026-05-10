import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const CITIES = ['Mumbai','Bangalore','Delhi','Hyderabad','Pune','Chennai','Noida','Gurgaon','Kolkata','Ahmedabad','Remote']

export default function JobAlerts() {
  const [contact, setContact] = useState('')
  const [keywords, setKeywords] = useState('')
  const [city, setCity] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [state, setState] = useState({ status: 'idle', msg: '' })

  async function submit(e) {
    e.preventDefault()
    setState({ status: 'loading', msg: '' })
    try {
      const r = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contact, keywords, city, frequency }),
      })
      const j = await r.json()
      if (!r.ok) {
        setState({ status: 'error', msg: j.error || 'Could not save alert' })
        return
      }
      setState({ status: 'success', msg: '✅ Alert saved! You will get notified when matching jobs are posted.' })
      setKeywords(''); setCity('')
    } catch {
      setState({ status: 'error', msg: 'Network error. Try again.' })
    }
  }

  return (
    <>
      <Head>
        <title>Job Alerts — Get notified when matching jobs are posted | HireHub360</title>
        <meta name="description" content="Set up free job alerts and get email/SMS when new jobs matching your skills and city are posted on HireHub360." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div style={{ minHeight:'100vh', background:'#f5f5f7', fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui" }}>
        <header style={{ background:'#fff', borderBottom:'1px solid #e5e5e7', padding:'14px 20px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ fontSize:18, fontWeight:700, color:'#1d1d1f', textDecoration:'none' }}>
              HireHub<span style={{ color:'#ff6b00' }}>Hub</span><sup style={{ fontSize:10, color:'#ff6b00' }}>360</sup>
            </Link>
            <Link href="/" style={{ fontSize:14, color:'#0066cc', textDecoration:'none' }}>← Browse jobs</Link>
          </div>
        </header>

        <main style={{ maxWidth:640, margin:'0 auto', padding:'40px 16px 80px' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🔔</div>
            <h1 style={{ fontSize:34, fontWeight:700, color:'#1d1d1f', marginBottom:10 }}>Job Alerts</h1>
            <p style={{ color:'#6e6e73', fontSize:16, lineHeight:1.5 }}>
              Get notified the moment a matching job is posted. Free, no spam, unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={submit} style={{ background:'#fff', borderRadius:18, padding:'28px 24px', border:'1px solid #e5e5e7' }}>
            <Field label="Email or phone *">
              <input
                type="text" value={contact} onChange={e=>setContact(e.target.value)}
                placeholder="you@email.com  or  9876543210"
                required
                style={inputStyle}
              />
            </Field>

            <Field label="Job keywords" hint="e.g. React developer, sales, content writer">
              <input
                type="text" value={keywords} onChange={e=>setKeywords(e.target.value)}
                placeholder="React developer"
                style={inputStyle}
              />
            </Field>

            <Field label="Preferred city">
              <select value={city} onChange={e=>setCity(e.target.value)} style={inputStyle}>
                <option value="">Any city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Notification frequency">
              <div style={{ display:'flex', gap:10 }}>
                {['daily','weekly'].map(f => (
                  <button key={f} type="button" onClick={()=>setFrequency(f)}
                    style={{
                      flex:1, padding:'12px', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer',
                      background: frequency===f ? '#ff6b00' : '#fff',
                      color: frequency===f ? '#fff' : '#1d1d1f',
                      border:'1px solid '+(frequency===f ? '#ff6b00' : '#e5e5e7'),
                    }}>
                    {f === 'daily' ? '⚡ Daily' : '📬 Weekly digest'}
                  </button>
                ))}
              </div>
            </Field>

            <p style={{ fontSize:12, color:'#6e6e73', marginTop:4, marginBottom:18 }}>
              At least one of <strong>keywords</strong> or <strong>city</strong> is required.
            </p>

            <button type="submit" disabled={state.status==='loading'}
              style={{
                width:'100%', background:'#ff6b00', color:'#fff', padding:'14px', borderRadius:12,
                fontSize:16, fontWeight:600, border:'none', cursor:'pointer',
                opacity: state.status==='loading' ? 0.7 : 1,
              }}>
              {state.status==='loading' ? 'Saving…' : 'Create alert'}
            </button>

            {state.msg && (
              <div style={{
                marginTop:16, padding:'12px 14px', borderRadius:10, fontSize:14,
                background: state.status==='success' ? '#d1fae5' : '#fee2e2',
                color: state.status==='success' ? '#065f46' : '#991b1b',
              }}>{state.msg}</div>
            )}
          </form>

          <div style={{ marginTop:32, padding:'20px 24px', background:'#fff7ed', borderRadius:14, border:'1px solid #fed7aa' }}>
            <p style={{ fontSize:14, color:'#9a3412', margin:0, lineHeight:1.6 }}>
              <strong>Pro tip:</strong> Be specific with keywords. "React developer" works better than "developer".
              You can create multiple alerts with different keywords.
            </p>
          </div>
        </main>
      </div>
    </>
  )
}

const inputStyle = {
  width:'100%', padding:'12px 14px', fontSize:16, borderRadius:10,
  border:'1px solid #d2d2d7', background:'#fff', color:'#1d1d1f',
  outline:'none', boxSizing:'border-box',
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:14, fontWeight:500, color:'#1d1d1f', marginBottom:6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize:12, color:'#6e6e73', margin:'6px 0 0' }}>{hint}</p>}
    </div>
  )
}
