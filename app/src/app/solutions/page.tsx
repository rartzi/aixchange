import Link from "next/link";
import { SolutionsGrid } from "@/components/features/solutions/SolutionsGrid";

// Add dynamic flag to prevent static page generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SolutionsPage() {
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
      <SolutionsGrid initialSolutions={[]} />
    </div>
  );
}