import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 text-center max-w-7xl mx-auto min-h-screen">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-16 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="mb-6 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Coșul tău este gol</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Se pare că nu ai adăugat încă niciun produs în coș. Explorează colecțiile noastre și găsește ceva care îți place!</p>
          <Link 
            to="/magazin" 
            className="inline-block bg-brand-yellow text-gray-900 font-bold py-4 px-10 rounded-xl hover:bg-brand-yellow-dark transition-all shadow-lg shadow-yellow-500/20"
          >
            MERGI LA MAGAZIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center lg:text-left">Coșul tău de cumpărături</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Lista Produse */}
        <div className="flex-grow space-y-6">
          {cart.map((item) => (
            <div key={`${item.id}-${item.variation_id}`} className="flex items-start sm:items-center gap-3 sm:gap-4 bg-white dark:bg-white/[0.02] p-3 sm:p-4 rounded-2xl border border-gray-100 dark:border-white/5 transition-all hover:border-gray-200 dark:hover:border-white/10 shadow-sm relative">
              {/* Imagine Mica */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
              </div>
              
              {/* Info & Controale */}
              <div className="flex-grow flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="flex-grow pr-8 sm:pr-0">
                  <h3 className="text-[11px] sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1 leading-tight mb-0.5 sm:mb-1">{item.name}</h3>
                  {item.variation_name && (
                    <p className="text-[9px] text-brand-yellow font-bold uppercase tracking-wider mb-0.5 sm:mb-1">{item.variation_name}</p>
                  )}
                  <p className="text-[9px] text-gray-400 font-medium">{(item.sale_price || item.price)} RON</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-8">
                  {/* Controale Cantitate Compacte */}
                  <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variation_id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-brand-yellow transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-[11px] sm:text-xs font-black text-gray-900 dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variation_id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-brand-yellow transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[70px] sm:min-w-[80px]">
                    <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{(item.sale_price || item.price) * item.quantity} RON</p>
                  </div>
                </div>
              </div>

              {/* Delete Button - Positioned absolutely on mobile */}
              <button 
                onClick={() => removeFromCart(item.id, item.variation_id)}
                className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-rose-500 transition-colors sm:static"
                title="Șterge produs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Sumar Comandă */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 sticky top-32">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sumar Comandă</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">{cartTotal} RON</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Transport</span>
                <span className="text-green-500 font-bold">Gratuit</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl">
                <span className="font-bold text-gray-900 dark:text-white">Total <span className="text-xs font-medium text-gray-400 ml-1">(cu TVA)</span></span>
                <span className="font-bold text-gray-900 dark:text-white">{cartTotal} RON</span>
              </div>
            </div>

            <Link 
              to="/comanda" 
              className="block w-full bg-orange-500 text-white text-center font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              FINALIZEAZĂ COMANDA
            </Link>
            
            <Link 
              to="/magazin" 
              className="block w-full text-center text-sm text-gray-500 dark:text-gray-400 mt-4 hover:text-brand-yellow transition-colors"
            >
              ← Continuă cumpărăturile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
