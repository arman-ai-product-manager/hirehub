import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import ScreenerLayout from '../../components/ScreenerLayout'
import UpgradeModal from '../../components/UpgradeModal'

const SB = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 4 }}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 7px', lineHeight: 1.4 }}>{hint}</p>}
      {children}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', marginBottom: 20 }}>
      {title && <h2 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: '0 0 20px', paddingBottom: 14, borderBottom: '1px solid #f3f4f6' }}>{title}</h2>}
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [session,     setSession]     = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [sub,         setSub]         = useState(null)
  const [usage,       setUsage]       = useState(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const [company,     setCompany]     = useState({ name: '', logo_url: null })
  const [nameDraft,   setNameDraft]   = useState('')
  const [savingName,  setSavingName]  = useState(false)
  const [nameMsg,     setNameMsg]     = useState('')

  const [logoUploading, setLogoUploading] = useState(false)
  const [logoMsg,       setLogoMsg]       = useState('')
  const logoInputRef = useRef(null)

  const [inviteEmail,  setInviteEmail]  = useState('')
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteMsg,    setInviteMsg]    = useState('')

  useEffect(() => {
    if (!SB) return
    SB.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
      if (data.session) {
        const token = data.session.access_token
        loadSubscription(token)
        loadCompany(token)
      }
    }).catch(() => setAuthLoading(false))
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

  async function loadCompany(token) {
    try {
      const r = await fetch('/api/screener/company', { headers: { Authorization: 'Bearer ' + token } })
      if (!r.ok) return
      const d = await r.json()
      setCompany(d.company || { name: '', logo_url: null })
      setNameDraft(d.company?.name || '')
    } catch {}
  }

  async function saveName(e) {
    e.preventDefault()
    if (!nameDraft.trim()) return
    setSavingName(true)
    setNameMsg('')
    try {
      const token = await getToken()
      const r = await fetch('/api/screener/company', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body:    JSON.stringify({ name: nameDraft.trim() }),
      })
      const d = await r.json()
      if (!r.ok) { setNameMsg('Error: ' + (d.error || 'Could not save')); return }
      setCompany(d.company)
      setNameMsg('Saved!')
      setTimeout(() => setNameMsg(''), 2500)
    } catch {
      setNameMsg('Network error')
    } finally {
      setSavingName(false)
    }
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setLogoMsg('Only JPEG, PNG, WebP or GIF images are supported.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoMsg('Image must be under 2 MB.')
      return
    }

    setLogoUploading(true)
    setLogoMsg('')
    try {
      const { data: { session: sess } } = await SB.auth.getSession()
      if (!sess) { setLogoMsg('Session expired'); return }

      const ext  = file.name.split('.').pop().toLowerCase()
      const path = `${sess.user.id}/logo.${ext}`

      const { data: uploadData, error: uploadErr } = await SB.storage
        .from('screener-logos')
        .upload(path, file, { contentType: file.type, upsert: true })

      if (uploadErr) { setLogoMsg('Upload failed: ' + uploadErr.message); return }

      const { data: urlData } = SB.storage.from('screener-logos').getPublicUrl(uploadData.path)
      const logoUrl = urlData?.publicUrl

      const r = await fetch('/api/screener/company', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sess.access_token },
        body:    JSON.stringify({ logo_url: logoUrl }),
      })
      const d = await r.json()
      if (!r.ok) { setLogoMsg('Saved to storage but DB update failed: ' + d.error); return }

      setCompany(d.company)
      setLogoMsg('Logo updated!')
      setTimeout(() => setLogoMsg(''), 2500)
    } catch (err) {
      setLogoMsg('Upload error: ' + err.message)
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  async function sendInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviteSending(true)
    setInviteMsg('')
    try {
      const token = await getToken()
      const r = await fetch('/api/screener/invite', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body:    JSON.stringify({ email: inviteEmail.trim(), company_name: company?.name || '' }),
      })
      const d = await r.json()
      if (!r.ok) { setInviteMsg('Error: ' + (d.error || 'Could not send')); return }
      setInviteEmail('')
      setInviteMsg('Invite sent to ' + inviteEmail.trim() + '!')
      setTimeout(() => setInviteMsg(''), 4000)
    } catch {
      setInviteMsg('Network error')
    } finally {
      setInviteSending(false)
    }
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</div>
    </div>
  )
  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', background: '#f9fafb', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Sign in required</h2>
        <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>Sign In →</a>
      </div>
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 9, border: '1.5px solid #d1d5db',
    fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
  }

  return (
    <>
      <Head>
        <title>Settings — AI Resume Screener | HireHub360</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {showUpgrade && (
        <UpgradeModal
          getToken={getToken}
          usage={usage}
          currentPlan={sub?.plan || null}
          onClose={() => setShowUpgrade(false)}
          onActivated={newSub => { setSub(newSub); getToken().then(loadSubscription); setShowUpgrade(false) }}
        />
      )}

      <ScreenerLayout getToken={getToken} usage={usage} sub={sub} onShowUpgrade={() => setShowUpgrade(true)}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 5vw 72px' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-.04em', margin: '0 0 4px', color: '#111827' }}>Settings</h1>
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Manage your company profile, subscription, and team.</p>
          </div>

          {/* ── Company Profile ── */}
          <Card title="Company Profile">
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Logo */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {company?.logo_url
                    ? <img src={company.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28, color: '#9ca3af' }}>🏢</span>
                  }
                </div>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1.5px solid #d1d5db', background: '#fff', fontSize: 11, fontWeight: 700, cursor: logoUploading ? 'default' : 'pointer', color: '#374151', opacity: logoUploading ? .7 : 1 }}>
                  {logoUploading ? 'Uploading…' : 'Upload logo'}
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                {logoMsg && (
                  <p style={{ fontSize: 11, color: logoMsg.startsWith('Error') ? '#dc2626' : '#16a34a', margin: '5px 0 0', fontWeight: 600 }}>{logoMsg}</p>
                )}
              </div>

              {/* Name */}
              <form onSubmit={saveName} style={{ flex: 1, minWidth: 200 }}>
                <Field label="Company Name">
                  <input
                    value={nameDraft}
                    onChange={e => setNameDraft(e.target.value)}
                    placeholder="e.g. Acme Hiring Co."
                    maxLength={100}
                    style={inputStyle}
                  />
                </Field>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    type="submit"
                    disabled={savingName || !nameDraft.trim()}
                    style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#ff6b00', color: '#fff', fontWeight: 700, fontSize: 13, cursor: savingName ? 'default' : 'pointer', opacity: savingName ? .7 : 1 }}>
                    {savingName ? 'Saving…' : 'Save Name'}
                  </button>
                  {nameMsg && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>{nameMsg}</span>}
                </div>
              </form>
            </div>
          </Card>

          {/* ── Subscription ── */}
          <Card title="Subscription">
            {usage?.active ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>
                    ACTIVE
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                    {sub?.plan ? sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1) : 'Active'} Plan
                  </span>
                </div>
                {!usage.unlimited && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      <span style={{ color: '#374151' }}>Screenings this month</span>
                      <span style={{ color: usage.percent >= 90 ? '#dc2626' : '#374151' }}>{usage.used} / {usage.limit}</span>
                    </div>
                    <div style={{ background: '#f3f4f6', borderRadius: 999, height: 7, overflow: 'hidden' }}>
                      <div style={{ width: `${usage.percent}%`, height: '100%', background: usage.percent >= 90 ? '#dc2626' : '#ff6b00', borderRadius: 999, transition: 'width .4s' }} />
                    </div>
                  </div>
                )}
                {usage.unlimited && (
                  <p style={{ fontSize: 14, color: '#16a34a', fontWeight: 600, margin: '0 0 16px' }}>✓ Unlimited AI screenings</p>
                )}
                <button
                  onClick={() => setShowUpgrade(true)}
                  style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Change Plan
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 16px' }}>No active subscription. Subscribe to start AI-screening resumes.</p>
                <button
                  onClick={() => setShowUpgrade(true)}
                  style={{ padding: '11px 24px', borderRadius: 9, border: 'none', background: '#ff6b00', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  View Plans →
                </button>
              </div>
            )}
          </Card>

          {/* ── Team ── */}
          <Card title="Team">
            <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 18px', lineHeight: 1.5 }}>
              Invite team members to collaborate on resume screening. They'll receive an email with a link to sign up.
            </p>
            <form onSubmit={sendInvite} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                required
                style={{ ...inputStyle, flex: '1 1 220px', width: 'auto' }}
              />
              <button
                type="submit"
                disabled={inviteSending || !inviteEmail.trim()}
                style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: '#1d1d1f', color: '#fff', fontWeight: 700, fontSize: 13, cursor: inviteSending ? 'default' : 'pointer', opacity: inviteSending ? .7 : 1, flexShrink: 0 }}>
                {inviteSending ? 'Sending…' : 'Send Invite'}
              </button>
            </form>
            {inviteMsg && (
              <p style={{ fontSize: 13, color: inviteMsg.startsWith('Error') ? '#dc2626' : '#16a34a', margin: '10px 0 0', fontWeight: 600 }}>
                {inviteMsg}
              </p>
            )}
          </Card>

          {/* ── Account ── */}
          <Card title="Account">
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
              Signed in as <strong style={{ color: '#374151' }}>{session?.user?.email || '—'}</strong>
            </div>
            <button
              onClick={async () => {
                await SB.auth.signOut()
                window.location.href = '/screener'
              }}
              style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Sign Out
            </button>
          </Card>
        </div>
      </ScreenerLayout>
    </>
  )
}
