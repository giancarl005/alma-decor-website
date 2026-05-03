'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { API_BASE } from '@/lib/api';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    primary_image: string | null;
    badge?: string | null;
    category_name: string;
  };
}

const getFullUrl = (url: string | null) => {
  if (!url) return 'https://via.placeholder.com/400x500?text=Alma+Decor';
  if (url.startsWith('http')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${path}`;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const hasDiscount = product.sale_price !== null && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price);
  const currentPrice = hasDiscount ? product.sale_price : product.price;
  const discountPercent = hasDiscount ? Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white dark:bg-white/[0.02] rounded-xl p-2 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/10 flex flex-col h-full">
      {/* Image Section */}
      <Link href={`/produs/${product.slug}`} className="relative aspect-[3/2] mb-3 overflow-hidden rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 block">
        <img 
          src={getFullUrl(product.primary_image)} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          {hasDiscount && (
            <div className="relative group/badge">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-500 rounded-full blur opacity-25 group-hover/badge:opacity-50 transition duration-1000 group-hover/badge:duration-200"></div>
              <div className="relative bg-gradient-to-br from-rose-600 to-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-[5px] shadow-xl flex items-center gap-1.5 border border-white/20 backdrop-blur-sm transition-transform">
                <svg className="w-2.5 h-2.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="tracking-tighter">OFERTĂ -{discountPercent}%</span>
              </div>
            </div>
          )}
          {product.badge && (
            <div className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-[5px] shadow-md uppercase tracking-widest">
              {product.badge}
            </div>
          )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-grow">
        {/* Reviews Section - Real Data Only */}
        {Number((product as any).reviews_count) > 0 ? (
            <div className="flex items-center gap-1 mb-2">
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-[16px] ${i < Math.round(Number((product as any).avg_rating || 0)) ? 'text-brand-yellow' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                    ))}
                </div>
                <span className="text-[9px] font-bold text-gray-400">({(product as any).reviews_count})</span>
            </div>
        ) : (
            <div className="flex items-center gap-1 mb-2 h-[13px]">
                <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-tighter">Fără recenzii</span>
            </div>
        )}

        <Link href={`/produs/${product.slug}`} className="mb-2">
          <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 leading-tight line-clamp-2 min-h-[2.5rem] hover:text-brand-yellow transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-widest font-medium">
            {product.category_name}
        </p>

        {/* Price & Cart Container */}
        <div className="mt-auto flex justify-between items-end border-t border-gray-50 dark:border-white/5 pt-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400 line-through decoration-rose-500/30 leading-none mb-1">{product.price} RON</span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-gray-900 dark:text-brand-yellow leading-none">{currentPrice}</span>
              <span className="text-[10px] font-bold text-gray-900 dark:text-brand-yellow">RON</span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-[5px] flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                added ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 hover:scale-110'
            }`}
          >
            {added ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
