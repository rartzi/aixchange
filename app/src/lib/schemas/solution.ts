import { z } from 'zod';

// Predefined categories that users can select from
export const predefinedCategories = [
  'Natural Language Processing',
  'Computer Vision',
  'Speech Recognition',
  'Generative AI',
  'Machine Learning',
  'Deep Learning',
  'Reinforcement Learning',
  'Other',
] as const;

// Solution status options
export const statusOptions = ['Active', 'Pending', 'Inactive'] as const;

// Metadata schema for additional flexible fields
export const metadataSchema = z.object({
  resourceConfig: z.object({
    cpu: z.string().optional(),
    memory: z.string().optional(),
    gpu: z.string().optional(),
    storage: z.string().optional(),
  }).optional(),
  apiEndpoints: z.array(z.object({
    path: z.string(),
    method: z.string(),
    description: z.string().optional(),
  })).optional(),
  documentation: z.object({
    format: z.string().optional(),
    url: z.string().url().optional(),
  }).optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
}).strict();

// Main solution schema
export const solutionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(predefinedCategories),
  provider: z.string()
    .min(2, 'Provider name is required')
    .max(100, 'Provider name must be less than 100 characters'),
  launchUrl: z.string()
    .url('Please enter a valid URL')
    .min(1, 'Launch URL is required'),
  sourceCodeUrl: z.union([
    z.string().url('Please enter a valid GitHub URL'),
    z.string().max(0)
  ]).optional(),
  tokenCost: z.number()
    .min(0, 'Token cost must be 0 or greater')
    .default(0),
  rating: z.number()
    .min(0, 'Rating must be 0 or greater')
    .max(5, 'Rating must be 5 or less')
    .default(0),
  status: z.enum(statusOptions)
    .default('Pending'),
  tags: z.array(z.string())
    .min(1, 'Add at least one tag')
    .max(5, 'Maximum 5 tags allowed'),
  imageUrl: z.string().optional(),
  metadata: metadataSchema.optional(),
});

export type SolutionMetadata = z.infer<typeof metadataSchema>;
export type SolutionFormData = z.infer<typeof solutionSchema>;