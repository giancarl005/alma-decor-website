import React from 'react';
import { ShieldCheckIcon, SparklesIcon, WrenchScrewdriverIcon, HandThumbUpIcon, CheckIcon } from './ui/Icon';

const uspData = [
  {
    icon: <ShieldCheckIcon className="w-12 h-12 text-brand-yellow mb-4" />,
    title: 'Calitate Premium',
    description: [
      'Materiale selectate de la branduri de top.',
      'Finisaje excepționale și durabilitate garantată.',
      'Produse care definesc standardele de excelență.',
    ],
  },
  {
    icon: <SparklesIcon className="w-12 h-12 text-brand-yellow mb-4" />,
    title: 'Consultanță Specializată',
    description: [
      'Soluții personalizate pentru viziunea ta.',
      'Sfaturi practice de la o echipă de experți.',
      'Asistență dedicată în fiecare etapă a proiectului.',
    ],
  },
  {
    icon: <WrenchScrewdriverIcon className="w-12 h-12 text-brand-yellow mb-4" />,
    title: 'Servicii Complete',
    description: [
      'Pachet complet: măsurători, transport, montaj.',
      'Echipe de montatori profesioniști.',
      'O experiență fără griji de la început până la sfârșit.',
    ],
  },
  {
    icon: <HandThumbUpIcon className="w-12 h-12 text-brand-yellow mb-4" />,
    title: 'Satisfacție Garantată',
    description: [
      'Dedicare totală pentru fiecare client în parte.',
      'Profesionalism și pasiune în tot ceea ce facem.',
      'Ne asigurăm că rezultatul final depășește așteptările.',
    ],
  },
];

const UspCard: React.FC<typeof uspData[0]> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center h-full">
    {icon}
    <h3 className="text-xl font-bold text-brand-dark dark:text-gray-100 mb-4">{title}</h3>
    <div className="text-gray-600 dark:text-gray-400 space-y-3 w-full">
      {description.map((item, index) => (
        <div key={index} className="flex items-start text-left">
          <CheckIcon className="w-5 h-5 text-brand-yellow mr-3 mt-1 flex-shrink-0" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const WhyChooseUs: React.FC = () => {
  return (
    <section id="de-ce-alma-decor" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">De ce Alma Decor?</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Ne diferențiem prin angajamentul nostru față de excelență, oferind nu doar produse, ci soluții complete care aduc valoare și frumusețe casei tale.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {uspData.map((item) => (
            <UspCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
