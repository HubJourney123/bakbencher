// src/app/page.js
import { PrismaClient } from '@prisma/client';
import UniversityCard from '@/components/UniversityCard';
import NavigationHeader from '@/components/NavigationHeader';

const prisma = new PrismaClient();

// Function to get short form from university name
function getShortForm(name) {
  const shortForms = {
    "Khulna University of Engineering & Technology": "KUET",
    "Bangladesh University of Engineering & Technology": "BUET",
    "Chittagong University of Engineering & Technology": "CUET",
    "Rajshahi University of Engineering & Technology": "RUET",
    "University of Dhaka": "DU",
    "Jahangirnagar University": "JU",
    "University of Rajshahi": "RU",
    "University of Chittagong": "CU",
    "Shahjalal University of Science & Technology": "SUST",
    "Jashore University of Science & Technology": "JUST",
    "Pabna University of Science & Technology": "PUST",
    "Military Institute of Science & Technology": "MIST",
    "Islamic University": "IU",
    "International Islamic University Chittagong": "IIUC"
  };
  
  return shortForms[name] || name.split(' ').map(word => word[0]).join('');
}

export default async function HomePage() {
  // Fetch universities from database
  const universities = await prisma.university.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  // Add shortForm to each university
  const universitiesWithShortForm = universities.map(uni => ({
    ...uni,
    shortForm: getShortForm(uni.name)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Bangladesh University Question Bank
          </h1>
          <p className="mt-2 text-gray-600">
            Previous year questions and solutions from top universities
          </p>
        </div>
      </header>

      {/* Universities Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {universities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No universities found. Please run the seed script.</p>
            <p className="text-sm text-gray-400 mt-2">Run: npm run seed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {universitiesWithShortForm.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 University Question Bank. Educational purpose only.
          </p>
        </div>
      </footer>
    </div>
  );
}