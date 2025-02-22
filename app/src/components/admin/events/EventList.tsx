import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { eventService } from "@/lib/services/eventService";
import type { Prisma } from "@prisma/client";

type EventWithCounts = Prisma.EventGetPayload<{
  include: {
    _count: {
      select: {
        participants: true;
        solutions: true;
      };
    };
  };
}>;

export async function EventList() {
  try {
    const events = await eventService.getAllEvents();

    if (events.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading events:", error);
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading events</p>
      </div>
    );
  }
}

function EventCard({ event }: { event: EventWithCounts }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              <Link href={`/admin/events/${event.id}`}>{event.title}</Link>
            </CardTitle>
            <CardDescription className="mt-2">
              {event.shortDescription}
            </CardDescription>
          </div>
          <StatusBadge status={event.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <Badge variant="outline">{event.type}</Badge>
            </div>
            <div className="text-muted-foreground">
              Starts {formatDistanceToNow(event.startDate)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Participants</div>
              <div className="font-medium">{event._count.participants}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Submissions</div>
              <div className="font-medium">{event._count.solutions}</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/events/${event.id}`}>View</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: EventWithCounts['status'] }) {
  const variants: Record<EventWithCounts['status'], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    DRAFT: { label: "Draft", variant: "outline" },
    UPCOMING: { label: "Upcoming", variant: "secondary" },
    ACTIVE: { label: "Active", variant: "default" },
    VOTING: { label: "Voting", variant: "default" },
    COMPLETED: { label: "Completed", variant: "outline" },
    ARCHIVED: { label: "Archived", variant: "outline" },
  };

  const { label, variant } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}