import Link from 'next/link';

const UniversityCard = ({ university }) => {
  // Define minimalistic color schemes for different universities
  const getColorScheme = (shortForm) => {
    const colorSchemes = {
      // Engineering Universities
      BUET: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      KUET: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      CUET: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      RUET: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      
      // General Universities
      DU: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-indigo-500',
      JU: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-indigo-500',
      RU: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-indigo-500',
      CU: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-indigo-500',
      
      // Science & Technology Universities
      SUST: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      JUST: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      PUST: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      MIST: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500',
      
      // Islamic Universities
      IU: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-indigo-500',
      IIUC: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-indigo-500',
      
      // Default
      default: 'bg-gray-800 border-gray-600 hover:bg-gray-900 hover:border-cyan-500'
    };
    
    return colorSchemes[shortForm] || colorSchemes.default;
  };

  return (
    <Link href={`/${university.slug}`}>
      <div className={`
        ${getColorScheme(university.shortForm)}
        relative overflow-hidden rounded-xl p-6 cursor-pointer
        border-2
        transition-all duration-300 ease-out
        shadow-md hover:shadow-lg hover:scale-105
        group
      `}>
        {/* Content */}
        <div className="relative z-10 text-white">
          <h2 className="text-6xl font-extrabold uppercase tracking-wider mb-2">
            {university.shortForm}
          </h2>
          <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
            {university.name}
          </p>
        </div>
        
        {/* Hover Effect Arrow */}
        <div className="absolute bottom-3 right-3 text-gray-400 group-hover:text-cyan-400 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        
        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient bg-[length:200%_200%]" />
      </div>
    </Link>
  );
};

export default UniversityCard;