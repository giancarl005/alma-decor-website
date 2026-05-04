'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { API_BASE } from '@/lib/api';

interface ProductGridClientProps {
  categorySlug?: string;
  initialLimit?: number;
}

const ProductGridClient: React.FC<ProductGridClientProps> = ({ 
  categorySlug,
  initialLimit = 30 
}) => {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentLimit = parseInt(searchParams.get('limit') || initialLimit.toString());
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use relative URL so it works on any domain (local or server)
        let url = `/api/produse.php?page=${currentPage}&limit=${currentLimit}&sort=${currentSort}`;
        if (categorySlug) url += `&categorie=${categorySlug}`;
        if (currentMinPrice) url += `&min_price=${currentMinPrice}`;
        if (currentMaxPrice) url += `&max_price=${currentMaxPrice}`;
        
        // On local dev, we might need the full URL if we're running on port 3000
        const finalUrl = `${API_BASE}${url}`;

        const res = await fetch(finalUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        if (data.status === 'success') {
          setProducts(data.data || []);
          setTotalCount(data.total_count || 0);
          setTotalPages(data.total_pages || 1);
        } else {
          throw new Error(data.message || 'Eroare necunoscută');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, currentPage, currentLimit, currentSort, currentMinPrice, currentMaxPrice]);

  const [pathName, setPathName] = useState('');

  useEffect(() => {
    setPathName(window.location.pathname);
  }, []);

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-500 font-medium">Eroare: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-brand-yellow font-bold uppercase tracking-widest text-[10px]"
        >
          Reîncearcă
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 dark:border-white/5 pb-4 gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Se afișează <span className="text-gray-900 dark:text-white">{products.length} din {totalCount} produse</span>
        </p>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sortează:</span>
            <select 
              className="bg-transparent text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none cursor-pointer"
              value={currentSort}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                params.set('sort', e.target.value);
                window.location.href = `${pathName}?${params.toString()}`;
              }}
            >
              <option value="newest">Noutăți</option>
              <option value="price_asc">Preț: Mic - Mare</option>
              <option value="price_desc">Preț: Mare - Mic</option>
            </select>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {products.map((product) => (
            <ProductCard key={`prod-${product.id}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-gray-400 font-medium">Nu am găsit produse.</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && pathName && (
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-center items-center gap-4">
          {currentPage > 1 && (
            <Link 
              href={`${pathName}?page=${currentPage - 1}&limit=${currentLimit}&sort=${currentSort}${currentMinPrice ? `&min_price=${currentMinPrice}` : ''}${currentMaxPrice ? `&max_price=${currentMaxPrice}` : ''}`}
              className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest hover:text-brand-yellow transition-colors"
            >
              Anterior
            </Link>
          )}
          
          <div className="flex items-center gap-4">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
               // Show pages around current
               let pageNum = currentPage - 2 + i;
               if (pageNum <= 0) pageNum = i + 1;
               if (pageNum > totalPages) return null;
               
               return (
                <Link
                  key={`page-${i}`}
                  href={`${pathName}?page=${pageNum}&limit=${currentLimit}&sort=${currentSort}${currentMinPrice ? `&min_price=${currentMinPrice}` : ''}${currentMaxPrice ? `&max_price=${currentMaxPrice}` : ''}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all ${currentPage === pageNum ? 'bg-brand-yellow text-gray-900' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  {pageNum}
                </Link>
               );
            })}
          </div>

          {currentPage < totalPages && (
            <Link 
              href={`${pathName}?page=${currentPage + 1}&limit=${currentLimit}&sort=${currentSort}${currentMinPrice ? `&min_price=${currentMinPrice}` : ''}${currentMaxPrice ? `&max_price=${currentMaxPrice}` : ''}`}
              className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest hover:text-brand-yellow transition-colors"
            >
              Următor
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default ProductGridClient;
