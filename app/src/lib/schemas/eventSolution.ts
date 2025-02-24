import { solutionSchema } from "./solution"
import { z } from "zod"

// Extend the base solution schema for event-specific solutions
export const eventSolutionSchema = solutionSchema.extend({
  // No need to add eventId here since we'll get it from the URL params
  // and handle it in the API endpoint
})

export type EventSolutionFormData = z.infer<typeof eventSolutionSchema>