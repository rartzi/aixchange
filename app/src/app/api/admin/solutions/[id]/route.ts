import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { solutionSchema } from "@/lib/schemas/solution";
import { ZodError } from "zod";
import { SolutionStatus } from "@prisma/client";

// PATCH /api/admin/solutions/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Log incoming data for debugging
    console.log('Incoming update data:', data);

    // Ensure required fields are present
    const updateData = {
      title: data.title,
      description: data.description,
      category: data.category,
      provider: data.provider,
      launchUrl: data.launchUrl,
      sourceCodeUrl: data.sourceCodeUrl || undefined,
      tokenCost: Number(data.tokenCost || 0),
      rating: Number(data.rating || 0),
      status: data.status,
      tags: Array.isArray(data.tags) ? data.tags : [],
      imageUrl: data.imageUrl,
      isPublished: data.isPublished ?? true,
    };

    // Validate the data against the schema
    try {
      solutionSchema.parse(updateData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation errors:', error.errors);
        return NextResponse.json(
          { error: "Validation error", details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Map status string to enum
    let dbStatus: SolutionStatus;
    switch (updateData.status) {
      case 'Active':
        dbStatus = SolutionStatus.ACTIVE;
        break;
      case 'Pending':
        dbStatus = SolutionStatus.PENDING;
        break;
      case 'Inactive':
        dbStatus = SolutionStatus.INACTIVE;
        break;
      default:
        dbStatus = SolutionStatus.PENDING;
    }

    // Update the solution
    const solution = await prisma.solution.update({
      where: { id },
      data: {
        title: updateData.title,
        description: updateData.description,
        category: updateData.category,
        provider: updateData.provider,
        launchUrl: updateData.launchUrl,
        sourceCodeUrl: updateData.sourceCodeUrl,
        tokenCost: updateData.tokenCost,
        rating: updateData.rating,
        status: dbStatus,
        tags: updateData.tags,
        imageUrl: updateData.imageUrl,
        isPublished: updateData.isPublished,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Solution',
        entityId: solution.id,
        userId: session.user.id,
        metadata: {
          title: solution.title,
          category: solution.category,
          provider: solution.provider,
          status: solution.status,
        },
      },
    });

    return NextResponse.json({
      success: true,
      solution,
      message: "Solution updated successfully"
    });
  } catch (error) {
    console.error("Error updating solution:", error);
    
    return NextResponse.json(
      { error: "Failed to update solution" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/solutions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // First delete all related records
    await prisma.$transaction([
      // Delete all reviews
      prisma.review.deleteMany({
        where: { solutionId: id },
      }),
      // Delete all resources
      prisma.resource.deleteMany({
        where: { solutionId: id },
      }),
      // Finally delete the solution
      prisma.solution.delete({
        where: { id },
      }),
    ]);

    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Solution',
        entityId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json(
      { error: "Failed to delete solution" },
      { status: 500 }
    );
  }
}