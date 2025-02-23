"use client"

import { type EventWithCounts } from "@/types/event"
import EventCard from "./EventCard"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function EventsGrid() {
  const [events, setEvents] = useState<EventWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/events?${searchParams.toString()}`)
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
      setLoading(false)
    }

    fetchEvents()
  }, [searchParams])

  if (loading) {
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