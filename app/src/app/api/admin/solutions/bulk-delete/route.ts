import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const bulkDeleteSchema = z.object({
  solutionIds: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = bulkDeleteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { solutionIds } = validationResult.data;

    // Use a transaction to ensure both deletion and audit logging succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Delete the solutions
      await tx.solution.deleteMany({
        where: {
          id: {
            in: solutionIds,
          },
        },
      });

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          action: "BULK_DELETE",
          entityType: "SOLUTION",
          entityId: "BULK",
          userId: session.user.id,
          metadata: {
            deletedCount: solutionIds.length,
            solutionIds,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${solutionIds.length} solutions`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    
    let errorMessage = "Failed to delete solutions";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003':
          errorMessage = "Cannot delete solutions with dependencies";
          break;
        default:
          errorMessage = "Database error occurred during deletion";
      }
    }

    return NextResponse.json({
      success: false,
      error: "Deletion failed",
      message: errorMessage
    }, { status: 500 });
  }
}