import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { solutionImportSchema } from "@/lib/schemas/solutionImport";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request data
    const data = await request.json();

    // Validate against schema
    const validationResult = solutionImportSchema.safeParse({
      ...data,
      defaultAuthorId: session.user.id
    });

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        errors: validationResult.error.errors.map(err => ({
          title: err.path.join('.'),
          error: err.message
        })),
        message: "Import validation failed"
      }, { status: 400 });
    }

    const { solutions } = validationResult.data;
    const errors: Array<{ title: string; error: string }> = [];
    let imported = 0;

    // Process each solution individually, allowing partial success
    for (const solution of solutions) {
      try {
        // Use a transaction for each solution to ensure resource creation is atomic
        await prisma.$transaction(async (tx) => {
          // Extract resources and prepare solution data
          const { resources, ...solutionData } = solution;

          // Create solution first
          const createdSolution = await tx.solution.create({
            data: {
              ...solutionData,
              authorId: session.user.id,
              status: "PENDING"
            }
          });

          // Create resources separately if they exist
          if (resources && resources.length > 0) {
            await tx.resource.createMany({
              data: resources.map(resource => ({
                ...resource,
                solutionId: createdSolution.id,
                createdAt: new Date(),
                updatedAt: new Date()
              }))
            });
          }
        });

        imported++;
      } catch (error) {
        console.error("Import error details:", error);
        
        let errorMessage = "Failed to import solution";
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Convert database errors to user-friendly messages
          switch (error.code) {
            case 'P2002':
              errorMessage = "A solution with this name already exists";
              break;
            case 'P2003':
              errorMessage = "Invalid reference in solution data";
              break;
            default:
              errorMessage = "Database error occurred while importing";
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        errors.push({
          title: solution.title || "Unknown solution",
          error: errorMessage
        });
      }
    }

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        action: "BULK_SUBMISSION",
        entityType: "SOLUTION",
        entityId: "BULK",
        userId: session.user.id,
        metadata: {
          importedCount: imported,
          totalCount: solutions.length,
          failedCount: solutions.length - imported,
        },
      },
    });

    // Return response based on import results
    if (imported === 0) {
      return NextResponse.json({
        success: false,
        imported: 0,
        errors,
        message: "Failed to import any solutions. Please check the errors and try again.",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length > 0 ? errors : undefined,
      message: errors.length > 0
        ? `Imported ${imported} out of ${solutions.length} solutions. Some solutions had errors.`
        : `Successfully imported all ${imported} solutions`,
    });
  } catch (error) {
    console.error("Error in bulk submission:", error);
    
    let errorMessage = "Failed to process submission";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          errorMessage = "Some solutions already exist in the system";
          break;
        case 'P2003':
          errorMessage = "Invalid reference in solution data";
          break;
        default:
          errorMessage = "Database error occurred";
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Submission failed",
        message: "Failed to process the bulk submission",
        errors: [{ title: "Submission Error", error: errorMessage }],
      },
      { status: 500 }
    );
  }
}