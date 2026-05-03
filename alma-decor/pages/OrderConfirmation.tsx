import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckIcon, ArrowRightIcon } from '../components/ui/Icon';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const orderId = location.state?.orderId || 'AD-MOCK-001';

  React.useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="pt-40 pb-32 px-6 max-w-3xl mx-auto text-center">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <CheckIcon className="w-12 h-12 text-green-500" />
      </div>
      
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 italic serif">Comandă Plasată cu Succes!</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">
        Mulțumim pentru încredere. Comanda ta <span className="font-bold text-brand-yellow">#{orderId}</span> a fost recepționată și urmează să fie procesată de echipa noastră.
      </p>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 text-left mb-12 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Ce urmează?</h2>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-6 h-6 bg-brand-yellow rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">1</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Vei primi un email de confirmare cu detaliile comenzii.</p>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 bg-brand-yellow rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">2</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Echipa noastră te va contacta dacă sunt necesare informații suplimentare.</p>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 bg-brand-yellow rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">3</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Vei primi un nou email în momentul în care comanda este expediată.</p>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/magazin"
          className="bg-brand-yellow text-gray-900 font-bold py-4 px-10 rounded-xl hover:scale-105 transition-all shadow-lg text-[11px] uppercase tracking-widest"
        >
          Continuă Cumpărăturile
        </Link>
        <Link 
          to="/"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 px-10 rounded-xl hover:scale-105 transition-all shadow-lg text-[11px] uppercase tracking-widest"
        >
          Înapoi la Prima Pagina
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
