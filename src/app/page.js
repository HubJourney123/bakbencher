import { PrismaClient } from '@prisma/client';
import UniversityCard from '@/components/UniversityCard';
import NavigationHeader from '@/components/NavigationHeader';
import RandomHadith from '@/components/RandomHadith';

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
    <div className="min-h-screen bg-slate-900">
      <NavigationHeader />
      
      {/* Compact Header with gradient overlay */}
      <header className="relative">
        {/* Subtle gradient overlay */}
       {/* <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-purple-900/10 to-transparent"></div> */}

        <div className="relative">
          {/* Compact header content */}
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-4">
            <div className="text-center">
              {/* Main heading only 
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-red-700">
                bakbencher.com
              </h1>*/}
              
              {/* Simplified description 
              <p className="mt-4 text-base sm:text-lg text-purple-200/70 max-w-2xl mx-auto">
                Previous year questions and solutions from top universities
              </p>*/}
            </div>
          </div>

          {/* Hadith Component */}
          <RandomHadith />
        </div>
      </header>

      {/* Universities Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">
              Select Your University
            </h2>
            {/*<p className="text-purple-400/60 text-sm sm:text-base">
              Choose from Bangladesh's premier educational institutions
            </p>*/}
          </div>

          {universities.length === 0 ? (
            <div className="relative">
              <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-purple-500/20">
                <svg className="w-12 h-12 mx-auto text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-purple-300 text-lg font-medium mb-2">No universities found</p>
                <p className="text-purple-400/60 text-sm">Please run the seed script to populate data</p>
                <code className="inline-block mt-3 px-4 py-2 bg-slate-800/50 text-purple-300 rounded-lg font-mono text-sm">
                  npm run seed
                </code>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {universitiesWithShortForm.map((university, index) => (
                <div 
                  key={university.id} 
                  className="transform hover:scale-105 transition-all duration-300 hover:z-10"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <UniversityCard university={university} />
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          {universities.length > 0 && (
            <div className="mt-16 text-center">
              <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
                <a 
                  href="/search" 
                  className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  <span className="flex items-center">
                    Browse All Questions
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                <span className="text-purple-400/60 text-sm">or</span>
                <a 
                  href="/admin" 
                  className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm text-purple-300 font-semibold rounded-full border border-purple-500/30 hover:bg-slate-800/70 hover:border-purple-400 transition-all duration-300"
                >
                  Contribute Questions
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="relative mt-16 border-t border-purple-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-purple-400 font-semibold mb-2 text-lg">About</h3>
              <p className="text-purple-300/50 text-sm leading-relaxed">
                bakbencher.com helps students excel by providing access to previous year questions.
              </p>
            </div>
            <div>
              <h3 className="text-purple-400 font-semibold mb-2 text-lg">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/search" className="text-purple-300/50 hover:text-purple-300 transition-colors">Question Bank</a></li>
                <li><a href="/admin" className="text-purple-300/50 hover:text-purple-300 transition-colors">Admin Panel</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-400 font-semibold mb-2 text-lg">Connect</h3>
              <div className="flex space-x-3">
                <a href="#" className="text-purple-300/50 hover:text-purple-300 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-purple-300/50 hover:text-purple-300 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-purple-800/20">
            <p className="text-center text-purple-400/40 text-sm">
              © 2025 bakbencher.com | Educational purpose only
            </p>
          </div>
        </div>
      </footer>

      
    </div>
  );
}