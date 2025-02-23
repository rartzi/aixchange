import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Users2Icon, TrophyIcon } from "lucide-react"
import { formatDistanceToNow, intervalToDuration, type Duration } from "date-fns"
import EventSolutions from "@/components/events/EventSolutions"
import JoinEventButton from "@/components/events/JoinEventButton"

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await prisma.$queryRaw<Array<{
    id: string
    title: string
    description: string
    shortDescription: string
    startDate: Date
    endDate: Date
    status: string
    type: string
    imageUrl: string | null
    bannerUrl: string | null
    prizes: any
    rules: string
    isPromoted: boolean
    participantCount: number
    submissionCount: number
  }>>`
    SELECT *
    FROM "Event"
    WHERE id = ${params.id}
  `

  if (!event[0]) {
    notFound()
  }

  const currentEvent = event[0]
  const isActive = currentEvent.status === "ACTIVE"
  const startingSoon = currentEvent.status === "UPCOMING" && 
    new Date(currentEvent.startDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const duration = intervalToDuration({
    start: new Date(currentEvent.startDate),
    end: new Date(currentEvent.endDate)
  })

  const formatDuration = (duration: Duration) => {
    const parts = []
    if (duration.months) parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`)
    if (duration.days) parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`)
    if (duration.hours) parts.push(`${duration.hours} hour${duration.hours > 1 ? 's' : ''}`)
    return parts.join(', ') || 'Less than an hour'
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={currentEvent.bannerUrl || currentEvent.imageUrl || "/placeholder-image.jpg"}
          alt={currentEvent.title}
          fill
          className="object-cover"
        />
        {currentEvent.isPromoted && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500">
            Featured Event
          </Badge>
        )}
      </div>

      {/* Event Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {currentEvent.status}
            </Badge>
            <Badge variant="outline">{currentEvent.type}</Badge>
          </div>
          <h1 className="text-4xl font-bold">{currentEvent.title}</h1>
          <p className="text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(currentEvent.startDate), { addSuffix: true })}
          </p>
        </div>
        <JoinEventButton eventId={currentEvent.id} />
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-2 p-4 rounded-lg bg-card">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-semibold">{formatDuration(duration)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 rounded-lg bg-card">
          <Users2Icon className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-semibold">{currentEvent.participantCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 rounded-lg bg-card">
          <TrophyIcon className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Solutions</p>
            <p className="font-semibold">{currentEvent.submissionCount}</p>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="rules">Rules & Prizes</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="about" className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            {currentEvent.description}
          </div>
        </TabsContent>
        <TabsContent value="rules" className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Rules</h2>
            {currentEvent.rules}
            {currentEvent.prizes && (
              <>
                <h2>Prizes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(currentEvent.prizes).map(([place, prize]) => (
                    <div key={place} className="p-4 rounded-lg bg-card">
                      <h3 className="text-lg font-semibold mb-2">{place}</h3>
                      <p className="text-muted-foreground">{prize as string}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="solutions">
          <EventSolutions eventId={currentEvent.id} />
        </TabsContent>
      </Tabs>
    </main>
  )
}