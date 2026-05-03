import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import * as Icons from '../../components/admin/AdminIcons';

const AdminImport: React.FC = () => {
  const [fileData, setFileData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<any>({ name: '', price: '', sku: '', short_description: '', description: '', brand: '', image: '', gallery: '' });
  const [markup, setMarkup] = useState(0);
  const [selectedCat, setSelectedCat] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('alma_admin_token');
    if (!token) navigate('/admin/login');
    
    fetch('/api/admin/categorii.php')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([{id:1, name:'Parchet'}]));

    fetchLogs();
  }, [navigate]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs.php');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.endsWith('.csv')) {
        const rows = text.split('\n').map(row => row.split(','));
        setHeaders(rows[0]);
        setFileData(rows.slice(1));
      } else if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          setHeaders(Object.keys(json[0]));
          setFileData(json.map(obj => Object.values(obj)));
        }
      }
    };
    reader.readAsText(file);
  };

  const startImport = async () => {
    if (!selectedCat) return alert("Selectează o categorie!");
    setLoading(true);
    try {
      const response = await fetch('/api/admin/import.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: fileData,
          mapping,
          markup,
          category_id: selectedCat
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Eroare la import!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <AdminSidebar />

      <main className="ml-64 flex-grow p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Motor <span className="text-blue-600 dark:text-brand-yellow not-italic">Sincronizare</span></h1>
            <p className="text-gray-500 text-sm font-medium">Sincronizarea catalogului cu sursele externe de date.</p>
          </div>
          <div className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm text-gray-900 dark:text-white">
             Status: <span className="text-blue-600 dark:text-brand-yellow">{fileData.length ? 'Ready' : 'Waiting'}</span>
          </div>
        </header>

        {!fileData.length ? (
          <div className="admin-card rounded-[3rem] p-24 text-center border-dashed border-2 border-gray-200 dark:border-white/5 group hover:border-blue-600/30 dark:hover:border-brand-yellow/30 transition-all shadow-sm">
            <div className="flex justify-center mb-8 text-gray-300 dark:text-gray-700 group-hover:text-blue-600 dark:group-hover:text-brand-yellow transition-colors scale-150">
              <Icons.IconImport />
            </div>
            <h2 className="text-3xl font-bold italic serif mb-4 text-gray-900 dark:text-white">Încarcă Fluxul de Date</h2>
            <p className="text-gray-500 text-base mb-10 max-w-md mx-auto leading-relaxed font-medium">Acceptă fișiere CSV sau JSON structurate pentru import masiv în baza de date.</p>
            <input 
              type="file" 
              accept=".csv,.json"
              id="fileInput"
              className="hidden" 
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="fileInput"
              className="px-10 py-4 bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-black dark:hover:bg-brand-yellow/80 transition-all inline-block shadow-md"
            >
              Selectează Fișierul
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-staggered-fade">
            <div className="lg:col-span-1 space-y-10">
              <div className="admin-card p-8 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8 italic serif border-b border-gray-100 dark:border-white/5 pb-4">01. Mapare Câmpuri</h3>
                <div className="space-y-5">
                  {[
                    { key: 'name', label: 'Nume' },
                    { key: 'price', label: 'Preț' },
                    { key: 'sku', label: 'SKU' },
                    { key: 'brand', label: 'Brand' },
                    { key: 'image', label: 'Imagine' }
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">{field.label}</label>
                      <select 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold uppercase outline-none focus:border-blue-600 dark:focus:border-brand-yellow appearance-none cursor-pointer text-gray-700 dark:text-white"
                        value={mapping[field.key]}
                        onChange={e => setMapping({...mapping, [field.key]: parseInt(e.target.value)})}
                      >
                        <option value="">Alege...</option>
                        {headers.map((h, i) => <option key={i} value={i}>{h || `Col ${i+1}`}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card p-8 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8 italic serif border-b border-gray-100 dark:border-white/5 pb-4">02. Configurație</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">Segment Destinație</label>
                    <select 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold outline-none focus:border-blue-600 dark:focus:border-brand-yellow appearance-none cursor-pointer text-gray-700 dark:text-white"
                      value={selectedCat}
                      onChange={e => setSelectedCat(e.target.value)}
                    >
                      <option value="">Alege...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">Adaos Procentual (%)</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold outline-none focus:border-blue-600 dark:focus:border-brand-yellow text-gray-700 dark:text-white"
                      value={markup}
                      onChange={e => setMarkup(parseInt(e.target.value) || 0)}
                      placeholder="Ex: 20"
                    />
                  </div>
                </div>
              </div>

              {logs.length > 0 && (
                <div className="admin-card p-8 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
                  <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 italic serif border-b border-gray-100 dark:border-white/5 pb-4">Istoric Sincronizare</h3>
                  <div className="space-y-4">
                    {logs.map((log, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-gray-50 dark:border-white/[0.02] pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-[10px] font-bold text-gray-900 dark:text-white">{new Date(log.created_at).toLocaleDateString('ro-RO')}</p>
                          <p className="text-[8px] text-gray-400 uppercase tracking-widest">{log.source_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-emerald-500">+{log.added_count + log.updated_count}</p>
                          {log.errors_count > 0 && <p className="text-[8px] font-bold text-rose-500">{log.errors_count} Erori</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={startImport}
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? 'Sincronizare...' : 'Execută Importul'}
              </button>
            </div>

            <div className="lg:col-span-2 space-y-10">
              {result && (
                <div className="admin-card p-8 rounded-[2rem] bg-emerald-500/5 border-emerald-500/20">
                   <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     Import Finalizat
                   </h3>
                   <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Adăugate</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{result.added || 0}</p>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Actualizate</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{result.updated || 0}</p>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Erori</p>
                        <p className="text-2xl font-black text-rose-500">{result.errors || 0}</p>
                      </div>
                   </div>
                </div>
              )}

              <div className="admin-card rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/[0.03] flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
                  <h3 className="text-lg font-bold serif italic text-gray-900 dark:text-white">Previzualizare Flux</h3>
                  <button onClick={() => { setFileData([]); setResult(null); }} className="text-rose-600 dark:text-rose-500 text-[9px] font-bold uppercase tracking-widest hover:underline">Abandon</button>
                </div>
                <div className="overflow-x-auto max-h-[600px] scrollbar-hide">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[8px] font-bold uppercase tracking-widest">
                      <tr>
                        {headers.map((h, i) => <th key={i} className="px-6 py-4">{h || `Col ${i+1}`}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.02]">
                      {fileData.slice(0, 10).map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell: any, ci: number) => <td key={ci} className="px-6 py-4 text-gray-600 dark:text-gray-400 text-[10px] truncate max-w-[150px]">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) }
      </main>
    </div>
  );
};

export default AdminImport;
