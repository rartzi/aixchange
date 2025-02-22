import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { generateEventImage } from "@/lib/services/imageService";

// Validation schema for creating events
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  status: z.enum(["DRAFT", "UPCOMING", "ACTIVE", "VOTING", "COMPLETED", "ARCHIVED"]),
  type: z.enum(["HACKATHON", "CHALLENGE", "COMPETITION", "WORKSHOP"]),
  imageUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  prizes: z.any().optional(),
  rules: z.string().min(1, "Rules are required"),
  maxParticipants: z.number().optional().nullable(),
  isPublic: z.boolean().default(true),
  isPromoted: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            participants: true,
            solutions: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const validatedData = eventSchema.parse(json);

    // Generate image if not provided
    if (!validatedData.imageUrl) {
      const generatedImageUrl = await generateEventImage(
        validatedData.title,
        validatedData.description
      );
      if (generatedImageUrl) {
        validatedData.imageUrl = generatedImageUrl;
      }
    }

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
      },
      include: {
        _count: {
          select: {
            participants: true,
            solutions: true,
          },
        },
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "CREATE_EVENT",
        entityType: "EVENT",
        entityId: event.id,
        userId: session.user.id,
        metadata: {
          eventType: event.type,
          title: event.title,
          imageGenerated: !json.imageUrl && !!validatedData.imageUrl,
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}