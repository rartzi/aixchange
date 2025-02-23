import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required").max(200, "Short description must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  rules: z.string().min(1, "Rules are required"),
  type: z.enum(["HACKATHON", "CHALLENGE", "COMPETITION", "WORKSHOP"]),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  maxParticipants: z.number().int().min(1).optional(),
  imageUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  prizes: z.record(z.string()).optional(),
}).refine(
  (data) => {
    return data.endDate > data.startDate
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
)

export type EventFormValues = z.infer<typeof eventSchema>