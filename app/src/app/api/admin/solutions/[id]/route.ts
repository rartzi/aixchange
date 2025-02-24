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
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const formData = await request.formData();
    const data: Record<string, any> = {};
    
    // First get the imageUrl separately
    const imageUrl = formData.get('imageUrl')?.toString();
    
    // Then process other fields
    for (const [key, value] of formData.entries()) {
      if (key === 'imageUrl') {
        continue; // Skip, we already got it
      }
      try {
        data[key] = JSON.parse(value as string);
      } catch {
        data[key] = value;
      }
    }

    // Add imageUrl back if we have one
    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    const validatedData = solutionSchema.parse(data);

    const solution = await prisma.solution.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        provider: validatedData.provider,
        launchUrl: validatedData.launchUrl,
        sourceCodeUrl: validatedData.sourceCodeUrl,
        tokenCost: validatedData.tokenCost,
        rating: validatedData.rating,
        status: validatedData.status === 'Active' ? SolutionStatus.ACTIVE 
               : validatedData.status === 'Pending' ? SolutionStatus.PENDING 
               : SolutionStatus.INACTIVE,
        tags: validatedData.tags,
        imageUrl: validatedData.imageUrl,
        metadata: validatedData.metadata as any,
        isPublished: data.isPublished
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
        },
      },
    });

    return NextResponse.json(solution);
  } catch (error) {
    console.error("Error updating solution:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

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