'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { solutionSchema, predefinedCategories, type SolutionFormData } from '@/lib/schemas/solution';
import Image from 'next/image';
import { ZodError } from 'zod';

export function CreateSolutionForm() {
  const [formData, setFormData] = useState<Partial<SolutionFormData>>({
    title: '',
    description: '',
    category: '',
    provider: '',
    launchUrl: '',
    sourceCodeUrl: '',
    tokenCost: 0,
    rating: 0,
    status: 'Pending',
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    try {
      solutionSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, JSON.stringify(value));
        }
      });

      const response = await fetch('/api/solutions', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create solution');
      }

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        category: '',
        provider: '',
        launchUrl: '',
        tokenCost: 0,
        rating: 0,
        status: 'Pending',
        resourceConfig: initialResourceConfig,
        tags: [],
      });
      setCustomCategory('');
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating solution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto bg-card">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Add Solution</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-card-foreground">
            Name
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full p-2 border rounded-md bg-background text-foreground ${errors.title ? 'border-red-500' : 'border-border'}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
            className={`w-full p-2 border rounded-md min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Classification
          </label>
          <div className="flex gap-2">
            <select
              value={formData.category}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'custom') {
                  setFormData(prev => ({ ...prev, category: '' }));
                } else {
                  setFormData(prev => ({ ...prev, category: value }));
                  setCustomCategory('');
                }
              }}
              className={`flex-1 p-2 border rounded-md ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {predefinedCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="custom">Add Custom Category</option>
            </select>
          </div>
          {formData.category === '' && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setFormData(prev => ({ ...prev, category: e.target.value }));
              }}
              placeholder="Enter custom category"
              className="mt-2 w-full p-2 border rounded-md"
            />
          )}
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
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
            className={`w-full p-2 border rounded-md ${errors.provider ? 'border-red-500' : ''}`}
          />
          {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider}</p>}
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
            className={`w-full p-2 border rounded-md ${errors.launchUrl ? 'border-red-500' : ''}`}
            placeholder="https://"
          />
          {errors.launchUrl && <p className="text-red-500 text-sm mt-1">{errors.launchUrl}</p>}
        </div>

        {/* Token Cost */}
        <div>
          <label htmlFor="tokenCost" className="block text-sm font-medium mb-1">
            Token Cost
          </label>
          <input
            id="tokenCost"
            type="number"
            min="0"
            value={formData.tokenCost}
            onChange={(e) => setFormData(prev => ({ ...prev, tokenCost: Number(e.target.value) }))}
            className={`w-full p-2 border rounded-md ${errors.tokenCost ? 'border-red-500' : ''}`}
          />
          {errors.tokenCost && <p className="text-red-500 text-sm mt-1">{errors.tokenCost}</p>}
        </div>

        {/* Source Code URL */}
        <div>
          <label htmlFor="sourceCodeUrl" className="block text-sm font-medium mb-1">
            GitHub Repository URL (optional)
          </label>
          <input
            id="sourceCodeUrl"
            type="url"
            value={formData.sourceCodeUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, sourceCodeUrl: e.target.value }))}
            className="w-full p-2 border rounded-md bg-background text-foreground"
            placeholder="https://github.com/username/repo"
          />
          {errors.sourceCodeUrl && <p className="text-red-500 text-sm mt-1">{errors.sourceCodeUrl}</p>}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tags"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Add a tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Solution Image
          </label>
          <input
            id="image"
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div className="mt-2 flex items-center gap-4">
            {previewImage ? (
              <div className="relative w-32 h-32">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData(prev => ({ ...prev, image: undefined }));
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Upload Image
              </Button>
            )}
          </div>
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Card'}
        </Button>
      </form>
    </Card>
  );
}