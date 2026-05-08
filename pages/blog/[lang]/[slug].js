import Head from 'next/head'
import Link from 'next/link'
import { marked } from 'marked'
const { supabaseService } = require('../../../lib/supabase')

const LANG_META = {
  hi: { name: 'Hindi',     native: 'हिंदी',   htmlLang: 'hi-IN', ogLocale: 'hi_IN', dir: 'ltr' },
  mr: { name: 'Marathi',   native: 'मराठी',   htmlLang: 'mr-IN', ogLocale: 'mr_IN', dir: 'ltr' },
  ta: { name: 'Tamil',     native: 'தமிழ்',   htmlLang: 'ta-IN', ogLocale: 'ta_IN', dir: 'ltr' },
  kn: { name: 'Kannada',   native: 'ಕನ್ನಡ',   htmlLang: 'kn-IN', ogLocale: 'kn_IN', dir: 'ltr' },
  te: { name: 'Telugu',    native: 'తెలుగు',  htmlLang: 'te-IN', ogLocale: 'te_IN', dir: 'ltr' },
  bn: { name: 'Bengali',   native: 'বাংলা',   htmlLang: 'bn-IN', ogLocale: 'bn_IN', dir: 'ltr' },
  gu: { name: 'Gujarati',  native: 'ગુજરાતી', htmlLang: 'gu-IN', ogLocale: 'gu_IN', dir: 'ltr' },
  pa: { name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',  htmlLang: 'pa-IN', ogLocale: 'pa_IN', dir: 'ltr' },
  ml: { name: 'Malayalam', native: 'മലയാളം',  htmlLang: 'ml-IN', ogLocale: 'ml_IN', dir: 'ltr' },
}

const SUPPORTED_LANGS = Object.keys(LANG_META)

export default function LangBlogPost({ post, related, siblings, langCode }) {
  if (!post) return (
    <div style={{padding:'80px 24px',textAlign:'center',fontFamily:'sans-serif'}}>
      <div style={{fontSize:48,marginBottom:16}}>📄</div>
      <h2>Post not found</h2>
      <Link href="/blog" style={{color:'#ff6b00'}}>← Back to Blog</Link>
    </div>
  )

  const lm = LANG_META[langCode] || LANG_META.hi
  const html = marked(post.content || '')
  const canonicalUrl = `https://hirehub360.in/blog/${langCode}/${post.slug.replace(/^[a-z]{2}-/, '')}`
  const enSlug = post.slug.replace(/^[a-z]{2}-/, '')
  const ogImage = post.cover_image || 'https://hirehub360.in/og-default.png'
  const keywords = (post.tags || []).join(', ')

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: ogImage,
    url: canonicalUrl,
    author: { '@type': 'Organization', name: post.author || 'HireHub360', url: 'https://hirehub360.in' },
    publisher: {
      '@type': 'Organization', name: 'HireHub360', url: 'https://hirehub360.in',
      logo: { '@type': 'ImageObject', url: 'https://hirehub360.in/logo.png' }
    },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: canonicalUrl,
    inLanguage: lm.htmlLang,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hirehub360.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://hirehub360.in/blog' },
      { '@type': 'ListItem', position: 3, name: lm.name, item: `https://hirehub360.in/blog/${langCode}` },
      { '@type': 'ListItem', position: 4, name: post.title, item: canonicalUrl },
    ]
  }

  return (
    <>
      <Head>
        <title>{post.title} | HireHub360 Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta name="author" content={post.author || 'HireHub360'} />
        <meta name="language" content={lm.htmlLang} />
        <link rel="canonical" href={canonicalUrl} />

        {/* hreflang — link to all sibling language versions */}
        <link rel="alternate" hrefLang="en-IN" href={`https://hirehub360.in/blog/${enSlug}`} />
        <link rel="alternate" hrefLang={lm.htmlLang} href={canonicalUrl} />
        {(siblings || []).filter(s => s.lang !== langCode && s.lang !== 'en').map(s => {
          const slm = LANG_META[s.lang]
          if (!slm) return null
          return <link key={s.lang} rel="alternate" hrefLang={slm.htmlLang}
            href={`https://hirehub360.in/blog/${s.lang}/${enSlug}`} />
        })}
        <link rel="alternate" hrefLang="x-default" href={`https://hirehub360.in/blog/${enSlug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="HireHub360" />
        <meta property="og:locale" content={lm.ogLocale} />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:modified_time" content={post.updated_at || post.created_at} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={ogImage} />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>

      <nav style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 24px',display:'flex',alignItems:'center',gap:32,height:56,position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontWeight:800,fontSize:20,color:'#111',textDecoration:'none'}}>
          Hire<span style={{color:'#ff6b00'}}>Hub</span><span style={{color:'#ff6b00',fontSize:'0.7em',verticalAlign:'super'}}>360</span>
        </Link>
        <Link href="/blog" style={{color:'#444',textDecoration:'none',fontSize:15}}>Blog</Link>
        <span style={{marginLeft:'auto',fontSize:13,color:'#888'}}>{lm.native}</span>
      </nav>

      <main style={{maxWidth:780,margin:'0 auto',padding:'48px 24px'}} lang={lm.htmlLang} dir={lm.dir}>
        <Link href="/blog" style={{color:'#ff6b00',textDecoration:'none',fontSize:14,fontWeight:600}}>← Blog</Link>

        {/* Language switcher */}
        {siblings && siblings.length > 0 && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'16px 0',padding:'10px 14px',background:'#f9f9f9',borderRadius:10,border:'1px solid #eee',alignItems:'center'}}>
            <span style={{fontSize:12,color:'#888',marginRight:4}}>🌐</span>
            <Link href={`/blog/${enSlug}`}
              style={{fontSize:12,fontWeight:600,padding:'3px 10px',borderRadius:20,
                background:'#fff',border:'1.5px solid #e5e5ea',color:'#555',textDecoration:'none'}}>
              English
            </Link>
            {siblings.map(s => {
              const slm = LANG_META[s.lang]
              if (!slm) return null
              const isActive = s.lang === langCode
              return (
                <Link key={s.lang}
                  href={`/blog/${s.lang}/${enSlug}`}
                  style={{fontSize:12,fontWeight:600,padding:'3px 10px',borderRadius:20,textDecoration:'none',
                    background: isActive ? '#ff6b00' : '#fff',
                    color: isActive ? '#fff' : '#555',
                    border: isActive ? '1.5px solid #ff6b00' : '1.5px solid #e5e5ea'}}>
                  {slm.native}
                </Link>
              )
            })}
          </div>
        )}

        <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'16px 0'}}>
          <span style={{background:'#e8f0ff',color:'#3355cc',padding:'2px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>
            {lm.native}
          </span>
          {(post.tags||[]).slice(0,4).map(tag => (
            <span key={tag} style={{background:'#fff3e8',color:'#ff6b00',padding:'2px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{tag}</span>
          ))}
        </div>

        <h1 style={{fontSize:32,fontWeight:800,lineHeight:1.3,color:'#111',margin:'0 0 16px'}}>{post.title}</h1>

        <div style={{display:'flex',gap:20,fontSize:14,color:'#888',marginBottom:32,paddingBottom:24,borderBottom:'1px solid #eee'}}>
          <span>✍️ {post.author || 'HireHub360'}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
          <span style={{background:'#f5f5f7',padding:'2px 8px',borderRadius:6,fontSize:12}}>{lm.name}</span>
        </div>

        <div className="blog-content" style={{fontSize:17,lineHeight:1.85,color:'#333'}}
          dangerouslySetInnerHTML={{ __html: html }} />

        {related && related.length > 0 && (
          <div style={{marginTop:56,paddingTop:40,borderTop:'1px solid #eee'}}>
            <h3 style={{fontSize:20,fontWeight:700,color:'#111',marginBottom:24}}>Related Guides</h3>
            <div style={{display:'grid',gap:16}}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.lang && r.lang !== 'en' ? r.lang + '/' : ''}${r.lang && r.lang !== 'en' ? r.slug.replace(/^[a-z]{2}-/,'') : r.slug}`}
                  style={{display:'flex',alignItems:'flex-start',gap:16,padding:'16px',background:'#fafafa',borderRadius:10,textDecoration:'none',border:'1px solid #eee'}}>
                  <span style={{fontSize:24,flexShrink:0}}>📰</span>
                  <div>
                    <div style={{color:'#111',fontWeight:600,fontSize:15,lineHeight:1.4}}>{r.title}</div>
                    {r.excerpt && <div style={{color:'#888',fontSize:13,marginTop:4,lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{r.excerpt}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{marginTop:60,padding:'32px',background:'#fff8f4',borderRadius:16,textAlign:'center',border:'1px solid #ffe0c8'}}>
          <h3 style={{margin:'0 0 8px',color:'#111'}}>Post a job or find your next role</h3>
          <p style={{color:'#555',margin:'0 0 20px'}}>Active listings across India. Free to post. Free to apply.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/" style={{background:'#ff6b00',color:'#fff',padding:'12px 28px',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:16}}>Browse Jobs →</Link>
            <Link href="/hirehub.html" style={{background:'#111',color:'#fff',padding:'12px 28px',borderRadius:8,textDecoration:'none',fontWeight:700,fontSize:16}}>Post a Job Free</Link>
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
        .blog-content table{width:100%;border-collapse:collapse;margin:20px 0}
        .blog-content th,.blog-content td{padding:10px 14px;border:1px solid #e5e5ea;text-align:left}
        .blog-content th{background:#f5f5f7;font-weight:700}
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  const { data: posts } = await supabaseService
    .from('blogs').select('slug,lang')
    .in('lang', SUPPORTED_LANGS)
    .eq('published', true).limit(500)
  const paths = (posts || []).map(p => ({
    params: { lang: p.lang, slug: p.slug.replace(/^[a-z]{2}-/, '') }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { lang, slug } = params
  if (!SUPPORTED_LANGS.includes(lang)) return { notFound: true }

  const langSlug = `${lang}-${slug}`
  const { data: post } = await supabaseService
    .from('blogs').select('*')
    .eq('slug', langSlug).eq('lang', lang).eq('published', true).single()

  if (!post) return { notFound: true }

  // Fetch sibling translations via canonical_id
  let siblings = []
  if (post.canonical_id) {
    const { data: sibs } = await supabaseService
      .from('blogs').select('lang,slug,title')
      .eq('canonical_id', post.canonical_id)
      .eq('published', true)
      .neq('lang', 'en')
    siblings = sibs || []
  }

  // Related posts in same language
  const tags = (post.tags || []).slice(0, 2)
  let related = []
  if (tags.length > 0) {
    const { data: tagMatches } = await supabaseService
      .from('blogs').select('slug,title,excerpt,lang')
      .eq('published', true).eq('lang', lang)
      .neq('slug', langSlug).overlaps('tags', tags)
      .order('created_at', { ascending: false }).limit(3)
    related = tagMatches || []
  }

  return { props: { post, related, siblings, langCode: lang }, revalidate: 3600 }
}
