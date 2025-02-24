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
import { EventStatus, EventType } from "@/types/event"

interface EventsFiltersProps {
  searchInput: string
  filters: {
    status: EventStatus | "ALL"
    type: EventType | "ALL"
  }
  onSearchChange: (value: string) => void
  onFilterChange: (key: "status" | "type", value: EventStatus | EventType | "ALL") => void
  onReset: () => void
}

export default function EventsFilters({
  searchInput,
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
}: EventsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search events..."
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:w-80"
      />
      <Select 
        value={filters.status} 
        onValueChange={(value: EventStatus | "ALL") => onFilterChange("status", value)}
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
        value={filters.type} 
        onValueChange={(value: EventType | "ALL") => onFilterChange("type", value)}
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
        onClick={onReset}
      >
        Reset Filters
      </Button>
    </div>
  )
}