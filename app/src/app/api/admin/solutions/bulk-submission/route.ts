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

    for (const solution of solutions) {
      try {
        await prisma.solution.create({
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
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${imported} solutions${
        errors.length > 0 ? ` with ${errors.length} errors` : ""
      }`,
    });
  } catch (error) {
    console.error("Error in bulk submission:", error);
    return NextResponse.json(
      { error: "Failed to process bulk submission" },
      { status: 500 }
    );
  }
}