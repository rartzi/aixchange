import { NextRequest, NextResponse } from 'next/server';
import { solutionSchema, type SolutionMetadata } from '@/lib/schemas/solution';
import { prisma } from '@/lib/db/prisma';
import { ZodError } from 'zod';
import { Prisma, Solution, Review, SolutionStatus } from '@prisma/client';

const ANONYMOUS_USER_ID = 'anonymous-user';

type SolutionWithAuthorAndReviews = Solution & {
  author: {
    name: string | null;
    image: string | null;
  };
  reviews: Pick<Review, 'rating'>[];
};

async function ensureAnonymousUser() {
  const anonymousUser = await prisma.user.findUnique({
    where: { id: ANONYMOUS_USER_ID },
  });

  if (!anonymousUser) {
    await prisma.user.create({
      data: {
        id: ANONYMOUS_USER_ID,
        email: 'anonymous@aixchange.ai',
        name: 'Anonymous User',
        role: 'USER',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAnonymousUser();

    const formData = await request.formData();
    const data: Record<string, any> = {};
    
    for (const [key, value] of formData.entries()) {
      try {
        data[key] = JSON.parse(value as string);
      } catch {
        data[key] = value;
      }
    }

    const validatedData = solutionSchema.parse(data);

    const solution = await prisma.solution.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        provider: validatedData.provider,
        launchUrl: validatedData.launchUrl,
        sourceCodeUrl: validatedData.sourceCodeUrl,
        tokenCost: validatedData.tokenCost,
        status: validatedData.status === 'Active' ? SolutionStatus.ACTIVE 
               : validatedData.status === 'Pending' ? SolutionStatus.PENDING 
               : SolutionStatus.INACTIVE,
        imageUrl: validatedData.imageUrl || '/placeholder-image.jpg',
        author: {
          connect: { id: ANONYMOUS_USER_ID }
        },
        tags: validatedData.tags,
        isPublished: true,
        metadata: validatedData.metadata as Prisma.JsonObject,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Solution',
        entityId: solution.id,
        userId: ANONYMOUS_USER_ID,
        metadata: {
          title: solution.title,
          category: solution.category,
          provider: solution.provider,
        } as Prisma.JsonObject,
      },
    });

    return NextResponse.json(solution, { status: 201 });
  } catch (error) {
    console.error('Error creating solution:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create solution' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const provider = searchParams.get('provider');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'recent';
    const status = searchParams.get('status');

    const where: Prisma.SolutionWhereInput = {
      isPublished: true,
    };

    // Text search across multiple fields
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    // Direct field filters (no longer in metadata)
    if (category) {
      where.category = category;
    }

    if (provider) {
      where.provider = provider;
    }

    if (status) {
      where.status = status as SolutionStatus;
    }

    // Get solutions with related data
    const solutions = await prisma.solution.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: sort === 'rating' 
        ? { rating: 'desc' }
        : sort === 'popular' 
        ? { reviews: { _count: 'desc' } }
        : { createdAt: 'desc' },
    });

    // Transform solutions for response
    const transformedSolutions = solutions.map((solution: SolutionWithAuthorAndReviews) => {
      const metadata = solution.metadata as SolutionMetadata;
      
      return {
        ...solution,
        reviewCount: solution.reviews.length,
        resourceConfig: metadata?.resourceConfig || {},
        apiEndpoints: metadata?.apiEndpoints || [],
        documentation: metadata?.documentation || {},
      };
    });

    return NextResponse.json(transformedSolutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}