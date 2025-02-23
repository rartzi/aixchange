import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EventsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Events & Challenges
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Join exciting AI challenges, hackathons, and events. Showcase your solutions, 
          collaborate with others, and win prizes. Have an idea? Create your own event!
        </p>
      </div>
      <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        <Link href="/events/create">
          Host an Event
        </Link>
      </Button>
    </div>
  )
}