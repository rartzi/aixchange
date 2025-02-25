import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { eventIds } = await request.json();

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Invalid event IDs' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete all events in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.event.deleteMany({
        where: {
          id: {
            in: eventIds
          }
        }
      });
    });

    return new NextResponse(JSON.stringify({
      success: true,
      message: `Successfully deleted ${eventIds.length} events`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bulk delete events:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}