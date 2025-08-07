// src/app/api/admin/universities/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PUT update university
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const university = await prisma.university.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug
      }
    });
    
    return NextResponse.json(university);
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

// DELETE university
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.university.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    );
  }
}