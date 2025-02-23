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
      setEvents(data);
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

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      const isEditing = !!eventData.id;
      const url = isEditing 
        ? `/api/admin/events/${eventData.id}`
        : '/api/admin/events';
      
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
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

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete event");
      }

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: Event["status"]) => {
    if (!selectedEvents.size) {
      toast({
        title: "Error",
        description: "No events selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/events/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventIds: Array.from(selectedEvents),
          status: newStatus,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to update events");
      }

      toast({
        title: "Success",
        description: `Successfully updated ${selectedEvents.size} events`,
      });

      setSelectedEvents(new Set());
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update events",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedEvents.size) {
      toast({
        title: "Error",
        description: "No events selected",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedEvents.size} events? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/events/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventIds: Array.from(selectedEvents),
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete events");
      }

      toast({
        title: "Success",
        description: result.message || `Successfully deleted ${selectedEvents.size} events`,
      });

      setSelectedEvents(new Set());
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete events",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const toggleEventSelection = (eventId: string) => {
    const newSelection = new Set(selectedEvents);
    if (newSelection.has(eventId)) {
      newSelection.delete(eventId);
    } else {
      newSelection.add(eventId);
    }
    setSelectedEvents(newSelection);
  };

  const toggleAllEvents = () => {
    if (selectedEvents.size === filteredEvents.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(filteredEvents.map(e => e.id)));
    }
  };

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.createdBy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.createdBy.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      if (!aValue || !bValue) return 0;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

  if (status === 'loading' || isLoading) {
    return <div className="p-8 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Event Management</h1>
        <Button onClick={handleAdd}>Add Event</Button>
      </div>
      
      <div className="space-y-8 px-8">
        {/* Bulk Import Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bulk Import</h2>
          <BulkImport onImportSuccess={fetchEvents} />
        </div>

        {/* Events Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Events Overview</h2>
            <div className="flex gap-4">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Select
                value={statusFilter}
                onValueChange={(value: "ALL" | Event["status"]) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="VOTING">Voting</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortField}
                onValueChange={(value: SortableFields) => setSortField(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                  <SelectItem value="participantCount">Participants</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                className="bg-white dark:bg-gray-800"
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>

          {selectedEvents.size > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedEvents.size} events selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const selectedEventsData = filteredEvents
                      .filter(e => selectedEvents.has(e.id))
                      .map(e => ({
                        ...e,
                        createdAt: new Date(e.createdAt).toISOString(),
                        updatedAt: new Date(e.updatedAt).toISOString(),
                        startDate: new Date(e.startDate).toISOString(),
                        endDate: new Date(e.endDate).toISOString()
                      }));
                    
                    const exportData = {
                      events: selectedEventsData
                    };
                    
                    const jsonStr = JSON.stringify(exportData, null, 2);
                    
                    // Create and trigger download
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'events-export.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    toast({
                      title: "Success",
                      description: `${selectedEvents.size} events exported to JSON file`,
                    });
                  }}
                  className="bg-white dark:bg-gray-800"
                >
                  Download JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const selectedEventsData = filteredEvents
                      .filter(e => selectedEvents.has(e.id))
                      .map(e => ({
                        ...e,
                        createdAt: new Date(e.createdAt).toISOString(),
                        updatedAt: new Date(e.updatedAt).toISOString(),
                        startDate: new Date(e.startDate).toISOString(),
                        endDate: new Date(e.endDate).toISOString()
                      }));
                    
                    const exportData = {
                      events: selectedEventsData
                    };
                    
                    const jsonStr = JSON.stringify(exportData, null, 2);
                    navigator.clipboard.writeText(jsonStr).then(() => {
                      toast({
                        title: "Success",
                        description: `${selectedEvents.size} events copied to clipboard as JSON`,
                      });
                    }).catch(err => {
                      toast({
                        title: "Error",
                        description: "Failed to copy to clipboard",
                        variant: "destructive",
                      });
                    });
                  }}
                  className="bg-white dark:bg-gray-800"
                >
                  Copy to Clipboard
                </Button>
              </div>
              <Select
                onValueChange={(value: Event["status"]) => handleBulkStatusUpdate(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Set Draft</SelectItem>
                  <SelectItem value="UPCOMING">Set Upcoming</SelectItem>
                  <SelectItem value="ACTIVE">Set Active</SelectItem>
                  <SelectItem value="VOTING">Set Voting</SelectItem>
                  <SelectItem value="COMPLETED">Set Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Set Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="ml-2"
              >
                Delete Selected
              </Button>
            </div>
          )}
          
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEvents.size === filteredEvents.length && filteredEvents.length > 0}
                      onCheckedChange={toggleAllEvents}
                    />
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Title</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Image</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Type</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Dates</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Participants</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Submissions</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Views</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell>
                      <Checkbox
                        checked={selectedEvents.has(event.id)}
                        onCheckedChange={() => toggleEventSelection(event.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{event.shortDescription}</div>
                    </TableCell>
                    <TableCell>
                      {event.imageUrl ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No image</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{event.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === "ACTIVE" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : event.status === "UPCOMING"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : event.status === "VOTING"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                          : event.status === "COMPLETED"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                          : event.status === "ARCHIVED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}>
                        {event.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Start: {new Date(event.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(event.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {event.participantCount}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{event.submissionCount}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{event.viewCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="bg-white dark:bg-gray-800"
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
                ))}
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