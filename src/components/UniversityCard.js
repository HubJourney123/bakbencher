// src/components/UniversityCard.js
import Link from 'next/link';

const UniversityCard = ({ university }) => {
  // Define color schemes for different universities
  const getColorScheme = (shortForm) => {
    const colorSchemes = {
      // Engineering Universities
      BUET: 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800',
      KUET: 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
      CUET: 'bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800',
      RUET: 'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800',
      
      // General Universities
      DU: 'bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800',
      JU: 'bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800',
      RU: 'bg-gradient-to-br from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800',
      CU: 'bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800',
      
      // Science & Technology Universities
      SUST: 'bg-gradient-to-br from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800',
      JUST: 'bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800',
      PUST: 'bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800',
      MIST: 'bg-gradient-to-br from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800',
      
      // Islamic Universities
      IU: 'bg-gradient-to-br from-lime-500 to-lime-700 hover:from-lime-600 hover:to-lime-800',
      IIUC: 'bg-gradient-to-br from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800',
      
      // Default
      default: 'bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800'
    };
    
    return colorSchemes[shortForm] || colorSchemes.default;
  };

  return (
    <Link href={`/${university.slug}`}>
      <div className={`
        ${getColorScheme(university.shortForm)}
        relative overflow-hidden rounded-2xl p-8 cursor-pointer
        transform transition-all duration-300 hover:scale-105
        shadow-lg hover:shadow-2xl
        group
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-bold mb-2 tracking-wider">
            {university.shortForm}
          </h2>
          <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
            {university.name}
          </p>
        </div>
        
        {/* Hover Effect Arrow */}
        <div className="absolute bottom-4 right-4 text-white/70 group-hover:text-white transform translate-x-0 group-hover:translate-x-2 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;