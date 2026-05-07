const fs   = require('fs')
const path = require('path')

// Build-time version — changes every deployment so Cloudflare must re-fetch
const BUILD_VERSION = process.env.VERCEL_DEPLOYMENT_ID || Date.now().toString()

// Serve hirehub.html as a dynamic API response — bypasses Vercel/Cloudflare CDN edge cache
// so users ALWAYS get the latest version on every request
export default function handler(req, res) {
  // NOT in public/ — so Cloudflare/Vercel CDN never caches it as a static asset
  const filePath = path.join(process.cwd(), 'hirehub-src.html')

  let html
  try {
    html = fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    return res.status(500).send('App file not found: ' + e.message)
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // Aggressive no-cache for Cloudflare + browsers
  res.setHeader('Cache-Control',              'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0')
  res.setHeader('Pragma',                     'no-cache')
  res.setHeader('Expires',                    '0')
  res.setHeader('Surrogate-Control',          'no-store')
  res.setHeader('CDN-Cache-Control',          'no-store')
  res.setHeader('Cloudflare-CDN-Cache-Control', 'no-store')
  res.setHeader('ETag',                       `"${BUILD_VERSION}"`)
  res.setHeader('X-App-Version',              BUILD_VERSION)

  res.status(200).send(html)
}
