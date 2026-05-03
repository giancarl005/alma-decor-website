'use client';

import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[60] p-3.5 bg-brand-yellow text-gray-900 rounded-[5px] shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 border border-white/20 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
      aria-label="Înapoi sus"
    >
      <div className="absolute inset-0 bg-white/20 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 group-hover:-translate-y-1 transition-transform relative z-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
