import Head from 'next/head'
import Link from 'next/link'
import { marked } from 'marked'
const { supabaseService } = require('../../lib/supabase')

export default function BlogPost({ post, related, faqItems }) {
  if (!post) return (
    <div style={{padding:'80px 24px',textAlign:'center',fontFamily:'sans-serif'}}>
      <div style={{fontSize:48,marginBottom:16}}>📄</div>
      <h2>Post not found</h2>
      <Link href="/blog" style={{color:'#ff6b00'}}>← Back to Blog</Link>
    </div>
  )

  const html = marked(post.content || '')

  const canonicalUrl = `https://hirehub360.in/blog/${post.slug}`
  const ogImage      = post.cover_image || 'https://hirehub360.in/og-default.png'
  const keywords     = (post.tags || []).join(', ')

  // Detect city + sector from tags for local SEO schema
  const cityTag   = (post.tags || []).find(t => /mumbai|delhi|bangalore|pune|hyderabad|chennai|kolkata|ahmedabad|noida|gurgaon|jaipur|surat|lucknow|nagpur|kochi|indore|bhopal|vadodara|chandigarh|visakhapatnam/i.test(t)) || ''
  const sectorTag = (post.tags || []).find(t => /it|finance|hr|bpo|pharma|retail|logistics|manufacturing|hospitality|real.estate|e.commerce|digital/i.test(t)) || ''

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: ogImage,
    url: canonicalUrl,
    author: { '@type': 'Organization', name: post.author || 'HireHub360 Team', url: 'https://hirehub360.in' },
    publisher: {
      '@type': 'Organization',
      name: 'HireHub360',
      url: 'https://hirehub360.in',
      logo: { '@type': 'ImageObject', url: 'https://hirehub360.in/logo.png' }
    },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: canonicalUrl,
    keywords: keywords,
    inLanguage: 'en-IN',
    ...(cityTag ? { locationCreated: { '@type': 'Place', name: cityTag, addressCountry: 'IN' } } : {}),
  }

  // Local business schema — ties every blog to hirehub360.in's local presence
  const localSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'HireHub360',
    url: 'https://hirehub360.in',
    description: 'India\'s AI-powered job posting platform. Post jobs, find candidates, book corporate venues.',
    address: { '@type': 'PostalAddress', addressCountry: 'IN', addressRegion: cityTag || 'Maharashtra' },
    telephone: '+91-98200-00000',
    sameAs: ['https://dev.to/hirehub360', 'https://hirehub360.hashnode.dev'],
    priceRange: '₹₹',
    openingHours: 'Mo-Su 00:00-23:59',
    hasMap: 'https://hirehub360.in',
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://hirehub360.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: 'https://hirehub360.in/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ]
  }

  return (
    <>
      <Head>
        <title>{post.title} | HireHub360 Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="keywords" content={`${keywords}${cityTag ? ', jobs in '+cityTag : ''}, job posting India, hire candidates, HireHub360`} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta name="author" content={post.author || 'HireHub360 Team'} />
        <meta name="publisher" content="HireHub360" />
        <meta name="language" content="en-IN" />
        <meta name="geo.region" content={cityTag ? `IN` : 'IN'} />
        <meta name="geo.country" content="IN" />
        {cityTag && <meta name="geo.placename" content={cityTag} />}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HireHub360" />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:modified_time" content={post.updated_at || post.created_at} />
        <meta property="article:author" content="HireHub360 Team" />
        {(post.tags || []).map(tag => <meta key={tag} property="article:tag" content={tag} />)}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@HireHub360" />

        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqItems && faqItems.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(f => ({
              '@type': 'Question',
              name: f.q || f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.a || f.answer }
            }))
          }) }} />
        )}
      </Head>

      <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',gap:32,height:56,position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span></Link>
        <Link href="/" style={{color:'#444',textDecoration:'none',fontSize:15}}>Browse Jobs</Link>
        <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none',fontSize:15,fontWeight:600}}>Blog</Link>
      </nav>

      <main style={{maxWidth:780,margin:'0 auto',padding:'48px 24px'}}>
        <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none',fontSize:14,fontWeight:600}}>← Back to Blog</Link>

        <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'20px 0 16px'}}>
          {(post.tags||[]).map(tag => (
            <span key={tag} style={{background:'#fff3e8',color:'#ff6b00',padding:'2px 10px',borderRadius:20,fontSize:13,fontWeight:600}}>{tag}</span>
          ))}
        </div>

        <h1 style={{fontSize:36,fontWeight:800,lineHeight:1.25,color:'#111',margin:'0 0 16px'}}>{post.title}</h1>

        <div style={{display:'flex',gap:20,fontSize:14,color:'#888',marginBottom:32,paddingBottom:24,borderBottom:'1px solid #eee'}}>
          <span>✍️ {post.author || 'HireHub360 Team'}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
        </div>

        {post.cover_image && (
          <img src={post.cover_image} alt={post.title}
            style={{width:'100%',maxHeight:400,objectFit:'cover',borderRadius:12,marginBottom:36}} />
        )}

        <div className="blog-content" style={{fontSize:17,lineHeight:1.8,color:'#333'}}
          dangerouslySetInnerHTML={{ __html: html }} />

        {/* Related Posts */}
        {related && related.length > 0 && (
          <div style={{marginTop:56,paddingTop:40,borderTop:'1px solid #eee'}}>
            <h3 style={{fontSize:20,fontWeight:700,color:'#111',marginBottom:24}}>Related Hiring Guides</h3>
            <div style={{display:'grid',gap:16}}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  style={{display:'flex',alignItems:'flex-start',gap:16,padding:'16px',background:'#fafafa',borderRadius:10,textDecoration:'none',border:'1px solid #eee'}}>
                  <span style={{fontSize:24,flexShrink:0}}>📰</span>
                  <div>
                    <div style={{color:'#111',fontWeight:600,fontSize:15,lineHeight:1.4}}>{r.title}</div>
                    {r.excerpt && <div style={{color:'#888',fontSize:13,marginTop:4,lineHeight:1.5,
                      overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{r.excerpt}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{marginTop:60,padding:'32px',background:'#fff8f4',borderRadius:16,textAlign:'center',border:'1px solid #ffe0c8'}}>
          <h3 style={{margin:'0 0 8px',color:'#111'}}>Post a job or find your next role</h3>
          <p style={{color:'#555',margin:'0 0 20px'}}>12,000+ active listings across India. Free to post. Free to apply.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/" style={{background:'#ff6b00',color:'#fff',padding:'12px 28px',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:16}}>
              Browse Jobs →
            </Link>
            <Link href="/" style={{background:'#111',color:'#fff',padding:'12px 28px',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:16}}>
              Post a Job Free
            </Link>
          </div>
        </div>
      </main>

      <footer style={{background:'#111',color:'#aaa',textAlign:'center',padding:'32px 24px',marginTop:80,fontSize:14}}>
        <p>© 2026 HireHub360 | <Link href="/" style={{color:'#ff6b00',textDecoration:'none'}}>Find Jobs</Link> | <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none'}}>Blog</Link></p>
      </footer>

      <style>{`
        .blog-content h2{font-size:24px;font-weight:700;margin:36px 0 12px;color:#111}
        .blog-content h3{font-size:20px;font-weight:600;margin:28px 0 10px;color:#111}
        .blog-content p{margin:0 0 20px}
        .blog-content ul,ol{margin:0 0 20px;padding-left:24px}
        .blog-content li{margin-bottom:8px}
        .blog-content strong{color:#111}
        .blog-content a{color:#ff6b00}
        .blog-content blockquote{border-left:4px solid #ff6b00;margin:24px 0;padding:12px 20px;background:#fff8f4;border-radius:0 8px 8px 0;font-style:italic}
        .blog-content code{background:#f5f5f5;padding:2px 6px;border-radius:4px;font-size:14px}
        .blog-content img{max-width:100%;border-radius:8px;margin:16px 0}
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  const { data: posts } = await supabaseService
    .from('blogs').select('slug').eq('published', true).limit(200)
  const paths = (posts || []).map(p => ({ params: { slug: p.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data: post } = await supabaseService
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) return { notFound: true }

  // Extract FAQPage schema data embedded as <!-- FAQ_JSON: [...] --> by AI cron
  let faqItems = []
  const faqMatch = (post.content || '').match(/<!--\s*FAQ_JSON:\s*(\[[\s\S]*?\])\s*-->/)
  if (faqMatch) {
    try { faqItems = JSON.parse(faqMatch[1]) } catch (_) {}
  }

  // Fetch 4 related posts (same tags first, then recents — exclude current)
  const tags = (post.tags || []).slice(0, 2)
  let related = []

  if (tags.length > 0) {
    const { data: tagMatches } = await supabaseService
      .from('blogs')
      .select('slug,title,excerpt')
      .eq('published', true)
      .neq('slug', params.slug)
      .overlaps('tags', tags)
      .order('created_at', { ascending: false })
      .limit(4)
    related = tagMatches || []
  }

  // Pad with recent posts if we have fewer than 4
  if (related.length < 4) {
    const { data: recents } = await supabaseService
      .from('blogs')
      .select('slug,title,excerpt')
      .eq('published', true)
      .neq('slug', params.slug)
      .order('created_at', { ascending: false })
      .limit(4)
    const existing = new Set(related.map(r => r.slug))
    for (const r of (recents || [])) {
      if (!existing.has(r.slug)) { related.push(r); existing.add(r.slug) }
      if (related.length >= 4) break
    }
  }

  return { props: { post, related, faqItems }, revalidate: 3600 }
}
