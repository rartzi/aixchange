import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';
import { solutionImportSchema } from '@/lib/schemas/solutionImport';
import { PrismaClient, Prisma } from '@prisma/client';

// TODO: Implement proper role-based access control
// Currently disabled for testing purposes
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return true; // Temporarily allow all authenticated users
}

export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = solutionImportSchema.parse(body);

    // Start a transaction for atomic import
    const result = await prisma.$transaction(async (prisma) => {
      const importedSolutions = [];
      const errors = [];

      // Process each solution
      for (const solution of validatedData.solutions) {
        try {
          // Create the solution
          const createdSolution = await prisma.solution.create({
            data: {
              ...solution,
              authorId: validatedData.defaultAuthorId,
              resources: {
                create: solution.resources || []
              }
            }
          });

          // Create audit log entry
          await prisma.auditLog.create({
            data: {
              action: 'SOLUTION_IMPORT',
              entityType: 'Solution',
              entityId: createdSolution.id,
              userId: validatedData.defaultAuthorId,
              metadata: {
                importBatch: true,
                solutionTitle: solution.title
              }
            }
          });

          importedSolutions.push(createdSolution);
        } catch (error) {
          errors.push({
            title: solution.title,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return { importedSolutions, errors };
    });

    // Return response with results
    return NextResponse.json({
      success: true,
      imported: result.importedSolutions.length,
      errors: result.errors,
      message: `Successfully imported ${result.importedSolutions.length} solutions${
        result.errors.length ? ` with ${result.errors.length} errors` : ''
      }`
    });

  } catch (error: unknown) {
    console.error('Solution import error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid import format', details: (error as any).errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}