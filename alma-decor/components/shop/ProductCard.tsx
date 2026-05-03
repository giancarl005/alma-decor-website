import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    primary_image: string | null;
    badge: string | null;
    badge_text: string | null;
    category_name: string;
    avg_rating?: number;
    reviews_count?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [added, setAdded] = useState(false);
  const hasDiscount = product.sale_price !== null;
  const currentPrice = hasDiscount ? product.sale_price : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    showNotification('Produs adăugat în coș!', 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white dark:bg-white/[0.02] rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-transparent hover:border-gray-100 dark:hover:border-white/5 flex flex-col h-full">
      {/* Top Tags & Wishlist */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {product.reviews_count && product.reviews_count > 10 ? (
            <span className="bg-[#00a1e4] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase">Top Favorite</span>
          ) : product.badge === 'promo' ? (
             <span className="bg-[#f50015] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase">Promovat</span>
          ) : null}
        </div>
        <button className="p-1.5 bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-full text-gray-400 hover:text-rose-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Image Section */}
      <Link to={`/produs/${product.slug}`} className="relative aspect-[3/2] mb-4 overflow-hidden rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
        <img 
          src={product.primary_image || 'https://via.placeholder.com/400x500?text=Alma+Decor'} 
          alt={product.name}
          className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-grow">
        <Link to={`/produs/${product.slug}`} className="mb-2">
          <h3 className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-tight line-clamp-3 min-h-[3.75rem] group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4 min-h-[1rem]">
          {product.reviews_count && product.reviews_count > 0 ? (
            <>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-[10px] ${i < Math.round(product.avg_rating || 0) ? 'text-brand-yellow' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                ))}
              </div>
              <span className="text-[10px] text-gray-400">({product.reviews_count})</span>
            </>
          ) : null}
        </div>

        {/* Price & Cart Container */}
        <div className="mt-auto flex justify-between items-end">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] text-gray-400 line-through leading-none mb-1">PRP: {product.price} Lei</span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-[#f50015] leading-none">{currentPrice}</span>
              <span className="text-[11px] font-bold text-[#f50015]">Lei</span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                added ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600'
            }`}
          >
            {added ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
