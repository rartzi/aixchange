import { z } from "zod";

export const eventImportSchema = z.object({
  defaultAuthorId: z.string(),
  events: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      shortDescription: z.string().min(1, "Short description is required"),
      startDate: z.string().transform((str) => new Date(str)),
      endDate: z.string().transform((str) => new Date(str)),
      type: z.enum(["HACKATHON", "CHALLENGE", "COMPETITION", "WORKSHOP"]),
      imageUrl: z.string().optional(),
      bannerUrl: z.string().optional(),
      prizes: z.any().optional(),
      rules: z.string().min(1, "Rules are required"),
      maxParticipants: z.number().optional(),
      isPublic: z.boolean().default(true),
      isPromoted: z.boolean().default(false),
    })
  ),
});

export type EventImport = z.infer<typeof eventImportSchema>;