"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
}

export function SolutionCard({
  id,
  title,
  description,
  author,
  tags,
  rating,
  createdAt,
}: SolutionCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-colors">
      <CardHeader>
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
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground/80 line-clamp-2 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </span>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
          asChild
        >
          <Link href={`/solutions/${id}`}>View Details →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}