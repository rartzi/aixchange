import { type Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import EventCard from "./EventCard"

type EventWithCounts = {
  id: string
  title: string
  shortDescription: string
  description: string
  startDate: Date
  endDate: Date
  status: "DRAFT" | "UPCOMING" | "ACTIVE" | "VOTING" | "COMPLETED" | "ARCHIVED"
  type: "HACKATHON" | "CHALLENGE" | "COMPETITION" | "WORKSHOP"
  imageUrl: string | null
  bannerUrl: string | null
  isPublic: boolean
  isPromoted: boolean
  _count: {
    participants: number
    solutions: number
  }
}

export default async function EventsGrid() {
  const events = await prisma.$queryRaw<EventWithCounts[]>`
    SELECT 
      e.*,
      json_build_object(
        'participants', (SELECT COUNT(*) FROM "EventParticipant" WHERE "eventId" = e.id),
        'solutions', (SELECT COUNT(*) FROM "Solution" WHERE "eventId" = e.id)
      ) as "_count"
    FROM "Event" e
    WHERE e."isPublic" = true
    ORDER BY e."isPromoted" DESC, e."startDate" ASC
  `

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No events found</h3>
        <p className="text-muted-foreground mt-2">Check back later or try different filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}