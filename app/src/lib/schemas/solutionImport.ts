import { z } from 'zod';
import { solutionSchema } from './solution';

// Type for the import data
export type SolutionImport = {
  solutions: Array<z.infer<typeof solutionSchema>>;
  defaultAuthorId?: string;
};

// Schema for bulk import
export const solutionImportSchema = z.object({
  solutions: z.array(solutionSchema)
    .min(1, "At least one solution is required")
    .max(100, "Maximum 100 solutions allowed per import"),
  defaultAuthorId: z.string().optional(),
});