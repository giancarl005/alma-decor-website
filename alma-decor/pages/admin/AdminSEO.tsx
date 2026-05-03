import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface SEOPage {
  id: number;
  page_key: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

const AdminSEO: React.FC = () => {
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState<Partial<SEOPage>>({
    page_key: '',
    meta_title: '',
    meta_description: '',
    og_image: ''
  });
  const navigate = useNavigate();

  const predefinedPages = [
    { key: 'home', label: 'Acasă' },
    { key: 'shop', label: 'Magazin' },
    { key: 'blog', label: 'Blog' },
    { key: 'about', label: 'Despre Noi' },
    { key: 'contact', label: 'Contact' },
    { key: 'cart', label: 'Coș Cumpărături' },
    { key: 'checkout', label: 'Finalizare Comandă' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    fetchSEOPages();
  }, [navigate]);

  const fetchSEOPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo.php');
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/seo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPage)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsEditing(false);
        fetchSEOPages();
      }
    } catch (err) {
      alert("Eroare la salvare!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Management <span className="text-blue-600 dark:text-brand-yellow not-italic">SEO</span></h1>
          <p className="text-gray-500 text-sm font-medium">Optimizează meta tag-urile pentru paginile principale ale site-ului.</p>
        </header>

        {isEditing ? (
          <div className="admin-card rounded-[2rem] p-8 max-w-2xl animate-staggered-fade bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Pagină</label>
                <select 
                  required
                  disabled={!!currentPage.id}
                  value={currentPage.page_key}
                  onChange={e => setCurrentPage({...currentPage, page_key: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                >
                  <option value="">Alege o pagină...</option>
                  {predefinedPages.map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Meta Title</label>
                <input 
                  required
                  value={currentPage.meta_title}
                  onChange={e => setCurrentPage({...currentPage, meta_title: e.target.value})}
                  placeholder="Ex: Alma Decor - Design Interior Premium"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Meta Description</label>
                <textarea 
                  rows={3}
                  value={currentPage.meta_description}
                  onChange={e => setCurrentPage({...currentPage, meta_description: e.target.value})}
                  placeholder="O scurtă descriere pentru rezultatele Google..."
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">OG Image URL</label>
                <input 
                  value={currentPage.og_image}
                  onChange={e => setCurrentPage({...currentPage, og_image: e.target.value})}
                  placeholder="URL-ul imaginii pentru social media share"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="px-10 py-4 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md">Salvează</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-10 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-widest">Anulează</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-staggered-fade">
            {predefinedPages.map(pre => {
              const saved = pages.find(p => p.page_key === pre.key);
              return (
                <div key={pre.key} className="admin-card rounded-[2rem] p-6 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-600/30 dark:hover:border-brand-yellow/30 transition-all group shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg italic serif text-gray-900 dark:text-white">{pre.label}</h3>
                    <button 
                      onClick={() => {
                        setCurrentPage(saved || { page_key: pre.key, meta_title: '', meta_description: '', og_image: '' });
                        setIsEditing(true);
                      }}
                      className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-400 group-hover:text-blue-600 dark:group-hover:text-brand-yellow transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 line-clamp-1"><span className="font-bold text-gray-400">Title:</span> {saved?.meta_title || 'Nesetat'}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-2"><span className="font-bold text-gray-400">Desc:</span> {saved?.meta_description || 'Nesetat'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSEO;
