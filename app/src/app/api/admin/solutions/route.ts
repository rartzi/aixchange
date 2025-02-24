import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { solutionSchema } from "@/lib/schemas/solution";
import { SolutionStatus } from "@prisma/client";
import { generateSolutionImage } from "@/lib/services/imageService";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData
    const formData = await request.formData();
    
    // Convert FormData to object with proper type handling
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'tokenCost' || key === 'rating') {
        // Convert numeric fields
        data[key] = Number(value);
      } else if (key === 'tags' || key === 'metadata' || key === 'apiEndpoints') {
        // Parse JSON fields
        try {
          data[key] = JSON.parse(value.toString());
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
          data[key] = key === 'tags' ? [] : undefined;
        }
      } else if (key === 'isPublished') {
        // Convert boolean fields
        data[key] = value === 'true';
      } else if (key === 'image') {
        // Skip image field as we'll handle it separately
        continue;
      } else {
        // String fields
        data[key] = value.toString();
      }
    }

    // Set default values if not provided
    if (!data.status) data.status = 'Pending';
    if (!data.tags) data.tags = [];
    if (!data.tokenCost) data.tokenCost = 0;
    if (!data.rating) data.rating = 0;
    if (typeof data.isPublished === 'undefined') data.isPublished = true;

    // Validate the parsed data
    const validationResult = solutionSchema.safeParse(data);

    console.log('Parsed data:', data);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const solutionData = validationResult.data;

    // Generate image if not provided
    if (!solutionData.imageUrl) {
      const imagePrompt = `${solutionData.title} - ${solutionData.description}`;
      const imageUrl = await generateSolutionImage(imagePrompt);
      if (imageUrl) {
        solutionData.imageUrl = imageUrl;
      }
    }

    // Map status to enum
    const status = solutionData.status === 'Active' ? SolutionStatus.ACTIVE
                : solutionData.status === 'Pending' ? SolutionStatus.PENDING
                : SolutionStatus.INACTIVE;

    // Create solution
    const solution = await prisma.solution.create({
      data: {
        ...solutionData,
        status,
        authorId: session.user.id,
        metadata: solutionData.metadata as any
      }
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "SOLUTION",
        entityId: solution.id,
        userId: session.user.id,
        metadata: {
          title: solution.title,
          status: solution.status
        }
      }
    });

    return NextResponse.json({
      success: true,
      solution,
      message: "Solution created successfully"
    });

  } catch (error) {
    console.error("Error creating solution:", error);
    return NextResponse.json(
      { error: "Failed to create solution" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const solutions = await prisma.solution.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    return NextResponse.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}