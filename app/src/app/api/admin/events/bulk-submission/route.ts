import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eventImportSchema } from "@/lib/schemas/eventImport";
import { generateEventImage } from "@/lib/services/imageService";

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
    const validatedData = eventImportSchema.parse(json);

    const results = {
      success: true,
      importedCount: 0,
      errors: [] as Array<{ title: string; error: string }>,
    };

    // Process each event independently
    for (const eventData of validatedData.events) {
      try {
        // Generate image if not provided
        if (!eventData.imageUrl) {
          const imagePrompt = `${eventData.title} - ${eventData.shortDescription}`;
          const imageUrl = await generateEventImage(imagePrompt);
          if (imageUrl) {
            eventData.imageUrl = imageUrl;
          }
        }

        // Create event
        await prisma.event.create({
          data: {
            ...eventData,
            createdById: validatedData.defaultAuthorId || session.user.id,
          },
        });

        results.importedCount++;
      } catch (error) {
        console.error(`Error importing event ${eventData.title}:`, error);
        results.errors.push({
          title: eventData.title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        // Continue with next event even if this one failed
      }
    }

    // Log the bulk submission action
    await prisma.auditLog.create({
      data: {
        action: "BULK_SUBMIT_EVENTS",
        entityType: "EVENT",
        entityId: "BULK",
        userId: session.user.id,
        metadata: {
          totalEvents: validatedData.events.length,
          importedCount: results.importedCount,
          errorCount: results.errors.length,
        },
      },
    });

    return NextResponse.json({
      ...results,
      message: `Successfully imported ${results.importedCount} events${
        results.errors.length > 0
          ? ` with ${results.errors.length} errors`
          : ""
      }`,
    });
  } catch (error) {
    console.error("Error in bulk submission:", error);
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