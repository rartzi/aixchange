import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    // Get all metrics in parallel
    const [totalUsers, totalSolutions, totalEvents] = await Promise.all([
      // Count active users
      prisma.user.count({
        where: { isActive: true }
      }),
      
      // Count all active solutions
      prisma.solution.count({
        where: { status: "ACTIVE" }
      }),

      // Count all public events that are not archived
      prisma.event.count({
        where: {
          isPublic: true,
          status: {
            not: "ARCHIVED"
          }
        }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalEvents,
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