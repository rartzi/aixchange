import { prisma } from "@/lib/db/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Prisma, EventStatus, EventType } from "@prisma/client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "ALL"
  const type = searchParams.get("type") || "ALL"

  const whereClause: Prisma.EventWhereInput = {
    isPublic: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
        { shortDescription: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
      ],
    }),
    ...(status !== "ALL" && { status: status as EventStatus }),
    ...(type !== "ALL" && { type: type as EventType }),
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Create event with the current user as creator
    const event = await prisma.event.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: session.user.id
          }
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}