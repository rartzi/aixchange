import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build query filters
    const where = {
      ...(featured ? { isPromoted: true, status: "ACTIVE" } : {}),
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    };

    // For now, return mock data for testing the UI
    const mockEvents = [
      {
        id: "1",
        title: "AI Innovation Challenge 2025",
        description: "Join us for the biggest AI innovation event of the year!",
        shortDescription: "Create groundbreaking AI solutions",
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31"),
        status: "UPCOMING",
        type: "HACKATHON",
        imageUrl: "/placeholder-image.jpg",
        bannerUrl: "/placeholder-image.jpg",
        isPublic: true,
        isPromoted: true,
        participantCount: 0,
        submissionCount: 0,
        viewCount: 100,
        winners: []
      },
      {
        id: "2",
        title: "Sustainable AI Workshop",
        description: "Learn how to build sustainable AI solutions",
        shortDescription: "AI for sustainability",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-04-02"),
        status: "UPCOMING",
        type: "WORKSHOP",
        imageUrl: "/placeholder-image.jpg",
        bannerUrl: "/placeholder-image.jpg",
        isPublic: true,
        isPromoted: true,
        participantCount: 0,
        submissionCount: 0,
        viewCount: 50,
        winners: []
      }
    ];

    return NextResponse.json({
      events: mockEvents,
      pagination: {
        total: 2,
        pages: 1,
        page: 1,
        limit: 10,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}