'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { Textarea } from "@/components/ui/textarea";

interface Event {
  id?: string;
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
  onSave: (event: FormData) => Promise<void>;
}

const DEFAULT_FORM_DATA: Required<Omit<Event, 'id' | 'imageUrl'>> = {
  title: '',
  description: '',
  shortDescription: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  status: 'DRAFT',
  type: 'HACKATHON',
  prizes: {},
  rules: '',
  maxParticipants: 0,
  isPublic: true,
  isPromoted: false,
};

export function AdminEventDialog({ open, onOpenChange, event, onSave }: AdminEventDialogProps) {
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    ...DEFAULT_FORM_DATA,
    imageUrl: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'info' | 'success' | 'error';
    message: string;
    details?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        ...event,
        maxParticipants: event.maxParticipants || 0,
        startDate: new Date(event.startDate).toISOString().split('T')[0],
        endDate: new Date(event.endDate).toISOString().split('T')[0],
      });
      setPreviewImage(event.imageUrl || null);
    } else {
      setFormData({
        ...DEFAULT_FORM_DATA,
        imageUrl: undefined
      });
      setPreviewImage(null);
    }
  }, [event]);

  const generateImage = async (description: string) => {
    try {
      setIsGeneratingImage(true);
      setStatusMessage({ type: 'info', message: 'Generating image with DALL-E...' });

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          title: formData.title || 'event',
          type: 'event'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage({
          type: 'error',
          message: 'Failed to generate image',
          details: data.details || 'Please try again or upload an image manually'
        });
        return null;
      }

      setStatusMessage({
        type: 'success',
        message: 'Image generated successfully',
        details: `Generated image: ${data.filename}`
      });

      setPreviewImage(data.imageUrl);
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));

      return data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      setStatusMessage({
        type: 'error',
        message: 'Error generating image',
        details: 'Please try again or upload an image manually'
      });
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'events');
      
      fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        setStatusMessage({
          type: 'success',
          message: 'Image uploaded successfully',
          details: `File: ${file.name}`
        });
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setStatusMessage({
          type: 'error',
          message: 'Failed to upload image',
          details: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, imageUrl: undefined }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // If no image is provided but we have a description, try to generate one
      if (!formData.imageUrl && formData.description) {
        const generatedImageUrl = await generateImage(formData.description);
        if (generatedImageUrl) {
          formData.imageUrl = generatedImageUrl;
        }
      }

      // Create FormData instance
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'prizes') {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // Add ID if editing
      if (event?.id) {
        formDataToSend.append('id', event.id);
      }

      await onSave(formDataToSend);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving event:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to save event',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
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

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-4 p-4 rounded-md ${
            statusMessage.type === 'success' ? 'bg-green-100 text-green-800' :
            statusMessage.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <p className="font-medium">{statusMessage.message}</p>
            {statusMessage.details && (
              <p className="text-sm mt-1">{statusMessage.details}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label htmlFor="shortDescription" className="text-sm font-medium">Short Description</label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              required
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Full Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
            />
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <label htmlFor="rules" className="text-sm font-medium">Rules</label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              required
              rows={4}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Event['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Event['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
          </div>

          {/* Max Participants */}
          <div className="space-y-2">
            <label htmlFor="maxParticipants" className="text-sm font-medium">Max Participants</label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>
              {formData.description && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateImage(formData.description)}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? 'Generating...' : 'Generate with AI'}
                </Button>
              )}
            </div>
            {previewImage && (
              <div className="mt-4">
                <Image
                  src={previewImage}
                  alt="Event preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          {/* Visibility Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked as boolean }))}
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make this event public
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPromoted"
                checked={formData.isPromoted}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPromoted: checked as boolean }))}
              />
              <label htmlFor="isPromoted" className="text-sm font-medium">
                Promote this event
              </label>
            </div>
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
            <Button 
              type="submit" 
              disabled={isSubmitting || isGeneratingImage}
            >
              {isSubmitting 
                ? 'Saving...' 
                : isGeneratingImage 
                  ? 'Generating Image...' 
                  : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}