export type EventStatus = "DRAFT" | "UPCOMING" | "ACTIVE" | "VOTING" | "COMPLETED" | "ARCHIVED"
export type EventType = "HACKATHON" | "CHALLENGE" | "COMPETITION" | "WORKSHOP"

export type Event = {
  id: string
  title: string
  description: string
  shortDescription: string
  startDate: Date
  endDate: Date
  status: EventStatus
  type: EventType
  imageUrl: string | null
  bannerUrl: string | null
  prizes: { [key: string]: string } | null
  rules: string
  maxParticipants: number | null
  isPublic: boolean
  isPromoted: boolean
  viewCount: number
  participantCount: number
  submissionCount: number
  createdAt: Date
  updatedAt: Date
  createdById: string
}

export type EventWithCounts = Event & {
  _count: {
    participants: number
    solutions: number
  }
}