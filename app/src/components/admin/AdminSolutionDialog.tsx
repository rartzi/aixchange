'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  isPublished: boolean;
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
    isPublished: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (solution) {
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
        isPublished,
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
        isPublished,
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
      const dataToSave = solution?.id ? { ...formData, id: solution.id } : formData;
      console.log('Saving solution data:', dataToSave);
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
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100 text-sm">
            {solution ? 'Edit Solution' : 'Add Solution'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-900 dark:text-gray-100">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-900 dark:text-gray-100">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ACTIVE" | "PENDING" | "INACTIVE") =>
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="ACTIVE" className="text-sm">Active</SelectItem>
                    <SelectItem value="PENDING" className="text-sm">Pending</SelectItem>
                    <SelectItem value="INACTIVE" className="text-sm">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isPublished: checked as boolean }))
                  }
                />
                <label
                  htmlFor="isPublished"
                  className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100"
                >
                  Published
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Provider</label>
              <Input
                value={formData.provider}
                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Launch URL</label>
              <Input
                type="url"
                value={formData.launchUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, launchUrl: e.target.value }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Source Code URL</label>
              <Input
                type="url"
                value={formData.sourceCodeUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceCodeUrl: e.target.value }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Image URL</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="/api/external-images/solutions/example.png"
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Token Cost</label>
              <Input
                type="number"
                value={formData.tokenCost}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenCost: Number(e.target.value) }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Rating</label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
            <textarea
              className={cn(
                "w-full min-h-[200px] p-2 border rounded-md resize-y",
                "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                "border-gray-200 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              )}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter a detailed description of the solution..."
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