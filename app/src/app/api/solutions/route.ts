import { NextRequest, NextResponse } from 'next/server';
import { solutionSchema, type SolutionMetadata } from '@/lib/schemas/solution';
import { prisma } from '@/lib/db/prisma';
import { ZodError, z } from 'zod';
import { Prisma, Solution, Review, SolutionStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const ANONYMOUS_USER_ID = 'anonymous-user';
const DEFAULT_PAGE_SIZE = 30;

// API Response Types
type ApiResponse<T> = {
  data: T;
  meta?: {
    hasMore?: boolean;
    nextCursor?: string;
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
  sort: z.enum(['recent', 'rating', 'most-voted', 'most-upvoted']).optional().default('recent'),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).optional(),
  tags: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
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
async function ensureAnonymousUser(name: string = 'Anonymous User') {
  try {
    const anonymousUser = await prisma.user.findUnique({
      where: { id: ANONYMOUS_USER_ID },
    });

    if (!anonymousUser) {
      await prisma.user.create({
        data: {
          id: ANONYMOUS_USER_ID,
          email: 'anonymous@aixchange.ai',
          name: name,
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
    const formData = await request.formData();
    const authorName = formData.get('authorName')?.toString() || 'Anonymous User';
    const session = await getServerSession();
    
    // Use authenticated user ID if available, otherwise use/create anonymous user
    const userId = session?.user?.id;
    
    if (!userId) {
      // Update or create anonymous user with the provided name
      await prisma.user.upsert({
        where: { id: ANONYMOUS_USER_ID },
        update: { name: authorName },
        create: {
          id: ANONYMOUS_USER_ID,
          email: 'anonymous@aixchange.ai',
          name: authorName,
          role: 'USER',
        },
      });
    }

    const data: Record<string, any> = {};
    
    // First get the imageUrl separately
    const imageUrl = formData.get('imageUrl')?.toString();
    
    // Then process other fields
    for (const [key, value] of formData.entries()) {
      if (key === 'imageUrl') {
        continue; // Skip, we already got it
      }
      try {
        data[key] = JSON.parse(value as string);
      } catch {
        data[key] = value;
      }
    }

    // Add imageUrl back if we have one
    if (imageUrl) {
      data.imageUrl = imageUrl;
      console.log('Processing imageUrl in API:', imageUrl);
    }

    const validatedData = solutionSchema.parse(data);

    // Enhanced logging for image URL debugging
    console.log('Solution Creation Debug:', {
      rawFormData: Object.fromEntries(formData.entries()),
      validatedImageUrl: validatedData.imageUrl,
      imageUrlType: typeof validatedData.imageUrl,
      finalImageUrl: typeof validatedData.imageUrl === 'string' ? validatedData.imageUrl : '/placeholder-image.jpg'
    });

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
        imageUrl: validatedData.imageUrl,
        author: {
          connect: { id: userId || ANONYMOUS_USER_ID }
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
        userId: userId || ANONYMOUS_USER_ID,
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
      tags,
      cursor,
      limit,
    } = queryParamsSchema.parse(params);

    const where: Prisma.SolutionWhereInput = {};
    
    // Only apply isPublished filter if no status is specified
    if (!status) {
      where.isPublished = true;
    }

    // Cursor-based pagination
    let skip: number | undefined;
    let take: number = limit;
    
    if (cursor) {
      where.id = {
        gt: cursor // Get items after the cursor
      };
    }

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

    // Determine sort order
    let orderBy: Prisma.SolutionOrderByWithRelationInput = {};
    switch (sort) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'most-voted':
        orderBy = { totalVotes: 'desc' };
        break;
      case 'most-upvoted':
        orderBy = { upvotes: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get solutions with cursor-based pagination
    const solutions = await prisma.solution.findMany({
      where,
      take: take + 1, // Fetch one extra to determine if there are more items
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
    });

    // Check if there are more items
    const hasMore = solutions.length > take;
    const items = hasMore ? solutions.slice(0, -1) : solutions;
    const nextCursor = hasMore ? items[items.length - 1].id : undefined;

    // Transform solutions for response
    const transformedSolutions = items.map((solution: SolutionWithAuthorAndReviews) => {
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
        hasMore,
        nextCursor,
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