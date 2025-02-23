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
import { useState } from "react"
import { EventStatus, EventType } from "@prisma/client"

export default function EventsFilters() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<EventStatus | "ALL">("ALL")
  const [type, setType] = useState<EventType | "ALL">("ALL")

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="md:w-80"
      />
      <Select value={status} onValueChange={(value: EventStatus | "ALL") => setStatus(value)}>
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
      <Select value={type} onValueChange={(value: EventType | "ALL") => setType(value)}>
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
      <Button variant="outline" onClick={() => {
        setSearch("")
        setStatus("ALL")
        setType("ALL")
      }}>
        Reset Filters
      </Button>
    </div>
  )
}