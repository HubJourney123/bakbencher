// src/app/api/questions/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET - Fetch questions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const year = searchParams.get('year');
    
    const where = {};
    if (courseId) where.courseId = courseId;
    if (year) where.year = parseInt(year);
    
    const questions = await prisma.question.findMany({
      where,
      include: {
        answer: true,
        course: true
      },
      orderBy: [
        { year: 'desc' },
        { examType: 'asc' },
        { questionNo: 'asc' }
      ]
    });
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST - Create single question
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.courseId || !data.year || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, year, content' },
        { status: 400 }
      );
    }
    
    const question = await prisma.question.create({
      data: {
        courseId: data.courseId,
        year: parseInt(data.year),
        examType: data.examType || 'Final',
        questionNo: data.questionNo ? parseInt(data.questionNo) : null,
        marks: data.marks ? parseInt(data.marks) : null,
        content: data.content,
        answer: data.answer ? {
          create: {
            content: data.answer.content || '',
            source: data.answer.source || null,
            contributor: data.answer.contributor || null
          }
        } : undefined
      },
      include: {
        answer: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      question 
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create question',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}