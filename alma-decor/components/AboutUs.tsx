import React from 'react';
import { CheckIcon, ArrowRightIcon } from './ui/Icon';

const AboutUs: React.FC = () => {

  const handleScrollToPortfolio = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.getElementById('portofoliu');
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
    <section id="despre-noi" className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6">
            <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">
              
              Pasiune pentru Design de Peste 20 de Ani
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              De peste două decenii, Alma Decor transformă casele în cămine și spațiile comerciale în experiențe memorabile. Fondată din pasiune pentru estetică și calitate, compania noastră a crescut constant, devenind un nume de referință în designul interior și exterior din România.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Misiunea noastră este simplă: să aducem frumusețea, funcționalitatea și durabilitatea în fiecare proiect, cu o atenție desăvârșită la detalii.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <CheckIcon className="w-6 h-6 text-brand-yellow mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300"><strong className="font-semibold text-brand-dark dark:text-gray-100">Peste 20 de Ani de Excelență:</strong> O tradiție îndelungată în a oferi soluții de design inovatoare și materiale de cea mai înaltă calitate.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-6 h-6 text-brand-yellow mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300"><strong className="font-semibold text-brand-dark dark:text-gray-100">Echipă de Experți:</strong> Designerii și consultanții noștri sunt dedicați viziunii tale, oferind consiliere personalizată.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-6 h-6 text-brand-yellow mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300"><strong className="font-semibold text-brand-dark dark:text-gray-100">Parteneriate de Top:</strong> Colaborăm cu cele mai renumite branduri pentru a-ți oferi acces la produse exclusiviste și durabile.</span>
              </li>
            </ul>
             <div className="mt-8">
              <a 
                href="#portofoliu"
                onClick={handleScrollToPortfolio}
                className="group inline-flex items-center justify-center bg-brand-yellow text-gray-900 font-bold py-4 px-8 rounded-lg text-lg hover:bg-brand-yellow-dark transition-all duration-300"
              >
                Vezi Proiectele Noastre
                <ArrowRightIcon className="w-6 h-6 ml-3 transform transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          {/* Image */}
          <div className="order-first lg:order-last lg:col-span-5 relative py-8 px-4">
            {/* Decorative background element */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg transform rotate-2"></div>
            
            {/* Image itself */}
            <div className="relative z-10">
                <img 
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1920&auto=format,compress&fit=crop" 
                alt="Interior elegant proiectat de Alma Decor" 
                className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-square lg:aspect-[4/5] max-h-[560px]" 
                loading="lazy"
                width="448"
                height="560"
                />
                {/* Experience Badge */}
                <div className="absolute bottom-4 right-4 bg-brand-yellow text-gray-900 text-sm font-bold py-3 px-5 rounded-lg shadow-lg transform -rotate-3 transition-transform hover:scale-105 hover:-rotate-2">
                  +20 Ani de Experiență
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
