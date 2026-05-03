import React from 'react';
import { Link } from 'react-router-dom';

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
    <article className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-brand-yellow text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {post.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>
      
      <div className="p-8 flex flex-col flex-grow">
        <span className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-widest">
          {post.date}
        </span>
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-brand-yellow transition-colors leading-tight">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="mt-auto">
          <Link 
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white group/btn"
          >
            <span>CITEȘTE MAI MULT</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="h-0.5 w-0 bg-brand-yellow transition-all group-hover/btn:w-full mt-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
