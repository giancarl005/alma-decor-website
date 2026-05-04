import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import { API_BASE } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Blog - Sfaturi și Idei de Design Interior | Alma Decor',
  description: 'Descoperă ultimele tendințe în design interior, sfaturi practice de la specialiști și idei inspiraționale pentru amenajarea casei tale pe blogul Alma Decor.',
};

export const dynamic = 'force-dynamic';

import { query } from '@/lib/db';

async function getPosts() {
  try {
    const posts = await query<any[]>(
      `SELECT a.*, c.name as category 
       FROM articole_blog a
       LEFT JOIN categorii_blog c ON a.category_blog_id = c.id
       WHERE a.is_published = 1
       ORDER BY a.created_at DESC`
    );
    return posts || [];
  } catch (err) {
    console.error('DB blog posts error:', err);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  const getFullImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/800x500?text=Alma+Decor';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold italic serif tracking-tighter text-gray-900 dark:text-white mb-6">
            Jurnal de <span className="text-brand-yellow not-italic">Design</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            Inspiratie, noutati si sfaturi practice pentru transformarea locuintei tale intr-un acasa adevarat.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">În curând noi articole.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {posts.map((post: any) => (
              <article key={post.id} className="group relative bg-white dark:bg-white/[0.02] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-yellow/5 flex flex-col md:flex-row p-4 gap-6 md:gap-8">
                
                {/* Image Section (Left) */}
                <Link href={`/blog/${post.slug}`} className="block relative w-full md:w-2/5 aspect-[16/9] md:aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0">
                  <img 
                    src={getFullImageUrl(post.featured_image)} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Category Badge over image */}
                  <div className="absolute top-4 left-4 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {post.category || 'Design Interior'}
                  </div>
                </Link>
                
                {/* Content Section (Right) */}
                <div className="flex-1 flex flex-col justify-center py-2 md:pr-6">
                  {/* Meta: Date & Time */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{new Date(post.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span>Timp de citire {post.reading_time || 1} min</span>
                  </div>
                  
                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug mb-4 group-hover:text-brand-yellow transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  
                  {/* Excerpt */}
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 md:line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Read More Link */}
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-yellow hover:text-gray-900 dark:hover:text-white transition-colors mt-auto">
                    Citește Articolul <span className="text-lg leading-none">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
