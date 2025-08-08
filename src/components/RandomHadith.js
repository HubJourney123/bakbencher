// src/components/RandomHadith.js
'use client';

import { useState, useEffect } from 'react';
import { hadiths } from '@/data/hadiths';

export default function RandomHadith() {
  const [currentHadith, setCurrentHadith] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Get a random hadith
  const getRandomHadith = () => {
    const randomIndex = Math.floor(Math.random() * hadiths.length);
    return hadiths[randomIndex];
  };

  // Initialize with a random hadith
  useEffect(() => {
    setCurrentHadith(getRandomHadith());
    // Fade in effect
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Change hadith with animation
  const changeHadith = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentHadith(getRandomHadith());
      setIsVisible(true);
    }, 300);
  };

  if (!currentHadith) return null;

  return (
    <div className="relative bg-gradient-to-r from-slate-900/50 via-slate-900/50 to-slate-900/50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          {/* Header with icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {/* Islamic star icon */}
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.09 8.26L20.87 8.27L15.48 12.14L17.54 18.41L12 14.47L6.46 18.41L8.52 12.14L3.13 8.27L9.91 8.26L12 2Z"/>
              </svg>
              <h3 className="text-sm sm:text-base font-semibold text-purple-300 uppercase tracking-wider">
                আজকের হাদীস
              </h3>
            </div>
            
            {/* Refresh button */}
            <button
              onClick={changeHadith}
              className="group p-2 text-purple-400 hover:text-purple-300 transition-all duration-300"
              title="নতুন হাদীস দেখুন"
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-180 transition-transform duration-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Hadith content */}
          <div className="space-y-4">
            {/* Arabic text (optional - you can remove this if not needed) */}
            {/*{currentHadith.arabic && (
              //<p className="text-right text-lg sm:text-xl text-purple-200/70 leading-relaxed font-arabic" dir="rtl">
                //{currentHadith.arabic}
              //</p>
            //)}

            {/* Bangla translation */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed pl-6 font-bengali">
                "{currentHadith.bangla}"
              </p>
            </div>

            {/* Reference section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-3 border-t border-purple-500/20">
              {/* Narrator */}
              <div className="flex items-center space-x-2 text-purple-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">
                  বর্ণনাকারী: <span className="font-medium">{currentHadith.narrator}</span>
                </span>
              </div>

              {/* Source */}
              <div className="flex items-center space-x-2 text-purple-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-sm sm:text-base">
                  {currentHadith.source} - <span className="font-medium">{currentHadith.hadithNo}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient lines 
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>*/}
    </div>
  );
}