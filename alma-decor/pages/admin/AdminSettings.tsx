import React, { useState, useEffect } from 'react';
import { AdminSaveIcon, AdminFacebookIcon, AdminInstagramIcon, AdminLinkedInIcon, AdminTikTokIcon } from '../../components/admin/AdminIcons';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_tiktok: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings.php')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Setările au fost salvate cu succes!' });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Eroare: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse text-gray-400">Se încarcă setările...</div>;
  }

  return (
    <div className="p-8 max-w-4xl animate-staggered-fade">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold italic serif tracking-tighter text-gray-900 dark:text-white">
            Setări Site<span className="text-blue-600 dark:text-brand-yellow not-italic ml-2">.</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mt-2">
            Configurare identitate socială și parametri globali
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? 'Se salvează...' : (
            <>
              <AdminSaveIcon />
              Salvează Modificările
            </>
          )}
        </button>
      </header>

      {message && (
        <div className={`mb-8 p-4 rounded-xl text-sm font-bold border ${
          message.type === 'success' 
          ? 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/10 dark:border-green-900/20' 
          : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/10 dark:border-red-900/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-800"></span>
            Rețele Sociale
          </h2>
          
          <div className="space-y-6">
            {/* Facebook */}
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Facebook URL</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-brand-yellow transition-colors">
                  <AdminFacebookIcon />
                </div>
                <input 
                  type="text" 
                  value={settings.social_facebook}
                  onChange={(e) => setSettings({...settings, social_facebook: e.target.value})}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow transition-all"
                />
              </div>
            </div>

            {/* Instagram */}
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Instagram URL</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-brand-yellow transition-colors">
                  <AdminInstagramIcon />
                </div>
                <input 
                  type="text" 
                  value={settings.social_instagram}
                  onChange={(e) => setSettings({...settings, social_instagram: e.target.value})}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow transition-all"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">LinkedIn URL</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-brand-yellow transition-colors">
                  <AdminLinkedInIcon />
                </div>
                <input 
                  type="text" 
                  value={settings.social_linkedin}
                  onChange={(e) => setSettings({...settings, social_linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow transition-all"
                />
              </div>
            </div>

            {/* TikTok */}
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">TikTok URL</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-brand-yellow transition-colors">
                  <AdminTikTokIcon />
                </div>
                <input 
                  type="text" 
                  value={settings.social_tiktok}
                  onChange={(e) => setSettings({...settings, social_tiktok: e.target.value})}
                  placeholder="https://tiktok.com/@..."
                  className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-brand-yellow transition-all"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
