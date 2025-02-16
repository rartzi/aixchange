import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Authentication - AIXchange",
  description: "Sign in or register for AIXchange",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image
              className="mx-auto h-10 w-auto"
              src="/next.svg"
              alt="AIXchange Logo"
              width={40}
              height={40}
              priority
            />
          </div>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}