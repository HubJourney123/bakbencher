// src/app/api/admin/courses/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: {
          include: {
            university: true
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
      ]
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST new course
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Check if course code already exists in the same department
    const existing = await prisma.course.findFirst({
      where: {
        code: data.code,
        departmentId: data.departmentId
      }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A course with this code already exists in this department' },
        { status: 400 }
      );
    }
    
    const course = await prisma.course.create({
      data: {
        code: data.code,
        name: data.name,
        slug: data.slug,
        departmentId: data.departmentId,
        credits: data.credits,
        semester: data.semester
      },
      include: {
        department: {
          include: {
            university: true
          }
        }
      }
    });
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

