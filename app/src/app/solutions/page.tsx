import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { SolutionCard } from "@/components/features/solutions/SolutionCard";

interface Solution {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  isPublished: boolean;
  author?: {
    name: string | null;
    image: string | null;
  } | null;
  reviews: {
    rating: number;
  }[];
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

  // Calculate average rating for each solution
  const solutionsWithRating = solutions.map((solution: Solution) => ({
    ...solution,
    averageRating: solution.reviews.length > 0
      ? solution.reviews.reduce((acc: number, review) => acc + review.rating, 0) / solution.reviews.length
      : undefined
  }));

  return (
    <div>
      {/* Header */}
      <section className="py-12 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-primary-foreground">Solutions Marketplace</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Discover and explore innovative AI solutions from our community
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search solutions..."
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
              <select className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors">
                <option value="">All Categories</option>
                <option value="ml">Machine Learning</option>
                <option value="nlp">Natural Language Processing</option>
                <option value="cv">Computer Vision</option>
              </select>
            </div>
            <select className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors">
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {solutionsWithRating.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-muted-foreground">
                No solutions found
              </h3>
              <p className="text-muted-foreground/80 mt-2">
                Be the first to publish a solution!
              </p>
              <Link href="/solutions/create" className="btn-primary mt-6">
                Create Solution
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionsWithRating.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  id={solution.id}
                  title={solution.title}
                  description={solution.description}
                  author={{
                    name: solution.author?.name ?? "Anonymous",
                    image: solution.author?.image ?? undefined,
                  }}
                  tags={solution.tags}
                  rating={solution.averageRating}
                  createdAt={solution.createdAt.toISOString()}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}