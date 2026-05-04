import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface FAQ {
  question: string;
  answer: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  meta_title: string;
  meta_description: string;
  faq_json: FAQ[] | null;
  schema_type: string;
  is_published: number;
  created_at: string;
}

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'faq'>('content');
  const [isUploading, setIsUploading] = useState(false);
  
  // Stare Autori
  const [mainTab, setMainTab] = useState<'articole' | 'autori'>('articole');
  const [authors, setAuthors] = useState<any[]>([]);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<any>({});
  
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: 'Admin',
    category: 'General',
    meta_title: '',
    meta_description: '',
    faq_json: [],
    schema_type: 'Article',
    is_published: 0
  });

  const navigate = useNavigate();
  const editorRef = useRef<any>(null);



  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog.php');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await fetch('/api/admin/blog_authors.php');
      const data = await res.json();
      setAuthors(data.status === 'success' ? data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    fetchPosts();
    fetchAuthors();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentPost.id ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/admin/blog.php', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPost)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsEditing(false);
        fetchPosts();
      } else {
        alert(data.message || 'Eroare la salvare');
      }
    } catch (err) {
      alert("Eroare la conexiune!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Sigur ștergi acest articol?")) return;
    try {
      const res = await fetch(`/api/admin/blog.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') fetchPosts();
    } catch (err) {
      alert("Eroare la ștergere!");
    }
  };

  // Upload pentru Imaginea Principală
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload_image.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCurrentPost(prev => ({ ...prev, featured_image: data.url }));
      } else {
        alert(data.error || 'Eroare la upload');
      }
    } catch (err) {
      alert('Eroare la conectare pentru upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAuthorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload_image.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCurrentAuthor(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Eroare la upload');
      }
    } catch (err) {
      alert('Eroare la conectare pentru upload');
    } finally {
      setIsUploading(false);
    }
  };

  const addFAQ = () => {
    setCurrentPost(prev => ({
      ...prev,
      faq_json: [...(prev.faq_json || []), { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setCurrentPost(prev => {
      const faqs = [...(prev.faq_json || [])];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faq_json: faqs };
    });
  };

  const removeFAQ = (index: number) => {
    setCurrentPost(prev => {
      const faqs = [...(prev.faq_json || [])];
      faqs.splice(index, 1);
      return { ...prev, faq_json: faqs };
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-10 max-w-[1400px]">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Management <span className="text-blue-600 dark:text-brand-yellow not-italic">Blog</span></h1>
            <p className="text-gray-500 text-sm font-medium">Creează articole și gestionează profilurile autorilor.</p>
            
            {/* Main Tabs */}
            <div className="flex gap-4 mt-6 bg-white dark:bg-white/5 p-1 rounded-xl w-fit border border-gray-100 dark:border-white/10">
              <button 
                onClick={() => setMainTab('articole')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mainTab === 'articole' ? 'bg-gray-900 text-white dark:bg-brand-yellow dark:text-gray-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                Articole
              </button>
              <button 
                onClick={() => setMainTab('autori')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mainTab === 'autori' ? 'bg-gray-900 text-white dark:bg-brand-yellow dark:text-gray-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                Despre Autori
              </button>
            </div>
          </div>
          
          {mainTab === 'articole' && !isEditing && (
            <button 
              onClick={() => {
                setIsEditing(true);
                setActiveTab('content');
                setCurrentPost({ 
                  title: '', slug: '', excerpt: '', content: '', featured_image: '', 
                  author: 'Admin', category: 'General', meta_title: '', meta_description: '', faq_json: [], 
                  schema_type: 'Article', is_published: 1 
                });
              }}
              className="px-6 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all"
            >
              Articol Nou
            </button>
          )}
          
          {mainTab === 'autori' && !isEditingAuthor && (
            <button 
              onClick={() => {
                setIsEditingAuthor(true);
                setCurrentAuthor({ 
                  name: '', image: '', description: '', is_verified: 0, 
                  stat_1_label: '', stat_1_value: '', stat_2_label: '', stat_2_value: '', stat_3_label: '', stat_3_value: '' 
                });
              }}
              className="px-6 py-3 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all"
            >
              Autor Nou
            </button>
          )}
        </header>

        {mainTab === 'articole' ? (
          <>
          {isEditing ? (
          <form onSubmit={handleSave} className="animate-in fade-in duration-300">
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 dark:border-white/10 mb-8">
              {(['content', 'seo', 'faq'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab 
                    ? 'border-brand-yellow text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  {tab === 'content' ? 'Conținut Articol' : tab === 'seo' ? 'SEO & Meta' : 'FAQ & Schema.org'}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl p-8 mb-8 shadow-sm">
              
              {/* TAB: CONTENT */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Titlu Articol</label>
                      <input 
                        required
                        value={currentPost.title}
                        onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Slug URL (opțional)</label>
                      <input 
                        value={currentPost.slug}
                        onChange={e => setCurrentPost({...currentPost, slug: e.target.value})}
                        placeholder="lasă gol pentru auto-generare"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Autor</label>
                      <select
                        value={currentPost.author}
                        onChange={e => setCurrentPost({...currentPost, author: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow appearance-none cursor-pointer"
                      >
                        <option value="Admin">Admin</option>
                        {authors.map(author => (
                          <option key={author.id} value={author.name}>{author.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Categorie</label>
                      <input 
                        list="blog-categories"
                        value={currentPost.category || ''}
                        onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                        placeholder="Ex: Noutăți, Sfaturi, Design..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                      />
                      <datalist id="blog-categories">
                        {Array.from(new Set(posts.map(p => p.category).filter(Boolean))).map((cat, idx) => (
                          <option key={idx} value={cat as string} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Imagine Principală (Upload din calculator)</label>
                    <div className="flex items-center gap-4">
                      {currentPost.featured_image && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          <img src={`${currentPost.featured_image}`} alt="Featured" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex items-center justify-center w-full bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl px-4 py-6 cursor-pointer hover:border-brand-yellow transition-colors group">
                           <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} />
                           <span className="text-sm font-bold text-gray-500 group-hover:text-brand-yellow">
                             {isUploading ? 'Se încarcă...' : 'Apasă aici pentru a alege o imagine (maxim 5MB)'}
                           </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Rezumat Scenariu (Excerpt)</label>
                    <textarea 
                      rows={2}
                      value={currentPost.excerpt}
                      onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Conținut Articol</label>
                      <span className="text-[10px] font-bold text-gray-400">Trage imagini în editor sau folosește butonul de Imagine</span>
                    </div>
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                      <Editor
                        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
                        onInit={(evt, editor) => editorRef.current = editor}
                        value={currentPost.content}
                        onEditorChange={(content) => setCurrentPost({...currentPost, content})}
                        init={{
                          height: 500,
                          menubar: false,
                          promotion: false,
                          convert_urls: false,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                          ],
                          toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'image link | removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                          images_upload_url: '/api/admin/upload_image.php',
                          images_upload_credentials: true,
                          automatic_uploads: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/20 mb-8">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Aceste informații vor apărea direct în căutările Google. Un titlu și o descriere atractive cresc rata de click (CTR).</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Meta Titlu SEO</label>
                      <span className={`text-[10px] font-bold ${(currentPost.meta_title?.length || 0) > 60 ? 'text-rose-500' : 'text-gray-400'}`}>
                        {currentPost.meta_title?.length || 0} / 60
                      </span>
                    </div>
                    <input 
                      value={currentPost.meta_title}
                      onChange={e => setCurrentPost({...currentPost, meta_title: e.target.value})}
                      placeholder="Dacă lipsește, se folosește titlul articolului"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Meta Descriere</label>
                      <span className={`text-[10px] font-bold ${(currentPost.meta_description?.length || 0) > 160 ? 'text-rose-500' : 'text-gray-400'}`}>
                        {currentPost.meta_description?.length || 0} / 160
                      </span>
                    </div>
                    <textarea 
                      rows={3}
                      value={currentPost.meta_description}
                      onChange={e => setCurrentPost({...currentPost, meta_description: e.target.value})}
                      placeholder="Scurt rezumat captivant. Dacă lipsește, se folosește Excerpt-ul."
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB: FAQ & SCHEMA */}
              {activeTab === 'faq' && (
                <div className="space-y-8 max-w-4xl">
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/20">
                    <p className="text-sm text-purple-800 dark:text-purple-300 font-medium mb-2">Întrebările Frecvente se vor afișa vizual la finalul articolului și vor genera automat cod <strong>FAQPage Schema</strong> invizibil pentru Google, crescând șansele să apari în snippet-urile speciale ("People also ask").</p>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Tip Schema.org</label>
                     <select 
                       value={currentPost.schema_type}
                       onChange={e => setCurrentPost({...currentPost, schema_type: e.target.value})}
                       className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                     >
                       <option value="Article">Article (Standard)</option>
                       <option value="NewsArticle">NewsArticle (Știri/Anunțuri)</option>
                       <option value="BlogPosting">BlogPosting (Postare de Blog)</option>
                     </select>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Întrebări și Răspunsuri (FAQ)</h3>
                    
                    <div className="space-y-4 mb-6">
                      {currentPost.faq_json?.map((faq, idx) => (
                        <div key={idx} className="p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl relative group">
                          <button 
                            type="button" 
                            onClick={() => removeFAQ(idx)}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >✕</button>
                          
                          <input 
                            placeholder="Întrebare (ex: Cât durează montajul?)"
                            value={faq.question}
                            onChange={(e) => updateFAQ(idx, 'question', e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 border-none rounded-lg px-4 py-2 text-sm outline-none mb-3 font-bold"
                          />
                          <textarea 
                            placeholder="Răspuns complet..."
                            value={faq.answer}
                            rows={2}
                            onChange={(e) => updateFAQ(idx, 'answer', e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 border-none rounded-lg px-4 py-2 text-sm outline-none resize-none"
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      type="button" 
                      onClick={addFAQ}
                      className="px-6 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-yellow hover:border-brand-yellow transition-colors w-full"
                    >
                      + Adaugă Întrebare (FAQ)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-2xl">
              <div className="flex-grow flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentPost.is_published === 1}
                    onChange={e => setCurrentPost({...currentPost, is_published: e.target.checked ? 1 : 0})}
                    className="w-5 h-5 accent-brand-yellow"
                  />
                  <span className="font-bold text-sm">Publică Imediat</span>
                </label>
              </div>

              <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Anulează</button>
              <button type="submit" className="px-10 py-3 bg-brand-yellow text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-yellow/20 hover:scale-105 transition-all">Salvează Articolul</button>
            </div>
          </form>
        ) : (
          <div className="admin-card rounded-[2rem] overflow-hidden bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[8px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Titlu Articol</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Autor</th>
                  <th className="px-8 py-4">Dată</th>
                  <th className="px-8 py-4 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.02]">
                {loading ? (
                  <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-medium">Se încarcă articolele...</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-medium">Niciun articol găsit. Scrie primul articol!</td></tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-5">
                        <p className="text-[11px] font-bold text-gray-900 dark:text-white group-hover:text-brand-yellow transition-colors">{post.title}</p>
                        <p className="text-[9px] text-gray-400 font-medium">/{post.slug}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${post.is_published ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                          {post.is_published ? 'Publicat' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[10px] font-bold text-gray-500">{post.author}</td>
                      <td className="px-8 py-5 text-[10px] font-bold text-gray-500">{new Date(post.created_at).toLocaleDateString('ro-RO')}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/admin/blog.php?id=${post.id}`);
                                const fullPost = await res.json();
                                setCurrentPost(fullPost);
                                setIsEditing(true);
                                setActiveTab('content');
                              } catch(e) {
                                alert("Eroare la preluarea datelor!");
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-brand-yellow transition-colors bg-gray-50 dark:bg-white/5 rounded-lg"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-rose-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-lg"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
          </>
        ) : (
          /* AUTHORS TAB */
          <>
            {isEditingAuthor ? (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const method = currentAuthor.id ? 'PUT' : 'POST';
                  try {
                    const res = await fetch('/api/admin/blog_authors.php', {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(currentAuthor)
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                      setIsEditingAuthor(false);
                      fetchAuthors();
                    } else alert(data.message || 'Eroare la salvare');
                  } catch (err) { alert("Eroare!"); }
                }} 
                className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm animate-in fade-in"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Nume Autor</label>
                    <input required value={currentAuthor.name} onChange={e => setCurrentAuthor({...currentAuthor, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Poză Profil (Upload din calculator)</label>
                    <div className="flex items-center gap-4">
                      {currentAuthor.image && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-yellow">
                          <img src={`${currentAuthor.image}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex items-center justify-center w-full bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl px-4 py-4 cursor-pointer hover:border-brand-yellow transition-colors group">
                           <input type="file" accept="image/*" className="hidden" onChange={handleAuthorImageUpload} />
                           <span className="text-sm font-bold text-gray-500 group-hover:text-brand-yellow">
                             {isUploading ? 'Se încarcă...' : 'Apasă aici pentru upload imagine'}
                           </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Descriere</label>
                  <textarea rows={3} value={currentAuthor.description || ''} onChange={e => setCurrentAuthor({...currentAuthor, description: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow" />
                </div>
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={currentAuthor.is_verified === 1} onChange={e => setCurrentAuthor({...currentAuthor, is_verified: e.target.checked ? 1 : 0})} className="w-5 h-5 accent-brand-yellow" />
                    <span className="font-bold text-sm">Verified Expert</span>
                  </label>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-yellow mb-4 border-b border-white/10 pb-2">Statistici (Bază Caseta)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <input placeholder="Label 1 (ex: INGINERIE)" value={currentAuthor.stat_1_label || ''} onChange={e => setCurrentAuthor({...currentAuthor, stat_1_label: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 mb-2 text-xs" />
                    <input placeholder="Valoare 1 (ex: Inginer din 2000)" value={currentAuthor.stat_1_value || ''} onChange={e => setCurrentAuthor({...currentAuthor, stat_1_value: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                  <div>
                    <input placeholder="Label 2 (ex: SPECIALIZARE)" value={currentAuthor.stat_2_label || ''} onChange={e => setCurrentAuthor({...currentAuthor, stat_2_label: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 mb-2 text-xs" />
                    <input placeholder="Valoare 2 (ex: Piscine din 2007)" value={currentAuthor.stat_2_value || ''} onChange={e => setCurrentAuthor({...currentAuthor, stat_2_value: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                  <div>
                    <input placeholder="Label 3 (ex: PROIECTE)" value={currentAuthor.stat_3_label || ''} onChange={e => setCurrentAuthor({...currentAuthor, stat_3_label: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 mb-2 text-xs" />
                    <input placeholder="Valoare 3 (ex: 500+ Finalizate)" value={currentAuthor.stat_3_value || ''} onChange={e => setCurrentAuthor({...currentAuthor, stat_3_value: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsEditingAuthor(false)} className="px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-xl font-bold text-[10px] uppercase">Anulează</button>
                  <button type="submit" className="px-6 py-2 bg-brand-yellow text-gray-900 rounded-xl font-bold text-[10px] uppercase shadow-md hover:scale-105 transition-all">Salvează Autor</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {authors.map(author => (
                  <div key={author.id} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:border-brand-yellow transition-all group relative">
                    <img src={author.image || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-full object-cover border-2 border-brand-yellow/30" />
                    <div className="flex-1 pr-6">
                      <h3 className="text-lg font-bold flex flex-wrap items-center gap-2">
                        {author.name}
                        {author.is_verified === 1 && <span className="bg-emerald-500/10 text-emerald-500 text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">Verified</span>}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{author.description}</p>
                    </div>
                    <button onClick={() => { setCurrentAuthor(author); setIsEditingAuthor(true); }} className="absolute top-6 right-6 text-gray-400 hover:text-brand-yellow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminBlog;
