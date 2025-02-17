import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { NextRequest } from "next/server"

// TEMPORARY: Authentication bypass for development
// TODO: Re-enable authentication before production deployment
export function middleware(req: NextRequest) {
  // Simulate admin access for development
  const simulatedRole = UserRole.ADMIN

  // Maintain role-based routing logic for UI consistency
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (simulatedRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // For moderator routes, allow both MODERATOR and ADMIN roles
  if (req.nextUrl.pathname.startsWith('/moderator')) {
    if (![UserRole.MODERATOR, UserRole.ADMIN].includes(simulatedRole)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return null
}

// Keep matchers for future authentication restoration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/moderator/:path*',
    '/profile/:path*'
  ]
}