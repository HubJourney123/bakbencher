// src/components/admin/BulkCourseImport.js
'use client';

import { useState } from 'react';

export default function BulkCourseImport({ departments, onImportComplete }) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);

  const sampleCSV = `code,name,semester,credits
CSE101,Introduction to Programming,1,3
CSE102,Programming Lab,1,1.5
CSE103,Discrete Mathematics,1,3
CSE201,Data Structures,2,3
CSE202,Data Structures Lab,2,1.5
CSE203,Digital Logic Design,2,3
CSE301,Algorithms,3,3
CSE302,Algorithms Lab,3,1.5
CSE303,Database Management Systems,3,3
CSE401,Software Engineering,4,3`;

  const handleImport = async () => {
    if (!selectedDepartment || !csvText.trim()) {
      alert('Please select a department and provide CSV data');
      return;
    }

    setImporting(true);
    setResults(null);

    try {
      // Parse CSV
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      if (!headers.includes('code') || !headers.includes('name')) {
        alert('CSV must have "code" and "name" columns');
        setImporting(false);
        return;
      }

      const courses = lines.slice(1).map(line => {
        // Handle commas in quoted values
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
          ?.map(v => v.trim().replace(/^"|"$/g, '')) || [];
        
        const course = {};
        
        headers.forEach((header, index) => {
          if (header === 'semester') {
            // Convert semester format: "1-1" -> 1, "1-2" -> 2, etc.
            const semValue = values[index];
            if (semValue && semValue.includes('-')) {
              const [year, term] = semValue.split('-').map(Number);
              course[header] = (year - 1) * 2 + term;
            } else {
              course[header] = values[index] ? parseInt(values[index]) : null;
            }
          } else if (header === 'credits') {
            course[header] = values[index] ? parseFloat(values[index]) : null;
          } else {
            course[header] = values[index] || '';
          }
        });
        
        return {
          ...course,
          slug: course.code.toLowerCase().replace(/\s+/g, '-'),
          departmentId: selectedDepartment
        };
      });

      // Import courses
      const response = await fetch('/api/admin/courses/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses })
      });

      // Debug: Check response
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        console.error('Response was:', responseText);
        throw new Error('Server returned invalid JSON. Check console for details.');
      }

      setResults(result);
      
      if (result.created > 0) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Bulk Import Courses</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Department *
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.university?.name} - {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSV Data (code, name, semester, credits)
        </label>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
          rows="10"
          placeholder={sampleCSV}
        />
        <button
          type="button"
          onClick={() => setCsvText(sampleCSV)}
          className="mt-1 text-sm text-blue-600 hover:underline"
        >
          Use sample data
        </button>
      </div>

      <button
        onClick={handleImport}
        disabled={importing}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {importing ? 'Importing...' : 'Import Courses'}
      </button>

      {results && (
        <div className={`mt-4 p-3 rounded ${results.created > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p>Import complete: {results.created} courses created, {results.failed} failed</p>
          {results.errors && results.errors.length > 0 && (
            <ul className="mt-2 text-sm">
              {results.errors.map((error, index) => (
                <li key={index}>• {error.code}: {error.error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Add this API route: src/app/api/admin/courses/bulk/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { courses } = await request.json();
    
    const results = { created: 0, failed: 0, errors: [] };
    
    for (const courseData of courses) {
      try {
        // Check if course already exists
        const existing = await prisma.course.findFirst({
          where: {
            code: courseData.code,
            departmentId: courseData.departmentId
          }
        });
        
        if (existing) {
          results.failed++;
          results.errors.push({
            code: courseData.code,
            error: 'Course already exists'
          });
          continue;
        }
        
        await prisma.course.create({
          data: courseData
        });
        
        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          code: courseData.code,
          error: error.message
        });
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to import courses' },
      { status: 500 }
    );
  }
}