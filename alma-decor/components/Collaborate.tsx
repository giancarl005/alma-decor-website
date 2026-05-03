import React from 'react';
import { TagIcon, BriefcaseIcon, CubeIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from './ui/Icon';

const benefits = [
  {
    icon: <TagIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />,
    title: 'Prețuri Preferențiale',
    description: 'Beneficiază de discounturi speciale, create pentru a-ți oferi un avantaj competitiv pe piață.'
  },
  {
    icon: <BriefcaseIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />,
    title: 'Comisioane Atractive',
    description: 'Recompensăm colaborările de succes. Oferim un sistem de comisionare motivant pentru fiecare proiect.'
  },
  {
    icon: <CubeIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />,
    title: 'Acces la Portofoliu Premium',
    description: 'Impresionează-ți clienții cu selecția noastră vastă de produse de la branduri de top.'
  },
  {
    icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-brand-yellow flex-shrink-0" />,
    title: 'Suport Tehnic Dedicat',
    description: 'Echipa noastră îți stă la dispoziție cu mostre, consultanță tehnică și soluții rapide pentru proiectul tău.'
  }
];

const Collaborate: React.FC = () => {
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
    <section id="colaborare" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 items-center">
          {/* Image Column */}
          <div className="lg:col-span-5">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1920&auto=format,compress&fit=crop" 
              alt="Colaborare cu arhitecți și designeri la Alma Decor" 
              className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-square lg:aspect-[4/5]" 
              loading="lazy"
              width="448"
              height="560"
            />
          </div>
          {/* Text Content Column */}
          <div className="lg:col-span-6 text-left">
            <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Parteneriate de Succes - Colaborează cu Alma Decor</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Ești arhitect, designer de interior sau constructor și cauți un partener de încredere care să îți ofere acces la produse de excepție și condiții avantajoase? Alma Decor este soluția. Înțelegem exigențele profesioniștilor și am creat un program de parteneriat special pentru a-ți susține viziunea și a-ți maximiza succesul.
            </p>
            <div className="mt-8 space-y-5">
              {benefits.map(benefit => (
                <div key={benefit.title} className="flex items-start space-x-4">
                  {benefit.icon}
                  <div>
                    <h3 className="font-semibold text-lg text-brand-dark dark:text-gray-100">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a 
                href="#contact" 
                onClick={handleScrollToContact}
                className="group inline-flex items-center justify-center bg-brand-yellow text-gray-900 font-bold py-4 px-8 rounded-lg text-lg hover:bg-brand-yellow-dark transition-all duration-300"
              >
                Devino Partener
                <ArrowRightIcon className="w-6 h-6 ml-3 transform transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaborate;
