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

    const data = await request.json();
    const { solutions, defaultAuthorId } = data;

    if (!Array.isArray(solutions)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected array of solutions." },
        { status: 400 }
      );
    }

    const errors: Array<{ title: string; error: string }> = [];
    let imported = 0;

    // Transaction to ensure all-or-nothing import
    await prisma.$transaction(async (tx) => {
      for (const solution of solutions) {
        try {
          await tx.solution.create({
            data: {
              ...solution,
              authorId: solution.authorId || defaultAuthorId,
              status: "PENDING",
            },
          });
          imported++;
        } catch (error) {
          errors.push({
            title: solution.title || "Unknown solution",
            error: error instanceof Error ? error.message : "Unknown error",
          });
          // If any solution fails to import, roll back the entire transaction
          throw error;
        }
      }
    });

    return NextResponse.json({
      success: true,
      imported,
      message: `Successfully imported ${imported} solutions`,
    });
  } catch (error) {
    console.error("Error in import:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to import solutions",
        message: "Import failed. No solutions were imported.",
      },
      { status: 500 }
    );
  }
}