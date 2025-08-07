// src/app/search/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CourseSearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    university: '',
    department: '',
    semester: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    universities: [],
    departments: [],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8]
  });

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Search when query or filters change
  useEffect(() => {
    if (query.trim() || Object.values(filters).some(f => f)) {
      performSearch();
    }
  }, [filters]);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch('/api/search/course-filters');
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {})
      });

      const response = await fetch(`/api/search/courses?${params}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const clearFilters = () => {
    setFilters({
      university: '',
      department: '',
      semester: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              <div>
                  <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    bakbencher
                  </span>
                  <span className="text-3xl font-bold text-gray-700">
                    .com
                  </span>
                </div>
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses by name or code (e.g., CSE101, Data Structures)..."
                  className="w-full px-4 py-2 pl-10 pr-16 border border-gray-900 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <svg 
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-purple-50 rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-4">
                {/* University Filter */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-1">
                    University
                  </label>
                  <select
                    value={filters.university}
                    onChange={(e) => setFilters({...filters, university: e.target.value, department: ''})}
                    className="w-full p-2 border border-gray-900 rounded-md text-sm"
                  >
                    <option value="">All Universities</option>
                    {filterOptions.universities.map(uni => (
                      <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-1">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({...filters, department: e.target.value})}
                    className="w-full p-2 border border-gray-900 rounded-md text-sm"
                    disabled={!filters.university}
                  >
                    <option value="">All Departments</option>
                    {filterOptions.departments
                      .filter(dept => !filters.university || dept.universityId === filters.university)
                      .map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                  </select>
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-1">
                    Semester
                  </label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({...filters, semester: e.target.value})}
                    className="w-full p-2 border border-gray-900 rounded-md text-sm"
                  >
                    <option value="">All Semesters</option>
                    {filterOptions.semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Search Results */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Searching courses...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Found {results.length} course{results.length !== 1 ? 's' : ''} 
                  {query && ` for "${query}"`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            ) : query || Object.values(filters).some(f => f) ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No courses found</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or filters</p>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500">Search for courses by name or code</p>
                <p className="text-sm text-gray-400 mt-1">Example: "CSE101" or "Data Structures"</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }) {
  const questionYears = [...new Set(course.questions.map(q => q.year))].sort((a, b) => b - a);
  const totalQuestions = course.questions.length;
  const examTypes = [...new Set(course.questions.map(q => q.examType))];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
      {/* University and Department */}
      <div className="text-sm text-gray-600 mb-2">
        <Link 
          href={`/${course.department.university.slug}`}
          className="hover:text-blue-600"
        >
          {course.department.university.name}
        </Link>
        <span className="mx-2">→</span>
        <Link 
          href={`/${course.department.university.slug}/${course.department.slug}`}
          className="hover:text-blue-600"
        >
          {course.department.name}
        </Link>
      </div>

      {/* Course Info */}
      <Link href={`/${course.department.university.slug}/${course.department.slug}/${course.slug}`}>
        <div className="cursor-pointer group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {course.code} - {course.name}
              </h3>
              {course.semester && (
                <p className="text-sm text-gray-600 mt-1">
                  Semester {course.semester} • {course.credits ? `${course.credits} Credits` : 'Credits N/A'}
                </p>
              )}
            </div>
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mt-1 transform group-hover:translate-x-1 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Question Stats */}
      {totalQuestions > 0 ? (
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              <span className="font-medium text-gray-900">{totalQuestions}</span> questions
            </span>
            <span className="text-gray-600">
              Years: {questionYears.slice(0, 3).join(', ')}
              {questionYears.length > 3 && '...'}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {examTypes.map(type => (
              <span key={type} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t pt-3 mt-3">
          <p className="text-sm text-gray-500">No questions uploaded yet</p>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense wrapper
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <CourseSearchContent />
    </Suspense>
  );
}