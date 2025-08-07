// src/app/api/admin/courses/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PUT update course
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const course = await prisma.course.update({
      where: { id },
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
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE course
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.course.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}