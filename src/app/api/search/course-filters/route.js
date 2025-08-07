// src/app/api/search/course-filters/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [universities, departments] = await Promise.all([
      prisma.university.findMany({ 
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true
        }
      }),
      prisma.department.findMany({ 
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          universityId: true
        }
      })
    ]);

    return NextResponse.json({
      universities,
      departments,
      semesters: [1, 2, 3, 4, 5, 6, 7, 8]
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}