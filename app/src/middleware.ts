import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/register')

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    // Check for protected admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Check for protected moderator routes
    if (req.nextUrl.pathname.startsWith('/moderator')) {
      if (token?.role !== UserRole.MODERATOR && token?.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/moderator/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
}