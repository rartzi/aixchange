import { type Prisma } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Users2Icon, TrophyIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

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

type EventCardProps = {
  event: EventWithCounts
}

export default function EventCard({ event }: EventCardProps) {
  const isActive = event.status === "ACTIVE"
  const startingSoon = event.status === "UPCOMING" && 
    new Date(event.startDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg 
      ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="relative h-48">
        <Image
          src={event.imageUrl || "/placeholder-image.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        {event.isPromoted && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500">
            Featured
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(event.startDate), { addSuffix: true })}
            </p>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2">{event.shortDescription}</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users2Icon className="w-4 h-4" />
            <span>{event._count.participants}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrophyIcon className="w-4 h-4" />
            <span>{event._count.solutions} solutions</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(event.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={isActive || startingSoon ? "default" : "secondary"}>
          <Link href={`/events/${event.id}`}>
            {isActive ? "Join Now" : startingSoon ? "Starting Soon" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}