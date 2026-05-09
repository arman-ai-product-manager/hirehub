import { useState } from 'react'

type Props = {
  product: string
  productLabel?: string
  accent?: string
  compact?: boolean
}

export default function InterestForm({ product, productLabel, accent = '#ff6b00', compact = false }: Props) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact || (!/.+@.+\..+/.test(contact) && !/^\+?[\d\s-]{7,}$/.test(contact))) {
      setStatus('⚠️ Enter a valid email or phone number')
      return
    }
    setSubmitting(true)
    setStatus('Saving…')
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, name, contact }),
      })
      if (res.ok) {
        setStatus(`✅ Got it! We'll notify you when ${productLabel || product} launches.`)
        setName('')
        setContact('')
      } else {
        setStatus('⚠️ Could not save. Try again.')
      }
    } catch {
      setStatus('⚠️ Network error. Try again.')
    }
    setSubmitting(false)
  }

  const statusColor = status.startsWith('✅') ? '#1a8a3c' : status.startsWith('⚠️') ? '#be123c' : '#666'

  return (
    <form onSubmit={submit} style={{
      background: '#fff',
      border: '1.5px solid #e5e5ea',
      borderRadius: 16,
      padding: compact ? '20px' : '28px 24px',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <div style={{ fontWeight: 800, fontSize: compact ? 16 : 18, marginBottom: 6, color: '#1d1d1f', letterSpacing: '-.02em' }}>
        🔔 Register your interest
      </div>
      <div style={{ fontSize: 13, color: '#6e6e73', marginBottom: 14, lineHeight: 1.5 }}>
        Be first to know when {productLabel || product} launches. No spam — just one email when it's live.
      </div>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name (optional)"
        style={{ width: '100%', border: '1.5px solid #e5e5ea', borderRadius: 10, padding: '11px 14px', fontSize: 16, marginBottom: 10, outline: 'none', boxSizing: 'border-box' }}
      />
      <input
        type="text"
        value={contact}
        onChange={e => setContact(e.target.value)}
        placeholder="Email or WhatsApp number"
        required
        style={{ width: '100%', border: '1.5px solid #e5e5ea', borderRadius: 10, padding: '11px 14px', fontSize: 16, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          background: accent,
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 15,
          border: 'none',
          cursor: submitting ? 'wait' : 'pointer',
          opacity: submitting ? 0.7 : 1,
          transition: 'opacity .15s',
        }}
      >
        {submitting ? 'Saving…' : 'Notify Me When Live →'}
      </button>
      {status && (
        <div style={{ marginTop: 12, fontSize: 13, color: statusColor, textAlign: 'center', fontWeight: 600 }}>
          {status}
        </div>
      )}
    </form>
  )
}
