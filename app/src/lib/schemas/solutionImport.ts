import { z } from 'zod';

// Schema for a single resource in the import
const resourceSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  url: z.string().url(),
});

// Schema for a single solution in the import
const solutionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  version: z.string().default("1.0.0"),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()),
  resources: z.array(resourceSchema).optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for the entire import payload
export const solutionImportSchema = z.object({
  solutions: z.array(solutionSchema).min(1),
  defaultAuthorId: z.string(), // The admin user who is importing
});

export type SolutionImport = z.infer<typeof solutionImportSchema>;