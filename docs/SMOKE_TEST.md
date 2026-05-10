# HireHub360 — Real Device Smoke Test

Run this on a real Android phone and a real iPhone before each major release.
Estimated time: 15 min per device.

## 0. Setup

- Open hirehub360.in in mobile browser (Chrome on Android, Safari on iOS).
- Have a test Supabase account ready (email + password) for sign-in flows.

## 1. Homepage (/)

- [ ] Page loads under 3 seconds on 4G
- [ ] Hero text visible without scroll
- [ ] Hamburger button (top-right) opens drawer
- [ ] Drawer shows: Browse Jobs, Features, Pricing, 🔔 Alerts, My Apps, Blog, Sign In, Post a Job
- [ ] Tap outside drawer → drawer closes
- [ ] Search bar accepts input without zoom (Android)
- [ ] Search submits, scrolls to listings
- [ ] City filter chips horizontally scroll
- [ ] Tap a category card → goes to `/jobs/for/<role>` (NEW)
- [ ] Tap a job card → opens job detail
- [ ] Apply button on job card → modal slides up from bottom
- [ ] Modal close button (X) and Escape key both close modal

## 2. Job Detail (/jobs/[slug])

- [ ] Page renders title, company, location, salary
- [ ] Apply button works
- [ ] WhatsApp apply button works
- [ ] Similar jobs section shows 4 related jobs
- [ ] Share button copies link
- [ ] Back button returns to homepage

## 3. My Applications (/my-applications) — NEW

- [ ] Not signed in → shows "Sign in to view applications" with CTA
- [ ] Sign in → list of applications loads
- [ ] Status chips work (All / Applied / Shortlisted etc.)
- [ ] Empty state shows "Browse jobs →" CTA
- [ ] Each card shows job title, company, applied date, status

## 4. Job Alerts (/job-alerts) — NEW

- [ ] Email input accepts valid email
- [ ] Phone input accepts 10-digit number starting 6-9
- [ ] Invalid contact → error message
- [ ] No keywords AND no city → error message
- [ ] Daily / Weekly toggle works
- [ ] Submit shows success state
- [ ] No console errors

## 5. Category Pages (/jobs/for/[role]) — NEW

- [ ] All 12 role slugs render: software-engineer, product-manager, data-scientist, sales-executive, marketing-manager, hr-executive, finance-analyst, designer, devops-engineer, content-writer, operations-manager, business-analyst
- [ ] Hero shows role title, salary range, exp range
- [ ] Job count > 0 (or empty state with alert CTA)
- [ ] City links go to /jobs/in/<city>
- [ ] "Create job alert" CTA goes to /job-alerts
- [ ] View source → JSON-LD CollectionPage schema present

## 6. Resume Page (/resume/[slug])

- [ ] Direct visit `/resume/test-user?n=Test&t=Engineer&loc=Mumbai` renders
- [ ] No HTML/script injected from URL params (XSS test: try `?n=<script>`)
- [ ] Hire CTA modal opens
- [ ] Email/phone validation works in modal

## 7. Career Pages (/careers/[slug])

- [ ] Visit `/careers/test-co?n=Test+Co&t=Building+future`
- [ ] Brand color, name, tagline render from URL
- [ ] Empty state shows email subscribe form
- [ ] Email subscribe shows success message

## 8. Pricing (/pricing)

- [ ] Plan cards render
- [ ] Sign in flow does not break the page (Supabase guard)
- [ ] Subscribe button opens checkout (or auth redirect)

## 9. Product Pages — Interest forms

For each: `/worker-loans`, `/worker-insurance`, `/upskilling`, `/payroll`

- [ ] InterestForm renders
- [ ] Email or phone validates
- [ ] Submit shows success
- [ ] Disclaimer/data sources visible

## 10. Cross-cutting

- [ ] Support chat widget (bottom-right) visible on all pages
- [ ] Tap support chat → opens panel
- [ ] WhatsApp link in support chat opens wa.me
- [ ] Footer renders with links
- [ ] No layout shift on scroll
- [ ] Theme color (orange status bar) on Chrome Android
- [ ] No console errors anywhere
- [ ] No 404s in network tab on initial load

## Known limits

- `My Applications` requires the `applications` Supabase table (already exists)
- `Job Alerts` requires `job_alerts` table — run `supabase/migrations/20260510_job_alerts.sql`
- `Career subscribe` requires `career_subscribers` — run `20260509_career_subscribers.sql`
- `Interest forms` require `product_interest` — run `20260509_product_interest.sql`

If a SQL migration is not yet run, the API still returns success but data is logged server-side only. Run the SQL in Supabase SQL Editor to start collecting.
