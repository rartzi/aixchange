'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SolutionCard } from './SolutionCard';
import { FilterSidebar } from './FilterSidebar';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Solution, FilterState, initialFilterState } from './types';

interface SolutionStats {
  total: number;
  active: number;
  pending: number;
}

interface SolutionsGridProps {
  initialSolutions: Solution[];
}

export function SolutionsGrid({ initialSolutions }: SolutionsGridProps) {
  const [solutions, setSolutions] = useState<Solution[]>(initialSolutions);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<SolutionStats>({ total: 0, active: 0, pending: 0 });
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);
  const debouncedAuthor = useDebounce(filters.author, 300);

  // Extract unique tags from all solutions
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialSolutions.forEach(solution => {
      solution.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [initialSolutions]); // Use initialSolutions instead of solutions to maintain stable tag list

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
        
        // Tags - using AND logic
        if (filters.selectedTags.length > 0) {
          params.append('tags', filters.selectedTags.join(','));
        }

        const response = await fetch(`/api/solutions?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch solutions');
        
        const { data, metadata } = await response.json();
        setSolutions(prevSolutions =>
          page === 1 ? data : [...prevSolutions, ...data]
        );
        setHasMore(metadata?.hasMore ?? false);
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [debouncedSearch, filters.category, filters.provider, debouncedAuthor, filters.selectedTags, sort, page]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset pagination when filters change
  };

  const observerRef = useRef<HTMLDivElement>(null);
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoading]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Stats Bar */}
        <div className="bg-background/80 backdrop-blur-sm border-b border-border py-3">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Total Solutions:</span>
                <span className="font-bold text-foreground">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Active:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{stats.active}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Pending:</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Bar with Search and Filter Toggle */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border py-4">
          <div className="container mx-auto px-4 flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 hover:bg-primary/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filters
              {(filters.category || filters.provider || filters.author || filters.selectedTags.length > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {[
                    filters.category,
                    filters.provider,
                    filters.author,
                    ...filters.selectedTags
                  ].filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-8">
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
          )}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div
            ref={observerRef}
            className="h-10 w-full flex items-center justify-center py-8"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            )}
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={setSort}
        availableTags={availableTags}
      />
    </>
  );
}