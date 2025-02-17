import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"
import { Adapter } from "next-auth/adapters"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Custom adapter functions
const customAdapter = {
  async createUser(user: any) {
    return prisma.user.create({ data: user })
  },
  async getUser(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },
  async updateUser(user: any) {
    return prisma.user.update({
      where: { id: user.id },
      data: user,
    })
  },
} as Adapter

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // TEMPORARY: Bypass authentication for development
      async authorize(credentials) {
        return {
          id: 'temp-admin-id',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    newUser: "/register"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }