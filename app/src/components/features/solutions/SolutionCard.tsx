"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface SolutionCardProps {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    image?: string;
  };
  tags: string[];
  rating?: number;
  totalVotes?: number;
  upvotes?: number;
  downvotes?: number;
  createdAt: string;
  category: string;
  provider: string;
  launchUrl: string;
  tokenCost: number;
  imageUrl?: string;
  sourceCodeUrl?: string;
  status?: string;
  onVote?: (id: string, vote: 'up' | 'down') => void;
}

export function SolutionCard({
  id,
  title,
  description,
  author,
  tags,
  rating,
  totalVotes = 0,
  upvotes = 0,
  downvotes = 0,
  createdAt,
  category,
  provider,
  launchUrl,
  tokenCost,
  imageUrl,
  sourceCodeUrl,
  status = 'Pending',
  onVote = () => {}
}: SolutionCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="bg-white dark:bg-[linear-gradient(135deg,rgb(17,24,39)_0%,rgb(29,40,58)_50%,rgb(30,58,138)_100%)] border-border hover:border-blue-400/30 transition-all min-h-[500px] flex flex-col shadow-md hover:shadow-xl dark:shadow-blue-900/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-6">
          <div className="relative w-full h-[200px] -mt-6 -mx-6 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {/* Loading skeleton */}
            <div
              className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 transition-opacity duration-300"
              aria-hidden="true"
            />
            
            <div className="relative w-full h-[200px] bg-gray-50 dark:bg-gray-900">
              <Image
                src={!imageError ? (imageUrl || '/placeholder-image.jpg') : '/placeholder-image.jpg'}
                alt={title}
                fill
                sizes="600px"
                className="object-cover object-center border-b border-border transition-opacity duration-300"
                style={{ opacity: 0 }}
                priority
                onError={(e) => {
                  console.error('Image load error:', {
                    url: imageUrl,
                    error: e,
                    fallback: '/placeholder-image.jpg'
                  });
                  setImageError(true);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                  target.style.opacity = '1';
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully:', {
                    url: imageUrl,
                    src: (e.target as HTMLImageElement).src
                  });
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '1';
                  const skeleton = target.parentElement?.previousElementSibling;
                  if (skeleton) {
                    skeleton.classList.add('opacity-0');
                  }
                }}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-primary/90 dark:hover:text-blue-200 transition-colors">
                  <Link href={`/solutions/${id}`}>{title}</Link>
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <CardDescription className="text-base text-muted-foreground">
                    by {author.name}
                  </CardDescription>
                  <span className="text-base text-muted-foreground">•</span>
                  <CardDescription className="text-base text-muted-foreground">
                    {new Date(createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </div>
            
            <div className="relative min-h-[4.5em]">
              <p className="text-base text-gray-600 dark:text-blue-100 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="min-h-[4em] flex items-start">
              <div className="flex flex-wrap gap-2 max-h-[3.6em] overflow-hidden">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-sm bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3">
          <span className="text-base font-medium text-gray-500 dark:text-blue-200">Status:</span>
          <span className={`text-base px-3 py-1 rounded-full inline-flex items-center w-fit ${
            status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' :
            status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300' :
            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
          }`}>
            {status}
          </span>

          <span className="text-base font-medium text-gray-500 dark:text-blue-200/80">Category:</span>
          <span className="text-base text-gray-700 dark:text-white/90">{category}</span>

          <span className="text-base font-medium text-gray-500 dark:text-blue-200/80">Provider:</span>
          <span className="text-base text-gray-700 dark:text-white/90">{provider}</span>
        </div>

        {/* Rating and Voting Section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-6">
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{rating.toFixed(1)}</span>
                {totalVotes !== undefined && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({totalVotes})</span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={() => onVote?.(id, 'up')} title="Upvote">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600 dark:text-green-400">
                  <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.5H11.5" />
                </svg>
                {upvotes !== undefined && <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{upvotes}</span>}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onVote?.(id, 'down')} title="Downvote">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400">
                  <path d="M18.905 12.75a.75.75 0 01-.07 1.06l-1.72 1.72v3.19l-2.75 1.5v-4.69l-1.72 1.72a.75.75 0 01-1.06-1.06l3.25-3.25 3.25 3.25a.75.75 0 011.06 0zm-7.24-7.24l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25-3.25-3.25a.75.75 0 010-1.06l3.25-3.25z" />
                </svg>
                {downvotes !== undefined && <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{downvotes}</span>}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6 flex flex-wrap gap-3 items-center border-t border-border">
        <div className="flex-1 text-sm text-gray-700 dark:text-white/90">
          <span className="font-medium">{tokenCost} tokens</span>
        </div>
        
        {sourceCodeUrl && (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700 dark:text-blue-200 dark:border-blue-400/30 dark:hover:bg-blue-400/10"
            asChild
          >
            <a href={sourceCodeUrl} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              Source Code
            </a>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-700 dark:text-blue-200 dark:hover:bg-blue-400/10"
          asChild
        >
          <Link href={`/solutions/${id}`}>View Details</Link>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
          asChild
        >
          <a href={launchUrl} target="_blank" rel="noopener noreferrer">
            Launch →
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}