'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Group testimonials into pairs for desktop
  const pairs: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    pairs.push(testimonials.slice(i, i + 2));
  }

  const next = () => {
    setCurrentIndex((prev) => (prev >= pairs.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? pairs.length - 1 : prev - 1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-1 space-y-8">
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Recenzii</h2>
          <h3 className="text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">Ce Spun <br /> Clienții</h3>
        </div>
        <p className="text-gray-500 font-medium">Mândria noastră este satisfacția clienților noștri de peste două decenii.</p>
        <div className="flex gap-4">
          <button 
            onClick={prev}
            className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-brand-yellow hover:border-brand-yellow transition-all group shadow-sm active:scale-90"
          >
            <span className="text-xl group-hover:text-gray-900">←</span>
          </button>
          <button 
            onClick={next}
            className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-brand-yellow hover:border-brand-yellow transition-all group shadow-sm active:scale-90"
          >
            <span className="text-xl group-hover:text-gray-900">→</span>
          </button>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-2">
          {pairs.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-8 bg-brand-yellow' : 'w-2 bg-gray-200 dark:bg-white/10'}`} 
            />
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 overflow-hidden relative">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {pairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="min-w-full flex gap-8">
              {pair.map((t, i) => (
                <div key={i} className="w-full md:w-[calc(50%-1rem)] bg-gray-50 dark:bg-white/[0.02] p-10 rounded-[2rem] space-y-8 border border-gray-100 dark:border-white/5 hover:border-brand-yellow/30 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="text-brand-yellow text-4xl font-serif italic mb-4">"</div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium italic leading-relaxed line-clamp-5">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5 mt-auto">
                    <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full grayscale" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
