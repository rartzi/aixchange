import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { SolutionStatus } from '@prisma/client';

export async function GET() {
  try {
    // Get total count
    const total = await prisma.solution.count();

    // Get active count
    const active = await prisma.solution.count({
      where: {
        status: SolutionStatus.ACTIVE,
      },
    });

    // Get pending count
    const pending = await prisma.solution.count({
      where: {
        status: SolutionStatus.PENDING,
      },
    });

    return NextResponse.json({
      total,
      active,
      pending,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}