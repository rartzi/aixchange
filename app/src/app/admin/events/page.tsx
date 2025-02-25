"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BulkImport } from "@/components/admin/events/BulkImport";
import { AdminEventDialog } from "@/components/admin/AdminEventDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "UPCOMING" | "ACTIVE" | "VOTING" | "COMPLETED" | "ARCHIVED";
  type: "HACKATHON" | "CHALLENGE" | "COMPETITION" | "WORKSHOP";
  imageUrl?: string;
  prizes?: any;
  rules: string;
  maxParticipants?: number;
  isPublic: boolean;
  isPromoted: boolean;
  viewCount: number;
  participantCount: number;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

type SortableFields = keyof Pick<Event, 
  'title' | 'status' | 'createdAt' | 'updatedAt' | 'participantCount'
>;

export default function EventsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Event["status"]>("ALL");
  const [sortField, setSortField] = useState<SortableFields>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/login?callbackUrl=/admin/events');
      return;
    }

    fetchEvents();
  }, [session, status, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEvent = async (eventData: FormData) => {
    try {
      const isEditing = eventData.get('id') !== null;
      const url = isEditing 
        ? `/api/admin/events/${eventData.get('id')}`
        : '/api/admin/events';
      
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        body: eventData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} event`);
      }

      toast({
        title: "Success",
        description: `Event ${isEditing ? 'updated' : 'created'} successfully`,
      });

      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: Event["status"]) => {
    if (selectedEvents.size === 0) return;

    try {
      const response = await fetch("/api/admin/events/bulk-update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventIds: Array.from(selectedEvents),
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update events");

      toast({
        title: "Success",
        description: "Events updated successfully",
      });

      setSelectedEvents(new Set());
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update events",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedEvents.size} events?`)) return;

    try {
      const response = await fetch("/api/admin/events/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventIds: Array.from(selectedEvents),
        }),
      });

      if (!response.ok) throw new Error("Failed to delete events");

      toast({
        title: "Success",
        description: "Events deleted successfully",
      });

      setSelectedEvents(new Set());
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete events",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      return ((aValue as number) - (bValue as number)) * modifier;
    });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Event Management</h1>
        <Button onClick={() => {
          setEditingEvent(null);
          setDialogOpen(true);
        }}>Add Event</Button>
      </div>
      
      <div className="space-y-8 px-8">
        {/* Bulk Import Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bulk Import</h2>
          <BulkImport onImportSuccess={fetchEvents} />
        </div>

        {/* Events Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Events List</h2>
          
          {/* Filters and Actions */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="VOTING">Voting</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedEvents.size > 0 && (
              <div className="flex gap-2">
                <Select onValueChange={(value) => handleBulkStatusUpdate(value as Event["status"])}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Set as Draft</SelectItem>
                    <SelectItem value="UPCOMING">Set as Upcoming</SelectItem>
                    <SelectItem value="ACTIVE">Set as Active</SelectItem>
                    <SelectItem value="VOTING">Set as Voting</SelectItem>
                    <SelectItem value="COMPLETED">Set as Completed</SelectItem>
                    <SelectItem value="ARCHIVED">Set as Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEvents.size === filteredEvents.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEvents(new Set(filteredEvents.map(e => e.id)));
                        } else {
                          setSelectedEvents(new Set());
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (sortField === "title") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        } else {
                          setSortField("title");
                          setSortDirection("asc");
                        }
                      }}
                    >
                      Title
                      {sortField === "title" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (sortField === "status") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        } else {
                          setSortField("status");
                          setSortDirection("asc");
                        }
                      }}
                    >
                      Status
                      {sortField === "status" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (sortField === "participantCount") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        } else {
                          setSortField("participantCount");
                          setSortDirection("desc");
                        }
                      }}
                    >
                      Participants
                      {sortField === "participantCount" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEvents.has(event.id)}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedEvents);
                            if (checked) {
                              newSelected.add(event.id);
                            } else {
                              newSelected.delete(event.id);
                            }
                            setSelectedEvents(newSelected);
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {event.imageUrl && (
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          )}
                          <div>
                            <div>{event.title}</div>
                            <div className="text-sm text-gray-500">{event.shortDescription}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${event.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          event.status === 'VOTING' ? 'bg-purple-100 text-purple-800' :
                          event.status === 'COMPLETED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {event.status}
                        </span>
                      </TableCell>
                      <TableCell>{event.participantCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingEvent(event);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AdminEventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
}