import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { solutionImportSchema } from '@/lib/schemas/solutionImport';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

// TODO: Implement proper role-based access control
// Currently disabled for testing purposes
async function isAdmin(): Promise<boolean> {
  return true; // Temporarily allow all users
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
      const errors: Array<{ title: string; error: string }> = [];

      // Process each solution
      for (const solution of validatedData.solutions) {
        try {
          // Prepare metadata
          const metadata: Prisma.JsonObject = {
            category: solution.category,
            provider: solution.provider,
            launchUrl: solution.launchUrl,
            tokenCost: solution.tokenCost,
            resourceConfig: solution.resourceConfig,
            imageUrl: solution.imageUrl,
            ...(solution.metadata || {}), // Include any additional metadata
          };

          // Create the solution
          const createdSolution = await prisma.solution.create({
            data: {
              title: solution.title,
              description: solution.description,
              version: solution.version,
              isPublished: solution.isPublished,
              tags: solution.tags,
              authorId: validatedData.defaultAuthorId,
              metadata,
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
                solutionTitle: solution.title,
                category: solution.category,
                provider: solution.provider,
              } as Prisma.JsonObject
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

  } catch (error) {
    console.error('Solution import error:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid import format', 
          details: error.format()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}