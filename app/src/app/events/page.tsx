import { Metadata } from 'next'
import { prisma } from "@/lib/db/prisma"
import EventsHeader from '@/components/events/EventsHeader'
import EventsContainer from '@/components/events/EventsContainer'
import { type EventWithCounts } from "@/types/event"

export const metadata: Metadata = {
  title: 'Events | AIXchange',
  description: 'Discover and participate in AI-focused events, hackathons, and challenges.',
}

// Add dynamic flag to prevent static page generation
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getInitialEvents(): Promise<EventWithCounts[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        startDate: 'asc',
      },
      include: {
        _count: {
          select: {
            participants: true,
            solutions: true,
          },
        },
      },
      take: 10,
    })

    return events as EventWithCounts[]
  } catch (error) {
    console.error('Error fetching initial events:', error)
    return []
  }
}

export default async function EventsPage() {
  const initialEvents = await getInitialEvents()

  return (
    <main className="container mx-auto px-4 py-8">
      <EventsHeader />
      <div className="mt-8">
        <EventsContainer initialEvents={initialEvents} />
      </div>
    </main>
  )
}