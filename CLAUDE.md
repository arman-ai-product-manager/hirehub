@AGENTS.md

# HireHub360 — Project Memory

## What This Project Is
India's AI-powered job platform at **hirehub360.in**. Tech stack: Next.js 16.2.2 (Pages Router), Supabase, deployed on Vercel.

## Branch
Active development branch: `claude/build-resume-website-oH52J`

## Pages & Routes
| Route | File | Notes |
|---|---|---|
| `/` | `pages/index.tsx` | Homepage — ISR 60s, job listings, city filter, apply modal |
| `/jobs/[slug]` | `pages/jobs/[slug].js` | Job detail — SSG with fallback:blocking |
| `/jobs/in/[city]` | `pages/jobs/in/[city].js` | City landing pages |
| `/careers/[slug]` | `pages/careers/[slug].js` | Company career pages — brand from URL params |
| `/resume/[slug]` | `pages/resume/[slug].js` | Candidate public profile — SSR, URL param fallback |
| `/features` | `pages/features.js` | 7 world-first features showcase — dark theme |
| `/pricing` | `pages/pricing.js` | Pricing page |
| `/blog` | `pages/blog/index.js` | Blog index |
| `/blog/[slug]` | `pages/blog/[slug].js` | Blog post |
| `/sitemap.xml` | `pages/sitemap.xml.js` | Dynamic sitemap — 269 URLs |
| `/api/app` | `pages/api/app.js` | Serves hirehub.html (main React app) |

## Design System
- **Colors:** `#ff6b00` orange (primary), `#1d1d1f` dark, `#f5f5f7` light bg
- **Font:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui`
- **Style:** Inline styles only (no Tailwind/CSS modules), Apple-clean aesthetic
- **Nav logo:** `HireHub<span>Hub</span><sup>360</sup>` pattern

## Favicon
`/public/favicon.svg` — dark circle + orange arc + white "H". Set globally in `_document.tsx` and in every page's `<Head>`.

## Known Fixes Applied
- **Mobile scroll bug:** `globals.css` — `overflow-x: hidden` must be on `body` only, NOT on `html`. Putting it on `html` breaks iOS Safari touch scroll entirely.

## Supabase Tables Used
- `jobs` — active job listings
- `blogs` — blog posts (published:true)
- `candidates` — candidate profiles (for `/resume/[slug]`)

## Sitemap Structure (269 URLs)
- Static: `/`, `/pricing`, `/features`, `/blog`, `/hirehub.html`
- City pages: 21 cities (`/jobs/in/[city]`)
- Keyword×city SEO URLs: 231 entries (priority 0.64 major, 0.51 tier-2)
- Demo jobs: 12 slugs
- Dynamic: DB jobs + blog posts

## 7 Features (on /features page)
1. **HireHub Score** — Work credit score (CIBIL for work)
2. **AI Salary Agent** — AI negotiates salary on worker's behalf
3. **LiveWork** — Freelancers stream work live, billed per minute
4. **VerifiedWork** — Blockchain work certificates, unfakeable
5. **WorkerFirst** — Reverse hiring: companies apply to workers
6. **InstantHire** — 1-hour on-site hire (Swiggy model for talent)
7. **BlindHire** — Anonymous apply, identity revealed only after shortlist

## Resume Page (`/resume/[slug]`)
- SSR via `getServerSideProps`
- Tries `candidates` Supabase table first
- Falls back to URL params: `?n=Name&t=Title&loc=Location&skills=React,Node`
- Shows: avatar, name, title, location, badges (availability/salary/open-to), skills, experience timeline, education, Hire CTA modal
- Schema.org `Person` structured data

## Career Pages (`/careers/[slug]`)
- Brand data from URL params: `?n=CompanyName&c=#color&t=tagline&cta=ApplyNow&logo=url`
- Jobs pulled from Supabase matching company name slug
- Works with zero DB data

## Important Patterns
- All pages use `getStaticProps` (ISR) or `getServerSideProps` — no client-side data fetching for SEO content
- Demo data always present as fallback when DB is empty
- Apply modal slides up from bottom (mobile-first)
- `mkSlug(s)` = lowercase, alphanumeric+hyphens only
