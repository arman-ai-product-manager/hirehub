import { useState, useEffect, useRef } from 'react'

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

// getToken  — async fn returning a fresh JWT
// usage     — { used, limit, unlimited, at_limit, percent, active }
// currentPlan — 'starter' | 'pro' | 'agency' | null
// onClose, onActivated(subscription) — callbacks
export default function UpgradeModal({ getToken, usage, currentPlan, onClose, onActivated }) {
  // step: 'plans' | 'waiting' | 'done'
  const [step,        setStep]        = useState('plans')
  const [subscribing, setSubscribing] = useState(null)   // plan key during checkout call
  const [pendingSub,  setPendingSub]  = useState(null)   // { id, plan_name } while waiting
  const [activating,  setActivating]  = useState(false)  // manual verify in progress
  const [err,         setErr]         = useState('')
  const popupRef  = useRef(null)
  const pollRef   = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Poll subscription status every 3s while waiting for Cashfree auth
  useEffect(() => {
    if (step !== 'waiting' || !pendingSub) return
    pollRef.current = setInterval(async () => {
      try {
        const token = await getToken()
        const r = await fetch('/api/screener/subscription', {
          headers: { Authorization: 'Bearer ' + token },
        })
        if (!r.ok) return
        const d = await r.json()
        if (d.usage?.active) {
          clearInterval(pollRef.current)
          setStep('done')
          onActivated && onActivated(d.subscription)
        }
      } catch {}
    }, 3000)
    return () => clearInterval(pollRef.current)
  }, [step, pendingSub]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubscribe(plan) {
    setErr('')
    setSubscribing(plan.key)
    try {
      const token = await getToken()
      if (!token) { setErr('Session expired — please sign in again.'); setSubscribing(null); return }

      const r = await fetch('/api/screener/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body:    JSON.stringify({ plan: plan.key }),
      })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Could not start checkout'); setSubscribing(null); return }

      const authLink = d.authorization_link
      if (!authLink) { setErr('No payment link returned — contact support.'); setSubscribing(null); return }

      // Open Cashfree authorization in a popup window
      popupRef.current = window.open(
        authLink,
        'cashfree_auth',
        'width=620,height=720,scrollbars=yes,resizable=yes'
      )

      setPendingSub({ id: d.subscription_id, plan_name: d.plan_name })
      setStep('waiting')
      setSubscribing(null)
    } catch {
      setErr('Something went wrong. Please try again.')
      setSubscribing(null)
    }
  }

  // Manual verify — called when user clicks "I've completed payment"
  async function handleVerify() {
    if (!pendingSub || activating) return
    setErr('')
    setActivating(true)
    try {
      const token = await getToken()
      const r = await fetch('/api/screener/activate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body:    JSON.stringify({ subscription_id: pendingSub.id }),
      })
      const d = await r.json()
      if (!r.ok) {
        setErr(d.error || 'Payment not yet confirmed — please wait a moment and try again.')
        setActivating(false)
        return
      }
      clearInterval(pollRef.current)
      setStep('done')
      onActivated && onActivated(d.subscription)
    } catch {
      setErr('Verification error — contact support if you have paid.')
      setActivating(false)
    }
  }

  const usedPct  = usage?.unlimited ? 0 : (usage?.limit ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0)
  const barColor = usedPct >= 90 ? '#dc2626' : usedPct >= 70 ? '#d97706' : '#ff6b00'
  const canClose = step !== 'done'

  return (
    <div
      onClick={e => { if (canClose && e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 3000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '20px 16px 40px', overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 740,
        padding: '32px 28px 28px', position: 'relative', marginTop: 'auto', marginBottom: 'auto',
      }}>
        {canClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 18, background: 'none', border: 'none',
              fontSize: 24, color: '#9ca3af', cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
            }}
            aria-label="Close">×</button>
        )}

        {/* ── Waiting for payment ── */}
        {step === 'waiting' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>💳</div>
            <h2 style={{ fontWeight: 900, fontSize: 20, color: '#111827', margin: '0 0 8px' }}>
              Complete your payment
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>
              A Cashfree payment window has opened. Complete the authorization there.
              <br />This page will update automatically once your payment is confirmed.
            </p>

            {/* Animated spinner */}
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid #f3f4f6', borderTopColor: '#ff6b00',
              animation: 'spin 1s linear infinite', margin: '0 auto 24px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

            <p style={{ color: '#9ca3af', fontSize: 12, margin: '0 0 20px' }}>
              Waiting for confirmation from Cashfree…
            </p>

            <button
              onClick={handleVerify}
              disabled={activating}
              style={{
                background: '#ff6b00', color: '#fff', border: 'none', borderRadius: 10,
                padding: '12px 28px', fontWeight: 700, fontSize: 14,
                cursor: activating ? 'default' : 'pointer', opacity: activating ? .7 : 1,
                marginBottom: 12, display: 'block', width: '100%', maxWidth: 320, margin: '0 auto 12px',
              }}>
              {activating ? 'Verifying…' : "I've completed the payment →"}
            </button>

            <button
              onClick={() => {
                clearInterval(pollRef.current)
                popupRef.current?.close()
                setStep('plans')
                setPendingSub(null)
                setActivating(false)
                setErr('')
              }}
              style={{
                background: 'none', border: 'none', color: '#9ca3af', fontSize: 13,
                cursor: 'pointer', padding: '4px 8px',
              }}>
              ← Back to plans
            </button>

            {err && (
              <div style={{
                background: '#fee2e2', color: '#dc2626', padding: '11px 14px',
                borderRadius: 9, fontSize: 13, fontWeight: 600, marginTop: 16,
              }}>
                {err}
              </div>
            )}
          </div>
        )}

        {/* ── Plan selection ── */}
        {step === 'plans' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.03em', color: '#111827', margin: '0 0 5px' }}>
                Upgrade your plan
              </h2>
              {usage && (
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                  {usage.at_limit
                    ? `You've used all ${usage.limit} screenings this month — upgrade to continue.`
                    : !usage.active
                    ? 'Subscribe to start AI-screening resumes.'
                    : `${usage.used} of ${usage.limit} screenings used this month.`}
                </p>
              )}
            </div>

            {/* Usage bar */}
            {usage && !usage.unlimited && usage.limit > 0 && (
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: '#374151' }}>This month&apos;s usage</span>
                  <span style={{ color: barColor }}>{usage.used} / {usage.limit} resumes</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${usedPct}%`, height: '100%', borderRadius: 999, background: barColor, transition: 'width .4s' }} />
                </div>
              </div>
            )}

            {/* Plan cards — paddingTop leaves room for the badge pill */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))',
              gap: 12, paddingTop: 14, marginBottom: 0,
            }}>
              {PLANS.map(plan => {
                const isCurrent = currentPlan === plan.key
                const isLoading = subscribing === plan.key
                return (
                  <div key={plan.key} style={{
                    border:     `2px solid ${plan.popular ? '#ff6b00' : isCurrent ? '#16a34a' : '#e5e7eb'}`,
                    borderRadius: 14, padding: '20px 16px', position: 'relative',
                    background: plan.popular ? '#fff9f5' : '#fff',
                  }}>
                    {plan.popular && !isCurrent && (
                      <div style={{
                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                        background: '#ff6b00', color: '#fff', fontSize: 10, fontWeight: 800,
                        padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: '.04em',
                      }}>MOST POPULAR</div>
                    )}
                    {isCurrent && (
                      <div style={{
                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                        background: '#16a34a', color: '#fff', fontSize: 10, fontWeight: 800,
                        padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
                      }}>CURRENT PLAN</div>
                    )}

                    <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 3 }}>{plan.name}</div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontWeight: 900, fontSize: 26, color: '#111827', letterSpacing: '-.03em' }}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>/month</span>
                    </div>
                    <div style={{
                      display: 'inline-block', fontSize: 11, color: '#374151', fontWeight: 700,
                      background: '#f3f4f6', padding: '3px 9px', borderRadius: 6, marginBottom: 12,
                    }}>
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
                        width: '100%', padding: '10px', borderRadius: 9, border: 'none',
                        background: isCurrent ? '#dcfce7' : plan.popular ? '#ff6b00' : '#1d1d1f',
                        color: isCurrent ? '#16a34a' : '#fff',
                        fontWeight: 700, fontSize: 13,
                        cursor: isCurrent || subscribing ? 'default' : 'pointer',
                        opacity: isLoading ? .75 : 1, transition: 'opacity .15s',
                      }}>
                      {isCurrent ? '✓ Current Plan' : isLoading ? 'Opening payment…' : 'Subscribe →'}
                    </button>
                  </div>
                )
              })}
            </div>

            {err && (
              <div style={{
                background: '#fee2e2', color: '#dc2626', padding: '11px 14px',
                borderRadius: 9, fontSize: 13, fontWeight: 600, marginTop: 16,
              }}>
                {err}
              </div>
            )}

            <p style={{ textAlign: 'center', margin: '16px 0 0', fontSize: 11, color: '#9ca3af' }}>
              Secured by Cashfree · Cancel anytime · Auto-renews monthly
            </p>
          </>
        )}
      </div>
    </div>
  )
}
