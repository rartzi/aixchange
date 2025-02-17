import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { SolutionsGrid } from "@/components/features/solutions/SolutionsGrid";
import { Prisma } from "@prisma/client";

interface SolutionMetadata {
  category: string;
  provider: string;
  launchUrl: string;
  tokenCost: number;
  imageUrl: string;
  resourceConfig: {
    cpu: string;
    memory: string;
    storage: string;
    gpu: string;
  };
  status: string;
}

export default async function SolutionsPage() {
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
      createdAt: "desc",
    },
  });

  // Transform solutions to include metadata fields
  const transformedSolutions = solutions.map((solution) => {
    const metadata = (solution.metadata as Prisma.JsonObject || {}) as Partial<SolutionMetadata>;
    return {
      ...solution,
      createdAt: solution.createdAt.toISOString(), // Convert Date to string
      category: metadata.category || 'Other',
      provider: metadata.provider || 'Unknown',
      launchUrl: metadata.launchUrl || '#',
      tokenCost: metadata.tokenCost || 0,
      imageUrl: metadata.imageUrl || '/placeholder-image.jpg',
      resourceConfig: metadata.resourceConfig || {
        cpu: '1 core',
        memory: '1GB',
        storage: '1GB',
        gpu: '',
      },
      rating: solution.reviews.length > 0
        ? solution.reviews.reduce((acc, review) => acc + review.rating, 0) / solution.reviews.length
        : undefined
    };
  });

  return (
    <div>
      {/* Header */}
      <section className="py-12 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-primary-foreground">Solutions Marketplace</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Discover and explore innovative AI solutions from our community
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/solutions/create"
                className="px-6 py-3 rounded-lg bg-white text-primary hover:bg-white/90 transition-colors font-medium"
              >
                Create Solution
              </Link>
              <Link
                href="/admin/solutions/import"
                className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Bulk Import
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid with Search and Filters */}
      <SolutionsGrid initialSolutions={transformedSolutions} />
    </div>
  );
}