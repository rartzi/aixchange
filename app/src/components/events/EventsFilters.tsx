"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { EventStatus, EventType } from "@/types/event"
import { useCallback, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export default function EventsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state for immediate UI feedback
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")
  const status = (searchParams.get("status") as EventStatus | "ALL") || "ALL"
  const type = (searchParams.get("type") as EventType | "ALL") || "ALL"

  const createQueryString = useCallback((params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })
    return newSearchParams.toString()
  }, [searchParams])

  const debouncedUpdateSearch = useDebouncedCallback((value: string) => {
    const queryString = createQueryString({ search: value })
    router.push(`${pathname}?${queryString}`)
  }, 300)

  const updateFilters = useCallback((params: Record<string, string>) => {
    const queryString = createQueryString(params)
    router.push(`${pathname}?${queryString}`)
  }, [createQueryString, pathname, router])

  // Sync URL params with local state on mount and URL changes
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "")
  }, [searchParams])

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search events..."
        value={searchInput}
        onChange={(e) => {
          const value = e.target.value
          setSearchInput(value)
          debouncedUpdateSearch(value)
        }}
        className="md:w-80"
      />
      <Select 
        value={status} 
        onValueChange={(value: EventStatus | "ALL") => updateFilters({ status: value })}
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="UPCOMING">Upcoming</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="VOTING">Voting</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={type} 
        onValueChange={(value: EventType | "ALL") => updateFilters({ type: value })}
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          <SelectItem value="HACKATHON">Hackathon</SelectItem>
          <SelectItem value="CHALLENGE">Challenge</SelectItem>
          <SelectItem value="COMPETITION">Competition</SelectItem>
          <SelectItem value="WORKSHOP">Workshop</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        onClick={() => {
          setSearchInput("")
          router.push(pathname)
        }}
      >
        Reset Filters
      </Button>
    </div>
  )
}