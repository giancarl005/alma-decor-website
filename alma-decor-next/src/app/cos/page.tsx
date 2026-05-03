'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { TrashIcon } from '@/components/ui/Icon';

import { API_BASE } from '@/lib/api';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const getFullUrl = (url: string | null) => {
    if (!url) return 'https://via.placeholder.com/400x500?text=Alma+Decor';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold italic serif text-gray-900 dark:text-white mb-4">Coșul tău este gol</h1>
          <p className="text-gray-500 mb-12 max-w-md mx-auto">Se pare că nu ai adăugat încă niciun produs în coșul de cumpărături.</p>
          <Link href="/magazin" className="inline-block bg-brand-yellow text-gray-900 font-black py-5 px-12 rounded-xl hover:bg-gray-900 hover:text-white transition-all text-sm tracking-[0.2em] shadow-xl shadow-brand-yellow/20">
            ÎNAPOI LA MAGAZIN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em] mb-4">Shopping</h2>
          <h1 className="text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">Coșul Tău</h1>
          <div className="h-1 w-20 bg-brand-yellow mt-8" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            <div className="hidden md:grid grid-cols-12 pb-6 border-b border-gray-100 dark:border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="col-span-5">Produs</div>
              <div className="col-span-2 text-center">Preț</div>
              <div className="col-span-2 text-center">Cantitate</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {cart.map((item) => (
              <div key={`${item.id}-${item.variation_id}`} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pb-8 border-b border-gray-50 dark:border-white/[0.03]">
                {/* Product Info */}
                <div className="col-span-1 md:col-span-5 flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex-shrink-0">
                    <img 
                      src={getFullUrl(item.image)} 
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-white hover:text-brand-yellow transition-colors leading-tight text-sm">
                      <Link href={`/produs/${item.slug}`}>{item.name}</Link>
                    </h3>
                    {item.variation_name && (
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.variation_name}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2 text-center">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{Number(item.sale_price || item.price).toFixed(2)} Lei</p>
                </div>

                {/* Quantity */}
                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg p-1 border border-gray-100 dark:border-white/10">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variation_id)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-gray-900 dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variation_id)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-1 md:col-span-2 text-right">
                  <p className="font-black text-gray-900 dark:text-brand-yellow tracking-tight text-sm">
                    {(Number(item.sale_price || item.price) * item.quantity).toFixed(2)} Lei
                  </p>
                </div>

                {/* Delete Icon */}
                <div className="col-span-1 flex justify-end">
                  <button 
                    onClick={() => removeFromCart(item.id, item.variation_id)}
                    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group/delete"
                    title="Șterge produs"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 dark:bg-white/[0.02] rounded-[2rem] p-10 border border-gray-100 dark:border-white/5 lg:sticky lg:top-24">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">Sumar Comandă</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">{cartTotal.toFixed(2)} Lei</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transport</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Gratuit</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-white/5 my-6" />
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900 dark:text-white italic serif">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-900 dark:text-brand-yellow tracking-tighter">
                      {cartTotal.toFixed(2)}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RON (TVA Inclus)</p>
                  </div>
                </div>
              </div>

              <Link href="/comanda" className="block w-full bg-orange-500 text-white font-black py-5 rounded-xl hover:bg-orange-600 transition-all text-sm tracking-[0.2em] text-center shadow-xl shadow-orange-500/20 active:scale-[0.98]">
                FINALIZARE COMANDĂ
              </Link>
              
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-4 text-gray-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Comandă verificată manual</p>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Politica de retur 14 zile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
