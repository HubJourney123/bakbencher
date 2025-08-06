// src/app/search/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuestionAnswerDisplay from '@/components/QuestionAnswerDisplay';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    university: '',
    department: '',
    course: '',
    year: '',
    examType: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    universities: [],
    departments: [],
    courses: [],
    years: [],
    examTypes: []
  });

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Search when query or filters change
  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [filters]);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch('/api/search/filters');
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim() && !Object.values(filters).some(f => f)) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {})
      });

      const response = await fetch(`/api/search?${params}`);
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
      course: '',
      year: '',
      examType: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Question Bank
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions, topics, or keywords..."
                  className="w-full px-4 py-2 pl-10 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                  className="absolute right-2 top-1.5 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
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
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <select
                    value={filters.university}
                    onChange={(e) => setFilters({...filters, university: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Universities</option>
                    {filterOptions.universities.map(uni => (
                      <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({...filters, department: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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

                {/* Course Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    value={filters.course}
                    onChange={(e) => setFilters({...filters, course: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    disabled={!filters.department}
                  >
                    <option value="">All Courses</option>
                    {filterOptions.courses
                      .filter(course => !filters.department || course.departmentId === filters.department)
                      .map(course => (
                        <option key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Years</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Exam Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={filters.examType}
                    onChange={(e) => setFilters({...filters, examType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Types</option>
                    {filterOptions.examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
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
                <p className="mt-2 text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} 
                  {query && ` for "${query}"`}
                </p>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={result.id}>
                      {/* Course Info Header */}
                      <div className="bg-gray-100 px-4 py-2 rounded-t-lg text-sm">
                        <Link 
                          href={`/${result.course.department.university.slug}/${result.course.department.slug}/${result.course.slug}/${result.year}`}
                          className="text-blue-600 hover:underline"
                        >
                          {result.course.department.university.name} → {result.course.department.name} → {result.course.code} - {result.course.name} ({result.year})
                        </Link>
                      </div>
                      <QuestionAnswerDisplay question={result} index={index + 1} />
                    </div>
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
                <p className="text-gray-500">No results found</p>
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
                <p className="text-gray-500">Enter a search term to find questions</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Wrap the component with Suspense
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
      <SearchContent />
    </Suspense>
  );
}