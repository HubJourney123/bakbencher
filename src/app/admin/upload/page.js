// src/app/admin/upload/page.js
import BulkQuestionUploader from '@/components/BulkQuestionUploader';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function UploadPage({ searchParams }) {
  const { courseId } = await searchParams;

  // Get all universities with departments and courses
  const universities = await prisma.university.findMany({
    include: {
      departments: {
        include: {
          courses: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  // If courseId is provided, get that specific course
  let selectedCourse = null;
  if (courseId) {
    selectedCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        department: {
          include: {
            university: true
          }
        }
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bulk Upload Questions</h1>
      
      <BulkQuestionUploader 
        universities={universities}
        selectedCourse={selectedCourse}
      />
    </div>
  );
}