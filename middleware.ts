import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/product', '/pricing', '/contact']

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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}