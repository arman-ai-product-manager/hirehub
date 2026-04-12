import Head from 'next/head'
import { useState } from 'react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    label: '₹999',
    period: 'one-time',
    desc: 'Perfect for small companies hiring occasionally',
    features: [
      '5 Job Posts (30 days each)',
      'AI Candidate Ranking',
      'Applicant CRM',
      'Email Support',
      'Google-indexed job pages',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2999,
    label: '₹2,999',
    period: 'one-time',
    desc: 'For growing companies with active hiring needs',
    features: [
      '20 Job Posts (60 days each)',
      'AI CV Screening & Fit Score',
      'Priority Placement in Search',
      'Full Applicant CRM',
      'WhatsApp & Email Notifications',
      'Dedicated Support',
      'Company Brand Profile',
    ],
    cta: 'Go Pro →',
    highlight: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 7999,
    label: '₹7,999',
    period: 'one-time',
    desc: 'For enterprises with high-volume hiring',
    features: [
      'Unlimited Job Posts (90 days each)',
      'Advanced AI Matching',
      'Bulk CV Import & Export',
      'API Access',
      'Custom Branding',
      'Dedicated Account Manager',
      'Analytics Dashboard',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')

  async function handlePay(plan) {
    if (plan.id === 'unlimited') {
      window.location.href = 'mailto:armanshk612@gmail.com?subject=HireHub Unlimited Plan'
      return
    }

    setLoading(plan.id)
    setError('')

    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price * 100,          // paise
          currency: 'INR',
          receipt: `hire_${plan.id}_${Date.now()}`,
          notes: { plan: plan.id, product: 'HireHub' },
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.orderId) throw new Error(data.error || 'Could not create order')

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Hire Hub',
        description: `${plan.name} Plan`,
        order_id: data.orderId,
        image: 'https://hirehub360.in/favicon.ico',
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#ff6b00' },
        handler: function (response) {
          // Payment successful — verify on server
          fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan: plan.id,
            }),
          })
          setSuccess(`🎉 Payment successful! Your ${plan.name} plan is now active.`)
          setLoading('')
        },
        modal: {
          ondismiss: () => setLoading(''),
        },
      }

      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay not loaded. Please refresh and try again.')
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        setError('Payment failed: ' + (resp.error?.description || 'Unknown error'))
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
        <title>Pricing — Hire Hub | Post Jobs in India</title>
        <meta name="description" content="Simple one-time pricing to post jobs and hire top talent in India. No hidden fees, no subscription required." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        {/* Razorpay checkout script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f5f5f7;color:#1d1d1f}
        a{text-decoration:none;color:inherit}
        .nav{background:#fff;border-bottom:1px solid #e5e5ea;padding:0 5vw;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .logo{font-weight:900;font-size:22px;letter-spacing:-.04em}
        .logo span{color:#ff6b00}
        .btn-back{background:#f5f5f7;color:#1d1d1f;padding:8px 18px;border-radius:999px;font-weight:600;font-size:13px}
        .hero{background:linear-gradient(135deg,#0f0f0f 0%,#1a0800 60%,#0f0f0f 100%);padding:52px 5vw 44px;text-align:center;color:#fff}
        .hero h1{font-size:clamp(28px,5vw,52px);font-weight:900;letter-spacing:-.05em;margin-bottom:12px}
        .hero h1 span{color:#ff6b00}
        .hero p{font-size:16px;color:#aaa;max-width:480px;margin:0 auto;line-height:1.7}
        .badge{display:inline-block;background:rgba(255,107,0,.2);color:#ff6b00;padding:5px 14px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:18px;text-transform:uppercase;letter-spacing:.06em}
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;padding:44px 5vw;max-width:1100px;margin:0 auto}
        .plan{background:#fff;border-radius:20px;padding:32px 28px;border:2px solid #e5e5ea;transition:all .2s;position:relative}
        .plan.hot{border-color:#ff6b00;box-shadow:0 8px 40px rgba(255,107,0,.18)}
        .hot-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#ff6b00;color:#fff;padding:5px 20px;border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap;letter-spacing:.04em}
        .plan-name{font-size:15px;font-weight:700;color:#6e6e73;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em}
        .plan-price{font-size:44px;font-weight:900;letter-spacing:-.05em;color:#1d1d1f;margin-bottom:2px}
        .plan-price span{font-size:18px;font-weight:600;color:#6e6e73}
        .plan-desc{font-size:14px;color:#6e6e73;margin-bottom:24px;line-height:1.6;min-height:40px}
        .plan-feats{list-style:none;margin-bottom:28px}
        .plan-feats li{padding:7px 0;font-size:14px;color:#3d3d3f;display:flex;align-items:flex-start;gap:9px;border-bottom:1px solid #f5f5f7}
        .plan-feats li:last-child{border:none}
        .plan-feats li::before{content:'✓';color:#ff6b00;font-weight:800;flex-shrink:0;margin-top:1px}
        .pay-btn{width:100%;padding:15px;border-radius:12px;font-size:16px;font-weight:800;cursor:pointer;border:none;transition:all .18s;letter-spacing:-.02em}
        .pay-btn.primary{background:#ff6b00;color:#fff}
        .pay-btn.primary:hover{opacity:.88;transform:translateY(-1px)}
        .pay-btn.secondary{background:#f5f5f7;color:#1d1d1f}
        .pay-btn.secondary:hover{background:#e5e5ea}
        .pay-btn:disabled{opacity:.55;cursor:not-allowed;transform:none!important}
        .alert{margin:0 5vw 20px;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;text-align:center}
        .alert.ok{background:#f0fdf4;color:#1a8a3c;border:1.5px solid #bbf7d0}
        .alert.err{background:#fff1f2;color:#be123c;border:1.5px solid #fecdd3}
        .guarantee{text-align:center;padding:24px 5vw 48px;color:#6e6e73;font-size:14px}
        .guarantee strong{color:#1d1d1f}
        footer{background:#1d1d1f;color:#888;padding:28px 5vw;text-align:center;font-size:13px}
        @media(max-width:640px){.plans{grid-template-columns:1fr;padding:28px 5vw}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="logo">Hire <span>Hub</span></a>
        <a href="/" className="btn-back">← Browse Jobs</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="badge">💳 Simple Pricing</div>
        <h1>Pay Once,<br /><span>Hire Fast</span></h1>
        <p>No subscriptions. No monthly fees. Pay once and start posting jobs instantly.</p>
      </div>

      {/* ALERTS */}
      {success && <div className="alert ok">{success}</div>}
      {error   && <div className="alert err">⚠️ {error}</div>}

      {/* PLAN CARDS */}
      <div className="plans">
        {PLANS.map(plan => (
          <div key={plan.id} className={`plan${plan.highlight ? ' hot' : ''}`}>
            {plan.highlight && <div className="hot-badge">⭐ Most Popular</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">
              {plan.label}
              <span> / {plan.period}</span>
            </div>
            <p className="plan-desc">{plan.desc}</p>
            <ul className="plan-feats">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button
              className={`pay-btn ${plan.highlight ? 'primary' : 'secondary'}`}
              disabled={loading === plan.id}
              onClick={() => handlePay(plan)}
            >
              {loading === plan.id ? '⏳ Opening payment...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* GUARANTEE */}
      <div className="guarantee">
        🔒 <strong>Secure Payment via Razorpay</strong> &nbsp;·&nbsp; All major cards, UPI, Net Banking accepted
        <br /><br />
        Questions? Email us at <a href="mailto:armanshk612@gmail.com" style={{color:'#ff6b00',fontWeight:600}}>armanshk612@gmail.com</a>
      </div>

      <footer>© 2026 Hire Hub · India's AI Job Platform</footer>
    </>
  )
}
