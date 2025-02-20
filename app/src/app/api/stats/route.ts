import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [userCount, solutionCount] = await Promise.all([
      prisma.user.count(),
      prisma.solution.count({
        where: {
          isPublished: true
        }
      })
    ]);

    return NextResponse.json({
      userCount,
      solutionCount
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}