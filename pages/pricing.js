import Head from 'next/head'
import { useState } from 'react'

// ─── PLAN DATA ────────────────────────────────────────────────────────────────
const COMPANY_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    label: '₹0',
    period: 'Forever free',
    desc: 'Get started with zero risk',
    badge: null,
    highlight: false,
    dark: false,
    anchor: null,
    social: null,
    scarcity: null,
    features: [
      '2 job posts/day',
      'Basic applicant view',
      '30-day listing',
      'Company profile page',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'secondary',
    isFree: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 999,
    label: '₹999',
    period: '/month · Cancel anytime',
    desc: 'For companies hiring consistently',
    badge: '⭐ Most Popular',
    highlight: true,
    dark: false,
    anchor: '₹2,999/mo',
    social: '1,200+ companies this month',
    scarcity: '🔒 3 slots left at launch price',
    features: [
      'Unlimited job posts',
      'Find CVs — full access',
      '10 CV unlock credits/month',
      'AI applicant fit score',
      'Applicant CRM + pipeline',
      'Company Partner badge',
      'Google-indexed jobs',
      '7-day free trial',
    ],
    cta: 'Start 7-Day Free Trial →',
    ctaStyle: 'primary',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 2499,
    label: '₹2,499',
    period: '/month · Cancel anytime',
    desc: 'For fast-growing teams',
    badge: '🚀 Best Value',
    badgeColor: '#af52de',
    highlight: false,
    dark: false,
    anchor: null,
    social: '320+ teams on Scale',
    scarcity: null,
    features: [
      'Everything in Growth',
      '50 CV unlock credits/month',
      'Bulk CV download',
      'Priority candidate alerts',
      'Dedicated account manager',
      'ATS integration',
      'Venue booking 30% off',
      '14-day free trial',
    ],
    cta: 'Start Free Trial →',
    ctaStyle: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    label: 'Custom',
    period: 'Volume pricing · Billed monthly',
    desc: 'For large corporations & staffing firms',
    badge: '🏆 Best for Corps',
    badgeColor: '#ff9500',
    highlight: false,
    dark: true,
    anchor: null,
    social: '50+ corporates on Enterprise',
    scarcity: null,
    features: [
      '500+ CV credits/month',
      'Multi-user team accounts',
      'White-label career portal',
      'SLA support 6am–11pm',
      'Custom ATS integration',
      'Co-branded venue events',
      'Dedicated success manager',
    ],
    cta: 'Talk to Our Team →',
    ctaStyle: 'dark',
    isEnterprise: true,
  },
]

const CREDIT_PACKS = [
  { credits: 10,  price: 499,  per: '₹49.9/CV', label: '₹499',   badge: null,          ctaLabel: 'Buy 10 Credits' },
  { credits: 50,  price: 1999, per: '₹39.9/CV', label: '₹1,999', badge: '🔥 Best Value', ctaLabel: 'Buy 50 Credits' },
  { credits: 200, price: 5999, per: '₹29.9/CV', label: '₹5,999', badge: null,            ctaLabel: 'Buy 200 Credits' },
]

const SEEKER_PLANS = [
  {
    id: 'free_seeker',
    name: 'Free',
    price: 0,
    label: '₹0',
    period: 'Forever',
    badge: null,
    highlight: false,
    features: ['Browse all jobs', 'Basic profile & CV', '3 applications/day', '1 free ATS scan'],
    cta: 'Current Plan',
    isFree: true,
  },
  {
    id: 'pro_seeker',
    name: 'Pro Seeker',
    price: 99,
    label: '₹99',
    period: '/month · Cancel anytime',
    badge: '🔥 Best for Job Seekers',
    highlight: true,
    anchor: '₹299/mo',
    social: '18,400+ active seekers',
    scarcity: '⏰ Early adopter price — ends Apr 30',
    features: [
      'Unlimited applications',
      '20 ATS scans/month',
      'Priority in recruiter search',
      'AI CV builder unlimited',
      'Salary negotiation guide',
      'Direct recruiter connect',
      'First month ₹1 trial',
    ],
    cta: 'Start for ₹1 →',
    ctaStyle: 'primary',
    trialAmount: 100,
  },
  {
    id: 'career_plus',
    name: 'Career Plus',
    price: 249,
    label: '₹249',
    period: '/month · Cancel anytime',
    badge: null,
    highlight: false,
    features: [
      'Everything in Pro',
      '1:1 career coaching',
      'Resume review by expert',
      'Referral network access',
      'Interview prep sessions',
      'Featured profile badge',
    ],
    cta: 'Start Free Trial →',
    ctaStyle: 'primary',
  },
]

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [loading, setLoading] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState('company') // 'company' | 'seeker'

  async function handlePay(planId, amount, label) {
    if (!amount) {
      // Enterprise contact
      window.open('https://wa.me/919820000000?text=Hi+I+want+Enterprise+pricing+for+HireHub360', '_blank')
      return
    }
    if (amount === 0) return // free plan
    setLoading(planId)
    setError('')
    try {
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR', receipt: `hire_${planId}_${Date.now()}` }),
      })
      const data = await res.json()
      if (!res.ok || !data.orderId) throw new Error(data.error || 'Could not create order')
      if (typeof window === 'undefined' || !window.Razorpay) throw new Error('Razorpay not loaded')
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'HireHub360',
        description: label,
        order_id: data.orderId,
        image: 'https://hirehub360.in/favicon.ico',
        theme: { color: '#ff6b00' },
        handler: () => {
          setSuccess(`🎉 Payment successful! ${label} is now active.`)
          setLoading('')
        },
        modal: { ondismiss: () => setLoading('') },
      })
      rzp.on('payment.failed', (r) => {
        setError('Payment failed: ' + (r.error?.description || 'Unknown error'))
        setLoading('')
      })
      rzp.open()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading('')
    }
  }

  return (
    <>
      <Head>
        <title>Pricing — HireHub360 | India's Smartest Hiring Platform</title>
        <meta name="description" content="Monthly plans from ₹999/mo. Pay-per-CV unlock. ATS Scanner. No hidden fees. 3,400+ companies trust HireHub360." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        /* Nav */
        .nav{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border-bottom:1px solid #e5e5ea;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}.logo span{color:#ff6b00}
        .btn-back{background:#f5f5f7;color:#1d1d1f;padding:8px 18px;border-radius:999px;font-weight:600;font-size:13px;border:none;cursor:pointer}
        /* Hero */
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 50%,#0a0a0f 100%);padding:60px 5vw 52px;text-align:center;color:#fff;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-40px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(255,107,0,.25) 0%,transparent 70%);pointer-events:none}
        .hero::after{content:'';position:absolute;bottom:-30px;left:30px;width:200px;height:200px;background:radial-gradient(circle,rgba(255,107,0,.12) 0%,transparent 70%);pointer-events:none}
        .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,107,0,.15);border:1px solid rgba(255,107,0,.3);border-radius:999px;padding:5px 16px;font-size:11px;font-weight:700;color:#ff6b00;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px}
        .hero h1{font-size:clamp(30px,5.5vw,56px);font-weight:900;letter-spacing:-.05em;margin-bottom:14px;position:relative}
        .hero h1 span{color:#ff6b00}
        .hero p{font-size:15px;color:#999;max-width:460px;margin:0 auto 20px;line-height:1.7;position:relative}
        .hero-social{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;font-size:12px;color:#666;position:relative}
        .hero-social span{display:flex;align-items:center;gap:5px}
        /* Tab switcher */
        .tab-wrap{display:flex;justify-content:center;padding:28px 5vw 0}
        .tab-row{display:inline-flex;background:#fff;border-radius:999px;padding:4px;border:1.5px solid #e5e5ea;gap:2px}
        .tab-btn{padding:9px 24px;border-radius:999px;border:none;font-size:14px;font-weight:700;cursor:pointer;transition:all .18s;color:#6e6e73;background:transparent}
        .tab-btn.active{background:#ff6b00;color:#fff;box-shadow:0 4px 14px rgba(255,107,0,.3)}
        /* Section label */
        .sec-label{font-size:11px;font-weight:700;color:#6e6e73;text-transform:uppercase;letter-spacing:.08em;text-align:center;margin:32px 0 16px}
        /* Plan grid */
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;padding:0 5vw;max-width:1200px;margin:0 auto}
        /* Plan card */
        .plan{background:#fff;border-radius:20px;padding:28px 24px;border:2px solid #e5e5ea;transition:all .2s;position:relative;overflow:hidden}
        .plan.highlight{border-color:#ff6b00;box-shadow:0 8px 40px rgba(255,107,0,.15)}
        .plan.dark{background:linear-gradient(135deg,#1d1d1f,#2c1a00);border:none;color:#fff}
        .plan-accent{position:absolute;top:0;left:0;right:0;height:3px}
        .plan-badge{position:absolute;top:-1px;right:20px;color:#fff;font-size:10px;font-weight:800;padding:5px 14px;border-radius:0 0 10px 10px;white-space:nowrap;letter-spacing:.02em}
        .plan-name{font-size:13px;font-weight:800;color:#6e6e73;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
        .plan.dark .plan-name{color:#888}
        .plan-anchor{font-size:12px;color:#aaa;text-decoration:line-through;margin-bottom:2px}
        .plan-price{font-size:40px;font-weight:900;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:2px}
        .plan.dark .plan-price{color:#ff6b00}
        .plan.highlight .plan-price{color:#ff6b00}
        .plan-period{font-size:12px;color:#6e6e73;margin-bottom:8px}
        .plan.dark .plan-period{color:#888}
        .plan-social{font-size:11px;color:#6e6e73;margin-bottom:4px}
        .plan.dark .plan-social{color:#666}
        .plan-scarcity{font-size:11px;color:#ff9500;font-weight:700;margin-bottom:12px}
        .plan-feats{list-style:none;margin-bottom:20px;display:flex;flex-direction:column;gap:7px}
        .plan-feats li{font-size:13px;color:#3d3d3f;display:flex;align-items:flex-start;gap:8px}
        .plan.dark .plan-feats li{color:#ccc}
        .plan-feats li::before{content:'✅';flex-shrink:0;font-size:12px;margin-top:1px}
        /* Buttons */
        .pay-btn{width:100%;padding:14px;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;border:none;transition:all .18s;letter-spacing:-.02em}
        .pay-btn.primary{background:#ff6b00;color:#fff}
        .pay-btn.primary:hover{opacity:.88;transform:translateY(-1px)}
        .pay-btn.secondary{background:#f5f5f7;color:#1d1d1f}
        .pay-btn.secondary:hover{background:#e5e5ea}
        .pay-btn.dark{background:#ff6b00;color:#fff}
        .pay-btn.dark:hover{opacity:.88}
        .pay-btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
        /* Credit packs */
        .credits-section{max-width:1200px;margin:28px auto 0;padding:0 5vw}
        .credits-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
        .credit-card{background:#fff;border-radius:16px;padding:20px;border:2px solid #e5e5ea;position:relative;transition:all .2s}
        .credit-card.highlight{border-color:#ff6b00}
        .credit-badge{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#ff6b00;color:#fff;font-size:10px;font-weight:800;padding:3px 12px;border-radius:999px;white-space:nowrap}
        .credit-count{font-size:28px;font-weight:900;color:#1d1d1f;margin-bottom:3px}
        .credit-price{font-size:32px;font-weight:900;color:#ff6b00;margin-bottom:2px}
        .credit-per{font-size:12px;color:#6e6e73;margin-bottom:14px}
        /* ATS addon */
        .ats-box{background:#fff;border-radius:16px;padding:20px 24px;border:1.5px solid #e5e5ea;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;max-width:1200px;margin:16px auto 0;padding-left:5vw;padding-right:5vw}
        /* Alerts */
        .alert{margin:16px 5vw;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;text-align:center}
        .alert.ok{background:#f0fdf4;color:#1a8a3c;border:1.5px solid #bbf7d0}
        .alert.err{background:#fff1f2;color:#be123c;border:1.5px solid #fecdd3}
        /* Footer strip */
        .trust{text-align:center;padding:20px 5vw 6px;color:#aaa;font-size:12px}
        .guarantee{text-align:center;padding:16px 5vw 48px;color:#6e6e73;font-size:13px}
        footer{background:#1d1d1f;color:#555;padding:28px 5vw;text-align:center;font-size:12px}
        @media(max-width:640px){.plans{grid-template-columns:1fr;padding:0 4vw}.credits-grid{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire <span>Hub</span>360</a>
        <a href="/" className="btn-back">← Back to App</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">💳 Transparent Pricing</div>
        <h1>Hire Smarter.<br /><span>Pay Less.</span></h1>
        <p>Monthly plans. Pay-per-CV unlock. No lock-in. Cancel anytime. India's best value hiring platform.</p>
        <div className="hero-social">
          <span>🏢 3,400+ companies</span>
          <span>👤 1.2L+ job seekers</span>
          <span>⚡ Avg hire in 8 days</span>
          <span>🔒 Razorpay secured</span>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="tab-wrap">
        <div className="tab-row">
          <button className={`tab-btn${tab === 'company' ? ' active' : ''}`} onClick={() => setTab('company')}>🏢 For Companies</button>
          <button className={`tab-btn${tab === 'seeker' ? ' active' : ''}`} onClick={() => setTab('seeker')}>👤 For Job Seekers</button>
        </div>
      </div>

      {/* ALERTS */}
      {success && <div className="alert ok">{success}</div>}
      {error   && <div className="alert err">⚠️ {error}</div>}

      {/* ── COMPANY PLANS ── */}
      {tab === 'company' && <>
        <div className="sec-label">Monthly Plans — Cancel Anytime</div>
        <div className="plans">
          {COMPANY_PLANS.map(plan => (
            <div key={plan.id} className={`plan${plan.highlight ? ' highlight' : ''}${plan.dark ? ' dark' : ''}`}>
              {plan.highlight && <div className="plan-accent" style={{ background: 'linear-gradient(90deg,#ff6b00,#ff9500)' }} />}
              {plan.badge && (
                <div className="plan-badge" style={{ background: plan.badgeColor || '#ff6b00' }}>{plan.badge}</div>
              )}
              <div className="plan-name" style={{ marginTop: plan.badge ? '18px' : '0' }}>{plan.name}</div>
              {plan.anchor && <div className="plan-anchor">Was {plan.anchor}</div>}
              <div className="plan-price">{plan.label}</div>
              <div className="plan-period">{plan.period}</div>
              {plan.social && <div className="plan-social">👥 {plan.social}</div>}
              {plan.scarcity && <div className="plan-scarcity">{plan.scarcity}</div>}
              <ul className="plan-feats" style={{ marginTop: plan.social || plan.scarcity ? '0' : '14px' }}>
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button
                className={`pay-btn ${plan.ctaStyle || 'secondary'}`}
                disabled={loading === plan.id || plan.isFree}
                onClick={() => plan.isEnterprise
                  ? handlePay(plan.id, null, plan.name)
                  : plan.isFree
                    ? null
                    : handlePay(plan.id, plan.price * 100, `${plan.name} Monthly — ₹${plan.price}/mo`)}
              >
                {loading === plan.id ? '⏳ Processing…' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* CV CREDIT PACKS */}
        <div className="credits-section">
          <div className="sec-label" style={{ textAlign: 'left', marginLeft: 0 }}>💳 Pay-Per-CV Unlock — No Subscription Needed</div>
          <div className="credits-grid">
            {CREDIT_PACKS.map(pack => (
              <div key={pack.credits} className={`credit-card${pack.badge ? ' highlight' : ''}`}>
                {pack.badge && <div className="credit-badge">{pack.badge}</div>}
                <div className="credit-count">{pack.credits} Credits</div>
                <div className="credit-price">{pack.label}</div>
                <div className="credit-per">{pack.per} · No expiry</div>
                <button
                  className={`pay-btn${pack.badge ? ' primary' : ''}`}
                  style={!pack.badge ? { background: '#1d1d1f', color: '#fff' } : {}}
                  disabled={loading === `c_${pack.credits}`}
                  onClick={() => handlePay(`c_${pack.credits}`, pack.price * 100, `${pack.credits} CV Credits`)}
                >
                  {loading === `c_${pack.credits}` ? '⏳…' : `${pack.ctaLabel} →`}
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 12 }}>
            Each credit unlocks 1 candidate's full contact info (phone + email). Credits never expire.
          </p>
        </div>
      </>}

      {/* ── JOB SEEKER PLANS ── */}
      {tab === 'seeker' && <>
        <div className="sec-label">Plans for Job Seekers</div>
        <div className="plans" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {SEEKER_PLANS.map(plan => (
            <div key={plan.id} className={`plan${plan.highlight ? ' highlight' : ''}`}>
              {plan.highlight && <div className="plan-accent" style={{ background: 'linear-gradient(90deg,#ff6b00,#ff9500)' }} />}
              {plan.badge && <div className="plan-badge" style={{ background: '#ff6b00' }}>{plan.badge}</div>}
              <div className="plan-name" style={{ marginTop: plan.badge ? '18px' : '0' }}>{plan.name}</div>
              {plan.anchor && <div className="plan-anchor">Was {plan.anchor}</div>}
              <div className="plan-price">{plan.label}</div>
              <div className="plan-period">{plan.period}</div>
              {plan.social && <div className="plan-social">👥 {plan.social}</div>}
              {plan.scarcity && <div className="plan-scarcity">{plan.scarcity}</div>}
              <ul className="plan-feats" style={{ marginTop: '12px' }}>
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button
                className={`pay-btn ${plan.ctaStyle || 'secondary'}`}
                disabled={loading === plan.id || plan.isFree}
                onClick={() => plan.isFree ? null : handlePay(plan.id, plan.trialAmount || plan.price * 100, plan.name)}
              >
                {loading === plan.id ? '⏳ Processing…' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ATS SCAN PACKS */}
        <div style={{ maxWidth: 1200, margin: '24px auto 0', padding: '0 5vw' }}>
          <div className="sec-label" style={{ textAlign: 'left', marginLeft: 0 }}>🤖 ATS Scan Packs — Beat the Bots, Rank in Recruiter Search</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { scans: 1, price: 0, label: '₹0', badge: null, note: 'Lifetime free', cta: 'Already Included', isFree: true },
              { scans: 20, price: 9, label: '₹9', badge: '⚡ Best Entry', note: '₹0.45/scan — insane value', cta: 'Buy 20 Scans →' },
              { scans: 100, price: 29, label: '₹29', badge: '🔥 Most Scans', note: '₹0.29/scan', cta: 'Buy 100 Scans →' },
            ].map(p => (
              <div key={p.scans} className={`credit-card${p.badge ? ' highlight' : ''}`} style={{ borderColor: p.badge ? '#ff6b00' : '#e5e5ea' }}>
                {p.badge && <div className="credit-badge">{p.badge}</div>}
                <div style={{ fontSize: 28, fontWeight: 900, color: '#1d1d1f', marginBottom: 3 }}>{p.scans} Scan{p.scans > 1 ? 's' : ''}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: p.isFree ? '#34c759' : '#ff6b00', marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: '#6e6e73', marginBottom: 14 }}>{p.note}</div>
                <button
                  className="pay-btn"
                  style={{ background: p.isFree ? '#f5f5f7' : p.badge ? '#ff6b00' : '#1d1d1f', color: p.isFree ? '#1d1d1f' : '#fff' }}
                  disabled={p.isFree || loading === `ats_${p.scans}`}
                  onClick={() => p.isFree ? null : handlePay(`ats_${p.scans}`, p.price * 100, `${p.scans} ATS Scans`)}
                >
                  {loading === `ats_${p.scans}` ? '⏳…' : p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* TRUST STRIP */}
      <div className="trust">🔒 Secured by Razorpay · All prices incl. 18% GST · Cancel anytime · No hidden fees</div>
      <div className="guarantee">
        <strong>30-day money-back guarantee</strong> on all paid plans. If you don't hire in 30 days, we refund — no questions asked.
      </div>

      <footer>
        © 2026 HireHub360 · hirehub360.in · For enterprise queries: <a href="mailto:team@hirehub360.in" style={{ color: '#ff6b00' }}>team@hirehub360.in</a>
      </footer>
    </>
  )
}

export function getStaticProps() {
  return { props: {}, revalidate: 3600 }
}
