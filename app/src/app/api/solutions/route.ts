import { NextRequest, NextResponse } from 'next/server';
import { solutionSchema, type SolutionMetadata } from '@/lib/schemas/solution';
import { prisma } from '@/lib/db/prisma';
import { ZodError, z } from 'zod';
import { Prisma, Solution, Review, SolutionStatus } from '@prisma/client';

const ANONYMOUS_USER_ID = 'anonymous-user';
const DEFAULT_PAGE_SIZE = 10;

// API Response Types
type ApiResponse<T> = {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    hasMore?: boolean;
  };
};

type ApiErrorResponse = {
  error: string;
  details?: unknown;
  code?: string;
};

// Query Parameter Schema
const queryParamsSchema = z.object({
  category: z.string().optional(),
  provider: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['recent', 'rating', 'popular', 'price-low', 'price-high']).optional().default('recent'),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  tags: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
});

type SolutionWithAuthorAndReviews = Solution & {
  author: {
    name: string | null;
    image: string | null;
  };
  reviews: Pick<Review, 'rating'>[];
};

/**
 * Ensures the anonymous user exists in the database
 * @throws {Error} If unable to create anonymous user
 */
async function ensureAnonymousUser() {
  try {
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
  } catch (error) {
    console.error('Error ensuring anonymous user:', error);
    throw new Error('Failed to ensure anonymous user');
  }
}

/**
 * Creates a new solution
 * @param request The incoming request containing solution data
 * @returns The created solution
 */
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

    const response: ApiResponse<Solution> = { data: solution };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating solution:', error);

    if (error instanceof ZodError) {
      const errorResponse: ApiErrorResponse = {
        error: 'Validation error',
        details: error.errors,
        code: 'VALIDATION_ERROR',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check for Prisma errors by code instead of instanceof
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: unknown };
      const errorResponse: ApiErrorResponse = {
        error: 'Database error',
        code: prismaError.code,
        details: prismaError.meta,
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const errorResponse: ApiErrorResponse = {
      error: 'Failed to create solution',
      code: 'INTERNAL_ERROR',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Retrieves solutions with filtering, sorting, and pagination
 * @param request The incoming request containing query parameters
 * @returns List of solutions matching the criteria
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const { 
      category, 
      provider,
      author,
      search,
      sort,
      status,
      minPrice,
      maxPrice,
      tags,
      page,
      pageSize,
    } = queryParamsSchema.parse(params);

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

    // Direct field filters
    if (category) {
      where.category = category;
    }

    if (provider) {
      where.provider = {
        contains: provider,
        mode: 'insensitive',
      };
    }

    if (author) {
      where.author = {
        name: {
          contains: author,
          mode: 'insensitive',
        },
      };
    }

    if (status) {
      where.status = status;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.tokenCost = {};
      if (minPrice !== undefined) {
        where.tokenCost.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.tokenCost.lte = maxPrice;
      }
    }

    // Tags filter - using AND logic
    if (tags) {
      const tagList = tags.split(',');
      // Create an AND condition for each tag
      where.AND = tagList.map(tag => ({
        tags: {
          has: tag
        }
      }));
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination
    const total = await prisma.solution.count({ where });

    // Determine sort order
    let orderBy: Prisma.SolutionOrderByWithRelationInput = {};
    switch (sort) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
        orderBy = { reviews: { _count: 'desc' } };
        break;
      case 'price-low':
        orderBy = { tokenCost: 'asc' };
        break;
      case 'price-high':
        orderBy = { tokenCost: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
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
      orderBy,
      skip,
      take: pageSize,
    });

    // Transform solutions for response
    const transformedSolutions = solutions.map((solution: SolutionWithAuthorAndReviews) => {
      const metadata = solution.metadata as SolutionMetadata;
      
      return {
        ...solution,
        reviewCount: solution.reviews.length,
        rating: solution.reviews.reduce((acc, review) => acc + review.rating, 0) / solution.reviews.length || 0,
        apiEndpoints: metadata?.apiEndpoints || [],
        documentation: metadata?.documentation || {},
      };
    });

    const response: ApiResponse<typeof transformedSolutions> = {
      data: transformedSolutions,
      meta: {
        page,
        pageSize,
        total,
        hasMore: skip + solutions.length < total,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching solutions:', error);

    if (error instanceof ZodError) {
      const errorResponse: ApiErrorResponse = {
        error: 'Invalid query parameters',
        details: error.errors,
        code: 'INVALID_QUERY',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check for Prisma errors by code instead of instanceof
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: unknown };
      const errorResponse: ApiErrorResponse = {
        error: 'Database error',
        code: prismaError.code,
        details: prismaError.meta,
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const errorResponse: ApiErrorResponse = {
      error: 'Failed to fetch solutions',
      code: 'INTERNAL_ERROR',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}