import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { eventSolutionSchema } from "@/lib/schemas/eventSolution"
import { z } from "zod"
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

    // Check if event exists and is accepting solutions
    const event = await prisma.$queryRaw<Array<{ id: string; title: string; status: string }>>`
      SELECT id, title, status
      FROM "Event"
      WHERE id = ${eventId}
    `

    if (!event[0]) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    if (event[0].status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Event is not accepting solutions" },
        { status: 400 }
      )
    }

    const json = await request.json()
    const data = eventSolutionSchema.parse(json)

    // Create solution using raw SQL
    const [solution] = await prisma.$queryRaw<Array<any>>`
      WITH new_solution AS (
        INSERT INTO "Solution" (
          id,
          title,
          description,
          category,
          provider,
          "launchUrl",
          "sourceCodeUrl",
          "tokenCost",
          rating,
          status,
          tags,
          "imageUrl",
          metadata,
          "authorId",
          "isPublished",
          "eventId",
          "createdAt",
          "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          ${data.title},
          ${data.description},
          ${data.category},
          ${data.provider},
          ${data.launchUrl},
          ${data.sourceCodeUrl || null},
          ${data.tokenCost},
          ${data.rating},
          'PENDING',
          ${data.tags}::text[],
          ${data.imageUrl || null},
          ${data.metadata ? JSON.stringify(data.metadata) : null}::jsonb,
          ${session.user.id},
          true,
          ${eventId},
          NOW(),
          NOW()
        )
        RETURNING *
      )
      SELECT 
        s.*,
        json_build_object(
          'name', u.name,
          'image', u.image
        ) as author
      FROM new_solution s
      LEFT JOIN "User" u ON s."authorId" = u.id
    `

    // Update event submission count
    await prisma.$executeRaw`
      UPDATE "Event"
      SET "submissionCount" = "submissionCount" + 1
      WHERE id = ${eventId}
    `

    await prisma.auditLog.create({
      data: {
        action: "SUBMIT_SOLUTION",
        entityType: "Solution",
        entityId: solution.id,
        userId: session.user.id,
        metadata: {
          eventId,
          eventTitle: event[0].title,
          solutionTitle: solution.title,
        } as Prisma.JsonObject,
      },
    })

    return NextResponse.json({ data: solution }, { status: 201 })
  } catch (error) {
    console.error("Error submitting solution:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to submit solution" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "recent"

    const orderByClause = {
      recent: `"createdAt" DESC`,
      rating: `rating DESC`,
      "most-voted": `"totalVotes" DESC`,
      "most-upvoted": `upvotes DESC`,
    }[sort] || `"createdAt" DESC`

    const solutions = await prisma.$queryRaw<Array<any>>`
      SELECT 
        s.*,
        json_build_object(
          'name', u.name,
          'image', u.image
        ) as author,
        json_build_object(
          'reviews', (SELECT COUNT(*) FROM "Review" WHERE "solutionId" = s.id)
        ) as "_count"
      FROM "Solution" s
      LEFT JOIN "User" u ON s."authorId" = u.id
      WHERE s."eventId" = ${eventId}
      AND s."isPublished" = true
      ORDER BY s.${Prisma.raw(orderByClause)}
    `

    return NextResponse.json({ data: solutions })
  } catch (error) {
    console.error("Error fetching solutions:", error)
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    )
  }
}