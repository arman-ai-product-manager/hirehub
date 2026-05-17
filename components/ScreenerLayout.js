import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const NAV = [
  { href: '/screener',          icon: '📋', label: 'Jobs' },
  { href: '/screener/settings', icon: '⚙️', label: 'Settings' },
]

export default function ScreenerLayout({ children, getToken, usage, sub, onShowUpgrade }) {
  const router              = useRouter()
  const [isMobile, setIsMobile]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [company, setCompany]     = useState(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    let t
    const debounced = () => { clearTimeout(t); t = setTimeout(check, 100) }
    window.addEventListener('resize', debounced)
    return () => { window.removeEventListener('resize', debounced); clearTimeout(t) }
  }, [])

  useEffect(() => {
    if (!getToken) return
    getToken().then(token => {
      if (!token) return
      fetch('/api/screener/company', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.company) setCompany(d.company) })
        .catch(() => {})
    })
  }, [getToken]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    try {
      const SB = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      await SB.auth.signOut()
    } catch {}
    window.location.href = '/screener'
  }

  const usedPct  = usage?.unlimited ? 0 : (usage?.limit ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0)
  const barColor = usedPct >= 90 ? '#dc2626' : usedPct >= 70 ? '#d97706' : '#ff6b00'
  const displayName = company?.name || 'My Company'
  const initial     = displayName[0]?.toUpperCase() || 'H'

  function SidebarContent({ onNavClick }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Company identity */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #f3f4f6' }}>
          <Link href="/screener" onClick={onNavClick} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {company?.logo_url ? (
              <img src={company.logo_url} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                {initial}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#111827', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>AI Screener</div>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '10px 10px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => {
            const active = router.pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={onNavClick} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
                borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? '#ff6b00' : '#374151',
                background: active ? '#fff4ee' : 'transparent',
                transition: 'background .12s',
              }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
          <button
            onClick={() => { onNavClick?.(); onShowUpgrade?.() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
              borderRadius: 8, background: 'transparent', border: 'none',
              fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', width: '100%', textAlign: 'left',
            }}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>💳</span>
            Billing
          </button>
        </nav>

        {/* Usage + sign out */}
        <div style={{ padding: '14px 14px 18px', borderTop: '1px solid #f3f4f6' }}>
          {usage?.active && !usage.unlimited && usage.limit > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 5 }}>
                <span style={{ color: '#6b7280' }}>Screenings</span>
                <span style={{ color: barColor }}>{usage.used}/{usage.limit}</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 999, height: 4, overflow: 'hidden' }}>
                <div style={{ width: `${usedPct}%`, height: '100%', background: barColor, borderRadius: 999, transition: 'width .4s' }} />
              </div>
              {usage.at_limit && (
                <button onClick={() => onShowUpgrade?.()} style={{
                  width: '100%', marginTop: 8, padding: '6px', borderRadius: 6, border: 'none',
                  background: '#ff6b00', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}>Upgrade →</button>
              )}
            </div>
          )}
          {usage?.unlimited && (
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginBottom: 10 }}>✓ Unlimited screenings</div>
          )}
          {usage && !usage.active && (
            <button onClick={() => onShowUpgrade?.()} style={{
              width: '100%', padding: '7px', borderRadius: 7, border: '1.5px solid #ff6b00',
              background: 'transparent', color: '#ff6b00', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginBottom: 10,
            }}>Subscribe →</button>
          )}
          <button onClick={handleSignOut} style={{
            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
            background: 'none', border: 'none', fontSize: 12, color: '#9ca3af', cursor: 'pointer', padding: '2px 0',
          }}>
            <span>↩</span> Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>

      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <aside style={{
          width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #e5e7eb',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto',
        }}>
          <SidebarContent />
        </aside>
      )}

      {/* ── Mobile top bar + menu ── */}
      {isMobile && (
        <>
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 52,
            background: '#fff', borderBottom: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
          }}>
            <Link href="/screener" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              {company?.logo_url
                ? <img src={company.logo_url} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
                : <div style={{ width: 26, height: 26, borderRadius: 6, background: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>{initial}</div>
              }
              <span style={{ fontWeight: 800, fontSize: 15, color: '#1d1d1f', letterSpacing: '-.02em' }}>
                Hire<span style={{ color: '#ff6b00' }}>Hub</span>
                <sup style={{ fontSize: '0.55em', color: '#ff6b00', fontWeight: 900 }}>360</sup>
              </span>
            </Link>
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', fontSize: 21, cursor: 'pointer', color: '#374151', padding: '4px 6px' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          {menuOpen && (
            <div style={{
              position: 'fixed', top: 52, left: 0, right: 0, zIndex: 199,
              background: '#fff', borderBottom: '1px solid #e5e7eb',
              padding: '8px 12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,.08)',
            }}>
              <SidebarContent onNavClick={() => setMenuOpen(false)} />
            </div>
          )}
        </>
      )}

      {/* ── Main content ── */}
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : 220, paddingTop: isMobile ? 52 : 0, minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
