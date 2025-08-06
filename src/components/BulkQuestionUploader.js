// src/components/BulkQuestionUploader.js
'use client';

import { useState, useEffect } from 'react';

export default function BulkQuestionUploader({ universities, selectedCourse }) {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(selectedCourse?.id || '');
  const [year, setYear] = useState(new Date().getFullYear());
  const [examType, setExamType] = useState('Final');
  
  const [uploadMethod, setUploadMethod] = useState('json'); // 'json' or 'file'
  const [jsonContent, setJsonContent] = useState('');
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  // Get departments for selected university
  const departments = selectedUniversity 
    ? universities.find(u => u.id === selectedUniversity)?.departments || []
    : [];

  // Get courses for selected department
  const courses = selectedDepartment
    ? departments.find(d => d.id === selectedDepartment)?.courses || []
    : [];

  // Set initial values if course is pre-selected
  useEffect(() => {
    if (selectedCourse) {
      setSelectedUniversity(selectedCourse.department.university.id);
      setSelectedDepartment(selectedCourse.department.id);
      setSelectedCourseId(selectedCourse.id);
    }
  }, [selectedCourse]);

  // Generate template JSON
  const generateTemplate = () => {
    const template = {
      courseId: selectedCourseId || "SELECT_A_COURSE_FIRST",
      year: year,
      examType: examType,
      questions: [
        {
          questionNo: 1,
          marks: 10,
          content: "## Question 1: [Title]\n\n[Question content here]\n\n```c\n// Code if needed\n```",
          answer: {
            content: "## Solution:\n\n[Answer content here]\n\n**Time Complexity:** $O(n)$",
            source: "Reference book or material",
            contributor: "Faculty name or contributor"
          }
        },
        {
          questionNo: 2,
          marks: 15,
          content: "## Question 2: [Title]\n\n[Question with equation]\n\n$$T(n) = 2T(n/2) + O(n)$$",
          answer: {
            content: "## Solution:\n\n[Step by step solution]",
            source: "Class lecture notes",
            contributor: "Professor name"
          }
        }
      ]
    };
    
    setJsonContent(JSON.stringify(template, null, 2));
  };

  // Download template as file
  const downloadTemplate = () => {
    const template = JSON.parse(jsonContent || '{}');
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${courses.find(c => c.id === selectedCourseId)?.code || 'template'}_${year}_${examType}.json`;
    a.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourseId) {
      setMessage('Please select a course');
      return;
    }

    setLoading(true);
    setMessage('');
    setErrors([]);

    try {
      let data;
      
      if (uploadMethod === 'json') {
        // Parse JSON content
        data = JSON.parse(jsonContent);
      } else {
        // Read file
        const fileContent = await file.text();
        data = JSON.parse(fileContent);
      }

      // Ensure courseId is set correctly
      if (data.courseId !== selectedCourseId) {
        data.courseId = selectedCourseId;
      }

      // If year and examType are provided at root level, apply to all questions
      if (data.year || data.examType) {
        data.questions = data.questions.map(q => ({
          ...q,
          year: q.year || data.year || year,
          examType: q.examType || data.examType || examType
        }));
      }

      // Prepare questions array with courseId
      const questions = data.questions.map(q => ({
        courseId: selectedCourseId,
        year: q.year || year,
        examType: q.examType || examType,
        questionNo: q.questionNo,
        marks: q.marks,
        content: q.content,
        answer: q.answer
      }));

      // Submit to API
      const response = await fetch('/api/questions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`Success! Uploaded ${result.created} questions.`);
        if (result.failed > 0) {
          setErrors(result.errors);
        }
        // Clear form
        setJsonContent('');
        setFile(null);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Course Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => {
              setSelectedUniversity(e.target.value);
              setSelectedDepartment('');
              setSelectedCourseId('');
            }}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select University</option>
            {universities.map(uni => (
              <option key={uni.id} value={uni.id}>{uni.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedCourseId('');
            }}
            className="w-full p-2 border rounded-md"
            required
            disabled={!selectedUniversity}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
            disabled={!selectedDepartment}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Year and Exam Type */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="2000"
            max={new Date().getFullYear() + 1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Final">Final</option>
            <option value="Mid">Mid Term</option>
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
            <option value="Lab">Lab</option>
          </select>
        </div>
      </div>

      {/* Upload Method Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setUploadMethod('json')}
          className={`px-4 py-2 rounded-md ${
            uploadMethod === 'json'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          JSON Editor
        </button>
        <button
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 rounded-md ${
            uploadMethod === 'file'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Upload File
        </button>
      </div>

      {/* Template Actions */}
      {selectedCourseId && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={generateTemplate}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Generate Template
          </button>
          {jsonContent && (
            <button
              onClick={downloadTemplate}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Download Template
            </button>
          )}
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md mb-4 ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <h4 className="text-red-800 font-medium mb-2">Errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>
                Question {error.questionNo || error.index}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit}>
        {uploadMethod === 'json' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Questions JSON
            </label>
            <textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="w-full p-3 border rounded-md font-mono text-sm"
              rows="20"
              placeholder="Paste your JSON here or click 'Generate Template' to start"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Format: Use Markdown for content, $...$ for inline math, $$...$$ for block math
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedCourseId}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Uploading...' : 'Upload Questions'}
        </button>
      </form>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Select the course first, then generate a template</li>
          <li>Each JSON should contain all questions for a specific course/year/exam</li>
          <li>Use Markdown formatting for content (headers, code blocks, etc.)</li>
          <li>For math equations: use $...$ for inline, $$...$$ for block equations</li>
          <li>Include images using Markdown: ![alt text](image-url)</li>
          <li>Always include source and contributor information for answers</li>
        </ul>
      </div>
    </div>
  );
}