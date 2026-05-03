import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { IconSearch, IconDownload, IconCheck, IconExternalLink, IconLoader, IconTrash } from '../../components/admin/AdminIcons';

const AdminScraper: React.FC = () => {
    const [url, setUrl] = useState('');
    const [supplier, setSupplier] = useState('nmc');
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, delay: 7 });
    const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(3); // Default to Profile Decorative
    const [importStockStatus, setImportStockStatus] = useState<string>('in_stoc');
    const [newCategoryName, setNewCategoryName] = useState('');
    const abortRef = useRef(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categorii.php');
            const data = await response.json();
            // categorii.php returns array directly for GET
            if (Array.isArray(data)) {
                setCategories(data);
            } else if (data.status === 'success') {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handlePreview = async () => {
        if (!url) return;
        setLoading(true);
        setStatus(null);
        setResults(null);
        abortRef.current = false;

        try {
            const response = await fetch('/api/admin/scraper.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, action: 'preview', supplier })
            });
            const data = await response.json();
            if (data.status === 'success') {
                if (data.type === 'category') {
                    const products = data.data.product_urls.map((pUrl: string) => ({
                        url: pUrl,
                        status: 'pending',
                        name: 'Așteptare...',
                        imported: false
                    }));
                    setResults({ ...data, products });
                    setBatchProgress({ ...batchProgress, total: products.length, current: 0 });
                } else {
                    setResults(data);
                }
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Eroare la conectarea cu serverul.' });
        } finally {
            setLoading(false);
        }
    };

    const importSingleProduct = async (productUrl: string) => {
        try {
            const response = await fetch('/api/admin/scraper.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url: productUrl, 
                    action: 'scrape_and_import', 
                    category_id: selectedCategoryId,
                    stock_status: importStockStatus,
                    new_category: newCategoryName,
                    supplier
                })
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Eroare conexiune' };
        }
    };

    const handleBatchImport = async () => {
        if (!results || results.type !== 'category') return;
        setImporting(true);
        abortRef.current = false;
        
        const products = [...results.products];
        for (let i = 0; i < products.length; i++) {
            if (abortRef.current) break;
            if (products[i].imported || products[i].status === 'success') continue;

            setBatchProgress(prev => ({ ...prev, current: i + 1 }));
            products[i].status = 'loading';
            setResults({ ...results, products });

            try {
                const res = await importSingleProduct(products[i].url);
                if (res.status === 'success') {
                    products[i].status = 'success';
                    products[i].imported = true;
                    products[i].name = "Importat cu succes";
                } else {
                    products[i].status = 'error';
                    products[i].name = res.message || "Eroare necunoscută";
                }
            } catch (e) {
                products[i].status = 'error';
                products[i].name = "Eroare conexiune";
            }
            
            setResults({ ...results, products });

            if (i < products.length - 1 && !abortRef.current) {
                await new Promise(resolve => setTimeout(resolve, batchProgress.delay * 1000));
            }
        }
        setImporting(false);
        setStatus({ type: 'success', message: 'Procesul de import s-a finalizat.' });
    };

    const handleSingleImport = async (index: number) => {
        if (results.type === 'category') {
            const products = [...results.products];
            const product = products[index];
            product.status = 'loading';
            setResults({ ...results, products });

            const res = await importSingleProduct(product.url);
            if (res.status === 'success') {
                product.status = 'success';
                product.imported = true;
                product.name = "Importat cu succes";
            } else {
                product.status = 'error';
                product.name = res.message || "Eroare necunoscută";
            }
            setResults({ ...results, products });
        } else {
            setLoading(true);
            const res = await importSingleProduct(results.data.url);
            if (res.status === 'success') {
                setResults({ ...results, imported: true });
                setStatus({ type: 'success', message: 'Produsul a fost importat.' });
            } else {
                setStatus({ type: 'error', message: res.message || 'Eroare import.' });
            }
            setLoading(false);
        }
    };

    const handleRemoveItem = (index: number) => {
        if (results && results.type === 'category') {
            const products = [...results.products];
            products.splice(index, 1);
            setResults({ ...results, products });
            setBatchProgress(prev => ({ ...prev, total: products.length }));
        }
    };

    const handleClearResults = () => {
        setResults(null);
        setStatus(null);
        setUrl('');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <AdminSidebar />
            
            <main className="ml-64 flex-grow p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold italic serif tracking-tighter mb-2">Scraper <span className="text-blue-600 dark:text-brand-yellow not-italic">Produse</span></h1>
                            <p className="text-gray-500 text-sm font-medium">Importă produse automat cu limitare de timp</p>
                        </div>
                    </div>

                    {/* Search & Config Box */}
                    <div className="bg-white dark:bg-white/[0.02] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-8 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Furnizor</label>
                                <select 
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 dark:text-white cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/[0.08]"
                                >
                                    <option value="nmc" className="bg-white dark:bg-gray-900">NMC Romania</option>
                                    <option value="mardom" className="bg-white dark:bg-gray-900">Mardom Decor</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">URL Furnizor (Produs sau Categorie)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                        <IconSearch size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Introduceți URL-ul..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-1 flex flex-col">
                                <label className="text-[10px] font-bold text-transparent mb-3 block opacity-0">Action</label>
                                <button 
                                    onClick={handlePreview}
                                    disabled={loading || !url}
                                    className="w-full h-[48px] bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-yellow/10 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <IconLoader className="animate-spin" size={16} /> : <IconDownload size={16} />}
                                    {loading ? 'Analizează...' : 'Previzualizare'}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Categorie Destinație</label>
                                <select
                                    value={selectedCategoryId}
                                    disabled={!!newCategoryName}
                                    onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 dark:text-white cursor-pointer disabled:opacity-30 transition-all"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Sau Categorie Nouă</label>
                                <input 
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nume categorie..."
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Status Stoc</label>
                                <select
                                    value={importStockStatus}
                                    onChange={(e) => setImportStockStatus(e.target.value as any)}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                                >
                                    <option value="in_stoc" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">În stoc</option>
                                    <option value="stoc_online" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">În stocul online</option>
                                    <option value="stoc_epuizat" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Stoc epuizat</option>
                                    <option value="precomanda" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Precomandă</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Delay (Sec)</label>
                                <input 
                                    type="number" 
                                    value={batchProgress.delay}
                                    onChange={(e) => setBatchProgress({...batchProgress, delay: parseInt(e.target.value) || 5})}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-blue-600 dark:text-brand-yellow"
                                />
                            </div>
                        </div>
                    </div>

                    {status && (
                        <div className={`p-5 rounded-2xl mb-8 text-sm flex items-center gap-4 border ${
                            status.type === 'success' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' : 'bg-red-500/5 text-red-600 border-red-500/10'
                        }`}>
                            {status.type === 'success' ? <IconCheck size={16} /> : "!"}
                            <p className="font-semibold">{status.message}</p>
                        </div>
                    )}

                    {importing && (
                        <div className="mb-8 bg-white dark:bg-white/5 p-6 rounded-3xl border border-blue-100 dark:border-brand-yellow/10 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Progres Import Automat</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-brand-yellow">{batchProgress.current} / {batchProgress.total}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 dark:bg-brand-yellow transition-all duration-500" 
                                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-[10px] text-gray-400 font-medium italic">Anti-blocare activă. Se așteaptă între solicitări.</p>
                                <button onClick={() => { abortRef.current = true; setImporting(false); }} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline">Oprește</button>
                            </div>
                        </div>
                    )}

                    {results && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <h2 className="text-xl font-bold italic serif tracking-tight">
                                    {results.type === 'category' ? `Rezultate Găsite (${results.products.length})` : 'Produs Găsit'}
                                </h2>
                                {results.type === 'category' && !importing && (
                                    <div className="flex gap-4">
                                        <button onClick={handleClearResults} className="px-6 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-white/20 transition-all">Anulează / Golește</button>
                                        <button onClick={handleBatchImport} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-lg hover:scale-105 transition-all">Importă Tot în Categoria Selectată</button>
                                    </div>
                                )}
                            </div>
                            
                            {results.type === 'category' ? (
                                <div className="bg-white dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-white/5 text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-white/5">
                                                <th className="px-8 py-5 w-16">Nr.</th>
                                                <th className="px-8 py-5">URL Produs</th>
                                                <th className="px-8 py-5 text-center">Status / Mesaj</th>
                                                <th className="px-8 py-5 text-right">Acțiune</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {results.products.map((item: any, idx: number) => (
                                                <tr key={idx} className={item.status === 'success' ? 'bg-emerald-500/5' : ''}>
                                                    <td className="px-8 py-4 text-[11px] font-mono text-gray-400">{idx + 1}</td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate max-w-sm">{item.url}</span>
                                                            <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-500"><IconExternalLink size={14} /></a>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4 text-center">
                                                        {item.status === 'pending' && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">În așteptare</span>}
                                                        {item.status === 'loading' && <IconLoader className="animate-spin mx-auto text-blue-500" size={16} />}
                                                        {item.status === 'success' && <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1"><IconCheck size={12} /> Importat</span>}
                                                        {item.status === 'error' && <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block">{item.name}</span>}
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        {!item.imported && !importing && (
                                                            <div className="flex justify-end gap-6">
                                                                <button onClick={() => handleRemoveItem(idx)} className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1 group">
                                                                    <IconTrash size={12} className="group-hover:scale-110 transition-transform" />
                                                                    Șterge
                                                                </button>
                                                                <button onClick={() => handleSingleImport(idx)} className="text-[9px] font-bold text-blue-600 dark:text-brand-yellow uppercase tracking-widest hover:underline">Importă</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 p-8 flex gap-8 items-center shadow-sm">
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
                                        <img src={results.data.primary_image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-bold text-blue-600 dark:text-brand-yellow uppercase tracking-widest mb-2">{results.data.sku}</div>
                                        <h3 className="text-2xl font-bold italic serif mb-4">{results.data.name}</h3>
                                        <div className="flex items-end gap-10">
                                            <div>
                                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preț</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{results.data.price} <span className="text-sm font-normal text-gray-400">RON</span></div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleClearResults} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-all">Anulează</button>
                                                <button
                                                    onClick={() => handleSingleImport(0)}
                                                    disabled={results.imported}
                                                    className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                                        results.imported ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-900 dark:bg-brand-yellow text-white dark:text-gray-900 hover:scale-105 shadow-md'
                                                    }`}
                                                >
                                                    {results.imported ? 'Importat cu succes' : 'Importă Draft'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminScraper;
