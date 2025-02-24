"use client"

import { useState, useEffect, useCallback } from "react"
import { type EventWithCounts, EventStatus, EventType } from "@/types/event"
import EventsFilters from "./EventsFilters"
import EventsGrid from "./EventsGrid"
import { useDebouncedCallback } from "use-debounce"

interface EventsContainerProps {
  initialEvents: EventWithCounts[]
}

export default function EventsContainer({ initialEvents }: EventsContainerProps) {
  const [events, setEvents] = useState<EventWithCounts[]>(initialEvents)
  const [isLoading, setIsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [filters, setFilters] = useState({
    status: "ALL" as "ALL" | EventStatus,
    type: "ALL" as "ALL" | EventType,
  })

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchInput) params.append("search", searchInput)
      if (filters.status !== "ALL") params.append("status", filters.status)
      if (filters.type !== "ALL") params.append("type", filters.type)

      const response = await fetch(`/api/events?${params.toString()}`)
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
    setIsLoading(false)
  }, [searchInput, filters.status, filters.type])

  const debouncedFetch = useDebouncedCallback(fetchEvents, 300)

  useEffect(() => {
    debouncedFetch()
  }, [searchInput, filters.status, filters.type, debouncedFetch])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  const handleFilterChange = (key: "status" | "type", value: EventStatus | EventType | "ALL") => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setSearchInput("")
    setFilters({
      status: "ALL",
      type: "ALL",
    })
  }

  return (
    <div className="space-y-8">
      <EventsFilters
        searchInput={searchInput}
        filters={filters}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      <EventsGrid
        events={events}
        isLoading={isLoading}
      />
    </div>
  )
}