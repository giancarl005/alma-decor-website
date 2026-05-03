import React from 'react';
import { ChatBubbleLeftRightIcon, WrenchScrewdriverIcon, ClipboardDocumentListIcon, SwatchIcon, DocumentTextIcon, ArrowRightIcon } from './ui/Icon';

const processSteps = [
  {
    icon: <ChatBubbleLeftRightIcon className="w-12 h-12 text-brand-dark dark:text-gray-100" />,
    title: 'Consultanță',
    description: 'Discutăm viziunea, nevoile și bugetul tău pentru a stabili direcția proiectului.',
  },
  {
    icon: <ClipboardDocumentListIcon className="w-12 h-12 text-brand-dark dark:text-gray-100" />,
    title: 'Planificare',
    description: 'Realizăm măsurători precise și creăm un plan detaliat al spațiului.',
  },
  {
    icon: <SwatchIcon className="w-12 h-12 text-brand-dark dark:text-gray-100" />,
    title: 'Selecție\u00A0Produse',
    description: 'Te ghidăm în showroom pentru a alege materialele și finisajele perfecte.',
  },
  {
    icon: <DocumentTextIcon className="w-12 h-12 text-brand-dark dark:text-gray-100" />,
    title: 'Ofertare',
    description: 'Îți prezentăm o ofertă de preț transparentă, completă și fără costuri ascunse.',
  },
  {
    icon: <WrenchScrewdriverIcon className="w-12 h-12 text-brand-dark dark:text-gray-100" />,
    title: 'Montaj',
    description: 'Echipa noastră de profesioniști instalează totul impecabil, cu atenție la detalii.',
  },
];


const Process: React.FC = () => {
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
    <section id="procesul-nostru" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Procesul Nostru</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Am creat un flux de lucru transparent și eficient, pentru o experiență relaxantă de la idee la realitate.
        </p>
        
        <div className="mt-16 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-gray-300 dark:bg-gray-700"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-8 relative">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-900 rounded-full border-4 border-brand-yellow shadow-lg">
                  {step.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-brand-dark dark:text-gray-100">{`Pasul\u00A0${index + 1}:\u00A0${step.title}`}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <a 
            href="#contact" 
            onClick={handleScrollToContact}
            className="group inline-flex items-center justify-center bg-brand-yellow text-gray-900 font-bold py-4 px-8 rounded-lg text-lg hover:bg-brand-yellow-dark transition-all duration-300"
          >
            Începe Proiectul Tău
            <ArrowRightIcon className="w-6 h-6 ml-3 transform transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Process;
