// src/app/api/search/filters/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [universities, departments, courses, yearData, examTypes] = await Promise.all([
      prisma.university.findMany({ orderBy: { name: 'asc' } }),
      prisma.department.findMany({ orderBy: { name: 'asc' } }),
      prisma.course.findMany({ orderBy: { code: 'asc' } }),
      prisma.question.findMany({
        select: { year: true },
        distinct: ['year'],
        orderBy: { year: 'desc' }
      }),
      prisma.question.findMany({
        select: { examType: true },
        distinct: ['examType'],
        orderBy: { examType: 'asc' }
      })
    ]);

    return NextResponse.json({
      universities,
      departments,
      courses,
      years: yearData.map(y => y.year),
      examTypes: examTypes.map(e => e.examType)
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}