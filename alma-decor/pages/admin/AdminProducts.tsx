import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import * as Icons from '../../components/admin/AdminIcons';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  sale_price: number | null;
  stock: number;
  stock_status: string;
  category_id: number;
  category_name?: string;
  slug: string;
  brand: string;
  primary_image?: string;
  is_active: number;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'prețuri' | 'descrieri' | 'imagini' | 'seo'>('general');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'price' | 'stock'>('id');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const navigate = useNavigate();

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/produse.php?page=${page}&limit=${itemsPerPage}`),
        fetch('/api/admin/categorii.php')
      ]);
      const prodsData = await prodRes.json();
      const catsData = await catRes.json();
      
      const prods = prodsData.data || prodsData;
      const cats = catsData.status === 'success' ? catsData.data : (Array.isArray(catsData) ? catsData : []);

      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
      if (prodsData.total_pages) setTotalPages(prodsData.total_pages);
      if (prodsData.total_count) setTotalProducts(prodsData.total_count);
    } catch (err) {
      setCategories([{ id: 1, name: 'Parchet' }, { id: 2, name: 'Tapet' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUpdate = async (p: Product) => {
    try {
      const res = await fetch('/api/admin/produse.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (data.status === 'success') {
        showNotification("Actualizat cu succes!");
        fetchData();
      } else {
        showNotification(data.message || "Eroare la salvare", 'error');
      }
    } catch (err) {
      showNotification("Eroare la conexiunea cu serverul", 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !editingProd.id;
      const res = await fetch('/api/admin/produse.php', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProd,
          slug: editingProd.slug || editingProd.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsModalOpen(false);
        fetchData();
        showNotification(isNew ? "Produs adăugat cu succes!" : "Produs actualizat!");
      } else {
        showNotification(data.message || "Eroare la salvare", 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification("Eroare la conexiunea cu serverul", 'error');
    }
  };

  const handleBulkCategoryUpdate = async (categoryId: string) => {
    if (!categoryId || selectedProductIds.length === 0) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/produse.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulk_update: true,
          product_ids: selectedProductIds,
          category_id: parseInt(categoryId)
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showNotification(`${selectedProductIds.length} produse actualizate!`);
        setSelectedProductIds([]);
        fetchData();
      } else {
        showNotification(data.message || "Eroare la actualizare", 'error');
      }
    } catch (err) {
      showNotification("Eroare la conexiunea cu serverul", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    fetchData();
  }, [navigate, page, itemsPerPage]);

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category_id?.toString() === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return b.id - a.id;
    });

  const allVisibleSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id));
  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedProductIds(selectedProductIds.filter(id => !filteredProducts.find(p => p.id === id)));
    } else {
      const newIds = new Set(selectedProductIds);
      filteredProducts.forEach(p => newIds.add(p.id));
      setSelectedProductIds(Array.from(newIds));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Catalog <span className="text-blue-600 dark:text-brand-yellow not-italic">Produse</span></h1>
            <p className="text-gray-500 text-sm font-medium">Administrarea inventarului premium Alma Decor.</p>
          </div>
          <button 
            onClick={() => { setEditingProd({ name: '', slug: '', sku: '', category_id: '', price: 0, sale_price: '', stock: 0, stock_status: 'in_stoc', brand: 'Alma Decor', short_description: '', description: '', meta_title: '', meta_description: '', badge: '', badge_text: '', is_active: 1 }); setIsModalOpen(true); setActiveTab('general'); }}
            className="px-6 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all"
          >
            + Adaugă Produs
          </button>
        </header>

        {/* Search & Filter Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 flex-grow max-w-4xl">
            <div className="relative flex-grow max-w-sm">
              <input 
                type="text"
                placeholder="Caută după nume sau SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl px-12 py-3.5 text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.IconSearch />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categorie:</span>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              >
                <option value="all">Toate Categoriile</option>
                {categories.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sortare:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option value="id">Cele mai noi</option>
              <option value="name">Nume (A-Z)</option>
              <option value="price">Preț (Crescător)</option>
              <option value="stock">Stoc (Crescător)</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedProductIds.length > 0 && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-brand-yellow/10 border border-blue-200 dark:border-brand-yellow/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-brand-yellow text-white dark:text-gray-900 text-[10px] font-black">
                {selectedProductIds.length}
              </span>
              <span className="text-xs font-bold text-blue-900 dark:text-brand-yellow uppercase tracking-widest">
                Produse Selectate
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Mută în:</span>
              <select 
                onChange={(e) => handleBulkCategoryUpdate(e.target.value)}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer shadow-sm min-w-[200px] text-gray-900 dark:text-white"
                defaultValue=""
              >
                <option value="" disabled className="bg-white dark:bg-brand-dark text-gray-900 dark:text-white">Alege o categorie...</option>
                {categories.map(c => <option key={c.id} value={c.id.toString()} className="bg-white dark:bg-brand-dark text-gray-900 dark:text-white">{c.name}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="admin-card rounded-[2rem] overflow-hidden bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.02] text-gray-400 dark:text-gray-500 text-[9px] font-medium uppercase tracking-widest border-b border-gray-100 dark:border-white/[0.03]">
                <th className="px-4 py-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-5 font-medium">Identitate Articol</th>
                <th className="px-4 py-5 text-center font-medium">Status</th>
                <th className="px-4 py-5 text-center font-medium">Categorie</th>
                <th className="px-4 py-5 text-center font-medium">Preț / Redus</th>
                <th className="px-4 py-5 text-center font-medium">Status Stoc</th>
                <th className="px-4 py-5 text-right font-medium">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.02]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group">
                  <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedProductIds.includes(p.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedProductIds([...selectedProductIds, p.id]);
                        else setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                      }}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white dark:bg-white/5 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        {p.primary_image ? (
                               <img src={p.primary_image} className="w-full h-full object-cover" alt={p.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 scale-75"><Icons.IconProducts /></div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900 dark:text-white text-[12px] leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-brand-yellow transition-colors">{p.name}</div>
                          {p.is_active === 0 && (
                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-[7px] font-bold uppercase tracking-widest">Draft</span>
                          )}
                        </div>
                        <div className="text-[8px] text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase">{p.sku || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center">
                      <div 
                        title={p.is_active === 1 ? 'Produs Publicat' : 'Ciornă (Draft)'}
                        className={`w-3 h-3 rounded-full shadow-sm border ${
                          p.is_active === 1 
                          ? 'bg-emerald-500 border-emerald-400 animate-pulse' 
                          : 'bg-amber-500 border-amber-400'
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[8px] font-medium uppercase text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/5">
                      {p.category_name || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-gray-100 dark:border-white/5">
                        <input 
                          type="number"
                          value={p.price}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value);
                            setProducts(products.map(item => item.id === p.id ? {...item, price: newPrice} : item));
                          }}
                          className="w-16 bg-transparent border-none text-[11px] font-medium text-gray-900 dark:text-white outline-none text-right tabular-nums"
                        />
                        <span className="text-[7px] font-medium text-gray-400 uppercase">RON</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/10">
                        <input 
                          type="number"
                          value={p.sale_price || ''}
                          placeholder="Fără"
                          onChange={(e) => {
                            const val = e.target.value;
                            const newSalePrice = val === '' ? null : parseFloat(val);
                            setProducts(products.map(item => item.id === p.id ? {...item, sale_price: newSalePrice} : item));
                          }}
                          className="w-16 bg-transparent border-none text-[11px] font-medium text-emerald-600 dark:text-emerald-400 outline-none text-right tabular-nums placeholder:text-emerald-600/20"
                        />
                        <span className="text-[7px] font-medium text-emerald-600/50 uppercase">RON</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <select 
                        value={p.stock_status || 'in_stoc'}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setProducts(products.map(item => item.id === p.id ? {...item, stock_status: newStatus} : item));
                        }}
                        className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                          p.stock_status === 'in_stoc' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' :
                          p.stock_status === 'stoc_online' ? 'bg-blue-500/5 text-blue-600 border-blue-500/10' :
                          p.stock_status === 'stoc_epuizat' ? 'bg-rose-500/5 text-rose-600 border-rose-500/10' :
                          'bg-amber-500/5 text-amber-600 border-amber-500/10'
                        }`}
                      >
                        <option value="in_stoc">În stoc</option>
                        <option value="stoc_online">În stocul online</option>
                        <option value="stoc_epuizat">Stoc epuizat</option>
                        <option value="precomanda">Precomandă</option>
                      </select>
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-gray-100 dark:border-white/5">
                        <span className="text-[7px] text-gray-400 font-medium uppercase">Cant:</span>
                        <input 
                          type="number"
                          value={p.stock}
                          onChange={(e) => {
                            const newStock = parseInt(e.target.value);
                            setProducts(products.map(item => item.id === p.id ? {...item, stock: newStock} : item));
                          }}
                          className="w-10 bg-transparent border-none text-[10px] font-medium text-gray-700 dark:text-white tabular-nums outline-none text-center"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.is_active === 0 && (
                        <button 
                          onClick={() => handleQuickUpdate({...p, is_active: 1})}
                          title="Publică în Magazin"
                          className="p-2 bg-emerald-600 text-white rounded-lg hover:scale-110 transition-all shadow-md"
                        >
                          <Icons.IconCheck size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleQuickUpdate(p)}
                        title="Salvează Modificările"
                        className="p-2 bg-blue-600 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-lg hover:scale-110 transition-all shadow-md"
                      >
                        <Icons.AdminSaveIcon />
                      </button>
                      <button 
                        onClick={async () => { 
                          try {
                            const res = await fetch(`/api/admin/produse.php?id=${p.id}`);
                            const prodData = await res.json();
                            const fullProd = prodData.data || prodData;
                            setEditingProd({
                              ...fullProd,
                              gallery: fullProd.gallery || []
                            }); 
                            setIsModalOpen(true); 
                            setActiveTab('general'); 
                          } catch (err) {
                            console.error(err);
                            showNotification("Eroare la încărcare detalii", 'error');
                          }
                        }} 
                        title="Editează Produs"
                        className="p-2 bg-gray-900 dark:bg-white/5 text-white dark:text-gray-400 rounded-lg hover:scale-110 transition-all border border-transparent dark:border-white/10"
                      >
                        <Icons.IconEdit />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(p.id)}
                        title="Șterge Produs"
                        className="p-2 bg-rose-600 text-white rounded-lg hover:scale-110 transition-all shadow-md"
                      >
                        <Icons.IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Afișează:</span>
            <div className="flex bg-white dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5 shadow-sm">
              {[100, 200, 300].map(limit => (
                <button 
                  key={limit}
                  onClick={() => { setItemsPerPage(limit); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${itemsPerPage === limit ? 'bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                >
                  {limit}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Total: <span className="text-gray-900 dark:text-white">{totalProducts} Articole</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-gray-400 disabled:opacity-30 hover:text-blue-600 dark:hover:text-brand-yellow transition-all shadow-sm"
            >
              ←
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pagina</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white">{page}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">din {totalPages}</span>
            </div>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-gray-400 disabled:opacity-30 hover:text-blue-600 dark:hover:text-brand-yellow transition-all shadow-sm"
            >
              →
            </button>
          </div>
        </div>

        {/* Custom Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-brand-dark w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-white/10 text-center animate-scale-in">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="text-rose-500 scale-150"><Icons.IconTrash /></div>
              </div>
              <h3 className="text-2xl font-bold italic serif tracking-tighter mb-4 text-gray-900 dark:text-white">Sigur dorești să ștergi?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 leading-relaxed font-medium">Această acțiune este ireversibilă. Produsul și galeria de imagini vor fi eliminate definitiv.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                  Anulează
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/admin/produse.php?id=${deleteConfirmId}`, { method: 'DELETE' });
                      const data = await res.json();
                      if (data.status === 'success') {
                        showNotification("Produs eliminat cu succes!");
                        setDeleteConfirmId(null);
                        fetchData();
                      }
                    } catch (err) {
                      showNotification("Eroare la eliminare", 'error');
                    }
                  }}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Confirmă Ștergerea
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed bottom-10 right-10 z-[500] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border animate-fade-in ${
            notification.type === 'success' 
            ? 'bg-emerald-500 border-emerald-400 text-white' 
            : 'bg-rose-500 border-rose-400 text-white'
          }`}>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {notification.type === 'success' ? '✓' : '✕'}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">{notification.message}</p>
          </div>
        )}

        {/* Product Modal */}
        {isModalOpen && editingProd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-brand-dark w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col border border-white/10">
              <header className="p-8 border-b border-gray-100 dark:border-white/[0.03] flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <h2 className="text-2xl font-bold italic serif tracking-tighter text-gray-900 dark:text-white">
                    {editingProd.id ? 'Editează' : 'Adaugă'} <span className="text-blue-600 dark:text-brand-yellow not-italic">Produs</span>
                  </h2>
                  <nav className="flex gap-4 ml-8 bg-gray-50 dark:bg-white/5 p-1 rounded-xl">
                    {['general', 'prețuri', 'descrieri', 'imagini', 'seo'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-brand-yellow' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-2xl">✕</button>
              </header>

              <div className="flex-grow overflow-y-auto p-10">
                <form className="space-y-8 animate-fade-in">
                  {activeTab === 'imagini' && (
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Imagine Principală</label>
                        <div className="flex items-start gap-8">
                          <div className="w-48 h-48 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center">
                            {editingProd.primary_image ? (
                              <img src={editingProd.primary_image} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-gray-300 dark:text-gray-600 text-4xl"><Icons.IconProducts /></div>
                            )}
                          </div>
                          <div className="space-y-4">
                            <p className="text-xs text-gray-500 max-w-xs">Încărcați o imagine de înaltă calitate pentru a reprezenta produsul în catalog.</p>
                            <input 
                              type="file" 
                              id="primary_image_upload"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  try {
                                    const res = await fetch('/api/admin/upload.php', {
                                      method: 'POST',
                                      body: formData
                                    });
                                    const data = await res.json();
                                    if (data.status === 'success') {
                                      setEditingProd({...editingProd, primary_image: data.url});
                                    }
                                  } catch (err) {
                                    alert("Eroare la upload!");
                                  }
                                }
                              }}
                            />
                            <label 
                              htmlFor="primary_image_upload"
                              className="inline-block px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl font-bold text-[9px] uppercase tracking-widest cursor-pointer transition-all"
                            >
                              Schimbă Imaginea
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Galerie Imagini</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {editingProd.gallery?.map((img: any, idx: number) => (
                            <div key={idx} className="relative aspect-square bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden group border border-gray-100 dark:border-white/10">
                              <img src={img.url} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => {
                                  const newGallery = [...editingProd.gallery];
                                  newGallery.splice(idx, 1);
                                  setEditingProd({...editingProd, gallery: newGallery});
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs"
                              >✕</button>
                            </div>
                          ))}
                          <label className="aspect-square bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                            <input 
                              type="file" 
                              multiple 
                              className="hidden" 
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                const newImages = [];
                                for (const file of files) {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  try {
                                    const res = await fetch('/api/admin/upload.php', { method: 'POST', body: formData });
                                    const data = await res.json();
                                    if (data.status === 'success') {
                                      newImages.push({ url: data.url });
                                    }
                                  } catch (err) { console.error(err); }
                                }
                                setEditingProd({...editingProd, gallery: [...(editingProd.gallery || []), ...newImages]});
                              }}
                            />
                            <div className="text-2xl text-gray-300 dark:text-gray-600">+</div>
                            <div className="text-[8px] font-bold text-gray-400 uppercase mt-1">Adaugă</div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Denumire Produs</label>
                          <input 
                            value={editingProd.name}
                            onChange={e => setEditingProd({...editingProd, name: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                          />
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                          <div className="flex-grow">
                            <div className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Vizibilitate Magazin</div>
                            <div className="text-[8px] text-gray-400 font-medium">Dacă este activat, produsul va fi vizibil clienților.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingProd({...editingProd, is_active: editingProd.is_active === 1 ? 0 : 1})}
                            className={`w-12 h-6 rounded-full relative transition-all ${editingProd.is_active === 1 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/10'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingProd.is_active === 1 ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Slug (URL)</label>
                          <input 
                            value={editingProd.slug}
                            onChange={e => setEditingProd({...editingProd, slug: e.target.value})}
                            placeholder="auto-generat dacă este gol"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">SKU / Cod</label>
                            <input 
                              value={editingProd.sku}
                              onChange={e => setEditingProd({...editingProd, sku: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Disponibilitate</label>
                            <select 
                              value={editingProd.stock_status || 'in_stoc'}
                              onChange={e => setEditingProd({...editingProd, stock_status: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow appearance-none text-[10px] font-bold uppercase text-gray-900 dark:text-white"
                            >
                              <option value="in_stoc" className="bg-white dark:bg-brand-dark">În stoc</option>
                              <option value="stoc_online" className="bg-white dark:bg-brand-dark">În stocul online</option>
                              <option value="stoc_epuizat" className="bg-white dark:bg-brand-dark">Stoc epuizat</option>
                              <option value="precomanda" className="bg-white dark:bg-brand-dark">Precomandă</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Cantitate Stoc</label>
                            <input 
                              type="number"
                              value={editingProd.stock}
                              onChange={e => setEditingProd({...editingProd, stock: parseInt(e.target.value)})}
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Categorie</label>
                          <select 
                            value={editingProd.category_id}
                            onChange={e => setEditingProd({...editingProd, category_id: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow appearance-none text-gray-900 dark:text-white"
                          >
                            <option value="" className="bg-white dark:bg-brand-dark">Alege Categorie</option>
                            {categories.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-brand-dark">{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Brand</label>
                          <input 
                            value={editingProd.brand}
                            onChange={e => setEditingProd({...editingProd, brand: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Badge (ex: NEW, PROMO)</label>
                          <input 
                            value={editingProd.badge_text || ''}
                            onChange={e => setEditingProd({...editingProd, badge_text: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'prețuri' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Preț Standard (RON)</label>
                          <input 
                            type="number"
                            value={editingProd.price}
                            onChange={e => setEditingProd({...editingProd, price: parseFloat(e.target.value)})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow text-xl font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Preț Redus / Promo (RON)</label>
                          <input 
                            type="number"
                            value={editingProd.sale_price || ''}
                            onChange={e => setEditingProd({...editingProd, sale_price: e.target.value ? parseFloat(e.target.value) : null})}
                            placeholder="Lăsați gol dacă nu există reducere"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-xl font-bold text-emerald-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'descrieri' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Descriere Completă (HTML suportat)</label>
                        <textarea 
                          rows={8}
                          value={editingProd.description || ''}
                          onChange={e => setEditingProd({...editingProd, description: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'seo' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Meta Title</label>
                        <input 
                          value={editingProd.meta_title || ''}
                          onChange={e => setEditingProd({...editingProd, meta_title: e.target.value})}
                          placeholder="Titlul pentru Google"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Meta Description</label>
                        <textarea 
                          rows={4}
                          value={editingProd.meta_description || ''}
                          onChange={e => setEditingProd({...editingProd, meta_description: e.target.value})}
                          placeholder="Descrierea pentru rezultatele căutării"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                        />
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <footer className="p-8 border-t border-gray-100 dark:border-white/[0.03] flex justify-end gap-4 bg-gray-50 dark:bg-white/[0.01]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Anulează</button>
                <button type="button" onClick={handleSave} className="px-10 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">
                  {editingProd.id ? 'Actualizează Produsul' : 'Creează Produsul'}
                </button>
              </footer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
