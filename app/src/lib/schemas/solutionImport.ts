import { z } from 'zod';

// Schema for a single resource in the import
const resourceSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  url: z.string().url(),
});

// Resource configuration schema
const resourceConfigSchema = z.object({
  cpu: z.string().min(1, 'CPU configuration is required'),
  memory: z.string().min(1, 'Memory configuration is required'),
  gpu: z.string().optional(),
  storage: z.string().min(1, 'Storage configuration is required'),
});

// Schema for a single solution in the import
const solutionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  version: z.string().default("1.0.0"),
  isPublished: z.boolean().default(false),
  category: z.string().default("Other"),
  provider: z.string().default("Unknown"),
  launchUrl: z.string().url().default("https://example.com"),
  tokenCost: z.number().min(0).default(0),
  resourceConfig: resourceConfigSchema,
  tags: z.array(z.string()),
  resources: z.array(resourceSchema).optional(),
  imageUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for the entire import payload
export const solutionImportSchema = z.object({
  solutions: z.array(solutionSchema).min(1),
  defaultAuthorId: z.string(), // The admin user who is importing
});

export type SolutionImport = z.infer<typeof solutionImportSchema>;