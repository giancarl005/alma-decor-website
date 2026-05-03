import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  name: string;
  slug: string;
  image: string;
  description: string;
}

const ProductCard: React.FC<Category> = ({ name, slug, image, description }) => (
  <Link to={`/magazin/${slug}`} className="group relative overflow-hidden rounded-lg shadow-lg aspect-[3/4] block">
    <img src={image || 'https://images.unsplash.com/photo-1581850518616-bcb8186c39ed?q=80&w=600&h=800&auto=format&fit=crop'} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-70"></div>
    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
      <h3 className="text-2xl font-bold h-16 flex items-end">{name}</h3>
      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
        <p className="mt-2 text-sm">{description}</p>
        <div className="text-brand-yellow font-semibold mt-4 inline-flex items-center">
          Vezi Produsele
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </div>
      </div>
    </div>
  </Link>
);

const Products: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categorii.php')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="produse" className="pt-36 pb-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Produsele Noastre</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Vă oferim o selecție premium de materiale pentru amenajări interioare și exterioare, de la parchet și tapet, la perdele, draperii și profile decorative.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat: any) => (
            <ProductCard key={cat.slug} name={cat.name} slug={cat.slug} image={cat.image} description={cat.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
