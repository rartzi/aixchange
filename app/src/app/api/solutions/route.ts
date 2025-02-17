import { NextRequest, NextResponse } from 'next/server';
import { solutionSchema } from '@/lib/schemas/solution';
import { prisma } from '@/lib/db/prisma';
import { ZodError } from 'zod';
import { Prisma, Solution, Review } from '@prisma/client';

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
        author: {
          connect: { id: ANONYMOUS_USER_ID }
        },
        tags: validatedData.tags,
        metadata: {
          category: validatedData.category,
          provider: validatedData.provider,
          launchUrl: validatedData.launchUrl,
          sourceCodeUrl: validatedData.sourceCodeUrl,
          tokenCost: validatedData.tokenCost,
          status: 'Active',
          imageUrl: '/placeholder-image.jpg',
          isPublished: true
        } as Prisma.JsonObject,
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
          category: (solution.metadata as any).category,
          provider: (solution.metadata as any).provider,
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

    const where: Prisma.SolutionWhereInput = {
      isPublished: true,
    };

    // Text search
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    // Category filter
    if (category) {
      where.metadata = {
        path: ['category'],
        equals: category,
      };
    }

    // Provider filter
    if (provider) {
      where.metadata = {
        path: ['provider'],
        equals: provider,
      };
    }

    // Get solutions with reviews for sorting
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
      orderBy: {
        createdAt: 'desc', // Default sort
      },
    });

    // Transform and sort solutions
    const transformedSolutions = solutions.map((solution: SolutionWithAuthorAndReviews) => {
      const metadata = solution.metadata as Record<string, any>;
      const averageRating = solution.reviews.length > 0
        ? solution.reviews.reduce((acc: number, review: Pick<Review, 'rating'>) => acc + review.rating, 0) / solution.reviews.length
        : 0;

      return {
        ...solution,
        category: metadata.category || 'Other',
        provider: metadata.provider || 'Unknown',
        launchUrl: metadata.launchUrl || '',
        tokenCost: metadata.tokenCost || 0,
        resourceConfig: metadata.resourceConfig || {},
        status: metadata.status || 'PENDING',
        imageUrl: metadata.imageUrl || '/placeholder-image.jpg',
        rating: averageRating,
        reviewCount: solution.reviews.length,
      };
    });

    // Apply sorting
    switch (sort) {
      case 'rating':
        transformedSolutions.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        transformedSolutions.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      // 'recent' is already handled by the database query
    }

    return NextResponse.json(transformedSolutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}