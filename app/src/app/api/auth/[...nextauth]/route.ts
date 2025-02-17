import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db/prisma"
import { Adapter } from "next-auth/adapters"
import { User, Prisma } from "@prisma/client"

// Custom adapter functions with proper Prisma input types
const customAdapter = {
  async createUser(userData: Omit<Prisma.UserCreateInput, "id">): Promise<User> {
    return prisma.user.create({ 
      data: {
        ...userData,
        // Set default values for required fields
        email: userData.email ?? '',
        role: userData.role ?? 'USER',
        authProvider: userData.authProvider ?? 'EMAIL'
      } 
    })
  },
  async getUser(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  },
  async updateUser(userData: Prisma.UserUpdateInput & { id: string }): Promise<User> {
    const { id, ...data } = userData
    return prisma.user.update({
      where: { id },
      data
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
      async authorize() {
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