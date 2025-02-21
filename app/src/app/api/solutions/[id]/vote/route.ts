import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { vote } = await request.json();
    if (vote !== 'up' && vote !== 'down') {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      );
    }

    const solution = await prisma.solution.findUnique({
      where: { id: params.id },
    });

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Update vote counts
    const updatedSolution = await prisma.solution.update({
      where: { id: params.id },
      data: {
        upvotes: vote === 'up' ? solution.upvotes + 1 : solution.upvotes,
        downvotes: vote === 'down' ? solution.downvotes + 1 : solution.downvotes,
        totalVotes: solution.totalVotes + 1,
      },
    });

    return NextResponse.json({
      upvotes: updatedSolution.upvotes,
      downvotes: updatedSolution.downvotes,
      totalVotes: updatedSolution.totalVotes,
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}