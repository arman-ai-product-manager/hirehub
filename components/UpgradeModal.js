import { useState, useEffect } from 'react'

const PLANS = [
  {
    key:      'starter',
    name:     'Starter',
    price:    2999,
    resumes:  100,
    label:    '100 resumes/month',
    popular:  false,
    features: ['100 AI screenings/month', 'All filters & export', 'Email support'],
  },
  {
    key:      'pro',
    name:     'Pro',
    price:    5999,
    resumes:  500,
    label:    '500 resumes/month',
    popular:  true,
    features: ['500 AI screenings/month', 'Priority screening', 'All Starter features', 'Priority support'],
  },
  {
    key:      'agency',
    name:     'Agency',
    price:    12999,
    resumes:  -1,
    label:    'Unlimited resumes',
    popular:  false,
    features: ['Unlimited AI screenings', 'All Pro features', 'Dedicated account manager'],
  },
]

function loadRazorpay() {
  return new Promise(resolve => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload  = () => resolve(true)
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })
}

// getToken — async fn that returns a fresh JWT
// usage     — { used, limit, unlimited, at_limit, percent, active }
// currentPlan — 'starter' | 'pro' | 'agency' | null
// onClose, onActivated(subscription) — callbacks
export default function UpgradeModal({ getToken, usage, currentPlan, onClose, onActivated }) {
  const [subscribing, setSubscribing] = useState(null) // plan key
  const [activating,  setActivating]  = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function handleSubscribe(plan) {
    setErr('')
    setSubscribing(plan.key)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { setErr('Could not load payment gateway — check your internet connection.'); setSubscribing(null); return }

      const token = await getToken()
      if (!token) { setErr('Session expired. Please sign in again.'); setSubscribing(null); return }

      const r = await fetch('/api/screener/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body:    JSON.stringify({ plan: plan.key }),
      })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Could not start checkout'); setSubscribing(null); return }

      const rzp = new window.Razorpay({
        key:             process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: d.subscription_id,
        name:            'HireHub360',
        description:     `${plan.name} — ₹${plan.price.toLocaleString('en-IN')}/month`,
        image:           '/favicon.svg',
        theme:           { color: '#ff6b00' },
        prefill:         {},
        handler: async function(response) {
          setActivating(true)
          setSubscribing(null)
          try {
            const freshToken = await getToken()
            const vr = await fetch('/api/screener/activate', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + freshToken },
              body:    JSON.stringify(response),
            })
            const vd = await vr.json()
            if (!vr.ok) { setErr(vd.error || 'Activation failed — contact support if plan not updated.'); setActivating(false); return }
            onActivated && onActivated(vd.subscription)
          } catch {
            setErr('Activation error — your payment went through. Contact support to unlock your plan.')
            setActivating(false)
          }
        },
        modal: { ondismiss: () => setSubscribing(null) },
      })
      rzp.open()
    } catch {
      setErr('Something went wrong. Please try again.')
      setSubscribing(null)
    }
  }

  const usedPct  = usage?.unlimited ? 0 : (usage?.limit ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0)
  const barColor = usedPct >= 90 ? '#dc2626' : usedPct >= 70 ? '#d97706' : '#ff6b00'

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px 40px', overflowY: 'auto' }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 740, padding: '32px 28px 28px', position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
        <button onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}
          aria-label="Close">×</button>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.03em', color: '#111827', margin: '0 0 5px' }}>
            {activating ? 'Activating your plan…' : 'Upgrade your plan'}
          </h2>
          {!activating && usage && (
            <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
              {usage.at_limit
                ? `You've used all ${usage.limit} screenings this month — upgrade to continue.`
                : !usage.active
                ? 'Subscribe to start AI-screening resumes.'
                : `${usage.used} of ${usage.limit} screenings used this month.`}
            </p>
          )}
          {activating && (
            <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Verifying payment and unlocking your account…</p>
          )}
        </div>

        {/* Usage bar */}
        {!activating && usage && !usage.unlimited && usage.limit > 0 && (
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: '#374151' }}>This month's usage</span>
              <span style={{ color: barColor }}>{usage.used} / {usage.limit} resumes</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: 999, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${usedPct}%`, height: '100%', borderRadius: 999, background: barColor, transition: 'width .4s' }} />
            </div>
          </div>
        )}

        {activating ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            Activating…
          </div>
        ) : (
          <>
            {/* Plan cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: 12, marginBottom: 0 }}>
              {PLANS.map(plan => {
                const isCurrent = currentPlan === plan.key
                const isLoading = subscribing === plan.key
                return (
                  <div key={plan.key} style={{
                    border:        `2px solid ${plan.popular ? '#ff6b00' : isCurrent ? '#16a34a' : '#e5e7eb'}`,
                    borderRadius:  14,
                    padding:       '20px 16px',
                    position:      'relative',
                    background:    plan.popular ? '#fff9f5' : '#fff',
                  }}>
                    {plan.popular && !isCurrent && (
                      <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#ff6b00', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: '.04em' }}>
                        MOST POPULAR
                      </div>
                    )}
                    {isCurrent && (
                      <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                        CURRENT PLAN
                      </div>
                    )}

                    <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 3 }}>{plan.name}</div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontWeight: 900, fontSize: 26, color: '#111827', letterSpacing: '-.03em' }}>₹{plan.price.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>/month</span>
                    </div>
                    <div style={{ display: 'inline-block', fontSize: 11, color: '#374151', fontWeight: 700, background: '#f3f4f6', padding: '3px 9px', borderRadius: 6, marginBottom: 12 }}>
                      {plan.label}
                    </div>
                    <ul style={{ padding: 0, margin: '0 0 16px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.4 }}>
                          <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => !isCurrent && !subscribing && handleSubscribe(plan)}
                      disabled={isCurrent || !!subscribing}
                      style={{
                        width:      '100%',
                        padding:    '10px',
                        borderRadius: 9,
                        border:     'none',
                        background: isCurrent ? '#dcfce7' : plan.popular ? '#ff6b00' : '#1d1d1f',
                        color:      isCurrent ? '#16a34a' : '#fff',
                        fontWeight: 700,
                        fontSize:   13,
                        cursor:     isCurrent || subscribing ? 'default' : 'pointer',
                        opacity:    isLoading ? .75 : 1,
                        transition: 'opacity .15s',
                      }}>
                      {isCurrent ? '✓ Current Plan' : isLoading ? 'Opening checkout…' : 'Subscribe →'}
                    </button>
                  </div>
                )
              })}
            </div>

            {err && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, marginTop: 16 }}>
                {err}
              </div>
            )}

            <p style={{ textAlign: 'center', margin: '16px 0 0', fontSize: 11, color: '#9ca3af' }}>
              Secured by Razorpay · Cancel anytime · Auto-renews monthly
            </p>
          </>
        )}
      </div>
    </div>
  )
}
