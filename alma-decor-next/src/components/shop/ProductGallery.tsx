'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  discountPercent?: number;
}

const API_BASE = 'http://localhost/Alma%20Decor%20Website';

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, discountPercent }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setMousePos({ x, y });
  };

  const getFullUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  if (!images || images.length === 0) return (
    <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Nicio imagine</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image Container */}
      <div className="w-full">
        <div 
          className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/[0.02] cursor-zoom-in group border border-gray-100 dark:border-white/5"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img 
            src={getFullUrl(images[activeImage])} 
            alt="Product" 
            className={`w-full h-full object-contain p-4 transition-transform duration-500 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
            style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
          />
          
          {/* Discount Badge - Sparkle Ribbon Style */}
          {discountPercent && discountPercent > 0 && (
            <div className="absolute top-6 left-6 z-20 group/badge">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-600 to-orange-500 rounded-full blur opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-rose-600 to-rose-500 text-white text-[12px] font-black px-5 py-2 rounded-[5px] shadow-2xl flex items-center gap-2 border border-white/30 backdrop-blur-md transition-transform cursor-default">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="tracking-tighter">OFERTĂ LIMITATĂ -{discountPercent}%</span>
              </div>
            </div>
          )}

          {/* Zoom Overlay Hint */}
          {!isZoomed && (
            <div className="absolute bottom-6 right-6 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails - Horizontal below */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                activeImage === index ? 'border-brand-yellow shadow-lg scale-95' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={getFullUrl(img)} alt={`Thumbnail ${index}`} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
