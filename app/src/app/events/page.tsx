import { prisma } from "@/lib/db/prisma";
import { EventsGrid } from "@/components/features/events/EventsGrid";
import Link from "next/link";

// Add dynamic flag to prevent static page generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        status: {
          in: ["UPCOMING", "ACTIVE"]
        }
      },
      include: {
        createdBy: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            participants: true,
            solutions: true,
          },
        },
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          startDate: 'asc',
        },
      ],
    });

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-primary-foreground">Events</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Join exciting AI events, workshops, and competitions. Showcase your skills, learn from others, and win prizes!
              </p>
            </div>
            <div>
              <Link
                href="/events/create"
                className="px-6 py-3 rounded-lg bg-white text-primary hover:bg-white/90 transition-colors font-medium"
              >
                Host Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Event Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Upcoming & Active Events</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              <Link
                href="/events?type=HACKATHON"
                className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Hackathons
              </Link>
              <Link
                href="/events?type=CHALLENGE"
                className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Challenges
              </Link>
              <Link
                href="/events?type=COMPETITION"
                className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Competitions
              </Link>
              <Link
                href="/events?type=WORKSHOP"
                className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Workshops
              </Link>
            </div>
          </div>

          {/* Events Grid */}
          {events.length > 0 ? (
            <EventsGrid events={events} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Check back later for upcoming events or{" "}
                <Link href="/events/create" className="text-primary hover:underline">
                  host your own
                </Link>
                !
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}