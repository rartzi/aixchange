import { z } from 'zod';

// Schema for a single resource in the submission
const resourceSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  url: z.string().url(),
});

// Schema for a single solution in the submission
const solutionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  version: z.string().default("1.0.0"),
  isPublished: z.boolean().default(false), // Default to false for review
  category: z.string().default("Other"),
  provider: z.string().default("Unknown"),
  launchUrl: z.string().url().default("https://example.com"),
  sourceCodeUrl: z.string().url().optional(),
  tokenCost: z.number().min(0).default(0),
  tags: z.array(z.string()),
  resources: z.array(resourceSchema).optional(),
  imageUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for the entire submission payload
export const bulkSolutionSubmissionSchema = z.object({
  solutions: z.array(solutionSchema).min(1),
  defaultAuthorId: z.string(), // The admin user submitting the solutions
});

export type BulkSolutionSubmission = z.infer<typeof bulkSolutionSubmissionSchema>;