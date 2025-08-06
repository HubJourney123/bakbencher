// src/app/admin/upload/simple/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleBulkUpload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle file selection
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Read and preview file content
    const text = await selectedFile.text();
    try {
      const json = JSON.parse(text);
      setPreview(JSON.stringify(json, null, 2));
    } catch (error) {
      setPreview('Invalid JSON file');
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      // Validate required fields
      if (!data.courseId || !data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid file format. Required: courseId and questions array');
      }

      // Process questions with answers
      const questions = data.questions.map(q => ({
        courseId: data.courseId,
        year: q.year || data.year,
        examType: q.examType || data.examType || 'Final',
        questionNo: q.questionNo,
        marks: q.marks,
        content: q.content,
        answer: q.answer
      }));

      // Upload to API
      const response = await fetch('/api/questions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully uploaded ${result.created} questions!`,
          details: result
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        details: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Download sample template
  const downloadTemplate = () => {
    const template = {
      courseId: "PASTE_YOUR_COURSE_ID_HERE",
      courseName: "Data Structures",
      courseCode: "CSE135",
      year: 2023,
      examType: "Final",
      questions: [
        {
          questionNo: 1,
          marks: 10,
          content: "## Question 1: [Title Here]\\n\\nWrite your question content here...\\n\\n```c\\n// Code block if needed\\n```",
          answer: {
            content: "## Solution:\\n\\nWrite the complete solution here...\\n\\n**Time Complexity:** $O(n)$",
            source: "Reference book, page number",
            contributor: "Faculty name"
          }
        },
        {
          questionNo: 2,
          marks: 15,
          content: "## Question 2: [Title]\\n\\nQuestion with math equation: $T(n) = 2T(n/2) + O(n)$",
          answer: {
            content: "## Solution:\\n\\nStep by step solution...",
            source: "Class lecture notes",
            contributor: "Professor name"
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.json';
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Bulk Upload Questions</h1>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Download the template JSON file</li>
            <li>Fill in your courseId (get from Prisma Studio)</li>
            <li>Add all questions with their answers</li>
            <li>Save as: <code className="bg-blue-100 px-1">CourseCode_Year_ExamType.json</code></li>
            <li>Upload the file</li>
          </ol>
        </div>

        {/* Template Download */}
        <div className="mb-6">
          <button
            onClick={downloadTemplate}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download Template
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {/* File Preview */}
        {preview && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">File Preview:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto max-h-96 text-sm">
              {preview}
            </pre>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white
            ${loading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Uploading...' : 'Upload Questions'}
        </button>

        {/* Result Display */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.message}
            </p>
            {result.details && result.success && (
              <div className="mt-2 text-sm text-green-700">
                <p>Created: {result.details.created} questions</p>
                {result.details.failed > 0 && (
                  <p>Failed: {result.details.failed} questions</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-medium mb-3">Quick Links:</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => window.open('/prisma-studio', '_blank')}
              className="text-blue-600 hover:underline"
            >
              Open Prisma Studio (Get Course IDs)
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="text-blue-600 hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Format Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium mb-3">Content Formatting Guide:</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <strong>Headers:</strong> <code>## Title</code></p>
            <p>• <strong>Code:</strong> <code>```c code here ```</code></p>
            <p>• <strong>Inline Math:</strong> <code>$O(n)$</code></p>
            <p>• <strong>Block Math:</strong> <code>$$T(n) = 2T(n/2) + O(n)$$</code></p>
            <p>• <strong>Images:</strong> <code>![alt text](image-url)</code></p>
            <p>• <strong>Bold:</strong> <code>**text**</code></p>
            <p>• <strong>Lists:</strong> Use <code>1.</code> or <code>-</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}