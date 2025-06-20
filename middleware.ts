import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth/line', '/', '/learn', '/identity', '/proofs', '/rewards', '/resume', '/settings', '/vault']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  // Check if the path is wallet-related (needs authentication)
  if (pathname.startsWith('/wallet')) {
    const token = request.cookies.get('authtoken')?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // For Edge Runtime compatibility, we'll do basic token validation
    // Full JWT verification happens in API routes which run in Node.js runtime
    try {
      // Basic check that token exists and has JWT structure (3 parts separated by dots)
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid token format')
      }
      
      // Token exists and has valid format, allow request
      // Actual verification will happen in API routes
      return NextResponse.next()
    } catch (error) {
      // Invalid token format, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - they have their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}