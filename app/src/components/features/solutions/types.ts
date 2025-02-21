import { predefinedCategories } from '@/lib/schemas/solution';

export interface FilterState {
  search: string;
  category: string;
  provider: string;
  author: string;
  selectedTags: string[];
}

export const initialFilterState: FilterState = {
  search: '',
  category: '',
  provider: '',
  author: '',
  selectedTags: [],
};

export interface Solution {
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
  metadata?: any;
}