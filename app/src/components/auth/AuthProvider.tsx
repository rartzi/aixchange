"use client"

import { SessionProvider } from "next-auth/react"
import { PropsWithChildren } from "react"
import { UserRole } from "@prisma/client"

// Mock session for development
const mockSession = {
  data: {
    user: {
      id: 'temp-admin-id',
      role: UserRole.ADMIN,
      email: 'admin@example.com',
      name: 'Admin User'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  status: 'authenticated'
}

export function AuthProvider({ children }: PropsWithChildren) {
  return <SessionProvider session={mockSession.data}>{children}</SessionProvider>
}

export default AuthProvider