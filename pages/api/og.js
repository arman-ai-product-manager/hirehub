// Dynamic OG image for hirehub360.in
// Usage: /api/og?t=Page+Title&s=Subtitle+text
// Returns 1200×630 PNG

import { ImageResponse } from 'next/og'

export const config = { runtime: 'edge' }

export default function handler(req) {
  const { searchParams } = new URL(req.url)
  const title   = (searchParams.get('t') || 'HireHub360').slice(0, 70)
  const sub     = (searchParams.get('s') || "India's AI-Powered Job Platform").slice(0, 100)
  const accent  = '#ff6b00'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: '#1d1d1f', padding: '60px 70px', fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ width: 80, height: 6, background: accent, borderRadius: 3 }} />

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 62, fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: '#a1a1a6', lineHeight: 1.4, maxWidth: 900 }}>
            {sub}
          </div>
        </div>

        {/* Bottom: logo + badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900, color: '#fff',
            }}>H</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
              HireHub<span style={{ color: accent }}>Hub</span>
              <span style={{ fontSize: 13, color: accent, verticalAlign: 'super', marginLeft: 2 }}>360</span>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.35)',
            color: accent, padding: '8px 18px', borderRadius: 999, fontSize: 15, fontWeight: 600,
          }}>
            hirehub360.in
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
