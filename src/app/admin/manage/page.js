// src/app/admin/manage/page.js
'use client';

import { useState } from 'react';
import UniversityManager from '@/components/admin/UniversityManager';
import DepartmentManager from '@/components/admin/DepartmentManager';
import CourseManager from '@/components/admin/CourseManager';

export default function AdminManagePage() {
  const [activeTab, setActiveTab] = useState('universities');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Academic Structure</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('universities')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'universities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Universities
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'departments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Courses
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'universities' && <UniversityManager />}
          {activeTab === 'departments' && <DepartmentManager />}
          {activeTab === 'courses' && <CourseManager />}
        </div>
      </div>
    </div>
  );
}