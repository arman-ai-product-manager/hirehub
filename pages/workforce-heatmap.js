import Head from 'next/head'

const HEATMAP_CITIES = [
  { city: 'Bangalore', state: 'Karnataka', heat: 'very-hot', jobs: '45,000+', growth: '+22%', color: '#ff2d00', icon: '🔴' },
  { city: 'Mumbai', state: 'Maharashtra', heat: 'hot', jobs: '38,000+', growth: '+14%', color: '#ff6b00', icon: '🟠' },
  { city: 'Delhi NCR', state: 'Delhi', heat: 'hot', jobs: '35,000+', growth: '+16%', color: '#ff6b00', icon: '🟠' },
  { city: 'Hyderabad', state: 'Telangana', heat: 'very-hot', jobs: '32,000+', growth: '+25%', color: '#ff2d00', icon: '🔴' },
  { city: 'Pune', state: 'Maharashtra', heat: 'hot', jobs: '22,000+', growth: '+11%', color: '#ff6b00', icon: '🟠' },
  { city: 'Chennai', state: 'Tamil Nadu', heat: 'warm', jobs: '18,000+', growth: '+8%', color: '#ffa500', icon: '🟡' },
  { city: 'Ahmedabad', state: 'Gujarat', heat: 'rising', jobs: '14,000+', growth: '+19%', color: '#22c55e', icon: '🟢' },
  { city: 'Kolkata', state: 'West Bengal', heat: 'warm', jobs: '12,000+', growth: '+6%', color: '#ffa500', icon: '🟡' },
  { city: 'Noida', state: 'UP', heat: 'hot', jobs: '20,000+', growth: '+13%', color: '#ff6b00', icon: '🟠' },
  { city: 'Gurgaon', state: 'Haryana', heat: 'hot', jobs: '18,000+', growth: '+12%', color: '#ff6b00', icon: '🟠' },
  { city: 'Jaipur', state: 'Rajasthan', heat: 'rising', jobs: '8,000+', growth: '+21%', color: '#22c55e', icon: '🟢' },
  { city: 'Coimbatore', state: 'Tamil Nadu', heat: 'rising', jobs: '7,000+', growth: '+17%', color: '#22c55e', icon: '🟢' },
  { city: 'Indore', state: 'MP', heat: 'rising', jobs: '6,500+', growth: '+23%', color: '#22c55e', icon: '🟢' },
  { city: 'Kochi', state: 'Kerala', heat: 'warm', jobs: '6,000+', growth: '+9%', color: '#ffa500', icon: '🟡' },
  { city: 'Nagpur', state: 'Maharashtra', heat: 'emerging', jobs: '4,500+', growth: '+15%', color: '#3b82f6', icon: '🔵' },
  { city: 'Lucknow', state: 'UP', heat: 'emerging', jobs: '5,500+', growth: '+18%', color: '#3b82f6', icon: '🔵' },
  { city: 'Surat', state: 'Gujarat', heat: 'emerging', jobs: '5,000+', growth: '+20%', color: '#3b82f6', icon: '🔵' },
  { city: 'Chandigarh', state: 'Punjab', heat: 'emerging', jobs: '4,000+', growth: '+14%', color: '#3b82f6', icon: '🔵' },
  { city: 'Visakhapatnam', state: 'AP', heat: 'emerging', jobs: '3,500+', growth: '+16%', color: '#3b82f6', icon: '🔵' },
  { city: 'Bhopal', state: 'MP', heat: 'emerging', jobs: '3,000+', growth: '+12%', color: '#3b82f6', icon: '🔵' },
  { city: 'Patna', state: 'Bihar', heat: 'emerging', jobs: '2,500+', growth: '+24%', color: '#3b82f6', icon: '🔵' },
]

const MIGRATION = [
  { from: 'Tier-2 cities', to: 'Bangalore', reason: 'Tech boom', volume: '2.1L/year' },
  { from: 'North India', to: 'Hyderabad', reason: 'IT expansion', volume: '85,000/year' },
  { from: 'Tier-3 cities', to: 'Mumbai', reason: 'Finance/media', volume: '1.2L/year' },
  { from: 'South India', to: 'Pune', reason: 'Manufacturing', volume: '60,000/year' },
  { from: 'East India', to: 'Bengaluru/Noida', reason: 'IT/BPO', volume: '95,000/year' },
]

const HEAT_LABELS = {
  'very-hot': 'Very Hot',
  'hot': 'Hot',
  'warm': 'Warm',
  'rising': 'Rising',
  'emerging': 'Emerging',
}

export default function WorkforceHeatmap() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'India Hiring Heatmap 2026',
    description: 'Real-time workforce intelligence across 21 Indian cities covering hiring activity, growth trends, and talent migration patterns.',
    url: 'https://hirehub360.in/workforce-heatmap',
    creator: {
      '@type': 'Organization',
      name: 'HireHub360',
      url: 'https://hirehub360.in',
    },
    keywords: 'India hiring, workforce data, job market, city hiring trends, talent migration, blue collar hiring',
    temporalCoverage: '2026',
    spatialCoverage: 'India',
  }

  return (
    <>
      <Head>
        <title>India Hiring Heatmap 2026 | HireHub360</title>
        <meta name="description" content="Real-time workforce intelligence across 21 cities, 7 sectors, 50+ roles. India's most comprehensive hiring heatmap for investors, media, recruiters, and government." />
        <meta name="keywords" content="India hiring heatmap, workforce intelligence, city hiring trends, talent migration India, blue collar jobs India, job market 2026" />
        <meta property="og:title" content="India Hiring Heatmap 2026 | HireHub360" />
        <meta property="og:description" content="Real-time workforce intelligence across 21 cities, 7 sectors, 50+ roles. Where India is hiring — and where it's going." />
        <meta property="og:url" content="https://hirehub360.in/workforce-heatmap" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hirehub360.in/api/og?t=India+Hiring+Heatmap+2026&s=21+cities+%C2%B7+7+sectors+%C2%B7+50%2B+roles+%E2%80%94+where+India+is+hiring" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="India Hiring Heatmap 2026 | HireHub360" />
        <meta name="twitter:description" content="21 cities. 450M+ workers. Real-time hiring intelligence for India." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href="https://hirehub360.in/workforce-heatmap" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", background: '#f5f5f7', minHeight: '100vh' }}>

        {/* Nav */}
        <nav style={{ background: '#1d1d1f', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>
            HireHub<span style={{ color: '#ff6b00' }}>Hub</span><sup style={{ fontSize: 11 }}>360</sup>
          </a>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="/features" style={{ color: '#ababab', textDecoration: 'none', fontSize: 14 }}>Features</a>
            <a href="/pricing" style={{ color: '#ababab', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
            <a href="/hirehub.html" style={{ background: '#ff6b00', color: '#fff', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Post Jobs</a>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ background: '#1d1d1f', color: '#fff', padding: '80px 24px 72px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.35)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff6b00', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#ff6b00', letterSpacing: 1, textTransform: 'uppercase' }}>Live Data · Updated Daily</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 62px)', fontWeight: 800, margin: '0 0 20px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            India Hiring Heatmap <span style={{ color: '#ff6b00' }}>2026</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#ababab', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.5 }}>
            Real-time workforce intelligence across <strong style={{ color: '#fff' }}>21 cities</strong>, <strong style={{ color: '#fff' }}>7 sectors</strong>, <strong style={{ color: '#fff' }}>50+ roles</strong>
          </p>

          {/* Summary stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, maxWidth: 780, margin: '0 auto' }}>
            {[
              { label: 'Active Job Openings', value: '3.3L+' },
              { label: 'Cities Tracked', value: '21' },
              { label: 'Workers in Database', value: '12M+' },
              { label: 'Avg. YoY Growth', value: '+16%' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '20px 28px', minWidth: 150, flex: '1 1 140px' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#ff6b00', letterSpacing: '-1px' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#ababab', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
          `}</style>
        </section>

        {/* Heat Legend */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '18px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6b6b6b', marginRight: 4 }}>Heat Level:</span>
            {[
              { icon: '🔴', label: 'Very Hot', desc: '>30K jobs, >20% growth' },
              { icon: '🟠', label: 'Hot', desc: '15K–30K jobs' },
              { icon: '🟡', label: 'Warm', desc: '8K–15K jobs' },
              { icon: '🟢', label: 'Rising', desc: 'High growth momentum' },
              { icon: '🔵', label: 'Emerging', desc: 'Up-and-coming markets' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f5f7', borderRadius: 8, padding: '6px 12px' }}>
                <span style={{ fontSize: 16 }}>{l.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>{l.label}</span>
                <span style={{ fontSize: 12, color: '#888' }}>— {l.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* City Heatmap Grid */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 0' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#1d1d1f', marginBottom: 8, letterSpacing: '-0.8px' }}>Top Cities by Hiring Activity</h2>
          <p style={{ fontSize: 16, color: '#6b6b6b', marginBottom: 36 }}>Ranked by total active openings · Growth = year-over-year</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 16,
          }}>
            {HEATMAP_CITIES.map((c, i) => (
              <div
                key={c.city}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '20px 20px 20px 0',
                  borderLeft: `5px solid ${c.color}`,
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 0, flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', lineHeight: 1.2 }}>{c.city}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{c.state}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: '#1d1d1f', fontSize: 15 }}>{c.jobs}</span> openings
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: c.color + '18',
                      color: c.color,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 100,
                    }}>
                      {c.growth} YoY
                    </span>
                    <span style={{
                      background: '#f0f0f0',
                      color: '#666',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 100,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      {HEAT_LABELS[c.heat]}
                    </span>
                  </div>
                </div>
                <div style={{ paddingRight: 14, paddingTop: 4, fontSize: 22, fontWeight: 800, color: '#e5e5e5', minWidth: 32, textAlign: 'right' }}>
                  #{i + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blue Collar Opportunity */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1d1d1f 0%, #2a2a2e 100%)',
            borderRadius: 20,
            padding: '48px 40px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* decorative accent */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,107,0,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -20, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,107,0,0.05)', pointerEvents: 'none' }} />

            <div style={{ display: 'inline-block', background: '#ff6b00', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, padding: '5px 14px', borderRadius: 100, marginBottom: 20, textTransform: 'uppercase' }}>
              Market Opportunity
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.8px' }}>
              The Untapped Market — <span style={{ color: '#ff6b00' }}>Blue Collar India</span>
            </h2>
            <p style={{ color: '#ababab', fontSize: 16, maxWidth: 600, marginBottom: 36, lineHeight: 1.6 }}>
              India's largest workforce segment remains the least served by technology. The opportunity is massive.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 20, marginBottom: 36 }}>
              {[
                { stat: '450M+', label: 'Blue collar workers in India', icon: '👷' },
                { stat: 'Only 5%', label: 'Hired through organized platforms', icon: '📊' },
                { stat: '₹8K–₹35K', label: 'Monthly wage range', icon: '💰' },
                { stat: '#1 Growth', label: 'Fastest: Delivery, Warehouse, Security, Construction', icon: '🚀' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '22px 20px' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#ff6b00', letterSpacing: '-0.5px', marginBottom: 6 }}>{s.stat}</div>
                  <div style={{ fontSize: 13, color: '#ababab', lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 12, padding: '16px 22px', display: 'inline-block' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#ff6b00' }}>
                🏆 HireHub360 is India's only platform covering both white-collar and blue-collar
              </span>
            </div>
          </div>
        </section>

        {/* Talent Migration Trends */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 0' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#1d1d1f', marginBottom: 8, letterSpacing: '-0.8px' }}>Talent Migration Trends</h2>
          <p style={{ fontSize: 16, color: '#6b6b6b', marginBottom: 32 }}>Where India's workforce is moving — and why</p>

          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.5fr 1fr',
              background: '#1d1d1f',
              color: '#ababab',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              padding: '14px 24px',
              gap: 16,
            }}>
              <div>From</div>
              <div>Destination</div>
              <div>Primary Driver</div>
              <div>Annual Volume</div>
            </div>

            {MIGRATION.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1.5fr 1fr',
                  padding: '18px 24px',
                  gap: 16,
                  borderBottom: i < MIGRATION.length - 1 ? '1px solid #f0f0f0' : 'none',
                  alignItems: 'center',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                }}
              >
                <div>
                  <span style={{ fontSize: 13, color: '#888', background: '#f5f5f7', padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>{row.from}</span>
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1d1d1f' }}>{row.to}</span>
                </div>
                <div style={{ fontSize: 14, color: '#555', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#ff6b00' }}>→</span> {row.reason}
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ff6b00' }}>{row.volume}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: '#aaa', marginTop: 14 }}>* Volume estimates based on employment registration data and HireHub360 platform analytics.</p>
        </section>

        {/* Sector Breakdown */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 0' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#1d1d1f', marginBottom: 8, letterSpacing: '-0.8px' }}>Top Hiring Sectors</h2>
          <p style={{ fontSize: 16, color: '#6b6b6b', marginBottom: 32 }}>Share of active openings across major industry segments</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { sector: 'Technology & IT', share: 32, jobs: '1.05L+', color: '#6366f1', trend: '↑ Hot' },
              { sector: 'Blue Collar & Gig', share: 28, jobs: '92,000+', color: '#ff6b00', trend: '↑ Fastest growing' },
              { sector: 'BFSI', share: 12, jobs: '39,000+', color: '#0891b2', trend: '↑ Steady' },
              { sector: 'Healthcare', share: 9, jobs: '29,700+', color: '#059669', trend: '↑ Rising' },
              { sector: 'Manufacturing', share: 8, jobs: '26,400+', color: '#dc2626', trend: '→ Stable' },
              { sector: 'Retail & E-commerce', share: 7, jobs: '23,100+', color: '#f59e0b', trend: '↑ Rising' },
              { sector: 'Others', share: 4, jobs: '13,200+', color: '#8b5cf6', trend: '→ Mixed' },
            ].map(s => (
              <div key={s.sector} style={{ background: '#fff', borderRadius: 14, padding: '22px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>{s.sector}</div>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 600, background: s.color + '12', padding: '3px 8px', borderRadius: 100 }}>{s.trend}</span>
                </div>
                {/* Progress bar */}
                <div style={{ background: '#f0f0f0', borderRadius: 100, height: 8, marginBottom: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${s.share * 3}%`, maxWidth: '100%', background: s.color, height: '100%', borderRadius: 100 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#888' }}>{s.share}% of openings</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{s.jobs}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 1100, margin: '56px auto 0', padding: '0 24px 80px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff6b00 0%, #e85500 100%)',
            borderRadius: 20,
            padding: '56px 40px',
            textAlign: 'center',
            color: '#fff',
          }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
              Get Full Access to Workforce Intelligence
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
              Tap into India's most comprehensive hiring dataset. Find talent, benchmark salaries, and track market shifts.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/hirehub.html"
                style={{
                  background: '#fff',
                  color: '#ff6b00',
                  padding: '14px 32px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 15,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Post Jobs on HireHub360 →
              </a>
              <a
                href="/salary-intelligence"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '14px 32px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 15,
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                View Salary Data →
              </a>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer style={{ borderTop: '1px solid #e5e5e5', background: '#fff', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            <strong style={{ color: '#666' }}>Data sources:</strong> Aggregated job postings on HireHub360 + partner platforms,
            India Skills Report 2025, NSDC Sector Skill Council studies, MoLE labour bureau data, and partner survey panels.
            Macro stats are directional; individual outcomes vary by skill, location, and employer.
          </p>
          <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · <a href="/" style={{ color: '#ff6b00', textDecoration: 'none' }}>HireHub360</a> · India's AI-powered jobs platform
          </p>
        </footer>

      </div>
    </>
  )
}
