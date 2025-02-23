import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Prisma } from "@prisma/client"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const eventId = params.id
    const userId = session.user.id

    // Check if event exists and is active
    const [event] = await prisma.$queryRaw<Array<{ id: string; title: string; status: string; maxParticipants: number | null; participantCount: number }>>`
      SELECT id, title, status, "maxParticipants", "participantCount"
      FROM "Event"
      WHERE id = ${eventId}
    `

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    if (event.status !== "ACTIVE" && event.status !== "UPCOMING") {
      return NextResponse.json(
        { error: "Event is not accepting participants" },
        { status: 400 }
      )
    }

    if (event.maxParticipants && event.participantCount >= event.maxParticipants) {
      return NextResponse.json(
        { error: "Event has reached maximum participants" },
        { status: 400 }
      )
    }

    // Check if user is already participating
    const [existingParticipant] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "EventParticipant"
      WHERE "userId" = ${userId}
      AND "eventId" = ${eventId}
    `

    if (existingParticipant) {
      return NextResponse.json(
        { error: "Already participating in this event" },
        { status: 400 }
      )
    }

    // Create participant and update event count in a transaction
    const [participant] = await prisma.$transaction([
      prisma.$executeRaw`
        INSERT INTO "EventParticipant" ("id", "userId", "eventId", "role", "joinedAt")
        VALUES (${Prisma.sql`gen_random_uuid()`}, ${userId}, ${eventId}, 'PARTICIPANT', NOW())
        RETURNING *
      `,
      prisma.$executeRaw`
        UPDATE "Event"
        SET "participantCount" = "participantCount" + 1
        WHERE id = ${eventId}
      `,
    ])

    await prisma.$executeRaw`
      INSERT INTO "AuditLog" ("id", "action", "entityType", "entityId", "userId", "metadata", "createdAt")
      VALUES (
        ${Prisma.sql`gen_random_uuid()`},
        'JOIN_EVENT',
        'Event',
        ${eventId},
        ${userId},
        ${Prisma.sql`jsonb_build_object('eventTitle', ${event.title}, 'participantRole', 'PARTICIPANT')`},
        NOW()
      )
    `

    return NextResponse.json({
      message: "Successfully joined event",
      participant,
    })
  } catch (error) {
    console.error("Error joining event:", error)
    return NextResponse.json(
      { error: "Failed to join event" },
      { status: 500 }
    )
  }
}