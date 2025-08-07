// src/app/api/admin/departments/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        university: true,
        _count: {
          select: { courses: true }
        }
      },
      orderBy: [
        { university: { name: 'asc' } },
        { name: 'asc' }
      ]
    });
    
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

// POST new department
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Check if slug already exists in the same university
    const existing = await prisma.department.findFirst({
      where: {
        slug: data.slug,
        universityId: data.universityId
      }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A department with this slug already exists in this university' },
        { status: 400 }
      );
    }
    
    const department = await prisma.department.create({
      data: {
        name: data.name,
        slug: data.slug,
        universityId: data.universityId
      },
      include: {
        university: true
      }
    });
    
    return NextResponse.json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}

