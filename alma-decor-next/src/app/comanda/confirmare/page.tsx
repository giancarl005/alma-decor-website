'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckIcon } from '@/components/ui/Icon';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'AD-MOCK-001';

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-40 pb-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckIcon className="w-12 h-12 text-emerald-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold italic serif text-gray-900 dark:text-white mb-6 tracking-tighter">Comandă Plasată cu Succes!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-12 leading-relaxed">
          Mulțumim pentru încredere. Comanda ta <span className="font-black text-brand-yellow">#{orderId}</span> a fost recepționată și urmează să fie procesată de echipa noastră.
        </p>

        <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/10 text-left mb-16 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 italic serif tracking-tight">Ce urmează?</h2>
          <ul className="space-y-6">
            <li className="flex gap-5">
              <div className="w-6 h-6 bg-brand-yellow text-gray-900 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black italic serif">1</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Vei primi un email de confirmare cu toate detaliile comenzii tale.</p>
            </li>
            <li className="flex gap-5">
              <div className="w-6 h-6 bg-brand-yellow text-gray-900 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black italic serif">2</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Echipa Alma Decor te va contacta telefonic dacă sunt necesare informații suplimentare.</p>
            </li>
            <li className="flex gap-5">
              <div className="w-6 h-6 bg-brand-yellow text-gray-900 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black italic serif">3</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Vei primi un nou email în momentul în care produsele sunt pregătite pentru livrare sau ridicare.</p>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href="/magazin"
            className="bg-brand-yellow text-gray-900 font-black py-5 px-12 rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-yellow/20 text-xs uppercase tracking-[0.2em]"
          >
            Continuă Cumpărăturile
          </Link>
          <Link 
            href="/"
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 px-12 rounded-2xl hover:scale-[1.02] transition-all shadow-xl text-xs uppercase tracking-[0.2em]"
          >
            Înapoi la Prima Pagină
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
