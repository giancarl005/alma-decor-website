import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ProductFilters from '../components/shop/ProductFilters';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  primary_image: string | null;
  badge: string | null;
  badge_text: string | null;
  category_name: string;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
}

const Shop: React.FC = () => {
  const location = useLocation();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const queryParams = new URLSearchParams(location.search);
  const initialIds = queryParams.get('produse');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(categorySlug || null);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [targetIds, setTargetIds] = useState<string | null>(initialIds);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const targetSlugs = queryParams.get('sluguri');

  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
      setPage(1);
    }
  }, [categorySlug]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [activeCategory, sort, searchQuery, showInStockOnly, itemsPerPage]);

  // Fetch Categories
  useEffect(() => {
    fetch('/api/categorii.php')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setCategories(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch Products with Filters and Pagination
  useEffect(() => {
    setLoading(true);
    let url = `/api/produse.php?sort=${sort}&page=${page}&limit=${itemsPerPage}`;
    if (activeCategory) url += `&categorie=${activeCategory}`;
    if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
    if (showInStockOnly) url += `&in_stock=1`;
    if (targetIds) url += `&ids=${targetIds}`;
    if (targetSlugs) url += `&slugs=${targetSlugs}`;
    
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setProducts(res.data);
          setTotalPages(res.total_pages || 1);
          setTotalProducts(res.total_count || 0);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }, [activeCategory, sort, searchQuery, showInStockOnly, targetIds, page, itemsPerPage]);

  const handleReset = () => {
    setActiveCategory(null);
    setSort('newest');
    setPriceRange([0, 100000]);
    setSearchQuery('');
    setShowInStockOnly(false);
    setTargetIds(null);
    setPage(1);
    setItemsPerPage(9);
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  };

  try {
    return (
      <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-brand-dark transition-colors duration-500">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 flex gap-4">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex-grow flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-gray-300">
                {showMobileFilters ? 'Închide Filtre' : 'Filtrează Produsele'}
              </span>
            </button>
          </div>

          {/* Sidebar Filtre */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0 animate-staggered-fade mb-12 lg:mb-0`}>
            <ProductFilters 
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={(slug) => {
                setActiveCategory(slug);
                if (window.innerWidth < 1024) setShowMobileFilters(false);
              }}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sort={sort}
              setSort={setSort}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showInStockOnly={showInStockOnly}
              setShowInStockOnly={setShowInStockOnly}
            />
          </div>

          {/* Catalog Produse */}
          <div className="flex-grow">
            <Breadcrumbs 
              items={(() => {
                const items = [{ label: 'Magazin', path: '/magazin', active: !activeCategory }];
                if (activeCategory) {
                  const currentCat = categories.find(c => c.slug === activeCategory);
                  if (currentCat) {
                    if (currentCat.parent_id) {
                      const parentCat = categories.find(c => c.id === currentCat.parent_id);
                      if (parentCat) {
                        items.push({ label: parentCat.name, path: `/magazin/${parentCat.slug}` });
                      }
                    }
                    items.push({ label: currentCat.name, active: true });
                  }
                }
                return items;
              })()} 
            />
            <header className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-gray-100 dark:border-white/5 pb-8">
              <div>
                <h1 className="text-4xl font-bold italic serif tracking-tighter text-gray-900 dark:text-white mb-2">
                  {targetIds || targetSlugs
                    ? 'Produse Recomandate' 
                    : activeCategory 
                      ? categories.find(c => c.slug === activeCategory)?.name 
                      : 'Toate Produsele'}
                  <span className="text-brand-yellow not-italic ml-3">.</span>
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                  {targetIds || targetSlugs ? 'Selecție din articolul citit' : 'Catalog Premium Alma Decor'}
                </p>
              </div>
              <div className="flex items-center gap-8 mt-4 md:mt-0">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Afișează</span>
                  <div className="flex bg-white dark:bg-white/5 rounded-lg p-0.5 border border-gray-100 dark:border-white/10 shadow-sm">
                    {[30, 60, 90].map(limit => (
                      <button 
                        key={limit}
                        onClick={() => setItemsPerPage(limit)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          itemsPerPage === limit 
                          ? 'bg-brand-yellow text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                  Total: <span className="text-gray-400 dark:text-gray-500">{totalProducts} Articole</span>
                </div>
              </div>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 disabled:opacity-30 hover:border-brand-yellow hover:text-brand-yellow transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button 
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                            page === p 
                            ? 'bg-brand-yellow text-gray-900 shadow-lg scale-110' 
                            : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 hover:border-brand-yellow hover:text-brand-yellow'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 disabled:opacity-30 hover:border-brand-yellow hover:text-brand-yellow transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-24 text-center border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex justify-center mb-8 text-gray-200 dark:text-gray-800">
                   <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <h2 className="text-2xl font-bold italic serif text-gray-900 dark:text-white mb-4">Niciun rezultat găsit</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed">Nu am găsit produse care să corespundă criteriilor de selecție. Încearcă să resetezi filtrele sau să schimbi termenii de căutare.</p>
                <button 
                  onClick={handleReset}
                  className="px-10 py-4 bg-brand-yellow text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all"
                >
                  Resetează Filtrele
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <div style={{ padding: '50px', color: 'red' }}><h1>Eroare Magazin</h1><pre>{String(err)}</pre></div>;
  }
};

export default Shop;
