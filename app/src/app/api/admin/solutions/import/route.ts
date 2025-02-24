import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { solutionImportSchema } from "@/lib/schemas/solutionImport";
import { Prisma, SolutionStatus } from "@prisma/client";

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

    // Process each solution independently
    for (const solution of solutions) {
      try {
        // Create solution
        await prisma.solution.create({
          data: {
            ...solution,
            authorId: session.user.id,
            status: SolutionStatus.ACTIVE,
            metadata: solution.metadata ? JSON.parse(JSON.stringify(solution.metadata)) : {}
          }
        });

        imported++;
      } catch (error) {
        console.error("Import error details:", error);
        
        let errorMessage = "Failed to import solution";
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
        // Continue with next solution
        continue;
      }
    }

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        action: "BULK_IMPORT",
        entityType: "SOLUTION",
        entityId: "BULK",
        userId: session.user.id,
        metadata: {
          importedCount: imported,
          totalCount: solutions.length,
          errorCount: errors.length
        },
      },
    });

    // Return success even if some solutions failed
    return NextResponse.json({
      success: true,
      imported,
      errors,
      message: errors.length > 0
        ? `Imported ${imported} solutions with ${errors.length} errors`
        : `Successfully imported ${imported} solutions`,
    });
  } catch (error) {
    console.error("Error in import:", error);
    
    let errorMessage = "Failed to import solutions";
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
        error: "Import failed",
        message: "No solutions were imported due to errors",
        errors: [{ title: "Import Error", error: errorMessage }],
      },
      { status: 500 }
    );
  }
}