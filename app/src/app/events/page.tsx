import { Metadata } from 'next'
import EventsGrid from '@/components/events/EventsGrid'
import EventsHeader from '@/components/events/EventsHeader'
import EventsFilters from '@/components/events/EventsFilters'

export const metadata: Metadata = {
  title: 'Events | AIXchange',
  description: 'Discover and participate in AI-focused events, hackathons, and challenges.',
}

export default async function EventsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <EventsHeader />
      <div className="mt-8">
        <EventsFilters />
      </div>
      <div className="mt-8">
        <EventsGrid />
      </div>
    </main>
  )
}