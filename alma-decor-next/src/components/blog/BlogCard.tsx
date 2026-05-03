'use client';

import React from 'react';
import Link from 'next/link';

interface BlogCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="group relative flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden rounded-[2.5rem] mb-8 bg-gray-100 dark:bg-white/5">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        {/* Category Overlay */}
        <div className="absolute top-6 left-6">
          <span className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/20">
            {post.category}
          </span>
        </div>
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
      
      {/* Content */}
      <div className="flex flex-col flex-grow px-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-brand-yellow"></span>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
            {post.date}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`} className="block group/title">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 italic serif leading-[1.2] group-hover/title:text-brand-yellow transition-colors duration-300">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-4 text-[11px] font-black text-gray-900 dark:text-white group/btn tracking-[0.3em] uppercase"
          >
            <span>Citește articolul</span>
            <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover/btn:bg-brand-yellow group-hover/btn:border-brand-yellow group-hover/btn:text-gray-900 transition-all duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
