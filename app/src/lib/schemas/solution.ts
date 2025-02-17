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

// Resource configuration schema
export const resourceConfigSchema = z.object({
  cpu: z.string().min(1, 'CPU configuration is required'),
  memory: z.string().min(1, 'Memory configuration is required'),
  gpu: z.string().optional(),
  storage: z.string().min(1, 'Storage configuration is required'),
});

// Solution status options
export const statusOptions = ['Active', 'Pending', 'Inactive'] as const;

// Main solution schema
export const solutionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters'),
  provider: z.string()
    .min(2, 'Provider name is required')
    .max(100, 'Provider name must be less than 100 characters'),
  launchUrl: z.string()
    .url('Please enter a valid URL')
    .min(1, 'Launch URL is required'),
  tokenCost: z.number()
    .min(0, 'Token cost must be 0 or greater')
    .default(0),
  rating: z.number()
    .min(0, 'Rating must be 0 or greater')
    .max(5, 'Rating must be 5 or less')
    .default(0),
  status: z.enum(statusOptions)
    .default('Pending'),
  resourceConfig: resourceConfigSchema,
  tags: z.array(z.string())
    .min(1, 'Add at least one tag')
    .max(5, 'Maximum 5 tags allowed'),
  image: z.instanceof(File, { message: 'Please upload an image' })
    .optional(),
});

export type SolutionFormData = z.infer<typeof solutionSchema>;