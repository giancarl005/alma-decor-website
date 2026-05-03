import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  onOpenPolicy: (page: 'cookies') => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out transform animate-slide-up"
      role="dialog"
      aria-live="polite"
      aria-label="Notificare privind cookie-urile"
    >
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
          Acest site folosește cookie-uri pentru a vă asigura cea mai bună experiență de navigare. Prin continuarea navigării, sunteți de acord cu utilizarea acestora. Detalii în{' '}
          <button 
            onClick={() => onOpenPolicy('cookies')} 
            className="font-semibold text-brand-yellow hover:underline focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded"
          >
            Politica noastră Cookies
          </button>.
        </p>
        <div className="flex-shrink-0 flex items-center gap-3">
          <button 
            onClick={handleDecline} 
            className="px-4 py-2 text-sm font-bold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            Refuză
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2 text-sm font-bold bg-brand-yellow text-gray-900 rounded-lg hover:bg-brand-yellow-dark transition-colors duration-300"
          >
            Acceptă
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
