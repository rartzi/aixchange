import Link from "next/link";
import { SolutionsGrid } from "@/components/features/solutions/SolutionsGrid";
import { prisma } from "@/lib/db/prisma";

// Add dynamic flag to prevent static page generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getInitialSolutions() {
  try {
    const solutions = await prisma.solution.findMany({
      where: {
        isPublished: true,
      },
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
        createdAt: 'desc',
      },
      take: 10,
    });

    return solutions.map((solution) => ({
      ...solution,
      createdAt: solution.createdAt.toISOString(),
      updatedAt: solution.updatedAt.toISOString(),
      reviewCount: solution.reviews.length,
      resourceConfig: (solution.metadata as any)?.resourceConfig || {},
      apiEndpoints: (solution.metadata as any)?.apiEndpoints || [],
      documentation: (solution.metadata as any)?.documentation || {},
    }));
  } catch (error) {
    console.error('Error fetching initial solutions:', error);
    return [];
  }
}

export default async function SolutionsPage() {
  const initialSolutions = await getInitialSolutions();

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-primary-foreground">(AI)Xchange</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Discover and explore innovative AI solutions from our community
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/solutions/create"
                className="px-6 py-3 rounded-lg bg-white text-primary hover:bg-white/90 transition-colors font-medium"
              >
                Submit Solution
              </Link>
              <Link
                href="/admin/solutions/bulk-submission"
                className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Bulk Submission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid with Search and Filters */}
      <SolutionsGrid initialSolutions={initialSolutions} />
    </>
  );
}