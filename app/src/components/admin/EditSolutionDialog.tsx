'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from 'next/image';

interface EditSolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solution: any;
}

export function EditSolutionDialog({ open, onOpenChange, solution }: EditSolutionDialogProps) {
  const [formData, setFormData] = useState({
    title: solution?.title || '',
    description: solution?.description || '',
    category: solution?.category || 'Other',
    provider: solution?.provider || '',
    status: solution?.status === 'ACTIVE' ? 'Active' : solution?.status === 'PENDING' ? 'Pending' : 'Inactive',
    launchUrl: solution?.launchUrl || '',
    sourceCodeUrl: solution?.sourceCodeUrl || '',
    tokenCost: solution?.tokenCost || 0,
    rating: solution?.rating || 0,
    tags: solution?.tags || [],
    imageUrl: solution?.imageUrl,
    isPublished: solution?.isPublished ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/solutions/${solution.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: solution.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update solution');
      }

      // Force reload the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error('Error updating solution:', err);
      setError(err instanceof Error ? err.message : 'Failed to update solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle>Edit Solution</DialogTitle>
          <DialogDescription>
            Edit the details of your solution below.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 rounded-md bg-red-100 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-md min-h-[100px] bg-background text-foreground"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            />
          </div>

          {/* Provider */}
          <div>
            <label htmlFor="provider" className="block text-sm font-medium mb-1">
              Provider
            </label>
            <input
              id="provider"
              type="text"
              value={formData.provider}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            />
          </div>

          {/* Launch URL */}
          <div>
            <label htmlFor="launchUrl" className="block text-sm font-medium mb-1">
              Launch URL
            </label>
            <input
              id="launchUrl"
              type="url"
              value={formData.launchUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, launchUrl: e.target.value }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              placeholder="https://"
            />
          </div>

          {/* Source Code URL */}
          <div>
            <label htmlFor="sourceCodeUrl" className="block text-sm font-medium mb-1">
              Source Code URL (optional)
            </label>
            <input
              id="sourceCodeUrl"
              type="url"
              value={formData.sourceCodeUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceCodeUrl: e.target.value }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              placeholder="https://github.com/..."
            />
          </div>

          {/* Token Cost */}
          <div>
            <label htmlFor="tokenCost" className="block text-sm font-medium mb-1">
              Token Cost
            </label>
            <input
              id="tokenCost"
              type="number"
              value={formData.tokenCost}
              onChange={(e) => setFormData(prev => ({ ...prev, tokenCost: Number(e.target.value) }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 border rounded-md bg-background text-foreground"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Published Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isPublished" className="text-sm font-medium">
              Published
            </label>
          </div>

          {/* Preview Image */}
          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Image
              </label>
              <div className="relative w-32 h-32">
                <Image
                  src={formData.imageUrl}
                  alt={formData.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Solution'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}