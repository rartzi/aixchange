"use client"

import { type EventWithCounts } from "@/types/event"
import EventCard from "./EventCard"

interface EventsGridProps {
  events: EventWithCounts[]
  isLoading: boolean
}

export default function EventsGrid({ events, isLoading }: EventsGridProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    )
  }

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