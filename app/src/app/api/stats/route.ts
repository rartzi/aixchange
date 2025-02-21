import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { SolutionStatus } from '@prisma/client';

export async function GET() {
  try {
    // Get solution counts
    const total = await prisma.solution.count();
    const active = await prisma.solution.count({
      where: {
        status: SolutionStatus.ACTIVE,
      },
    });
    const pending = await prisma.solution.count({
      where: {
        status: SolutionStatus.PENDING,
      },
    });

    // Get community member count (all users except admins)
    const communityMembers = await prisma.user.count({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });

    return NextResponse.json({
      solutions: {
        total,
        active,
        pending,
      },
      community: {
        members: communityMembers
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}