import React from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parent_id?: number | null;
}

interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sort: string;
  setSort: (sort: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (show: boolean) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  priceRange,
  setPriceRange,
  sort,
  setSort,
  searchQuery,
  setSearchQuery,
  showInStockOnly,
  setShowInStockOnly
}) => {
  const rootCategories = categories.filter(c => !c.parent_id);

  return (
    <aside className="space-y-12">
      {/* Search Bar Premium */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
          Căutare
        </h3>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Caută în catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-yellow transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </section>

      {/* Categorii */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
          Categorii
        </h3>
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm flex justify-between items-center ${
                activeCategory === null 
                ? 'bg-brand-yellow text-gray-900 font-bold shadow-md scale-[1.02]' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.03] font-semibold'
              }`}
            >
              <span>Toate Produsele</span>
              {activeCategory === null && <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>}
            </button>
          </li>
          {rootCategories.map((cat) => {
            const children = categories.filter(c => c.parent_id === cat.id);
            const isActiveParent = activeCategory === cat.slug || children.some(c => c.slug === activeCategory);

            return (
              <React.Fragment key={cat.id}>
                <li>
                  <button 
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm flex justify-between items-center ${
                      activeCategory === cat.slug 
                      ? 'bg-brand-yellow text-gray-900 font-bold shadow-md scale-[1.02]' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.03] font-semibold'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {activeCategory === cat.slug && <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>}
                  </button>
                </li>
                {children.length > 0 && (
                  <ul className="pl-6 mt-1 mb-2 space-y-1">
                    {children.map(child => (
                      <li key={child.id}>
                        <button 
                          onClick={() => setActiveCategory(child.slug)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-xs flex justify-between items-center ${
                            activeCategory === child.slug 
                            ? 'bg-gray-900 dark:bg-white/10 text-white dark:text-brand-yellow font-bold shadow-sm' 
                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                            <span>{child.name}</span>
                          </div>
                          {activeCategory === child.slug && <div className="w-1 h-1 bg-brand-yellow rounded-full"></div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </section>

      {/* Disponibilitate */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
          Status
        </h3>
        <button 
          onClick={() => setShowInStockOnly(!showInStockOnly)}
          className="flex items-center gap-3 group w-full text-left cursor-pointer"
        >
          <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${showInStockOnly ? 'bg-brand-yellow' : 'bg-gray-200 dark:bg-white/10'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ${showInStockOnly ? 'left-6' : 'left-1'}`}></div>
          </div>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Doar în stoc</span>
        </button>
      </section>

      {/* Rafinează Sortare */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
          Ordonare
        </h3>
        <div className="relative group">
            <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none cursor-pointer"
            >
            <option value="newest">Cele mai noi</option>
            <option value="price_asc">Preț: Mic la Mare</option>
            <option value="price_desc">Preț: Mare la Mic</option>
            <option value="name_asc">Nume: A-Z</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
      </section>

      {/* Buget */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
          Buget (RON)
        </h3>
        <div className="flex items-center gap-3">
          <input 
              type="number" 
              placeholder="Min"
              value={priceRange[0] === 0 ? '' : priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all shadow-sm"
          />
          <span className="text-gray-300 dark:text-gray-700 font-light">/</span>
          <input 
              type="number" 
              placeholder="Max"
              value={priceRange[1] === 10000 ? '' : priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all shadow-sm"
          />
        </div>
      </section>
    </aside>
  );
};

export default ProductFilters;
