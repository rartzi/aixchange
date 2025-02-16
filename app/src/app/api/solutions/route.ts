import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
import { z } from 'zod';

const createSolutionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  tags: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createSolutionSchema.parse(body);

    const solution = await prisma.solution.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        tags: validatedData.tags,
        authorId: session.user.id,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_SOLUTION',
        entityType: 'Solution',
        entityId: solution.id,
        userId: session.user.id,
        metadata: {
          title: solution.title,
          tags: solution.tags,
        },
      },
    });

    return NextResponse.json(solution, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating solution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const authorId = searchParams.get('author');
    const tag = searchParams.get('tag');

    const where = {
      ...(published === 'true' && { isPublished: true }),
      ...(authorId && { authorId }),
      ...(tag && { tags: { has: tag } }),
    };

    const solutions = await prisma.solution.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(solutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}