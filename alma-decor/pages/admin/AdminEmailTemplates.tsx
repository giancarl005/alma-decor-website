import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface EmailTemplate {
  id: number;
  template_key: string;
  subject: string;
  body_html: string;
}

const AdminEmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<EmailTemplate>>({
    template_key: '',
    subject: '',
    body_html: ''
  });
  const navigate = useNavigate();

  const predefinedTemplates = [
    { key: 'order_confirmation', label: 'Confirmare Comandă' },
    { key: 'order_status_update', label: 'Actualizare Status Comandă' },
    { key: 'new_account', label: 'Cont Nou Creat' },
    { key: 'password_reset', label: 'Recuperare Parolă' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    fetchTemplates();
  }, [navigate]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email_templates.php');
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/email_templates.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTemplate)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsEditing(false);
        fetchTemplates();
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
          <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Template-uri <span className="text-blue-600 dark:text-brand-yellow not-italic">Email</span></h1>
          <p className="text-gray-500 text-sm font-medium">Personalizează mesajele automate trimise către clienți.</p>
        </header>

        {isEditing ? (
          <div className="admin-card rounded-[2rem] p-8 max-w-4xl animate-staggered-fade bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Tip Email</label>
                <select 
                  required
                  disabled={!!currentTemplate.id}
                  value={currentTemplate.template_key}
                  onChange={e => setCurrentTemplate({...currentTemplate, template_key: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                >
                  <option value="">Alege un template...</option>
                  {predefinedTemplates.map(t => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Subiect Email</label>
                <input 
                  required
                  value={currentTemplate.subject}
                  onChange={e => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
                  placeholder="Ex: Confirmare comanda ta pe Alma Decor"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Conținut HTML</label>
                  <span className="text-[9px] text-gray-400 italic">Folosește variabile precum {"{customer_name}"}, {"{order_id}"}</span>
                </div>
                <textarea 
                  required
                  rows={15}
                  value={currentTemplate.body_html}
                  onChange={e => setCurrentTemplate({...currentTemplate, body_html: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-600 dark:focus:border-brand-yellow font-mono text-xs text-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="px-10 py-4 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all">Salvează Template</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-10 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Anulează</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-staggered-fade">
            {predefinedTemplates.map(pre => {
              const saved = templates.find(t => t.template_key === pre.key);
              return (
                <div key={pre.key} className="admin-card rounded-[2rem] p-8 flex flex-col bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-600/30 dark:hover:border-brand-yellow/30 transition-all group shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 dark:group-hover:text-brand-yellow transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <button 
                      onClick={() => {
                        setCurrentTemplate(saved || { template_key: pre.key, subject: '', body_html: '' });
                        setIsEditing(true);
                      }}
                      className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:bg-blue-600 dark:group-hover:bg-brand-yellow group-hover:text-white dark:group-hover:text-gray-900 transition-all"
                    >
                      Editează
                    </button>
                  </div>
                  <h3 className="text-xl font-bold italic serif text-gray-900 dark:text-white mb-2">{pre.label}</h3>
                  <p className="text-[10px] text-gray-500 font-medium mb-4"><span className="text-gray-400">Subiect:</span> {saved?.subject || 'Nepersonalizat'}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${saved ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">{saved ? 'Personalizat' : 'Sistem Default'}</span>
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

export default AdminEmailTemplates;
