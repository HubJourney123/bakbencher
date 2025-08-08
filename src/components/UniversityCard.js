// src/components/UniversityCard.js
import Link from 'next/link';

const UniversityCard = ({ university }) => {
  return (
    <Link href={`/${university.slug}`}>
      <div className="
        relative overflow-hidden rounded-xl cursor-pointer
        bg-slate-800
        border-2 border-blue-900
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl
        group
        p-6
      ">
        {/* University short form - Large and bold */}
        <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tight mb-3 text-white">
          {university.shortForm}
        </h2>

        {/* University full name */}
        <p className="text-sm sm:text-base font-bold text-gray-200">
          {university.name}
        </p>
      </div>
    </Link>
  );
};

export default UniversityCard;