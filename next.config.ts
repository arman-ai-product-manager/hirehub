import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Redirect static hirehub.html to dynamic API route — prevents Vercel/Cloudflare CDN caching
      {
        source: '/hirehub.html',
        destination: '/api/app',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        // Tell Cloudflare + browsers: NEVER cache hirehub.html or the app route
        source: '/hirehub.html',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          { key: 'Surrogate-Control', value: 'no-store' },      // Cloudflare CDN: don't cache
          { key: 'CDN-Cache-Control', value: 'no-store' },      // Cloudflare CDN: don't cache
          { key: 'Cloudflare-CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/app',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          { key: 'Surrogate-Control', value: 'no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Cloudflare-CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
