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
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationHeader />
      {/* Header */}
      <header className="relative bg-gradient-to-r from-gray-900 to-blue-950 shadow-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200 animate-pulse">
            bakbencher.com
          </h1>
          <p className="mt-3 text-lg text-blue-200 max-w-2xl">
            Previous year questions and solutions from top universities
          </p>
        </div>
      </header>

      {/* Universities Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {universities.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-blue-800/50">
            <p className="text-blue-300 text-lg">No universities found. Please run the seed script.</p>
            <p className="text-sm text-blue-400 mt-2">Run: npm run seed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {universitiesWithShortForm.map((university) => (
              <div key={university.id} className="transform hover:scale-105 transition-transform duration-300">
                <UniversityCard university={university} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-950/50 border-t border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-blue-300 text-sm">
            © 2024 bakbencher.com | Educational purpose only.
          </p>
        </div>
      </footer>
    </div>
  );
}