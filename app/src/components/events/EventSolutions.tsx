import { type Solution, type Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, MessageSquareIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

type EventSolutionsProps = {
  eventId: string
}

type SolutionWithDetails = Solution & {
  author: {
    name: string | null
    image: string | null
  }
  _count: {
    reviews: number
  }
}

export default async function EventSolutions({ eventId }: EventSolutionsProps) {
  const solutions = await prisma.$queryRaw<SolutionWithDetails[]>`
    SELECT 
      s.*,
      json_build_object(
        'name', u.name,
        'image', u.image
      ) as author,
      json_build_object(
        'reviews', (SELECT COUNT(*) FROM "Review" WHERE "solutionId" = s.id)
      ) as "_count"
    FROM "Solution" s
    LEFT JOIN "User" u ON s."authorId" = u.id
    WHERE s."eventId" = ${eventId}
    AND s."isPublished" = true
    ORDER BY s.upvotes DESC
  `

  if (solutions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No solutions yet</h3>
        <p className="text-muted-foreground mt-2">Be the first to submit a solution!</p>
        <Button asChild className="mt-4">
          <Link href="/solutions/submit">Submit Solution</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Solutions ({solutions.length})</h3>
        <Button asChild>
          <Link href="/solutions/submit">Submit Solution</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {solutions.map((solution) => (
          <Card key={solution.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={solution.author.image || "/placeholder-image.jpg"}
                    alt={solution.author.name || "Anonymous"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{solution.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    by {solution.author.name || "Anonymous"} • {formatDistanceToNow(solution.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{solution.description}</p>
              {solution.imageUrl && (
                <div className="relative h-48 mt-4 rounded-md overflow-hidden">
                  <Image
                    src={solution.imageUrl}
                    alt={solution.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  <span>{solution.upvotes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                  <span>{solution.downvotes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4" />
                  <span>{solution._count.reviews}</span>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={`/solutions/${solution.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}