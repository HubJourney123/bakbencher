// src/app/admin/layout.js
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <nav className="flex space-x-6">
                <Link href="/admin" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link href="/admin/upload" className="hover:text-gray-300">
                  Upload Questions
                </Link>
                <Link href="/admin/manage" className="hover:text-gray-300">
                  Manage Questions
                </Link>
                <Link href="/" className="hover:text-gray-300">
                  View Site
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}