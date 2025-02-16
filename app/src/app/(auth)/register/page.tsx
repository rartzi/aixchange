import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/RegisterForm"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Register | AiXchange",
  description: "Create your AiXchange account",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}