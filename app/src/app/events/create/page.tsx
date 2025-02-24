import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import EventForm from "@/components/events/EventForm"

export default async function CreateEventPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/events/create")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Host an Event
        </h1>
        <p className="text-muted-foreground mb-8">
          Create your own AI challenge, hackathon, or competition. Engage with the community
          and discover innovative solutions.
        </p>
        <EventForm />
      </div>
    </main>
  )
}