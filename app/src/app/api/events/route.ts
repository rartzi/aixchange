import { prisma } from "@/lib/db/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "ALL"
  const type = searchParams.get("type") || "ALL"

  const whereClause = {
    isPublic: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(status !== "ALL" && { status }),
    ...(type !== "ALL" && { type }),
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    orderBy: [
      { isPromoted: "desc" },
      { startDate: "asc" },
    ],
    include: {
      _count: {
        select: {
          participants: true,
          solutions: true,
        },
      },
    },
  })

  return NextResponse.json(events)
}