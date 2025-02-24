import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { solutionImportSchema } from "@/lib/schemas/solutionImport";
import { generateSolutionImage } from "@/lib/services/imageService";
import { SolutionStatus } from "@prisma/client";

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
    const validatedData = solutionImportSchema.parse(json);

    const results = {
      success: true,
      importedCount: 0,
      errors: [] as Array<{ title: string; error: string }>,
    };

    // Process each solution independently
    for (const solutionData of validatedData.solutions) {
      try {
        // Generate image if not provided
        if (!solutionData.imageUrl) {
          const imagePrompt = `${solutionData.title} - ${solutionData.description}`;
          const imageUrl = await generateSolutionImage(imagePrompt);
          if (!imageUrl) {
            throw new Error('Failed to generate image for solution');
          }
          solutionData.imageUrl = imageUrl;
        }

        // Map status to enum
        const status = solutionData.status === 'Active' ? SolutionStatus.ACTIVE 
                    : solutionData.status === 'Pending' ? SolutionStatus.PENDING 
                    : SolutionStatus.INACTIVE;

        // Create solution
        await prisma.solution.create({
          data: {
            title: solutionData.title,
            description: solutionData.description,
            category: solutionData.category,
            provider: solutionData.provider,
            launchUrl: solutionData.launchUrl,
            sourceCodeUrl: solutionData.sourceCodeUrl,
            tokenCost: solutionData.tokenCost,
            rating: solutionData.rating,
            status,
            tags: solutionData.tags,
            imageUrl: solutionData.imageUrl,
            authorId: validatedData.defaultAuthorId || session.user.id,
            metadata: solutionData.metadata as any,
            isPublished: true
          },
        });

        results.importedCount++;
      } catch (error) {
        console.error(`Error importing solution ${solutionData.title}:`, error);
        results.errors.push({
          title: solutionData.title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        // Continue with next solution even if this one failed
      }
    }

    // Log the bulk submission action
    await prisma.auditLog.create({
      data: {
        action: "BULK_SUBMIT_SOLUTIONS",
        entityType: "SOLUTION",
        entityId: "BULK",
        userId: session.user.id,
        metadata: {
          totalSolutions: validatedData.solutions.length,
          importedCount: results.importedCount,
          errorCount: results.errors.length,
        },
      },
    });

    return NextResponse.json({
      ...results,
      message: `Successfully imported ${results.importedCount} solutions${
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