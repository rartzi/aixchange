"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
  createdAt: string;
  category: string;
  provider: string;
  launchUrl: string;
  tokenCost: number;
  imageUrl?: string;
  sourceCodeUrl?: string;
  status?: string;
}

export function SolutionCard({
  id,
  title,
  description,
  author,
  tags,
  rating,
  createdAt,
  category,
  provider,
  launchUrl,
  tokenCost,
  imageUrl,
  sourceCodeUrl,
  status = 'Pending'
}: SolutionCardProps) {
  return (
    <Card className="bg-white dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-purple-800/30 border-border hover:border-primary/40 transition-colors min-h-[500px] flex flex-col shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-6">
          <div className="relative w-full h-48 -mt-6 -mx-6 bg-gray-100 dark:bg-gray-800">
            {/* Loading skeleton */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            
            <Image
              src={imageUrl || '/placeholder-image.jpg'}
              alt={title}
              fill
              sizes="(max-width: 768px) 100%, 600px"
              className="object-cover border-b border-border transition-opacity duration-300"
              priority
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
              onLoad={(e) => {
                // Remove loading skeleton when image loads
                const target = e.target as HTMLImageElement;
                target.classList.remove('opacity-0');
                const skeleton = target.previousElementSibling;
                if (skeleton) {
                  skeleton.classList.add('opacity-0');
                }
              }}
              style={{ opacity: 0 }} // Start hidden
            />
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary/80 transition-colors">
                <Link href={`/solutions/${id}`}>{title}</Link>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <CardDescription className="text-muted-foreground">
                  by {author.name}
                </CardDescription>
                <span className="text-muted-foreground">•</span>
                <CardDescription className="text-muted-foreground">
                  {new Date(createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-yellow-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground dark:text-muted-foreground/90">
              <span className="font-medium">Status:</span>{' '}
              <span className={`px-2 py-0.5 rounded ${
                status === 'Active' ? 'bg-green-100 text-green-700' :
                status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {status}
              </span>
            </div>
            <div className="text-sm text-muted-foreground dark:text-muted-foreground/90">
              <span className="font-medium">Category:</span>{' '}
              <span className="bg-primary/10 text-primary dark:text-white/90 px-2 py-0.5 rounded">
                {category}
              </span>
            </div>
            <div className="text-sm text-muted-foreground dark:text-muted-foreground/90">
              <span className="font-medium">Provider:</span>{' '}
              <span>{provider}</span>
            </div>
            <div className="text-sm text-muted-foreground dark:text-muted-foreground/90">
              <span className="font-medium">Cost:</span>{' '}
              <span>{tokenCost} tokens</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
            <span className={`text-sm px-2.5 py-0.5 rounded-full inline-flex items-center w-fit ${
              status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {status}
            </span>

            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>

            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{provider}</span>

            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cost:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{tokenCost} tokens</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-sm bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-6 flex flex-wrap gap-3 justify-end border-t border-border">
        {sourceCodeUrl && (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700 dark:text-gray-300"
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
          className="text-gray-700 dark:text-gray-300"
          asChild
        >
          <Link href={`/solutions/${id}`}>View Details</Link>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
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