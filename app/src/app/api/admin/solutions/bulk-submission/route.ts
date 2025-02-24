import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { solutionSchema } from "@/lib/schemas/solution";
import { SolutionStatus, Prisma } from "@prisma/client";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const solutions = body.solutions || [];

    // Process solutions in transaction
    const results = await prisma.$transaction(async (tx) => {
      const processed = [];
      const errors = [];

      for (const solution of solutions) {
        try {
          // Validate solution data
          const validatedData = solutionSchema.parse({
            ...solution,
            // Ensure required fields have values
            isPublished: solution.isPublished ?? true,
            status: solution.status || 'Pending'
          });

          // Create solution using same logic as single solution endpoint
          const created = await tx.solution.create({
            data: {
              title: validatedData.title,
              description: validatedData.description,
              category: validatedData.category,
              provider: validatedData.provider,
              launchUrl: validatedData.launchUrl,
              sourceCodeUrl: validatedData.sourceCodeUrl,
              tokenCost: validatedData.tokenCost,
              status: validatedData.status === 'Active' ? SolutionStatus.ACTIVE
                     : validatedData.status === 'Pending' ? SolutionStatus.PENDING
                     : SolutionStatus.INACTIVE,
              imageUrl: validatedData.imageUrl,
              author: {
                connect: { id: session.user.id }
              },
              tags: validatedData.tags,
              isPublished: validatedData.isPublished,
              // Convert metadata to Prisma JSON object
              metadata: validatedData.metadata as Prisma.JsonObject || {}
            },
          });

          // Create audit log
          await tx.auditLog.create({
            data: {
              action: "CREATE",
              entityType: "SOLUTION",
              entityId: created.id,
              userId: session.user.id,
              metadata: {
                title: created.title,
                status: created.status,
                importType: "BULK"
              } as Prisma.JsonObject
            }
          });

          processed.push(created);
        } catch (error) {
          errors.push({
            solution: solution.title,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return { processed, errors };
    });

    return NextResponse.json({
      success: true,
      processed: results.processed.length,
      errors: results.errors,
      data: results.processed
    });

  } catch (error) {
    console.error('Bulk solution import error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to process solutions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}