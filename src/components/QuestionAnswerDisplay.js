// src/components/QuestionAnswerDisplay.js
'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { useState } from 'react';

export default function QuestionAnswerDisplay({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(true); // Default to showing answers

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden question-container">
      {/* Question Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Question {question.questionNo || index}
            </h3>
            {question.examType && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {question.examType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {question.marks && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {question.marks} marks
              </span>
            )}
            {/* Toggle Answer Button - Hide on print */}
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="print:hidden text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full transition-colors"
            >
              {showAnswer ? 'Hide' : 'Show'} Answer
            </button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <div className="prose prose-lg max-w-none">
          <ContentRenderer content={question.content} />
        </div>
      </div>

      {/* Answer Section */}
      {question.answer && showAnswer && (
        <div className="border-t border-gray-200 bg-green-50 print:bg-white">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Answer
            </h4>
            
            <div className="prose prose-lg max-w-none">
              <ContentRenderer content={question.answer.content} />
            </div>

            {/* Attribution */}
            {(question.answer.source || question.answer.contributor) && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                {question.answer.source && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Source:</span> {question.answer.source}
                  </p>
                )}
                {question.answer.contributor && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Contributor:</span> {question.answer.contributor}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Content Renderer Component
function ContentRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // Custom code block renderer
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              style={tomorrow}
              PreTag="div"
              className="rounded-lg my-4 text-sm"
              showLineNumbers={true}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        // Custom image renderer
        img({ src, alt }) {
          return (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto"
              loading="lazy"
            />
          );
        },
        // Custom table renderer
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                {children}
              </table>
            </div>
          );
        },
        // Table headers
        th({ children }) {
          return (
            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
              {children}
            </th>
          );
        },
        // Table cells
        td({ children }) {
          return (
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-b">
              {children}
            </td>
          );
        },
        // Custom heading renderers for better styling
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>
        ),
        // Custom list styling
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 my-4 ml-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 my-4 ml-4">{children}</ol>
        ),
        // Blockquote styling
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}