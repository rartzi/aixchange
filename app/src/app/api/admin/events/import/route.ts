import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eventImportSchema } from "@/lib/schemas/eventImport";
import { generateEventImage } from "@/lib/services/imageService";

function transformImageUrl(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined;

  // If it's already an absolute URL, return it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative path in deploy/external-images/event/, transform it
  if (imageUrl.includes('deploy/external-images/event/')) {
    const filename = imageUrl.split('/').pop();
    return `/api/external-images/event/${filename}`;
  }

  // If it's just a filename, assume it's in the event directory
  if (!imageUrl.includes('/')) {
    return `/api/external-images/event/${imageUrl}`;
  }

  return imageUrl;
}

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

    // Process each event
    for (const eventData of validatedData.events) {
      try {
        // Transform or generate image URL
        let imageUrl = transformImageUrl(eventData.imageUrl);
        
        // Generate image if not provided
        if (!imageUrl) {
          const imagePrompt = `${eventData.title} - ${eventData.shortDescription}`;
          imageUrl = await generateEventImage(imagePrompt);
        }

        // Create event with transformed image URL
        await prisma.event.create({
          data: {
            ...eventData,
            imageUrl,
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
      }
    }

    // Update success status if there were any errors
    if (results.errors.length > 0) {
      results.success = false;
    }

    // Log the import action
    await prisma.auditLog.create({
      data: {
        action: "IMPORT_EVENTS",
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
    console.error("Error in bulk import:", error);
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