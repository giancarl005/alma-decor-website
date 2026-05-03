'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import ProductGallery from './ProductGallery';
import VariationPicker from './VariationPicker';
import ProductTabs from './ProductTabs';
import ProductCard from './ProductCard';
import ProductReviews from './ProductReviews';

interface ProductDetailsClientProps {
  product: any;
  similarProducts: any[];
}

const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({ product, similarProducts }) => {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasDiscount = product.sale_price !== null && Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price);
  const discountPercent = hasDiscount ? Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100) : 0;
  const safeImages = [product.primary_image, ...(product.gallery || [])].filter(Boolean);
  const safeVariations = Array.isArray(product?.variations) ? product.variations : [];

  const handleAddToCart = () => {
    const variation = safeVariations.find((v: any) => v.id === selectedVariation);
    addToCart(product, quantity, selectedVariation, variation?.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    { 
      id: 'desc', 
      label: 'Descriere', 
      content: product?.description ? (
        <div 
          className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-light prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />
      ) : (
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-light">Nicio descriere disponibilă.</p>
      )
    },
    { 
      id: 'specs', 
      label: 'Specificații', 
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
          {(product?.specs && product.specs.length > 0) ? product.specs.map((spec: any, i: number) => (
            spec.value === 'GROUP_HEADER' ? (
              <div key={i} className="col-span-1 md:col-span-2 pt-8 pb-4 border-b-2 border-gray-900/5 dark:border-white/5 mb-2">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white italic serif">{spec.label}</h3>
              </div>
            ) : (
              <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/[0.03]">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">{spec.label}</span>
                <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">{spec.value}</span>
              </div>
            )
          )) : <p className="text-gray-400 py-8 text-center col-span-2">Nu sunt specificații disponibile.</p>}
        </div>
      )
    },
    { 
      id: 'reviews', 
      label: 'Recenzii', 
      content: <ProductReviews productId={product.id} /> 
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1115]">
      {/* Product Content Wrapper */}
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs - SIMPLIFIED */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
           {product.parent_category_name ? (
             <>
               <Link href={`/magazin/${product.parent_category_slug}`} className="hover:text-gray-900 dark:hover:text-brand-yellow transition-colors">
                {product.parent_category_name}
               </Link>
               <span className="text-gray-300">/</span>
               <Link href={`/magazin/${product.category_slug}`} className="hover:text-gray-900 dark:hover:text-brand-yellow transition-colors">
                {product.category_name}
               </Link>
             </>
           ) : (
             <Link href={`/magazin/${product.category_slug}`} className="hover:text-gray-900 dark:hover:text-brand-yellow transition-colors">
              {product.category_name}
             </Link>
           )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start mb-8">
          {/* Gallery */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
            <ProductGallery images={safeImages} discountPercent={discountPercent} />
          </div>

          {/* Details */}
          <div className="w-full lg:w-[65%] flex flex-col space-y-8">
            <div className="space-y-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.reviews_count > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < Math.round(product.avg_rating) ? 'text-brand-yellow' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" onClick={() => document.getElementById('tab-reviews')?.click()}>
                    ({product.reviews_count} recenzii)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 pt-1">
                {hasDiscount && (
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through tabular-nums font-medium decoration-rose-500/50">
                        {product.price} RON
                    </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-brand-yellow tracking-tighter">
                    {hasDiscount ? product.sale_price : product.price}
                  </span>
                  <span className="text-sm font-bold text-gray-400">RON</span>
                </div>
              </div>

              <div className="h-px w-16 bg-brand-yellow/30 mt-4" />
            </div>

            {/* Variations */}
            <div className="space-y-6">
              {safeVariations.length > 0 && (
                <VariationPicker 
                  label="Opțiuni Personalizate" 
                  variations={safeVariations} 
                  selectedId={selectedVariation}
                  onSelect={setSelectedVariation}
                />
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col lg:flex-row gap-3 items-stretch">
                {/* Mobile Row 1 / Desktop part of row */}
                <div className="flex flex-row gap-3 lg:contents">
                {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-white dark:bg-white/5 rounded-[5px] p-1 border border-gray-100 dark:border-white/10 shadow-sm w-[130px] lg:w-[140px] h-12">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-xl font-light text-gray-400 hover:text-brand-yellow dark:hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-lg text-gray-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-xl font-light text-gray-400 hover:text-brand-yellow dark:hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                
                {/* Action Buttons */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={safeVariations.length > 0 && !selectedVariation}
                    className={`flex-1 lg:flex-[1.5] h-12 rounded-[5px] font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                      added 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {added ? 'ADĂUGAT ✓' : 'ADĂUGĂ ÎN COȘ'}
                  </button>
                </div>

                <a 
                  href={`https://wa.me/40770612470?text=${encodeURIComponent(`Bună ziua! Doresc detalii despre produsul: ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-[5px] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.1em] shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-95 group lg:flex-1"
                >
                  <svg className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  CERE DETALII
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Disponibilitate</span>
                  {(() => {
                    const status = product?.stock_status || 'in_stoc';
                    let label = 'În Stoc';
                    let color = 'text-emerald-500';
                    let dotColor = 'bg-emerald-500';

                    if (status === 'stoc_online' || status === 'in_stoc') {
                      label = status === 'in_stoc' ? 'În Stoc' : 'Stoc Online (3-5 zile)';
                      color = 'text-emerald-600 dark:text-emerald-400';
                      dotColor = 'bg-emerald-600';
                    } else if (status === 'stoc_epuizat') {
                      label = 'Stoc Epuizat';
                      color = 'text-rose-600 dark:text-rose-400';
                      dotColor = 'bg-rose-600';
                    } else if (status === 'precomanda') {
                      label = 'Precomandă';
                      color = 'text-amber-600 dark:text-amber-400';
                      dotColor = 'bg-amber-600';
                    }

                    return (
                      <span className={`text-[10px] ${color} font-bold flex items-center gap-2 uppercase tracking-wider`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
                        {label}
                      </span>
                    );
                  })()}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Brand Autorizat</span>
                  <span className="text-[10px] text-gray-900 dark:text-gray-100 font-bold uppercase tracking-wider">{product?.brand || 'Alma Decor'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Categorie</span>
                  <span className="text-[10px] text-gray-900 dark:text-gray-100 font-bold uppercase tracking-wider">{product.category_name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Cod Produs</span>
                  <span className="text-[10px] text-gray-900 dark:text-gray-100 font-bold uppercase tracking-wider">{product?.sku || 'AD-'+product?.slug?.toUpperCase()?.slice(0, 6)}</span>
                </div>
            </div>

            {/* Social Trust Elements - UNIVERSAL ICONS */}
            <div className="flex flex-row justify-between items-stretch gap-6 pt-10 border-t border-gray-100 dark:border-white/5">
              <div className="flex-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-yellow/5 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md">
                  {/* Consultancy - Headset Icon */}
                  <svg className="w-7 h-7 text-gray-400 group-hover:text-brand-yellow transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-3.536 4.978 4.978 0 011.414-3.536m0 0L5.636 5.636m4.243 4.243a1.992 1.992 0 00-1.414 3.414m1.414-3.414L8.464 8.464" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.15em]">Consultanță Tehnică</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">Soluții personalizate proiectului tău</p>
                </div>
              </div>

              <div className="w-px bg-gray-100 dark:bg-white/5 self-stretch" />

              <div className="flex-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-yellow/5 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md">
                  {/* Showroom - Map Pin Icon */}
                  <svg className="w-7 h-7 text-gray-400 group-hover:text-brand-yellow transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.15em]">Showroom</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">Vizitează-ne pentru mostre fizice</p>
                </div>
              </div>

              <div className="w-px bg-gray-100 dark:bg-white/5 self-stretch" />

              <div className="flex-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-yellow/5 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md">
                  {/* Quality - Shield Check Icon */}
                  <svg className="w-7 h-7 text-gray-400 group-hover:text-brand-yellow transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.15em]">Calitate Garantată</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">Materiale de înaltă densitate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - COMPACT */}
      <section className="bg-white dark:bg-[#0F1115] py-8 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ProductTabs tabs={tabs} />
        </div>
      </section>

      {/* Related Products - COMPACT */}
      <section className="py-16 bg-white dark:bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white italic serif tracking-tight">Produse similare</h2>
              <div className="h-px w-10 bg-brand-yellow mt-3" />
            </div>
            <Link href="/magazin" className="text-[9px] font-bold text-gray-400 hover:text-brand-yellow transition-colors uppercase tracking-[0.2em]">
              Vezi tot →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {similarProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsClient;
