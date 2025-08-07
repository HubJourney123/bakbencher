// src/app/api/admin/universities/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all universities
export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      include: {
        _count: {
          select: { departments: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

// POST new university
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Check if slug already exists
    const existing = await prisma.university.findUnique({
      where: { slug: data.slug }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A university with this slug already exists' },
        { status: 400 }
      );
    }
    
    const university = await prisma.university.create({
      data: {
        name: data.name,
        slug: data.slug
      }
    });
    
    return NextResponse.json(university);
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}

