'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
}

interface AdminEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSave: (event: Partial<Event>) => Promise<void>;
}

export function AdminEventDialog({ open, onOpenChange, event, onSave }: AdminEventDialogProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    shortDescription: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: 'DRAFT',
    type: 'HACKATHON',
    imageUrl: '',
    prizes: {},
    rules: '',
    maxParticipants: undefined,
    isPublic: true,
    isPromoted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        maxParticipants: event.maxParticipants || undefined,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: 'DRAFT',
        type: 'HACKATHON',
        imageUrl: '',
        prizes: {},
        rules: '',
        maxParticipants: undefined,
        isPublic: true,
        isPromoted: false,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = event?.id ? { ...formData, id: event.id } : formData;
      console.log('Saving event data:', dataToSave);
      await onSave(dataToSave);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {event ? 'Edit Event' : 'Add Event'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: "HACKATHON" | "CHALLENGE" | "COMPETITION" | "WORKSHOP") =>
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HACKATHON">Hackathon</SelectItem>
                  <SelectItem value="CHALLENGE">Challenge</SelectItem>
                  <SelectItem value="COMPETITION">Competition</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: Event["status"]) =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="VOTING">Voting</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Start Date</label>
              <Input
                type="datetime-local"
                value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">End Date</label>
              <Input
                type="datetime-local"
                value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value).toISOString() }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Image Path (Optional)</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="/api/external-images/events/example.png"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Max Participants (Optional)</label>
              <Input
                type="number"
                value={formData.maxParticipants || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value ? Number(e.target.value) : undefined }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isPublic: checked as boolean }))
                  }
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100"
                >
                  Public
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPromoted"
                  checked={formData.isPromoted}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isPromoted: checked as boolean }))
                  }
                />
                <label
                  htmlFor="isPromoted"
                  className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100"
                >
                  Promoted
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Short Description</label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
            <textarea
              className={cn(
                "w-full min-h-[100px] p-2 border rounded-md resize-y",
                "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                "border-gray-200 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              )}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter a detailed description of the event..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Rules</label>
            <textarea
              className={cn(
                "w-full min-h-[100px] p-2 border rounded-md resize-y",
                "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                "border-gray-200 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              )}
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              placeholder="Enter the rules for the event..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-white dark:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}