import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { User, UserRole } from "@prisma/client"

// Extend the User type to match our schema
type AdapterUser = Omit<User, "password"> & {
  id: string
  email: string
  role: UserRole
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    newUser: "/register"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        session.user.role = user.role as UserRole
      }
      return session
    }
  },
  events: {
    async signIn({ user }) {
      // Log successful sign-in
      await prisma.auditLog.create({
        data: {
          action: "SIGN_IN",
          entityType: "USER",
          entityId: user.id,
          userId: user.id,
          metadata: {
            timestamp: new Date().toISOString(),
            success: true
          }
        }
      })
    },
    async signOut({ token }) {
      if (token?.sub) {
        // Log sign-out
        await prisma.auditLog.create({
          data: {
            action: "SIGN_OUT",
            entityType: "USER",
            entityId: token.sub,
            userId: token.sub,
            metadata: {
              timestamp: new Date().toISOString()
            }
          }
        })
      }
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }