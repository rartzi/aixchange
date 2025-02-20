'use client';

import { useState, useEffect } from 'react';
import { SolutionCard } from './SolutionCard';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { predefinedCategories } from '@/lib/schemas/solution';
import type { SolutionMetadata } from '@/lib/schemas/solution';

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
  category: typeof predefinedCategories[number];
  provider: string;
  launchUrl: string;
  tokenCost: number;
  imageUrl: string;
  metadata?: SolutionMetadata;
}

interface SolutionsGridProps {
  initialSolutions: Solution[];
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
] as const;

interface FilterState {
  search: string;
  category: string;
  provider: string;
  author: string;
  priceRange: {
    min: number;
    max: number;
  };
  selectedTags: string[];
}

const initialFilterState: FilterState = {
  search: '',
  category: '',
  provider: '',
  author: '',
  priceRange: {
    min: 0,
    max: 1000,
  },
  selectedTags: [],
};

export function SolutionsGrid({ initialSolutions }: SolutionsGridProps) {
  const [solutions, setSolutions] = useState<Solution[]>(initialSolutions);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const debouncedSearch = useDebounce(filters.search, 300);
  const debouncedPriceRange = useDebounce(filters.priceRange, 500);
  const debouncedAuthor = useDebounce(filters.author, 300);

  useEffect(() => {
    const fetchSolutions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (filters.category) params.append('category', filters.category);
        if (filters.provider) params.append('provider', filters.provider);
        if (debouncedAuthor) params.append('author', debouncedAuthor);
        if (sort) params.append('sort', sort);
        if (page > 1) params.append('page', page.toString());
        
        // Price range
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
        
        // Tags
        if (filters.selectedTags.length > 0) {
          params.append('tags', filters.selectedTags.join(','));
        }

        const response = await fetch(`/api/solutions?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch solutions');
        
        const { data, metadata } = await response.json();
        setSolutions(page === 1 ? data : [...solutions, ...data]);
        setHasMore(metadata?.hasMore ?? false);
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [debouncedSearch, filters.category, filters.provider, debouncedAuthor, debouncedPriceRange, filters.selectedTags, sort, page]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset pagination when filters change
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div>
      {/* Filters Panel */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[280px]">
                <input
                  type="text"
                  placeholder="Search solutions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
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

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors"
              >
                <option value="">All Categories</option>
                {predefinedCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Provider Filter */}
              <input
                type="text"
                placeholder="Filter by provider..."
                value={filters.provider}
                onChange={(e) => handleFilterChange('provider', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />

              {/* Author Filter */}
              <input
                type="text"
                placeholder="Filter by submitter..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                  className="w-24 px-2 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
                  className="w-24 px-2 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
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
              
              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}