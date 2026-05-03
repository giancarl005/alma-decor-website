import React from 'react';

const partners = [
  { name: 'Transistor', logoUrl: 'https://tailwindui.com/img/logos/158x48/transistor-logo-gray-400.svg' },
  { name: 'Reform', logoUrl: 'https://tailwindui.com/img/logos/158x48/reform-logo-gray-400.svg' },
  { name: 'Tuple', logoUrl: 'https://tailwindui.com/img/logos/158x48/tuple-logo-gray-400.svg' },
  { name: 'Laravel', logoUrl: 'https://tailwindui.com/img/logos/158x48/laravel-logo-gray-400.svg' },
  { name: 'SavvyCal', logoUrl: 'https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-400.svg' },
  { name: 'Statamic', logoUrl: 'https://tailwindui.com/img/logos/158x48/statamic-logo-gray-400.svg' },
];

const Partners: React.FC = () => {
  return (
    <section id="parteneri" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Parteneri & Branduri de Top</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Colaborăm doar cu producători de renume pentru a garanta calitatea, durabilitatea și designul excepțional al fiecărui produs pe care îl oferim.
        </p>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 items-center">
          {partners.map((partner) => (
            <a href="#" key={partner.name} className="flex justify-center" title={`Partener: ${partner.name}`}>
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="max-h-12 w-auto filter grayscale hover:grayscale-0 dark:invert transition-all duration-300 ease-in-out"
                loading="lazy"
                width="158"
                height="48"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
