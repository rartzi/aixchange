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
}: SolutionCardProps) {
  return (
    <Card className="dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-purple-800/30 border-border hover:border-primary/40 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          {imageUrl && (
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-primary hover:text-primary/80 transition-colors">
                  <Link href={`/solutions/${id}`}>{title}</Link>
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  by {author.name}
                </CardDescription>
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
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground dark:text-muted-foreground/90">
              <span className="bg-primary/10 text-primary dark:text-white/90 px-2 py-0.5 rounded">
                {category}
              </span>
              <span>•</span>
              <span>{provider}</span>
              <span>•</span>
              <span>{tokenCost} tokens</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground/90 dark:text-white/90 line-clamp-2 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-primary/10 text-primary dark:text-white/90 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <span className="text-sm text-muted-foreground dark:text-muted-foreground/90">
          {new Date(createdAt).toLocaleDateString()}
        </span>
        <div className="flex flex-wrap gap-2">
          {sourceCodeUrl && (
            <Button
              variant="outline"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 dark:text-white/90"
              asChild
            >
              <a href={sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 mr-1">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                Source Code
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 hover:bg-primary/10 dark:text-white/90"
            asChild
          >
            <Link href={`/solutions/${id}`}>View Details</Link>
          </Button>
          <Button
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <a href={launchUrl} target="_blank" rel="noopener noreferrer">
              Launch →
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}