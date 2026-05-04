import React, { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductGridClient from '@/components/shop/ProductGridClient';

export const metadata: Metadata = {
  title: 'Catalog Produse Premium | Alma Decor',
  description: 'Explorează gama completă de produse Alma Decor. Găsește elementele perfecte pentru amenajarea casei tale, de la decorațiuni la finisaje.',
};

export const dynamic = 'force-dynamic';

import { API_BASE } from '@/lib/api';

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categorii.php`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function MagazinPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <Link href="/" className="hover:text-brand-yellow transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Magazin</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">
            Catalog <span className="text-brand-yellow not-italic font-bold">Produse.</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-white/5 pb-2">
                Categorii
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/magazin" 
                    className="text-sm font-bold text-brand-yellow flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                    Toate Produsele
                  </Link>
                </li>
                {categories.filter((c: any) => !c.parent_id || Number(c.parent_id) === 0).map((parent: any) => (
                  <React.Fragment key={`parent-${parent.id}`}>
                    <li>
                      <Link 
                        href={`/magazin/${parent.slug}`} 
                        className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-yellow transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-0 h-px bg-brand-yellow transition-all group-hover:w-3"></span>
                        {parent.name}
                      </Link>
                    </li>
                    {/* Subcategories */}
                    {categories.filter((c: any) => Number(c.parent_id) === Number(parent.id)).map((child: any) => (
                      <li key={`child-${child.id}`} className="pl-4">
                        <Link 
                          href={`/magazin/${child.slug}`} 
                          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-yellow transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-2 h-px bg-gray-200 dark:bg-white/10 group-hover:bg-brand-yellow transition-all"></span>
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-white/5 pb-2">
                Preț (RON)
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Sub 200 RON', min: '0', max: '200' },
                  { label: '200 - 500 RON', min: '200', max: '500' },
                  { label: 'Peste 500 RON', min: '500', max: '10000' }
                ].map((range) => (
                  <li key={range.label}>
                    <Link 
                      href={`/magazin?min_price=${range.min}&max_price=${range.max}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-4 h-4 rounded border border-gray-200 dark:border-white/10 transition-colors" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-brand-yellow transition-colors">{range.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <Suspense fallback={<div className="animate-pulse bg-gray-100 h-96 rounded-3xl" />}>
              <ProductGridClient initialLimit={30} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
