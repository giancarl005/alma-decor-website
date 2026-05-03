import React, { useState } from 'react';
import BlogCard from '../components/blog/BlogCard';

const MOCK_POSTS = [
  {
    id: 1,
    title: '5 Tendințe în Designul Interior pentru 2026',
    slug: 'tendinte-design-interior-2026',
    excerpt: 'Descoperă ce culori, materiale și stiluri vor domina locuințele noastre în anul ce vine. De la sustenabilitate la minimalism cald.',
    category: 'Sfaturi Design',
    date: '15 Aprilie 2026',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Cum alegi parchetul potrivit pentru încălzirea în pardoseală',
    slug: 'alegere-parchet-incalzire-pardoseala',
    excerpt: 'Ghid complet despre conductivitate termică, grosimi ideale și tipuri de lemn compatibile cu sistemele moderne de încălzire.',
    category: 'Ghiduri',
    date: '10 Aprilie 2026',
    image: 'https://images.unsplash.com/photo-1581850518616-bcb8186c39ed?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Profilele decorative: secretul unui finisaj de lux',
    slug: 'profile-decorative-finisaj-lux',
    excerpt: 'Învață cum să folosești plintele și brâurile decorative pentru a adăuga caracter și eleganță oricărei încăperi fără investiții majore.',
    category: 'Materiale',
    date: '05 Aprilie 2026',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Tapetul în 2026: Modele geometrice vs. Naturale',
    slug: 'tendinte-tapet-2026',
    excerpt: 'O analiză a celor mai populare modele de tapet din acest sezon. Ce alegem pentru un dormitor relaxant?',
    category: 'Materiale',
    date: '01 Aprilie 2026',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?q=80&w=2000&auto=format&fit=crop',
  },
];

const CATEGORIES = ['Toate', 'Sfaturi Design', 'Ghiduri', 'Materiale', 'Noutăți'];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Toate');

  const filteredPosts = activeCategory === 'Toate' 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
          BLOG<span className="text-brand-yellow">.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Inspirație, noutăți și sfaturi practice pentru amenajarea casei tale de la experții Alma Decor.
        </p>
      </div>

      {/* Categorii */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
              activeCategory === cat 
                ? 'bg-brand-yellow border-brand-yellow text-gray-900 shadow-lg shadow-yellow-500/20' 
                : 'bg-transparent border-gray-100 dark:border-gray-800 text-gray-500 hover:border-brand-yellow hover:text-brand-yellow'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Articole */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {filteredPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">Nu am găsit articole în această categorie.</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
