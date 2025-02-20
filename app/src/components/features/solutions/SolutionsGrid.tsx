'use client';

import { useState, useEffect } from 'react';
import { SolutionCard } from './SolutionCard';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface Solution {
  id: string;
  title: string;
  description: string;
  author: {
    name: string | null;
    image: string | null;
  };
  tags: string[];
  rating?: number;
  createdAt: string;
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
}

interface SolutionsGridProps {
  initialSolutions: Solution[];
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'nlp', label: 'Natural Language Processing' },
  { value: 'cv', label: 'Computer Vision' },
] as const;

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
] as const;

export function SolutionsGrid({ initialSolutions }: SolutionsGridProps) {
  const [solutions, setSolutions] = useState<Solution[]>(initialSolutions);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recent');
  
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchSolutions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (category) params.append('category', category);
        if (sort) params.append('sort', sort);

        const response = await fetch(`/api/solutions?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch solutions');
        
        const { data } = await response.json();
        setSolutions(data);
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [debouncedSearch, category, sort]);

  return (
    <div>
      {/* Filters */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search solutions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto px-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[500px] rounded-lg bg-card/50 animate-pulse"
                />
              ))}
            </div>
          ) : solutions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-muted-foreground">
                No solutions found
              </h3>
              <p className="text-muted-foreground/80 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto px-4">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  {...solution}
                  author={{
                    name: solution.author?.name ?? 'Anonymous',
                    image: solution.author?.image ?? undefined,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}