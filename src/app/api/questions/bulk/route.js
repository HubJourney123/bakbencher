// src/app/api/questions/bulk/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Log the incoming request
    console.log('Bulk upload API called');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { questions } = body;
    
    // Validate input
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Expected an array of questions in the request body' },
        { status: 400 }
      );
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions array is empty' },
        { status: 400 }
      );
    }

    console.log(`Processing ${questions.length} questions`);

    const results = [];
    const errors = [];
    
    // Process each question
    for (const [index, questionData] of questions.entries()) {
      try {
        // Validate required fields
        if (!questionData.courseId) {
          throw new Error('courseId is required');
        }
        if (!questionData.year) {
          throw new Error('year is required');
        }
        if (!questionData.content) {
          throw new Error('content is required');
        }

        // Create question with answer
        const question = await prisma.question.create({
          data: {
            courseId: questionData.courseId,
            year: parseInt(questionData.year),
            examType: questionData.examType || 'Final',
            questionNo: questionData.questionNo || (index + 1),
            marks: questionData.marks ? parseInt(questionData.marks) : null,
            content: questionData.content,
            answer: questionData.answer ? {
              create: {
                content: questionData.answer.content || '',
                source: questionData.answer.source || null,
                contributor: questionData.answer.contributor || null
              }
            } : undefined
          },
          include: {
            answer: true
          }
        });
        
        results.push(question);
        console.log(`Created question ${question.questionNo}`);
      } catch (error) {
        console.error(`Error creating question ${index + 1}:`, error);
        errors.push({
          index: index + 1,
          questionNo: questionData.questionNo || index + 1,
          error: error.message
        });
      }
    }
    
    console.log(`Bulk upload complete: ${results.length} created, ${errors.length} failed`);
    
    return NextResponse.json({
      success: true,
      created: results.length,
      failed: errors.length,
      results: results,
      errors: errors
    });
    
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process bulk upload',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Also handle OPTIONS for CORS if needed
export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200 });
}