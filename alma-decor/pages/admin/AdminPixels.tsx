import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminPixels: React.FC = () => {
  const [pixels, setPixels] = useState<any>({
    pixel_facebook: '',
    pixel_google_analytics: '',
    pixel_google_tag_manager: '',
    pixel_tiktok: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    fetchPixels();
  }, [navigate]);

  const fetchPixels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pixels.php');
      const data = await res.json();
      setPixels(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/pixels.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pixels)
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert("Configurații salvate cu succes!");
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
          <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Script <span className="text-blue-600 dark:text-brand-yellow not-italic">Manager</span></h1>
          <p className="text-gray-500 text-sm font-medium">Gestionează codurile de tracking pentru marketing și analytics.</p>
        </header>

        <div className="admin-card rounded-[2rem] p-8 max-w-2xl animate-staggered-fade bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Facebook Pixel ID</label>
                <input 
                  value={pixels.pixel_facebook}
                  onChange={e => setPixels({...pixels, pixel_facebook: e.target.value})}
                  placeholder="Ex: 123456789012345"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Google Analytics (G-ID)</label>
                <input 
                  value={pixels.pixel_google_analytics}
                  onChange={e => setPixels({...pixels, pixel_google_analytics: e.target.value})}
                  placeholder="Ex: G-XXXXXXXXXX"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Google Tag Manager (GTM-ID)</label>
                <input 
                  value={pixels.pixel_google_tag_manager}
                  onChange={e => setPixels({...pixels, pixel_google_tag_manager: e.target.value})}
                  placeholder="Ex: GTM-XXXXXXX"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">TikTok Pixel ID</label>
                <input 
                  value={pixels.pixel_tiktok}
                  onChange={e => setPixels({...pixels, pixel_tiktok: e.target.value})}
                  placeholder="Ex: CXXXXXXXXXXXXXXXXXXXX"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>
            </div>

            <button type="submit" className="px-10 py-4 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all">
              Salvează Configurația
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPixels;
