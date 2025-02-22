import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { solutionIds, status } = await request.json();

    if (!Array.isArray(solutionIds) || !solutionIds.length) {
      return NextResponse.json(
        { error: "No solutions selected" },
        { status: 400 }
      );
    }

    if (!["ACTIVE", "PENDING", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update all selected solutions
    await prisma.solution.updateMany({
      where: {
        id: {
          in: solutionIds
        }
      },
      data: {
        status
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${solutionIds.length} solutions`
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    return NextResponse.json(
      { error: "Failed to update solutions" },
      { status: 500 }
    );
  }
}