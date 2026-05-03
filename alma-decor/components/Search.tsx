import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: number;
  primary_image: string;
  category_name?: string;
}

const Search: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/produse.php?search=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white dark:bg-brand-dark animate-staggered-fade">
      <div className="container mx-auto px-6 py-8 flex flex-col h-full">
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl font-bold italic serif tracking-tighter">
            Căutare <span className="text-brand-yellow not-italic">Alma Decor</span>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-brand-yellow hover:text-gray-900 transition-all text-xl"
          >
            ✕
          </button>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="relative group mb-16">
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută parchet, tapet, perdele..."
              className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/10 text-4xl md:text-6xl font-black italic serif outline-none pb-6 focus:border-brand-yellow transition-all placeholder:text-gray-200 dark:placeholder:text-white/5"
            />
            {loading && (
              <div className="absolute right-0 bottom-8 animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Rezultate Produse</h3>
              {results.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                  {results.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/produs/${product.slug}`} 
                      onClick={onClose}
                      className="flex gap-6 py-6 group hover:translate-x-2 transition-transform"
                    >
                      <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-yellow transition-colors">{product.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{product.price} RON</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query.length >= 2 && !loading ? (
                <p className="text-gray-400 italic">Nu am găsit produse pentru "{query}"</p>
              ) : (
                <p className="text-gray-400 italic">Introdu cel puțin 2 caractere pentru a începe căutarea...</p>
              )}
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Link-uri Rapide</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Parchet', 'Tapet', 'Perdele', 'Profile', 'Showroom', 'Blog'].map((link) => (
                  <button 
                    key={link}
                    onClick={() => {
                      setQuery(link);
                      inputRef.current?.focus();
                    }}
                    className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-left hover:bg-brand-yellow group transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900">{link}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
