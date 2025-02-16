import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "Login - AIXchange",
  description: "Sign in to your AIXchange account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center text-sm">
          <a
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don&apos;t have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  )
}