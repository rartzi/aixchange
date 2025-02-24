'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { predefinedCategories } from '@/lib/schemas/solution';
import type { FilterState } from './types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  sort: string;
  onSortChange: (value: string) => void;
  availableTags: string[];
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'most-voted', label: 'Most Voted' },
  { value: 'most-upvoted', label: 'Most Upvoted' },
] as const;

export function FilterSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange,
  sort,
  onSortChange,
  availableTags = []
}: FilterSidebarProps) {
  const [tagSearch, setTagSearch] = useState('');

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFilterChange(key, value);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    handleFilterChange('selectedTags', newTags);
  };

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div 
      className={`
        fixed inset-0 z-50 
        transition-[visibility,opacity] duration-200 ease-in-out
        ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
      `}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside 
        className={`
          absolute right-0 top-0 bottom-0 w-[400px] bg-background shadow-2xl
          border-l border-border
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-background/80"
              aria-label="Apply filters and close"
            >
              Apply & Close
            </Button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <input
                  type="text"
                  placeholder="Filter by category..."
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Provider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <input
                  type="text"
                  placeholder="Filter by provider..."
                  value={filters.provider}
                  onChange={(e) => handleFilterChange('provider', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Submitter</label>
                <input
                  type="text"
                  placeholder="Filter by submitter..."
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Tags</label>
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Available Tags</span>
                    {filters.selectedTags.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {filters.selectedTags.length} selected
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto p-2 border border-border rounded-md">
                    {filteredTags.map((tag) => (
                      <Button
                        key={tag}
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className={`
                          flex items-center gap-1 font-medium
                          ${filters.selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80'
                            : 'bg-accent/90 text-accent-foreground hover:bg-accent dark:bg-accent/60 dark:text-accent-foreground/90 dark:hover:bg-accent/70'
                          }
                          transition-colors duration-200
                        `}
                      >
                        {tag}
                        {filters.selectedTags.includes(tag) && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </Button>
                    ))}
                    {filteredTags.length === 0 && (
                      <p className="text-sm text-muted-foreground p-2">No tags found</p>
                    )}
                  </div>
                </div>

                {filters.selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selected Tags (AND filter)</label>
                    <div className="flex flex-wrap gap-2">
                      {filters.selectedTags.map((tag) => (
                        <Button
                          key={tag}
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleTag(tag)}
                          className="flex items-center gap-1 font-medium bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors duration-200"
                        >
                          {tag}
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Filters Button */}
              <div className="mt-12">
                <Button 
                  onClick={onClose}
                  className="w-full"
                  variant="default"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}