import React from 'react';

const portfolioItems = [
  {
    category: 'Apartament Modern',
    title: 'Living Spațios și Luminos',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Stil Scandinav',
    title: 'Bucătărie Minimalistă',
    image: 'https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Design Industrial',
    title: 'Birou Acasă Funcțional',
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Amenajare Terasă',
    title: 'Oază de Relaxare Exterioară',
    image: 'https://images.pexels.com/photos/220769/pexels-photo-220769.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Clasic Contemporan',
    title: 'Dormitor Elegant',
    image: 'https://images.pexels.com/photos/376531/pexels-photo-376531.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
  {
    category: 'Spațiu Comercial',
    title: 'Cafenea Primitoare',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress,format&cs=tinysrgb&w=800&h=600&dpr=1',
  },
];

const Portfolio: React.FC = () => {
  return (
    <section id="portofoliu" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Portofoliu de Proiecte</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Descoperă o selecție a lucrărilor noastre de referință. Fiecare proiect reflectă pasiunea noastră pentru design și atenția la detalii, transformând viziunile clienților în realitate.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-[4/3]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                loading="lazy"
                width="800"
                height="600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white text-left">
                <p className="text-sm font-semibold uppercase text-brand-yellow tracking-wider">{item.category}</p>
                <h3 className="text-2xl font-bold mt-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
