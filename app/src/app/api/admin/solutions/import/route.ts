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

    // Transaction to ensure all-or-nothing import
    await prisma.$transaction(async (tx) => {
      for (const solution of solutions) {
        try {
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
          throw error;
        }
      }

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          action: "BULK_IMPORT",
          entityType: "SOLUTION",
          entityId: "BULK",
          userId: session.user.id,
          metadata: {
            importedCount: imported,
            totalCount: solutions.length,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      imported,
      message: `Successfully imported ${imported} solutions`,
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