import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { EventList } from "@/components/admin/events/EventList";

export const metadata: Metadata = {
  title: "Event Management | Admin",
  description: "Manage hackathons, challenges, and other innovation events",
};

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage hackathons, challenges, and innovation events
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="VOTING">Voting</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">All Types</option>
              <option value="HACKATHON">Hackathon</option>
              <option value="CHALLENGE">Challenge</option>
              <option value="COMPETITION">Competition</option>
              <option value="WORKSHOP">Workshop</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search events..."
              className="w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <EventList />
      </div>
    </div>
  );
}