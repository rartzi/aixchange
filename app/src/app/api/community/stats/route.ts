import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    // Get all metrics in parallel
    const [totalUsers, totalSolutions] = await Promise.all([
      // Count active users
      prisma.user.count({
        where: { isActive: true }
      }),
      
      // Count all active solutions
      prisma.solution.count({
        where: { status: "ACTIVE" }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalEvents: 0, // We'll implement events later
      totalSolutions
    });
  } catch (error) {
    console.error("Error fetching community stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}