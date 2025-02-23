import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const bulkUpdateSchema = z.object({
  eventIds: z.array(z.string()),
  status: z.enum(["DRAFT", "UPCOMING", "ACTIVE", "VOTING", "COMPLETED", "ARCHIVED"]),
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
    const { eventIds, status } = bulkUpdateSchema.parse(json);

    const updateResult = await prisma.event.updateMany({
      where: {
        id: {
          in: eventIds,
        },
      },
      data: {
        status,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "BULK_UPDATE_EVENTS",
        entityType: "EVENT",
        entityId: eventIds.join(","),
        userId: session.user.id,
        metadata: {
          status,
          count: updateResult.count,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully updated ${updateResult.count} events`,
      count: updateResult.count,
    });
  } catch (error) {
    console.error("Error updating events:", error);
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