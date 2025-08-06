// src/app/[university]/[department]/[course]/[year]/page.js
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import QuestionAnswerDisplay from '@/components/QuestionAnswerDisplay';
import PrintButton from '@/components/PrintButton';

const prisma = new PrismaClient();

export default async function QuestionsPage({ params, searchParams }) {
  const { 
    university: universitySlug, 
    department: departmentSlug, 
    course: courseSlug,
    year 
  } = await params;
  
  const { type: examType } = await searchParams; // Await searchParams too

  // Fetch course with full hierarchy
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

  // Build query conditions
  const queryConditions = {
    courseId: course.id,
    year: parseInt(year)
  };

  if (examType) {
    queryConditions.examType = examType;
  }

  // Fetch questions with answers
  const questions = await prisma.question.findMany({
    where: queryConditions,
    include: {
      answer: true
    },
    orderBy: [
      { examType: 'asc' },
      { questionNo: 'asc' }
    ]
  });

  // Group questions by exam type
  const questionsByExamType = questions.reduce((acc, question) => {
    if (!acc[question.examType]) {
      acc[question.examType] = [];
    }
    acc[question.examType].push(question);
    return acc;
  }, {});

  // Calculate total marks
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb - Hide on print */}
          <div className="py-4 text-sm print:hidden">
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
              <Link href={`/${universitySlug}/${departmentSlug}/${courseSlug}`} className="hover:text-gray-700">
                {course.name}
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">{year}</span>
            </nav>
          </div>
          
          {/* Course Info */}
          <div className="pb-6 print:pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-lg font-semibold">
                    {course.code}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
                    {course.name}
                  </h1>
                </div>
                <p className="text-gray-600">
                  {course.department.university.name} • {course.department.name}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-gray-700">
                    Year: <strong>{year}</strong>
                  </span>
                  {examType && (
                    <span className="text-gray-700">
                      Type: <strong>{examType}</strong>
                    </span>
                  )}
                  <span className="text-gray-700">
                    Total Questions: <strong>{questions.length}</strong>
                  </span>
                  <span className="text-gray-700">
                    Total Marks: <strong>{totalMarks}</strong>
                  </span>
                </div>
              </div>
              
              {/* Print Button - Client Component */}
              <PrintButton />
            </div>
          </div>
        </div>
      </header>

      {/* Exam Type Filter - Hide on print */}
      {!examType && Object.keys(questionsByExamType).length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Filter by exam type:</span>
            {Object.keys(questionsByExamType).map((type) => (
              <Link
                key={type}
                href={`/${universitySlug}/${departmentSlug}/${courseSlug}/${year}?type=${type}`}
                className="bg-white px-3 py-1 rounded-full text-sm border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {type} ({questionsByExamType[type].length})
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Questions Display */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-4">
        {questions.length > 0 ? (
          <div className="space-y-8 print:space-y-6">
            {examType ? (
              // Show filtered questions
              questions.map((question, index) => (
                <QuestionAnswerDisplay
                  key={question.id}
                  question={question}
                  index={index + 1}
                />
              ))
            ) : (
              // Show questions grouped by exam type
              Object.entries(questionsByExamType).map(([type, typeQuestions]) => (
                <div key={type} className="print:break-before-page">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b print:text-xl">
                    {type} Exam - {year}
                  </h2>
                  <div className="space-y-6">
                    {typeQuestions.map((question, index) => (
                      <QuestionAnswerDisplay
                        key={question.id}
                        question={question}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No questions found for this selection.</p>
            <Link 
              href={`/${universitySlug}/${departmentSlug}/${courseSlug}`}
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              ← Back to year selection
            </Link>
          </div>
        )}
      </main>


    </div>
  );
}