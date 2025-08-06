// src/app/api/search/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const university = searchParams.get('university');
    const department = searchParams.get('department');
    const course = searchParams.get('course');
    const year = searchParams.get('year');
    const examType = searchParams.get('examType');

    // Build where clause
    const where = {
      AND: []
    };

    // Text search in content
    if (query) {
      where.AND.push({
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { answer: { content: { contains: query, mode: 'insensitive' } } }
        ]
      });
    }

    // Filter conditions
    if (course) {
      where.AND.push({ courseId: course });
    } else if (department) {
      where.AND.push({ course: { departmentId: department } });
    } else if (university) {
      where.AND.push({ course: { department: { universityId: university } } });
    }

    if (year) {
      where.AND.push({ year: parseInt(year) });
    }

    if (examType) {
      where.AND.push({ examType });
    }

    // If no conditions, return empty
    if (where.AND.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Execute search
    const results = await prisma.question.findMany({
      where,
      include: {
        answer: true,
        course: {
          include: {
            department: {
              include: {
                university: true
              }
            }
          }
        }
      },
      take: 50, // Limit results
      orderBy: [
        { year: 'desc' },
        { questionNo: 'asc' }
      ]
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}

