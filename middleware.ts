import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware runs BEFORE static files — rewrites /hirehub.html → /api/app
// so the URL stays clean (hirehub360.in/hirehub.html) and content is always fresh
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/hirehub.html') {
    const url = request.nextUrl.clone()
    url.pathname = '/api/app'
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/hirehub.html'],
}
