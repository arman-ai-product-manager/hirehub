import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16 Proxy (renamed from Middleware) — runs before static files
// Rewrites /hirehub.html → /api/app so URL stays clean and content is always fresh
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/hirehub.html') {
    const url = request.nextUrl.clone()
    url.pathname = '/api/app'
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/hirehub.html'],
}
