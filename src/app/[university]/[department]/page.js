// src/app/[university]/[department]/page.js
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

// Course Card Component
const CourseCard = ({ course, universitySlug, departmentSlug }) => {
  return (
    <Link href={`/${universitySlug}/${departmentSlug}/${course.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {course.code}
              </span>
              {course._count.questions > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {course._count.questions} Questions
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {course.name}
            </h3>
            {course.credits && (
              <p className="text-sm text-gray-600 mt-1">
                Credits: {course.credits}
              </p>
            )}
          </div>
          <svg 
            className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all mt-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        {/* Question Stats */}
        {course.questionStats && course.questionStats.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Available Years:</p>
            <div className="flex flex-wrap gap-2">
              {course.questionStats.map((stat, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {stat.year}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default async function CoursesPage({ params }) {
  const { university: universitySlug, department: departmentSlug } = params;
  
  // Fetch department with university info
  const department = await prisma.department.findFirst({
    where: {
      slug: departmentSlug,
      university: {
        slug: universitySlug
      }
    },
    include: {
      university: true,
      courses: {
        include: {
          _count: {
            select: { questions: true }
          }
        },
        orderBy: {
          code: 'asc'
        }
      }
    }
  });

  if (!department) {
    notFound();
  }

  // Get question statistics for each course
  const coursesWithStats = await Promise.all(
    department.courses.map(async (course) => {
      const questionStats = await prisma.question.groupBy({
        by: ['year'],
        where: {
          courseId: course.id
        },
        _count: true,
        orderBy: {
          year: 'desc'
        }
      });
      
      return {
        ...course,
        questionStats
      };
    })
  );

  // Separate courses with and without questions
  const coursesWithQuestions = coursesWithStats.filter(c => c._count.questions > 0);
  const coursesWithoutQuestions = coursesWithStats.filter(c => c._count.questions === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-4 text-sm">
            <nav className="flex items-center space-x-2 text-gray-500">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span>/</span>
              <Link href={`/${universitySlug}`} className="hover:text-gray-700">
                {department.university.name}
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">{department.name}</span>
            </nav>
          </div>
          
          <div className="pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {department.name}
            </h1>
            <p className="mt-2 text-gray-600">
              {department.university.name}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {department.courses.length} Courses
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {coursesWithQuestions.length} with Questions
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Courses with Questions */}
        {coursesWithQuestions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-green-500 w-1 h-6 mr-3"></span>
              Courses with Questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesWithQuestions.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  universitySlug={universitySlug}
                  departmentSlug={departmentSlug}
                />
              ))}
            </div>
          </div>
        )}

        {/* Courses without Questions */}
        {coursesWithoutQuestions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-gray-400 w-1 h-6 mr-3"></span>
              Courses without Questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesWithoutQuestions.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  universitySlug={universitySlug}
                  departmentSlug={departmentSlug}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Courses Message */}
        {department.courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found in this department.</p>
            <Link 
              href={`/${universitySlug}`}
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              ← Back to departments
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}