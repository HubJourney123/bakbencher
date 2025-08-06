// src/app/admin/page.js
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // Get statistics
  const stats = await Promise.all([
    prisma.university.count(),
    prisma.department.count(),
    prisma.course.count(),
    prisma.question.count(),
  ]);

  const [universitiesCount, departmentsCount, coursesCount, questionsCount] = stats;

  // Get recent questions
  const recentQuestions = await prisma.question.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      course: {
        include: {
          department: {
            include: {
              university: true
            }
          }
        }
      }
    }
  });

  // Get courses with question counts
  const coursesWithCounts = await prisma.course.findMany({
    include: {
      _count: {
        select: { questions: true }
      },
      department: {
        include: {
          university: true
        }
      }
    },
    orderBy: {
      questions: {
        _count: 'desc'
      }
    },
    take: 10
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Universities</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{universitiesCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Departments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{departmentsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Courses</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{coursesCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Questions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{questionsCount}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link href="/admin/upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upload Questions
          </Link>
          <Link href="/admin/manage" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Manage Questions
          </Link>
        </div>
      </div>

      {/* Courses with Question Counts */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Courses Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coursesWithCounts.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.department.university.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.department.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.code} - {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course._count.questions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      href={`/admin/upload?courseId=${course.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Add Questions
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>
        <div className="space-y-4">
          {recentQuestions.map((question) => (
            <div key={question.id} className="border-b pb-4">
              <p className="text-sm text-gray-600">
                {question.course.department.university.name} → {question.course.department.name} → {question.course.code}
              </p>
              <p className="text-sm">
                Year: {question.year} | Type: {question.examType} | Question #{question.questionNo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}