import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const bulkDeleteSchema = z.object({
  eventIds: z.array(z.string()),
});

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
    const { eventIds } = bulkDeleteSchema.parse(json);

    // Delete event participants first
    await prisma.eventParticipant.deleteMany({
      where: {
        eventId: {
          in: eventIds,
        },
      },
    });

    // Then delete the events
    const deleteResult = await prisma.event.deleteMany({
      where: {
        id: {
          in: eventIds,
        },
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "BULK_DELETE_EVENTS",
        entityType: "EVENT",
        entityId: eventIds.join(","),
        userId: session.user.id,
        metadata: {
          count: deleteResult.count,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} events`,
      count: deleteResult.count,
    });
  } catch (error) {
    console.error("Error deleting events:", error);
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