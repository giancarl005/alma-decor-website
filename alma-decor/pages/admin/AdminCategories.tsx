import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import * as Icons from '../../components/admin/AdminIcons';

import { Editor } from '@tinymce/tinymce-react';

interface Categorie {
  id: number;
  name: string;
  slug: string;
  description: string;
  description_top: string;
  description_bottom: string;
  image: string;
  parent_id: number | null;
  sort_order: number;
}

const AdminCategories: React.FC = () => {
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Partial<Categorie> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCategorii = async () => {
    try {
      const response = await fetch('/api/admin/categorii.php');
      const data = await response.json();
      setCategorii(Array.isArray(data) ? data : []);
    } catch (err) {
      setCategorii([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload_image.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEditingCat({ ...editingCat!, image: data.url });
      } else {
        alert(data.error || 'Eroare la încărcare');
      }
    } catch (err) {
      console.error(err);
      alert('Eroare la încărcarea imaginii');
    }
  };

  const handleSave = async () => {
    if (!editingCat?.name) return;
    try {
      const isUpdate = !!editingCat.id;
      const response = await fetch('/api/admin/categorii.php', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCat)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setIsModalOpen(false);
        fetchCategorii();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Sigur vrei să ștergi această categorie?')) return;
    try {
      const response = await fetch(`/api/admin/categorii.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchCategorii();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    fetchCategorii();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Structură <span className="text-blue-600 dark:text-brand-yellow not-italic">Categorii</span></h1>
            <p className="text-gray-500 text-sm font-medium">Organizarea ierarhică a catalogului Alma Decor.</p>
          </div>
          <button 
            onClick={() => { setEditingCat({ name: '', slug: '', parent_id: null, sort_order: 0 }); setIsModalOpen(true); }}
            className="px-6 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all"
          >
            + Adaugă Segment
          </button>
        </header>

        <div className="admin-card rounded-[2rem] overflow-hidden bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.02] text-gray-400 dark:text-gray-500 text-[9px] font-medium uppercase tracking-widest border-b border-gray-100 dark:border-white/[0.03]">
                <th className="px-8 py-5 font-medium">Nume Segment</th>
                <th className="px-8 py-5 font-medium">Resursă (Slug)</th>
                <th className="px-8 py-5 text-center font-medium">Părinte</th>
                <th className="px-8 py-5 text-center font-medium">Prioritate</th>
                <th className="px-8 py-5 text-right font-medium">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.02]">
              {categorii.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-5">
                    <div className="font-medium text-gray-900 dark:text-white text-base leading-none mb-1">{cat.name}</div>
                    <div className="text-[9px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest">Nivel Arhitectural</div>
                  </td>
                  <td className="px-8 py-5 font-mono text-[10px] text-blue-600/70 dark:text-brand-yellow/70 italic">
                    /{cat.slug}
                  </td>
                  <td className="px-8 py-5 text-center text-gray-500 dark:text-gray-400 font-medium italic serif text-sm">
                    {cat.parent_id ? categorii.find(c => c.id === cat.parent_id)?.name : '-'}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex w-8 h-8 bg-gray-100 dark:bg-white/5 rounded-lg items-center justify-center font-medium text-gray-900 dark:text-white text-[10px] border border-gray-200 dark:border-white/5 shadow-sm">{cat.sort_order}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingCat(cat); setIsModalOpen(true); }} 
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-brand-yellow transition-all"
                        title="Editează"
                      >
                        <Icons.IconEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="p-2 text-gray-400 hover:text-rose-500 transition-all"
                        title="Șterge"
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

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-brand-dark w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
              <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-10 sticky top-0 bg-white dark:bg-brand-dark z-10 pb-4">
                  <div>
                    <h2 className="text-3xl font-bold italic serif tracking-tighter">
                      {editingCat?.id ? 'Editează' : 'Adaugă'} <span className="text-blue-600 dark:text-brand-yellow not-italic">Segment</span>
                    </h2>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Configurare structură catalog</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">✕</button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nume Categorie</label>
                        <input 
                          value={editingCat?.name || ''}
                          onChange={e => setEditingCat({...editingCat!, name: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                          placeholder="Ex: Profile Decorative"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Slug (URL)</label>
                          <input 
                            value={editingCat?.slug || ''}
                            onChange={e => setEditingCat({...editingCat!, slug: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-blue-600/70 dark:text-brand-yellow/70"
                            placeholder="Ex: profile-decorative"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Prioritate</label>
                          <input 
                            type="number"
                            value={editingCat?.sort_order || 0}
                            onChange={e => setEditingCat({...editingCat!, sort_order: parseInt(e.target.value) || 0})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Categorie Părinte</label>
                        <select
                          value={editingCat?.parent_id || ''}
                          onChange={e => setEditingCat({...editingCat!, parent_id: e.target.value ? parseInt(e.target.value) : null})}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none text-gray-900 dark:text-white"
                        >
                          <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Fără părinte (Root)</option>
                          {categorii.filter(c => c.id !== editingCat?.id).map(c => (
                            <option key={c.id} value={c.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="space-y-6">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Imagine Reprezentativă</label>
                      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group cursor-pointer">
                        {editingCat?.image ? (
                          <img src={editingCat.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <Icons.IconPlus className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Încarcă Imagine</span>
                          </div>
                        )}
                        {editingCat?.image && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none">Schimbă Imaginea</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TinyMCE Editors */}
                  <div className="space-y-8 pt-6 border-t border-gray-100 dark:border-white/5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Descriere Superioară (Top - SEO)</label>
                      <Editor
                        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
                        value={editingCat?.description_top || ''}
                        onEditorChange={(content) => setEditingCat({...editingCat!, description_top: content})}
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: ['link', 'lists', 'table', 'code'],
                          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link table code',
                          content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; background: transparent; color: #333; }'
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Descriere Inferioară (Bottom - SEO Extra)</label>
                      <Editor
                        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
                        value={editingCat?.description_bottom || ''}
                        onEditorChange={(content) => setEditingCat({...editingCat!, description_bottom: content})}
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: ['link', 'lists', 'table', 'code'],
                          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link table code',
                          content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; background: transparent; color: #333; }'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-12 sticky bottom-0 bg-white dark:bg-brand-dark pt-4 border-t border-gray-100 dark:border-white/5">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-50 dark:bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                  >
                    Anulează
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-grow-[2] py-4 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 font-bold text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingCat?.id ? 'Salvează Modificările' : 'Creează Categorie'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;
