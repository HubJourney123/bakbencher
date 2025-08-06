// src/app/[university]/page.js
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

// Department Card Component
const DepartmentCard = ({ department, universitySlug }) => {
  // Get short form from department name
  const getShortForm = (name) => {
    const shortForms = {
      "Computer Science & Engineering": "CSE",
      "Electrical & Electronic Engineering": "EEE",
      "Electronics & Communication Engineering": "ECE",
      "Electronics & Telecommunication Engineering": "ETE",
      "Civil Engineering": "CE",
      "Mechanical Engineering": "ME",
      "Chemical Engineering": "ChE",
      "Industrial Engineering & Management": "IEM",
      "Industrial & Production Engineering": "IPE",
      "Materials & Metallurgical Engineering": "MME",
      "Water Resources Engineering": "WRE",
      "Naval Architecture & Marine Engineering": "NAME",
      "Petroleum & Mining Engineering": "PME",
      "Glass & Ceramic Engineering": "GCE",
      "Urban & Regional Planning": "URP",
      "Building Engineering & Construction Management": "BECM",
      "Architecture": "Arch",
      "Mathematics": "Math",
      "Chemistry": "Chem",
      "Physics": "Phy",
      "Statistics": "Stat",
      "Environmental Sciences": "ES",
      "Applied Physics & Electronic Engineering": "APEE",
      "Theoretical Physics": "TP",
      "Civil & Environmental Engineering": "CEE",
      "Chemical Engineering & Polymer Science": "CEP",
      "Leather Engineering": "LE",
      "Textile Engineering": "TE"
    };
    
    return shortForms[name] || name.split(' ').map(word => word[0]).join('');
  };

  return (
    <Link href={`/${universitySlug}/${department.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {getShortForm(department.name)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {department.name}
            </p>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default async function DepartmentPage({ params }) {
  const { university: universitySlug } = await params;
  
  // Fetch university with departments from database
  const university = await prisma.university.findUnique({
    where: {
      slug: universitySlug
    },
    include: {
      departments: {
        orderBy: {
          name: 'asc'
        }
      }
    }
  });

  if (!university) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-4 text-sm">
            <nav className="flex items-center space-x-2 text-gray-500">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">{university.name}</span>
            </nav>
          </div>
          
          <div className="pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {university.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Select a department to view question papers
            </p>
          </div>
        </div>
      </header>

      {/* Departments Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {university.departments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No departments found for this university.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {university.departments.map((department) => (
              <DepartmentCard 
                key={department.id} 
                department={department} 
                universitySlug={universitySlug}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}