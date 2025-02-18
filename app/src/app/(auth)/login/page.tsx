import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login | AiXchange",
  description: "Login to your AiXchange account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}