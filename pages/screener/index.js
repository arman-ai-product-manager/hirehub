import Head from 'next/head'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import UpgradeModal from '../../components/UpgradeModal'
import ScreenerLayout from '../../components/ScreenerLayout'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

function timeAgo(d) {
  const ms = Date.now() - new Date(d)
  const m  = Math.floor(ms / 60000)
  if (m < 60) return `${m || 1}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Landing page (shown to non-authenticated visitors) ──────────────────────

const LANDING_PLANS = [
  { key: 'starter', name: 'Starter', price: 2999, label: '100 resumes/month', popular: false, features: ['100 AI screenings/month', 'All filters & export', 'Email support'] },
  { key: 'pro',     name: 'Pro',     price: 5999, label: '500 resumes/month', popular: true,  features: ['500 AI screenings/month', 'Priority screening', 'All Starter features', 'Priority support'] },
  { key: 'agency',  name: 'Agency',  price: 12999, label: 'Unlimited resumes', popular: false, features: ['Unlimited AI screenings', 'All Pro features', 'Dedicated account manager'] },
]

function SignInBox() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [err,      setErr]      = useState('')
  const [mode,     setMode]     = useState('signin') // 'signin' | 'signup'

  async function handleEmail(e) {
    e.preventDefault()
    setErr('')
    if (!SB) return
    setLoading(true)
    try {
      const fn = mode === 'signup' ? SB.auth.signUp : SB.auth.signInWithPassword
      const { error } = await fn.call(SB.auth, { email, password })
      if (error) setErr(error.message)
    } catch { setErr('Something went wrong') } finally { setLoading(false) }
  }

  async function handleGoogle() {
    if (!SB) return
    setLoading(true)
    const { error } = await SB.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: (typeof window !== 'undefined' ? window.location.origin : '') + '/screener' },
    })
    if (error) { setErr(error.message); setLoading(false) }
  }

  const inp = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '28px 26px', border: '1.5px solid #e5e7eb', maxWidth: 400, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,.08)' }}>
      <h2 style={{ fontWeight: 900, fontSize: 20, color: '#111827', margin: '0 0 4px', letterSpacing: '-.03em' }}>
        {mode === 'signup' ? 'Create account' : 'Sign in to get started'}
      </h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
        {mode === 'signup' ? 'Free trial — no credit card required' : 'Access your AI Resume Screener dashboard'}
      </p>

      {/* Google */}
      <button onClick={handleGoogle} disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px', border: '1.5px solid #e5e7eb', borderRadius: 9, background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 14, fontFamily: 'inherit' }}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#d1d5db', fontSize: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}/> or <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}/>
      </div>

      <form onSubmit={handleEmail}>
        <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inp, marginBottom: 14 }} />
        {err && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '9px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#ff6b00', color: '#fff', border: 'none', padding: '12px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, fontFamily: 'inherit' }}>
          {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account →' : 'Sign In →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 14 }}>
        {mode === 'signin' ? (
          <>No account? <button onClick={() => { setMode('signup'); setErr('') }} style={{ background: 'none', border: 'none', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>Sign up free →</button></>
        ) : (
          <>Already have one? <button onClick={() => { setMode('signin'); setErr('') }} style={{ background: 'none', border: 'none', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>Sign in →</button></>
        )}
      </p>
    </div>
  )
}

function LandingPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', color: '#111827' }}>
      {/* Nav */}
      <nav style={{ padding: '14px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-.03em', color: '#1d1d1f', textDecoration: 'none' }}>
          Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
        </a>
        <a href="#signin" style={{ background: '#ff6b00', color: '#fff', padding: '10px 22px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          Sign In →
        </a>
      </nav>

      {/* Hero — two column: headline left, sign-in box right */}
      <section id="signin" style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)', color: '#fff', padding: '64px 5vw 72px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', gap: 52, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Left: headline */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,107,0,.18)', border: '1px solid rgba(255,107,0,.35)', color: '#ff6b00', padding: '5px 16px', borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 24, letterSpacing: '.06em' }}>
              AI-POWERED RESUME SCREENING
            </div>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(32px, 5.5vw, 56px)', letterSpacing: '-.04em', margin: '0 0 18px', lineHeight: 1.08 }}>
              Screen 500 Resumes<br />
              <span style={{ color: '#ff6b00' }}>in 10 Minutes</span>
            </h1>
            <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(255,255,255,.6)', margin: '0 0 32px', maxWidth: 480, lineHeight: 1.7 }}>
              Upload any batch of PDFs. AI reads every resume, scores it 0–100 against your job description, and ranks candidates — so you interview only the best.
            </p>

            {/* Social proof */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[['500+', 'companies'], ['2M+', 'resumes screened'], ['10×', 'faster hiring']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontWeight: 900, fontSize: 20, color: '#ff6b00', letterSpacing: '-.03em' }}>{num}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: sign-in box */}
          <div style={{ flexShrink: 0, width: '100%', maxWidth: 400 }}>
            <SignInBox />
          </div>
        </div>
      </section>

      {/* Demo video placeholder */}
      <section style={{ background: '#f9fafb', padding: '60px 5vw' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.25)',
            aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Fake UI lines for decoration */}
            <div style={{ position: 'absolute', inset: 0, padding: '10% 8%', display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'none' }}>
              {[100, 85, 78, 62, 55, 41].map((score, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 1 - i * 0.12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626', flexShrink: 0 }}>{score}</div>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.08)', borderRadius: 4 }}>
                    <div style={{ width: `${score}%`, height: '100%', background: score >= 80 ? 'rgba(22,163,74,.6)' : score >= 60 ? 'rgba(217,119,6,.6)' : 'rgba(220,38,38,.5)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Play button */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,107,0,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 40px rgba(255,107,0,.4)', cursor: 'pointer' }}>
                <span style={{ fontSize: 26, marginLeft: 5 }}>▶</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Watch 2-minute demo</div>
              <div style={{ fontSize: 12, marginTop: 5, color: 'rgba(255,255,255,.5)' }}>See 100 resumes screened live</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 5vw', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-.03em', marginBottom: 52 }}>
            Everything you need to hire faster
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {[
              { icon: '⚡', title: 'Instant AI Analysis', desc: 'Each resume gets a 0–100 score, recommendation (Shortlist / Maybe / Reject), and specific reasoning — in seconds.' },
              { icon: '📊', title: 'Smart Ranking', desc: 'Candidates auto-ranked by fit. Filter by score, experience, or skills match. Export shortlist to CSV in one click.' },
              { icon: '🔒', title: 'Your Data, Secure', desc: "Resumes stored in encrypted cloud storage. GDPR-compliant. Delete any candidate's data instantly." },
              { icon: '📱', title: 'Works Everywhere', desc: 'Full mobile support. Review candidates, add to interview queue, and screen new batches from your phone.' },
              { icon: '📦', title: 'Batch Upload', desc: 'Drag and drop up to 500 PDFs at once. AI processes them all in parallel — no waiting, no queue.' },
              { icon: '✉️', title: 'Smart Notifications', desc: 'Get an email when screening is complete. Weekly digest of your hiring activity, automatically.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#f9fafb', borderRadius: 16, padding: '26px 22px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: '#f9fafb', padding: '72px 5vw' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-.03em', margin: '0 0 8px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 44, fontSize: 15 }}>Start screening today. Cancel anytime.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, paddingTop: 14 }}>
            {LANDING_PLANS.map(plan => (
              <div key={plan.key} style={{
                background: plan.popular ? '#fff9f5' : '#fff',
                border: `2px solid ${plan.popular ? '#ff6b00' : '#e5e7eb'}`,
                borderRadius: 16, padding: '26px 22px', position: 'relative',
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#ff6b00', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: '.04em' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{plan.name}</div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-.03em' }}>₹{plan.price.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>/month</span>
                </div>
                <div style={{ fontSize: 11, color: '#374151', fontWeight: 700, background: '#f3f4f6', display: 'inline-block', padding: '3px 10px', borderRadius: 6, marginBottom: 16 }}>
                  {plan.label}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#374151', display: 'flex', gap: 7, alignItems: 'flex-start', lineHeight: 1.4 }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="#signin" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: plan.popular ? '#ff6b00' : '#1d1d1f', color: '#fff' }}>
                  Get Started →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '72px 5vw', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 'clamp(22px, 4vw, 34px)', letterSpacing: '-.03em', marginBottom: 44 }}>
            Loved by hiring teams across India
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {[
              { name: 'Priya Sharma', role: 'HR Manager, TechCorp India', quote: 'We used to spend 3 days screening 200 resumes. Now it takes 15 minutes. The AI scores are surprisingly accurate — we shortlisted the same candidates we would have picked manually.' },
              { name: 'Rahul Mehta', role: 'Founder, StartupXYZ', quote: 'Hired our entire engineering team using HireHub360. The shortlist was spot-on — every candidate we interviewed was genuinely strong. Saved us weeks of work.' },
              { name: 'Sneha Patel', role: 'Talent Lead, GrowthCo', quote: 'Dropped 400 PDFs, got fully ranked results in under 10 minutes. The batch upload is incredible. Absolute game-changer for high-volume hiring.' },
            ].map(t => (
              <div key={t.name} style={{ background: '#f9fafb', borderRadius: 16, padding: '24px 22px', border: '1px solid #f3f4f6' }}>
                <div style={{ color: '#f59e0b', fontSize: 16, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, margin: '0 0 16px' }}>"{t.quote}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)', padding: '72px 5vw', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 5vw, 44px)', color: '#fff', letterSpacing: '-.03em', margin: '0 0 14px' }}>
          Ready to hire 10× faster?
        </h2>
        <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 16, margin: '0 0 36px' }}>Join 500+ companies screening smarter with AI. No credit card required to start.</p>
        <a href="#signin" style={{ background: '#ff6b00', color: '#fff', padding: '17px 44px', borderRadius: 12, fontWeight: 800, fontSize: 17, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 32px rgba(255,107,0,.4)' }}>
          Start Screening Today →
        </a>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1d1d1f', padding: '22px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>
          Hire<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: '0.5em', color: '#ff6b00' }}>360</sup>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>© 2025 HireHub360. All rights reserved.</div>
      </footer>
    </div>
  )
}

// ── Analytics bar chart ──────────────────────────────────────────────────────

function WeekChart({ getToken }) {
  const [days,    setDays]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getToken().then(token => {
      if (!token) { setLoading(false); return }
      fetch('/api/screener/analytics', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.days) setDays(d.days) })
        .catch(() => {})
        .finally(() => setLoading(false))
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !days) return null

  const total = days.reduce((s, d) => s + d.count, 0)
  if (total === 0) return null

  const maxCount = Math.max(...days.map(d => d.count), 1)

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#374151' }}>This week</span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{total} resumes uploaded</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 56 }}>
        {days.map(({ label, count }) => {
          const pct = Math.round((count / maxCount) * 100)
          return (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div title={`${count} resumes`} style={{
                width: '100%', background: count > 0 ? '#ff6b00' : '#f3f4f6',
                borderRadius: '4px 4px 2px 2px', height: `${Math.max(pct, count > 0 ? 8 : 4)}%`,
                minHeight: count > 0 ? 6 : 3, transition: 'height .4s',
              }} />
              <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600 }}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function ScreenerDashboard() {
  const [session,          setSession]          = useState(null)
  const [authLoading,      setAuthLoading]      = useState(true)
  const [jobs,             setJobs]             = useState([])
  const [loading,          setLoading]          = useState(true)
  const [creating,         setCreating]         = useState(false)
  const [form,             setForm]             = useState({ title: '', description: '', skills: '' })
  const [saving,           setSaving]           = useState(false)
  const [err,              setErr]              = useState('')
  const [netErr,           setNetErr]           = useState('')
  const [deleteJobConfirm, setDeleteJobConfirm] = useState(null)
  const [sub,              setSub]              = useState(null)
  const [usage,            setUsage]            = useState(null)
  const [showUpgrade,      setShowUpgrade]      = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = creating ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [creating])

  useEffect(() => {
    if (!deleteJobConfirm) return
    const t = setTimeout(() => setDeleteJobConfirm(null), 4000)
    return () => clearTimeout(t)
  }, [deleteJobConfirm])

  useEffect(() => {
    if (!SB) return
    SB.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
      if (data.session) {
        loadJobs(data.session.access_token)
        loadSubscription(data.session.access_token)
      } else setLoading(false)
    }).catch(() => {
      setAuthLoading(false)
      setLoading(false)
    })
  }, [])

  async function getToken() {
    if (!SB) return ''
    const { data } = await SB.auth.getSession()
    return data?.session?.access_token || ''
  }

  async function loadSubscription(token) {
    try {
      const r = await fetch('/api/screener/subscription', { headers: { Authorization: 'Bearer ' + token } })
      if (!r.ok) return
      const d = await r.json()
      setSub(d.subscription)
      setUsage(d.usage)
    } catch {}
  }

  async function loadJobs(token) {
    setLoading(true)
    setNetErr('')
    try {
      const r = await fetch('/api/screener/jobs', { headers: { Authorization: 'Bearer ' + token } })
      const d = await r.json()
      if (!r.ok) { setNetErr(d.error || 'Failed to load jobs'); setJobs([]); return }
      setJobs(d.jobs || [])
    } catch {
      setNetErr('Network error — could not load jobs')
    } finally {
      setLoading(false)
    }
  }

  async function createJob(e) {
    e.preventDefault()
    setErr('')
    if (!form.title.trim() || !form.description.trim()) { setErr('Title and description are required'); return }
    setSaving(true)
    try {
      const token = await getToken()
      if (!token) { setErr('Session expired — please sign in again'); return }
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
      const r = await fetch('/api/screener/jobs', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body:    JSON.stringify({ title: form.title.trim(), description: form.description.trim(), skills }),
      })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Could not create job'); return }
      setCreating(false)
      setForm({ title: '', description: '', skills: '' })
      loadJobs(token)
    } catch {
      setErr('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  async function deleteJob(id) {
    if (deleteJobConfirm !== id) { setDeleteJobConfirm(id); return }
    setDeleteJobConfirm(null)
    const token = await getToken()
    try {
      const r = await fetch('/api/screener/jobs?id=' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
      if (!r.ok) { const d = await r.json().catch(() => ({})); setNetErr(d.error || 'Delete failed'); return }
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch {
      setNetErr('Network error — delete failed')
    }
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', background: '#f9fafb' }}>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</div>
    </div>
  )

  if (!session) return (
    <>
      <Head>
        <title>AI Resume Screener — Screen 500 Resumes in 10 Minutes | HireHub360</title>
        <meta name="description" content="AI-powered resume screening. Upload PDFs, AI ranks every candidate against your JD in minutes. Starter from ₹2,999/month." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <LandingPage />
    </>
  )

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid #d1d5db', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }

  return (
    <>
      <Head>
        <title>AI Resume Screener — HireHub360</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {showUpgrade && (
        <UpgradeModal
          getToken={getToken}
          usage={usage}
          currentPlan={sub?.plan || null}
          onClose={() => setShowUpgrade(false)}
          onActivated={newSub => { setSub(newSub); setUsage(u => ({ ...u, active: true })); getToken().then(loadSubscription); setShowUpgrade(false) }}
        />
      )}

      <ScreenerLayout getToken={getToken} usage={usage} sub={sub} onShowUpgrade={() => setShowUpgrade(true)}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 5vw 60px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.04em', margin: 0, color: '#111827' }}>Jobs</h1>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '3px 0 0' }}>Upload up to 500 PDFs — AI ranks every candidate in minutes.</p>
            </div>
            <button
              onClick={() => { setCreating(true); setErr('') }}
              style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + New Job
            </button>
          </div>

          {/* Subscription status bar */}
          {usage && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {usage.active ? (
                <>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#374151' }}>
                        {sub?.plan ? sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1) + ' Plan' : 'Active'} —{' '}
                        {usage.unlimited ? 'Unlimited resumes' : `${usage.used} / ${usage.limit} resumes used`}
                      </span>
                      {!usage.unlimited && (
                        <span style={{ fontWeight: 700, color: usage.percent >= 90 ? '#dc2626' : usage.percent >= 70 ? '#d97706' : '#16a34a', flexShrink: 0 }}>{usage.percent}%</span>
                      )}
                    </div>
                    {!usage.unlimited && (
                      <div style={{ background: '#f3f4f6', borderRadius: 999, height: 7, overflow: 'hidden' }}>
                        <div style={{ width: `${usage.percent}%`, height: '100%', borderRadius: 999, background: usage.percent >= 90 ? '#dc2626' : usage.percent >= 70 ? '#d97706' : '#ff6b00', transition: 'width .4s' }} />
                      </div>
                    )}
                  </div>
                  {(usage.at_limit || usage.percent >= 80) && (
                    <button onClick={() => setShowUpgrade(true)} style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {usage.at_limit ? '🔒 Limit Reached — Upgrade' : 'Upgrade Plan'}
                    </button>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>🔒 No active subscription — subscribe to start screening</span>
                  <button onClick={() => setShowUpgrade(true)} style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
                    View Plans →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Weekly chart */}
          <WeekChart getToken={getToken} />

          {/* Network error */}
          {netErr && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: 1 }}>{netErr}</span>
              <button onClick={async () => { setNetErr(''); loadJobs(await getToken()) }} style={{ background: 'none', border: '1.5px solid #dc2626', color: '#dc2626', padding: '4px 12px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>Retry</button>
            </div>
          )}

          {/* Create Job Modal */}
          {creating && (
            <div
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
              onClick={e => { if (e.target === e.currentTarget) { setCreating(false); setErr(''); setForm({ title: '', description: '', skills: '' }) } }}
            >
              <div style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontWeight: 800, fontSize: 18, color: '#111827', margin: 0 }}>Create New Job</h2>
                  <button onClick={() => { setCreating(false); setErr(''); setForm({ title: '', description: '', skills: '' }) }} style={{ background: 'none', border: 'none', fontSize: 22, color: '#9ca3af', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>×</button>
                </div>
                <form onSubmit={createJob}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 5 }}>Job Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior React Developer" required autoCapitalize="words" style={{ ...inputStyle, marginBottom: 14 }} />

                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 5 }}>Job Description *</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Paste the full job description — AI uses this to evaluate every resume." required rows={6} style={{ ...inputStyle, marginBottom: 14, resize: 'vertical', lineHeight: 1.6 }} />

                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 5 }}>
                    Required Skills <span style={{ fontWeight: 400, color: '#9ca3af' }}>(comma separated, optional)</span>
                  </label>
                  <input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, Node.js, AWS, SQL" autoCapitalize="none" autoCorrect="off" style={{ ...inputStyle, marginBottom: 20 }} />

                  {err && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{err}</div>}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={saving} style={{ flex: 1, background: '#ff6b00', color: '#fff', border: 'none', padding: '12px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
                      {saving ? 'Creating…' : 'Create Job'}
                    </button>
                    <button type="button" onClick={() => { setCreating(false); setErr(''); setForm({ title: '', description: '', skills: '' }) }} style={{ padding: '12px 18px', borderRadius: 9, border: '1.5px solid #d1d5db', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Jobs grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading…</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', marginBottom: 6 }}>No jobs yet</h3>
              <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 13 }}>Create a job to start screening resumes with AI.</p>
              <button onClick={() => { setCreating(true); setErr('') }} style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                + Create First Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
              {jobs.map(job => {
                const isPendingDelete = deleteJobConfirm === job.id
                return (
                  <div key={job.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + (isPendingDelete ? '#fca5a5' : '#e5e7eb'), padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color .15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 15, color: '#111827', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h3>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(job.created_at)}</div>
                      </div>
                      {isPendingDelete ? (
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <button onClick={() => deleteJob(job.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 11px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Delete</button>
                          <button onClick={() => setDeleteJobConfirm(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 7, padding: '6px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => deleteJob(job.id)} style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 18, padding: '6px 10px', lineHeight: 1, flexShrink: 0, borderRadius: 6 }} aria-label="Delete job">×</button>
                      )}
                    </div>

                    {job.skills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {job.skills.slice(0, 5).map(s => (
                          <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>{s}</span>
                        ))}
                        {job.skills.length > 5 && <span style={{ fontSize: 10, color: '#9ca3af' }}>+{job.skills.length - 5}</span>}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap' }}>
                      <span><b style={{ color: '#374151' }}>{job.total}</b> <span style={{ color: '#9ca3af' }}>uploaded</span></span>
                      <span><b style={{ color: '#16a34a' }}>{job.done}</b> <span style={{ color: '#9ca3af' }}>screened</span></span>
                      {job.total - job.done > 0 && <span><b style={{ color: '#f59e0b' }}>{job.total - job.done}</b> <span style={{ color: '#9ca3af' }}>pending</span></span>}
                    </div>

                    <a href={`/screener/${job.id}`} style={{ display: 'block', textAlign: 'center', background: job.total > 0 ? '#ff6b00' : '#f3f4f6', color: job.total > 0 ? '#fff' : '#374151', padding: '10px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                      {job.total === 0 ? 'Upload Resumes →' : job.done < job.total ? 'Continue Screening →' : 'View Results →'}
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScreenerLayout>
    </>
  )
}
