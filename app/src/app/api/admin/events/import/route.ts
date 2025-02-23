import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eventImportSchema } from "@/lib/schemas/eventImport";
import { generateEventImage } from "@/lib/services/imageService";

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
    const validatedData = eventImportSchema.parse(json);

    const failures: { title: string; error: string }[] = [];
    let successCount = 0;

    for (const eventData of validatedData.events) {
      try {
        // Generate image if not provided
        if (!eventData.imageUrl) {
          const generatedImageUrl = await generateEventImage(
            eventData.title,
            eventData.description
          );
          if (generatedImageUrl) {
            eventData.imageUrl = generatedImageUrl;
          }
        }

        await prisma.event.create({
          data: {
            ...eventData,
            createdById: session.user.id,
          },
        });

        successCount++;
      } catch (error) {
        failures.push({
          title: eventData.title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "IMPORT_EVENTS",
        entityType: "EVENT",
        entityId: "BULK_IMPORT",
        userId: session.user.id,
        metadata: {
          totalCount: validatedData.events.length,
          successCount,
          failureCount: failures.length,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully imported ${successCount} events${
        failures.length > 0 ? `, ${failures.length} failed` : ""
      }`,
      successCount,
      failureCount: failures.length,
      failures,
    });
  } catch (error) {
    console.error("Error importing events:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}