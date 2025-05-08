import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/product', '/pricing', '/contact', '/try', '/docs']

const isPublic = createRouteMatcher(publicPaths)

export default clerkMiddleware((auth, req) => {
  if (isPublic(req)) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'index, follow')
    return response
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Optional: Only run on specific paths
    '/',
    '/product',
    '/pricing',
    '/contact',
    '/try',
    '/docs',
    '/api(.*)',
  ],
}