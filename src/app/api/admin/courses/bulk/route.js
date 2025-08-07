// src/app/api/admin/courses/bulk/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { courses } = body;
    
    if (!courses || !Array.isArray(courses)) {
      return NextResponse.json(
        { error: 'Invalid request: courses array required' },
        { status: 400 }
      );
    }

    const results = { created: 0, failed: 0, errors: [] };
    
    for (const courseData of courses) {
      try {
        // Validate required fields
        if (!courseData.code || !courseData.name || !courseData.departmentId) {
          results.failed++;
          results.errors.push({
            code: courseData.code || 'UNKNOWN',
            error: 'Missing required fields: code, name, or departmentId'
          });
          continue;
        }

        // Check if course already exists
        const existing = await prisma.course.findFirst({
          where: {
            code: courseData.code,
            departmentId: courseData.departmentId
          }
        });
        
        if (existing) {
          results.failed++;
          results.errors.push({
            code: courseData.code,
            error: 'Course already exists'
          });
          continue;
        }
        
        // Create course
        await prisma.course.create({
          data: {
            code: courseData.code,
            name: courseData.name,
            slug: courseData.slug || courseData.code.toLowerCase().replace(/\s+/g, '-'),
            departmentId: courseData.departmentId,
            credits: courseData.credits ? parseFloat(courseData.credits) : null,
            semester: courseData.semester ? parseInt(courseData.semester) : null
          }
        });
        
        results.created++;
        console.log(`Created course: ${courseData.code}`);
      } catch (error) {
        console.error(`Error creating course ${courseData.code}:`, error);
        results.failed++;
        results.errors.push({
          code: courseData.code,
          error: error.message
        });
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to import courses: ' + error.message },
      { status: 500 }
    );
  }
}