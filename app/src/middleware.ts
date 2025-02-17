import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { NextRequest } from "next/server"

// TEMPORARY: Disable all auth checks for development
export function middleware(req: NextRequest) {
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