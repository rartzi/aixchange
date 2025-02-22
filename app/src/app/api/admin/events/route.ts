import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Validation schema for creating/updating events
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  type: z.enum(["HACKATHON", "CHALLENGE", "COMPETITION", "WORKSHOP"]),
  imageUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  prizes: z.any().optional(), // Will be validated as JSON
  rules: z.string().min(1, "Rules are required"),
  maxParticipants: z.number().optional(),
  isPublic: z.boolean().default(true),
  isPromoted: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const validatedData = eventSchema.parse(json);

    // Create event
    const event = await prisma.event.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build query filters
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    // Get events with pagination
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              participants: true,
              solutions: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}