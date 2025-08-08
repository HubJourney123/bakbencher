// src/app/[university]/[department]/page.js
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

// Initialize Prisma Client properly
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Course Card Component with slate-900 theme
const CourseCard = ({ course, universitySlug, departmentSlug }) => {
  return (
    <Link href={`/${universitySlug}/${departmentSlug}/${course.slug}`}>
      <div className="bg-slate-800 rounded-xl hover:bg-slate-800 transition-all duration-300 p-6 cursor-pointer group border border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/30">
                {course.code}
              </span>
              {course._count?.questions > 0 && (
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-500/30">
                  {course._count.questions} Questions
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              {course.name}
            </h3>
            {course.credits && (
              <p className="text-sm text-purple-300/60 mt-2">
                Credits: {course.credits}
              </p>
            )}
          </div>
          <svg 
            className="w-5 h-5 text-purple-400/50 group-hover:text-purple-300 transform group-hover:translate-x-1 transition-all mt-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        {/* Question Stats */}
        {course.questionStats && course.questionStats.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <p className="text-xs text-purple-300/50 mb-2">Available Years:</p>
            <div className="flex flex-wrap gap-2">
              {course.questionStats.map((stat, index) => (
                <span 
                  key={index}
                  className="text-xs bg-slate-700 text-purple-100 px-2 py-1 rounded border border-purple-500/20"
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
  try {
    const { university: universitySlug, department: departmentSlug } = await params;
    
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
        try {
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
        } catch (error) {
          console.error(`Error fetching stats for course ${course.id}:`, error);
          return {
            ...course,
            questionStats: []
          };
        }
      })
    );

    // Separate courses with and without questions
    const coursesWithQuestions = coursesWithStats.filter(c => c._count?.questions > 0);
    const coursesWithoutQuestions = coursesWithStats.filter(c => !c._count?.questions || c._count.questions === 0);

    return (
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 shadow-lg border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="py-4 text-sm">
              <nav className="flex items-center space-x-2 text-purple-200/60">
                <Link href="/" className="hover:text-purple-200 transition-colors">Home</Link>
                <span className="text-purple-500/50">/</span>
                <Link href={`/${universitySlug}`} className="hover:text-purple-200 transition-colors">
                  {department.university.name}
                </Link>
                <span className="text-purple-100">/</span>
                <span className="text-purple-100 font-medium">{department.name}</span>
              </nav>
            </div>
            
            <div className="pb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-pink-100">
                {department.name}
              </h1>
              <p className="mt-2 text-purple-300/70">
                {department.university.name}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                  {department.courses.length} Courses
                </span>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">
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
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-b from-green-400 to-green-600 w-1 h-6 mr-3 rounded-full"></span>
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
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-b from-gray-400 to-gray-600 w-1 h-6 mr-3 rounded-full"></span>
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
            <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-purple-500/20">
              <svg className="w-16 h-16 mx-auto text-purple-400/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-purple-300/70 text-lg">No courses found in this department.</p>
              <Link 
                href={`/${universitySlug}`}
                className="mt-4 inline-block text-purple-400 hover:text-purple-300 transition-colors"
              >
                ← Back to departments
              </Link>
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in CoursesPage:', error);
    
    // Return a fallback UI if database connection fails
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-purple-500/20 max-w-md">
          <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Database Connection Error</h2>
          <p className="text-purple-300/70 mb-4">Unable to connect to the database. Please check your connection settings.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
}