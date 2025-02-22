import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH /api/admin/solutions/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();
    console.log('Update data:', data); // Log the update data

    if (data.status && !["ACTIVE", "PENDING", "INACTIVE"].includes(data.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    try {
      const solution = await prisma.solution.update({
        where: { id },
        data,
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
      return NextResponse.json(solution);
    } catch (prismaError) {
      console.error('Prisma error:', prismaError); // Log Prisma error
      return NextResponse.json(
        { error: prismaError instanceof Error ? prismaError.message : "Failed to update solution" },
        { status: 400 }
      );
    }
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json(
      { error: "Failed to delete solution" },
      { status: 500 }
    );
  }
}