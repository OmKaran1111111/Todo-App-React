import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
const isProtectedRoute = createRouteMatcher([
  '/', '/home', '/search', '/addtask', '/tasklist', '/dashboard',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
     const { userId } = await auth()
     if (!userId) {
       return NextResponse.redirect(new URL('/Login', req.url))
     }
   }

})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}