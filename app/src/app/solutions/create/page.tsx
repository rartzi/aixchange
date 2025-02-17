'use client';

import { CreateSolutionForm } from "@/components/features/solutions/CreateSolutionForm";
import Link from "next/link";

export default function CreateSolutionPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-12 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-primary-foreground">Create Solution</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Share your AI solution with the community
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/solutions"
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                ← Back to Solutions
              </Link>
              <Link
                href="/admin/solutions/import"
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Bulk Import
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <CreateSolutionForm />
      </section>
    </div>
  );
}