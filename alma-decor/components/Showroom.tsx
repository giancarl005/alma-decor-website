import React from 'react';
import { LocationMarkerIcon, ClockIcon, ArrowRightIcon } from './ui/Icon';

const Showroom: React.FC = () => {
    const handleScrollToContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const element = document.getElementById('contact');
        if (element) {
          const headerOffset = 90; // Match header's height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      };

  return (
    <section id="showroom" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-left">
            <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Vizitează Showroom-ul Nostru</h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Te invităm în spațiul nostru dedicat designului pentru a experimenta calitatea produselor noastre și pentru a te inspira. Atinge texturile, vezi culorile în lumina naturală și lasă-te ghidat de consultanții noștri pentru a găsi soluțiile perfecte pentru proiectul tău.
            </p>
            <div className="mt-8 space-y-5">
                <div className="flex items-start space-x-4">
                    <LocationMarkerIcon className="w-8 h-8 text-brand-yellow flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg text-brand-dark dark:text-gray-100">Adresă</h3>
                        <p className="text-gray-600 dark:text-gray-400">Strada 1 Decembrie 1918 13, Roșu, Ilfov</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <ClockIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg text-brand-dark dark:text-gray-100">Program</h3>
                        <p className="text-gray-600 dark:text-gray-400">Luni - Vineri: 09:00 - 18:00</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Sâmbătă & Duminică: Închis</p>
                    </div>
                </div>
            </div>
            <div className="mt-10">
              <a 
                href="#contact" 
                onClick={handleScrollToContact}
                className="group inline-flex items-center justify-center bg-brand-yellow text-gray-900 font-bold py-4 px-8 rounded-lg text-lg hover:bg-brand-yellow-dark transition-all duration-300"
              >
                Programează o Vizită
                <ArrowRightIcon className="w-6 h-6 ml-3 transform transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          {/* Image/Map Column */}
          <div className="relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-2xl">
             <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1920&auto=format,compress&fit=crop"
                alt="Showroom Alma Decor"
                className="w-full h-full object-cover"
                loading="lazy"
                width="1920"
                height="1080"
             />
             <div className="absolute inset-0 bg-black bg-opacity-20"></div>
             <a
                href="https://www.google.com/maps/place/Strada+1+Decembrie+1918+13,+Ro%C8%99u+077042"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 text-brand-dark dark:text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
             >
                Vezi pe Hartă <LocationMarkerIcon className="w-5 h-5 ml-2 text-brand-yellow" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showroom;
