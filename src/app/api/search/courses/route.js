// src/app/api/search/courses/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const university = searchParams.get('university');
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');

    // Build where clause
    const where = {
      AND: []
    };

    // Text search in course code or name
    if (query) {
      where.AND.push({
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } }
        ]
      });
    }

    // Filter by department
    if (department) {
      where.AND.push({ departmentId: department });
    } else if (university) {
      // Filter by university if no specific department
      where.AND.push({ 
        department: { 
          universityId: university 
        } 
      });
    }

    // Filter by semester
    if (semester) {
      where.AND.push({ semester: parseInt(semester) });
    }

    // Remove empty AND array if no conditions
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Fetch courses with question counts
    const courses = await prisma.course.findMany({
      where,
      include: {
        department: {
          include: {
            university: true
          }
        },
        questions: {
          select: {
            year: true,
            examType: true
          }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: [
        { department: { university: { name: 'asc' } } },
        { department: { name: 'asc' } },
        { semester: 'asc' },
        { code: 'asc' }
      ],
      take: 50 // Limit results
    });

    return NextResponse.json({ results: courses });
  } catch (error) {
    console.error('Course search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}