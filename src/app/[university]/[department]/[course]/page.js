// src/app/[university]/[department]/[course]/page.js
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

// Year Card Component
const YearCard = ({ year, examTypes, universitySlug, departmentSlug, courseSlug }) => {
  const totalQuestions = examTypes.reduce((sum, exam) => sum + exam._count._all, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{year}</h3>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {totalQuestions} Questions
        </span>
      </div>
      
      <div className="space-y-3">
        {examTypes.map((exam) => (
          <Link
            key={exam.examType}
            href={`/${universitySlug}/${departmentSlug}/${courseSlug}/${year}?type=${exam.examType}`}
          >
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
              <div>
                <span className="font-medium text-gray-800 group-hover:text-blue-600">
                  {exam.examType}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  ({exam._count._all} questions)
                </span>
              </div>
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
      
      {/* View All Questions for Year */}
      <Link
        href={`/${universitySlug}/${departmentSlug}/${courseSlug}/${year}`}
        className="mt-4 block text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        View All {year} Questions
      </Link>
    </div>
  );
};

export default async function YearSelectionPage({ params }) {
  const { university: universitySlug, department: departmentSlug, course: courseSlug } = params;
  
  // Fetch course with department and university info
  const course = await prisma.course.findFirst({
    where: {
      slug: courseSlug,
      department: {
        slug: departmentSlug,
        university: {
          slug: universitySlug
        }
      }
    },
    include: {
      department: {
        include: {
          university: true
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // Get all years and exam types with question counts
  const questionStats = await prisma.question.groupBy({
    by: ['year', 'examType'],
    where: {
      courseId: course.id
    },
    _count: {
      _all: true
    },
    orderBy: [
      { year: 'desc' },
      { examType: 'asc' }
    ]
  });

  // Group by year
  const yearGroups = questionStats.reduce((acc, stat) => {
    if (!acc[stat.year]) {
      acc[stat.year] = [];
    }
    acc[stat.year].push(stat);
    return acc;
  }, {});

  const years = Object.keys(yearGroups).sort((a, b) => b - a);

  // Get total question count
  const totalQuestions = await prisma.question.count({
    where: {
      courseId: course.id
    }
  });

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
                {course.department.university.name}
              </Link>
              <span>/</span>
              <Link href={`/${universitySlug}/${departmentSlug}`} className="hover:text-gray-700">
                {course.department.name}
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">{course.name}</span>
            </nav>
          </div>
          
          <div className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-lg font-semibold">
                {course.code}
              </span>
              {course.credits && (
                <span className="text-gray-600">
                  {course.credits} Credits
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {course.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Select a year to view question papers
            </p>
            {totalQuestions > 0 && (
              <div className="mt-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Total: {totalQuestions} Questions across {years.length} years
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Years Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {years.length > 0 ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Available Years</p>
                <p className="text-2xl font-bold text-gray-900">{years.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Latest Year</p>
                <p className="text-2xl font-bold text-gray-900">{years[0]}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">Oldest Year</p>
                <p className="text-2xl font-bold text-gray-900">{years[years.length - 1]}</p>
              </div>
            </div>

            {/* Year Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {years.map((year) => (
                <YearCard
                  key={year}
                  year={parseInt(year)}
                  examTypes={yearGroups[year]}
                  universitySlug={universitySlug}
                  departmentSlug={departmentSlug}
                  courseSlug={courseSlug}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No questions available for this course yet.</p>
            <Link 
              href={`/${universitySlug}/${departmentSlug}`}
              className="inline-block text-blue-600 hover:underline"
            >
              ← Back to courses
            </Link>
            {/* Admin Link */}
            <p className="mt-4 text-sm text-gray-400">
              Admin? <Link href="/admin/upload" className="text-blue-600 hover:underline">Upload questions</Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}