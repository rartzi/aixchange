'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { solutionSchema, predefinedCategories, type SolutionFormData } from '@/lib/schemas/solution';
import Image from 'next/image';
import { ZodError } from 'zod';

type ResourceConfig = {
  cpu: string;
  memory: string;
  storage: string;
  gpu: string;
};

const initialResourceConfig: ResourceConfig = {
  cpu: '',
  memory: '',
  storage: '',
  gpu: '',
};

export function CreateSolutionForm() {
  const [formData, setFormData] = useState<Partial<Omit<SolutionFormData, 'resourceConfig'>> & { resourceConfig: ResourceConfig }>({
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

  const updateResourceConfig = (field: keyof ResourceConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      resourceConfig: {
        ...prev.resourceConfig,
        [field]: value,
      },
    }));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Solution</h2>
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
            className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : ''}`}
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

        {/* Resource Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cpu" className="block text-sm font-medium mb-1">
              CPU Requirements
            </label>
            <input
              id="cpu"
              type="text"
              value={formData.resourceConfig.cpu}
              onChange={(e) => updateResourceConfig('cpu', e.target.value)}
              className={`w-full p-2 border rounded-md ${errors['resourceConfig.cpu'] ? 'border-red-500' : ''}`}
              placeholder="e.g., 2 cores"
            />
            {errors['resourceConfig.cpu'] && (
              <p className="text-red-500 text-sm mt-1">{errors['resourceConfig.cpu']}</p>
            )}
          </div>

          <div>
            <label htmlFor="memory" className="block text-sm font-medium mb-1">
              Memory Requirements
            </label>
            <input
              id="memory"
              type="text"
              value={formData.resourceConfig.memory}
              onChange={(e) => updateResourceConfig('memory', e.target.value)}
              className={`w-full p-2 border rounded-md ${errors['resourceConfig.memory'] ? 'border-red-500' : ''}`}
              placeholder="e.g., 8GB"
            />
            {errors['resourceConfig.memory'] && (
              <p className="text-red-500 text-sm mt-1">{errors['resourceConfig.memory']}</p>
            )}
          </div>

          <div>
            <label htmlFor="gpu" className="block text-sm font-medium mb-1">
              GPU Requirements (optional)
            </label>
            <input
              id="gpu"
              type="text"
              value={formData.resourceConfig.gpu}
              onChange={(e) => updateResourceConfig('gpu', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., NVIDIA T4"
            />
          </div>

          <div>
            <label htmlFor="storage" className="block text-sm font-medium mb-1">
              Storage Requirements
            </label>
            <input
              id="storage"
              type="text"
              value={formData.resourceConfig.storage}
              onChange={(e) => updateResourceConfig('storage', e.target.value)}
              className={`w-full p-2 border rounded-md ${errors['resourceConfig.storage'] ? 'border-red-500' : ''}`}
              placeholder="e.g., 50GB"
            />
            {errors['resourceConfig.storage'] && (
              <p className="text-red-500 text-sm mt-1">{errors['resourceConfig.storage']}</p>
            )}
          </div>
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