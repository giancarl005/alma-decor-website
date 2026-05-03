import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductCard from '@/components/shop/ProductCard';

export const metadata: Metadata = {
  title: 'Catalog Produse Premium | Alma Decor',
  description: 'Explorează gama completă de produse Alma Decor. Găsește elementele perfecte pentru amenajarea casei tale, de la decorațiuni la finisaje.',
};

const API_BASE = 'http://127.0.0.1/Alma%20Decor%20Website';

async function getProducts(page = 1, limit = 30, sort = 'newest', minPrice?: string, maxPrice?: string) {
  try {
    let url = `${API_BASE}/api/produse.php?page=${page}&limit=${limit}&sort=${sort}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;
    
    const res = await fetch(url, {
      cache: 'no-store'
    });
    if (!res.ok) {
      return { data: [], total_count: 0, total_pages: 0, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return data.status === 'success' ? data : { data: [], total_count: 0, total_pages: 0, error: data.message };
  } catch (error: any) {
    return { data: [], total_count: 0, total_pages: 0, error: error.message };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categorii.php`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function MagazinPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; limit?: string; sort?: string; min_price?: string; max_price?: string }>
}) {
  const sParams = await searchParams;
  const currentPage = parseInt(sParams.page || '1');
  const currentLimit = parseInt(sParams.limit || '30');
  const currentSort = sParams.sort || 'newest';

  const currentMinPrice = sParams.min_price || '';
  const currentMaxPrice = sParams.max_price || '';
  
  const productsData = await getProducts(currentPage, currentLimit, currentSort, currentMinPrice, currentMaxPrice);
  const categories = await getCategories();

  const products = productsData.data || [];
  const totalPages = productsData.total_pages || 1;

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
            {/* ... Categories section remains same ... */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-white/5 pb-2">
                Categorii
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/magazin" 
                    className={`text-sm font-bold flex items-center gap-2 group ${!sParams.sort ? 'text-brand-yellow' : 'text-gray-500'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                    Toate Produsele
                  </Link>
                </li>
                {categories.filter((c: any) => !c.parent_id || Number(c.parent_id) === 0).map((parent: any) => (
                  <React.Fragment key={parent.id}>
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
                      <li key={child.id} className="pl-4">
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
                <li>
                  <Link 
                    href={`/magazin?page=1&limit=${currentLimit}&sort=${currentSort}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`w-4 h-4 rounded border ${!currentMinPrice && !currentMaxPrice ? 'bg-brand-yellow border-brand-yellow' : 'border-gray-200 dark:border-white/10'} transition-colors`} />
                    <span className={`text-sm ${!currentMinPrice && !currentMaxPrice ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'} group-hover:text-brand-yellow transition-colors`}>Toate prețurile</span>
                  </Link>
                </li>
                {[
                  { label: 'Sub 200 RON', min: '0', max: '200' },
                  { label: '200 - 500 RON', min: '200', max: '500' },
                  { label: 'Peste 500 RON', min: '500', max: '10000' }
                ].map((range) => {
                  const isActive = currentMinPrice === range.min && currentMaxPrice === range.max;
                  return (
                    <li key={range.label}>
                      <Link 
                        href={`/magazin?page=1&limit=${currentLimit}&sort=${currentSort}&min_price=${range.min}&max_price=${range.max}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className={`w-4 h-4 rounded border ${isActive ? 'bg-brand-yellow border-brand-yellow' : 'border-gray-200 dark:border-white/10'} transition-colors`} />
                        <span className={`text-sm ${isActive ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'} group-hover:text-brand-yellow transition-colors`}>{range.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 dark:border-white/5 pb-4 gap-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Se afișează <span className="text-gray-900 dark:text-white">{products.length} din {productsData.total_count || 0} produse</span>
              </p>
              
              <div className="flex items-center gap-8">
                {/* Items per page */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Afișează:</span>
                  <div className="flex gap-2">
                    {[30, 60, 90].map((num) => (
                      <Link 
                        key={num}
                        href={`/magazin?page=1&limit=${num}&sort=${currentSort}`}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${currentLimit === num ? 'text-brand-yellow' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                      >
                        {num}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sortează după:</span>
                  <select 
                    className="bg-transparent text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none cursor-pointer"
                    defaultValue={currentSort}
                  >
                    <option value="newest">Noutăți</option>
                    <option value="price_asc">Preț: Mic la Mare</option>
                    <option value="price_desc">Preț: Mare la Mic</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-center items-center gap-4">
                {currentPage > 1 && (
                  <Link 
                    href={`/magazin?page=${currentPage - 1}&limit=${currentLimit}&sort=${currentSort}`}
                    className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest hover:text-brand-yellow transition-colors"
                  >
                    Anterior
                  </Link>
                )}
                
                <div className="flex items-center gap-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/magazin?page=${p}&limit=${currentLimit}&sort=${currentSort}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all ${currentPage === p ? 'bg-brand-yellow text-gray-900' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <Link 
                    href={`/magazin?page=${currentPage + 1}&limit=${currentLimit}&sort=${currentSort}`}
                    className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest hover:text-brand-yellow transition-colors"
                  >
                    Următor
                  </Link>
                )}
              </div>
            )}
            
            {products.length === 0 && (
              <div className="py-24 text-center space-y-4">
                <p className="text-gray-400 font-medium">Nu am găsit produse în această selecție.</p>
                <Link href="/magazin" className="inline-block text-xs font-bold text-brand-yellow uppercase tracking-widest border-b border-brand-yellow pb-1">Resetează Filtrele</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
