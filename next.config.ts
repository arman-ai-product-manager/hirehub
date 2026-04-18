import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Redirect static hirehub.html to dynamic API route — prevents Vercel CDN caching old version
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
        source: '/hirehub.html',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
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
