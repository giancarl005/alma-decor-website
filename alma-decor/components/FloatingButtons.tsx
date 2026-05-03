import React, { useState, useEffect } from 'react';
import { WhatsAppIcon, ArrowUpIcon } from './ui/Icon';

const FloatingButtons: React.FC = () => {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsScrollToTopVisible(true);
      } else {
        setIsScrollToTopVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-center space-y-3">
      {/* WhatsApp Button */}
      <div className="relative group">
        <a
          href="https://wa.me/+40770612470"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Scrie-ne pe WhatsApp"
          className="block transition-transform duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-full"
        >
          <div className="bg-[#25D366] group-hover:bg-yellow-400 transition-colors duration-300 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <WhatsAppIcon className="w-8 h-8 text-white" />
          </div>
        </a>
        <div className="absolute top-1/2 -translate-y-1/2 right-full mr-4 w-max bg-gray-800 text-white text-sm font-semibold py-2 px-3 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300 pointer-events-none">
          Scrie-ne pe WhatsApp
        </div>
      </div>


      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Go to top"
        className={`bg-brand-yellow text-gray-900 p-3 rounded-full shadow-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform ${
          isScrollToTopVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        disabled={!isScrollToTopVisible}
        style={{ pointerEvents: isScrollToTopVisible ? 'auto' : 'none' }}
      >
        <ArrowUpIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FloatingButtons;
