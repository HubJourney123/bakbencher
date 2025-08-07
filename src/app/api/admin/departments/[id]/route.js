// src/app/api/admin/departments/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PUT update department
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const department = await prisma.department.update({
      where: { id },
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
    console.error('Error updating department:', error);
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    );
  }
}

// DELETE department
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.department.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    );
  }
}