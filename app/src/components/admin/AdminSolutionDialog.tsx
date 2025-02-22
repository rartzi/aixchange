'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Solution {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  category: string;
  provider: string;
  launchUrl: string;
  sourceCodeUrl?: string;
  tokenCost: number;
  rating: number;
  tags: string[];
  imageUrl?: string;
  author: {
    name: string;
    email: string;
  };
}

interface AdminSolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solution?: Solution | null;
  onSave: (solution: Partial<Solution>) => Promise<void>;
}

export function AdminSolutionDialog({ open, onOpenChange, solution, onSave }: AdminSolutionDialogProps) {
  const [formData, setFormData] = useState<Partial<Solution>>({
    title: '',
    description: '',
    status: 'PENDING',
    category: '',
    provider: '',
    launchUrl: '',
    sourceCodeUrl: '',
    tokenCost: 0,
    rating: 0,
    tags: [],
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (solution) {
      // Only include fields we want to update
      const {
        title,
        description,
        status,
        category,
        provider,
        launchUrl,
        sourceCodeUrl,
        tokenCost,
        rating,
        tags,
        imageUrl,
      } = solution;
      
      setFormData({
        title,
        description,
        status,
        category,
        provider,
        launchUrl,
        sourceCodeUrl,
        tokenCost,
        rating,
        tags,
        imageUrl,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'PENDING',
        category: '',
        provider: '',
        launchUrl: '',
        sourceCodeUrl: '',
        tokenCost: 0,
        rating: 0,
        tags: [],
        imageUrl: '',
      });
    }
  }, [solution]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // If editing, include the ID
      const dataToSave = solution?.id ? { ...formData, id: solution.id } : formData;
      console.log('Saving solution data:', dataToSave); // Log the data being saved
      await onSave(dataToSave);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving solution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{solution ? 'Edit Solution' : 'Add Solution'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: "ACTIVE" | "PENDING" | "INACTIVE") => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Input
                value={formData.provider}
                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Launch URL</label>
              <Input
                type="url"
                value={formData.launchUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, launchUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Source Code URL</label>
              <Input
                type="url"
                value={formData.sourceCodeUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceCodeUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="/api/external-images/solutions/example.png"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Token Cost</label>
              <Input
                type="number"
                value={formData.tokenCost}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenCost: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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