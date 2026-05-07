/**
 * googleIndex.js — Google Indexing API via service account JWT
 *
 * Officially designed for JobPosting + LiveStream schema, but works for any URL
 * when the service account is added as a verified owner in Search Console.
 *
 * Quota: 200 URL submissions per day (resets midnight Pacific).
 *
 * Setup (one-time, 5 minutes):
 *   1. console.cloud.google.com → New Project "HireHub360"
 *   2. APIs & Services → Enable "Web Search Indexing API"
 *   3. IAM & Admin → Service Accounts → Create → name "hirehub-indexer"
 *   4. Click the service account → Keys → Add Key → JSON → download
 *   5. Search Console → Settings → Users and permissions → Add user
 *      → paste service account email (xxx@xxx.iam.gserviceaccount.com) → Owner
 *   6. Vercel → Settings → Environment Variables → add:
 *      GOOGLE_SERVICE_ACCOUNT_KEY = (paste the entire JSON file content as one line)
 */
const crypto = require('crypto')

const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const TOKEN_ENDPOINT    = 'https://oauth2.googleapis.com/token'
const SCOPE             = 'https://www.googleapis.com/auth/indexing'

// Cache the access token for up to 55 minutes (tokens last 60 min)
let _cachedToken  = null
let _tokenExpires = 0

async function getAccessToken() {
  if (_cachedToken && Date.now() < _tokenExpires) return _cachedToken

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) return null

  let key
  try {
    key = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (e) {
    console.error('[googleIndex] Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', e.message)
    return null
  }

  if (!key.private_key || !key.client_email) {
    console.error('[googleIndex] Missing private_key or client_email in service account key')
    return null
  }

  const now = Math.floor(Date.now() / 1000)

  // Build JWT header + payload
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: SCOPE,
    aud: TOKEN_ENDPOINT,
    exp: now + 3600,
    iat: now,
  })).toString('base64url')

  // Sign with private key (RS256)
  const signingInput = `${header}.${payload}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(signingInput)
  const signature = signer.sign(key.private_key, 'base64url')

  const jwt = `${signingInput}.${signature}`

  // Exchange JWT for access token
  const r = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  const data = await r.json()
  if (!data.access_token) {
    console.error('[googleIndex] Token exchange failed:', data)
    return null
  }

  _cachedToken  = data.access_token
  _tokenExpires = Date.now() + 55 * 60 * 1000  // 55 min
  return _cachedToken
}

/**
 * Submit URLs to Google Indexing API.
 * @param {string[]} urls  — absolute URLs to submit (max 200/day across all calls)
 * @param {'URL_UPDATED'|'URL_DELETED'} type
 * @returns {Promise<{url:string, ok:boolean, status:number|null, error?:string}[]>}
 */
async function googleIndex(urls, type = 'URL_UPDATED') {
  if (!urls || urls.length === 0) return []

  const token = await getAccessToken()
  if (!token) {
    console.warn('[googleIndex] No access token — GOOGLE_SERVICE_ACCOUNT_KEY not set or invalid')
    return urls.map(url => ({ url, ok: false, error: 'no_token' }))
  }

  const results = []

  // Submit one at a time — the API doesn't support batch in a single request
  for (const url of urls) {
    try {
      const r = await fetch(INDEXING_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type }),
        signal: AbortSignal.timeout(10000),
      })

      const body = await r.json().catch(() => ({}))

      results.push({
        url,
        ok: r.status === 200,
        status: r.status,
        ...(r.status !== 200 ? { error: body?.error?.message || r.statusText } : {}),
      })
    } catch (e) {
      results.push({ url, ok: false, status: null, error: e.message })
    }
  }

  return results
}

module.exports = { googleIndex }
