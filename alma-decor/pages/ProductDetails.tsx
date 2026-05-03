import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import ProductGallery from '../components/shop/ProductGallery';
import VariationPicker from '../components/shop/VariationPicker';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ProductTabs from '../components/shop/ProductTabs';
import ProductCard from '../components/shop/ProductCard';
import ProductReviews from '../components/shop/ProductReviews';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
}

const MOCK_PRODUCTS = [
  { 
    id: 1, 
    name: 'Parchet Stejar Natur 120mm', 
    slug: 'parchet-stejar-natur-120mm', 
    price: 189.00, 
    sale_price: 159.00, 
    primary_image: 'https://images.unsplash.com/photo-1581850518616-bcb8186c39ed?q=80&w=2070&auto=format&fit=crop', 
    images: [
      'https://images.unsplash.com/photo-1581850518616-bcb8186c39ed?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558211583-032d8892290b?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Parchet din stejar natural de înaltă calitate, ideal pentru livinguri moderne și dormitoare primitoare. Rezistent și ușor de întreținut.',
    category_name: 'Parchet',
    category_slug: 'parchet',
    brand: 'Alma Decor',
    specs: [
      { label: 'Grosime', value: '14 mm' },
      { label: 'Clasa de trafic', value: 'AC5 / 33' },
      { label: 'Sistem de montaj', value: 'Click' },
      { label: 'Garanție', value: '25 ani' }
    ],
    variations: [
      { id: 101, name: 'Stejar Natur', type: 'color' as const, value: '#d2b48c' },
      { id: 102, name: 'Stejar Alb', type: 'color' as const, value: '#f5f5f5' },
      { id: 103, name: 'Stejar Gri', type: 'color' as const, value: '#808080' }
    ]
  },
  { id: 2, name: 'Parchet Stejar Gri Deschis', slug: 'parchet-stejar-gri-deschis', price: 125.00, sale_price: null, primary_image: 'https://images.unsplash.com/photo-1558211583-032d8892290b?q=80&w=1974&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1558211583-032d8892290b?q=80&w=1974&auto=format&fit=crop'], description: 'O nuanță modernă de gri care aduce luminozitate oricărei încăperi.', category_name: 'Parchet', category_slug: 'parchet', brand: 'Alma Decor', specs: [], variations: [] },
  { id: 3, name: 'Tapet Floral Vintage', slug: 'tapet-floral-vintage', price: 245.00, sale_price: 210.00, primary_image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070&auto=format&fit=crop'], description: 'Model floral elegant pentru un design interior clasic și rafinat.', category_name: 'Tapet', category_slug: 'tapet', brand: 'DesignWalls', specs: [], variations: [] },
  { id: 4, name: 'Tapet Geometric Modern', slug: 'tapet-geometric-modern', price: 180.00, sale_price: null, primary_image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?q=80&w=2070&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?q=80&w=2070&auto=format&fit=crop'], description: 'Linii curate și forme geometrice pentru un aspect contemporan.', category_name: 'Tapet', category_slug: 'tapet', brand: 'ModernArt', specs: [], variations: [] },
  { id: 5, name: 'Plintă Decorativă Albă', slug: 'plinta-decorativa-alba', price: 45.00, sale_price: null, primary_image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop'], description: 'Finisajul perfect pentru orice pardoseală. Rezistentă la șocuri.', category_name: 'Profile Decorative', category_slug: 'profile-decorative', brand: 'Orac Decor', specs: [], variations: [] },
];

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Fetch Categories
  useEffect(() => {
    fetch('/api/categorii.php')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setCategories(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/produse.php?slug=${slug}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          const data = res.data;
          // Format specs if they are stored as string or just use them
          data.specs = Array.isArray(data.specs) ? data.specs : [];
          data.variations = Array.isArray(data.variations) ? data.variations : [];
          data.images = [data.primary_image, ...(data.gallery || [])].filter(Boolean);
          setProduct(data);

          // Fetch Similar Products
          if (data.category_slug) {
            fetch(`/api/produse.php?categorie=${data.category_slug}&limit=5`)
              .then(r => r.json())
              .then(r => {
                if (r.status === 'success') {
                  const filtered = r.data.filter((p: any) => p.id !== data.id).slice(0, 4);
                  setSimilarProducts(filtered);
                }
              });
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto"></div>
        <p className="mt-4 text-gray-500">Se încarcă produsul...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produsul nu a fost găsit.</h1>
        <Link to="/magazin" className="mt-4 text-brand-yellow font-bold hover:underline block">Înapoi la Magazin</Link>
      </div>
    );
  }

  const relatedProducts = MOCK_PRODUCTS
    .filter(p => p.category_slug === product.category_slug && p.id !== product.id)
    .slice(0, 3);

  const hasDiscount = product.sale_price !== null;
  const safeImages = Array.isArray(product?.images) ? product.images : [];
  const safeVariations = Array.isArray(product?.variations) ? product.variations : [];

  const handleAddToCart = () => {
    if (product) {
      const variation = safeVariations.find((v: any) => v.id === selectedVariation);
      addToCart(product, quantity, selectedVariation, variation?.name);
      setAdded(true);
      showNotification('Produs adăugat în coș!', 'success');
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const tabs = [
    { 
      id: 'desc', 
      label: 'Descriere', 
      content: product?.description ? (
        <div 
          className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-light prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />
      ) : (
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-light">Nicio descriere disponibilă.</p>
      )
    },
    { 
      id: 'specs', 
      label: 'Specificații', 
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
          {(product?.specs && product.specs.length > 0) ? product.specs.map((spec: any, i: number) => (
            spec.value === 'GROUP_HEADER' ? (
              <div key={i} className="col-span-1 md:col-span-2 pt-8 pb-4 border-b-2 border-gray-900/5 dark:border-white/5 mb-2">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white italic serif">{spec.label}</h3>
              </div>
            ) : (
              <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/[0.03]">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">{spec.label}</span>
                <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">{spec.value}</span>
              </div>
            )
          )) : <p className="text-gray-400 py-8 text-center col-span-2">Nu sunt specificații disponibile.</p>}
        </div>
      )
    },
    { 
      id: 'reviews', 
      label: 'Recenzii', 
      content: <ProductReviews productId={product.id} /> 
    }
  ];

  if (!product && !loading) {
     return (
       <div className="pt-32 pb-20 px-6 text-center">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eroare la încărcarea produsului.</h1>
         <Link to="/magazin" className="mt-4 text-brand-yellow font-bold hover:underline block">Înapoi la Magazin</Link>
       </div>
     );
  }

  try {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <Breadcrumbs 
          items={(() => {
            const items = [{ label: 'Magazin', path: '/magazin' }];
            
            // Find parent if exists
            if (product.category_parent_id && categories.length > 0) {
              const parentCat = categories.find(c => c.id === product.category_parent_id);
              if (parentCat) {
                items.push({ label: parentCat.name, path: `/magazin/${parentCat.slug}` });
              }
            }
            
            items.push({ label: product.category_name, path: `/magazin/${product.category_slug}` });
            items.push({ label: product.name, active: true });
            return items;
          })()} 
        />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Galerie - 45% wide */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <ProductGallery images={safeImages} />
          </div>

          {/* Detalii - 55% wide */}
          <div className="w-full lg:w-[55%] flex flex-col space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-2.5 py-0.5 bg-brand-yellow/10 text-brand-yellow text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-brand-yellow/20">
                  {product.category_name}
                </span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">SKU: {product?.sku || 'AD-'+product?.slug?.toUpperCase()?.slice(0, 6)}</span>
              </div>
              
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight italic serif tracking-tight max-w-[90%]">
                {product.name}
              </h1>

              {product.reviews_count > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < Math.round(product.avg_rating) ? 'text-brand-yellow' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{product.reviews_count} recenzii</span>
                </div>
              )}
              <div className="flex items-baseline gap-5 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-brand-yellow tracking-tighter">
                    {hasDiscount ? product.sale_price : product.price}
                  </span>
                  <span className="text-sm font-bold text-gray-400">RON</span>
                </div>
                {hasDiscount && (
                  <span className="text-lg text-gray-400/50 line-through tabular-nums italic font-medium">
                    {product.price} RON
                  </span>
                )}
              </div>

              <div className="h-px w-24 bg-brand-yellow/30 mt-6" />
            </div>

            <div className="space-y-8">
               {safeVariations.length > 0 && (
                 <VariationPicker 
                   label="Opțiuni Personalizate" 
                   variations={safeVariations as any} 
                   selectedId={selectedVariation}
                   onSelect={setSelectedVariation}
                 />
               )}

               <div className="flex flex-row gap-2 sm:gap-5 items-stretch pt-2">
                 <div className="flex items-center bg-gray-100/50 dark:bg-white/[0.05] rounded-xl p-1 border border-gray-100 dark:border-white/10">
                   <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 transition-all text-xl font-light text-gray-600 dark:text-gray-400"
                   >−</button>
                   <span className="w-12 text-center font-bold text-lg tabular-nums text-gray-900 dark:text-white">{quantity}</span>
                   <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 transition-all text-xl font-light text-gray-600 dark:text-gray-400"
                   >+</button>
                 </div>
                 
                 <button 
                  onClick={handleAddToCart}
                  className={`flex-grow h-14 rounded-xl font-bold text-base uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg ${
                    added 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20'
                  }`}
                >
                  {added ? 'Adăugat ✓' : 'Adaugă în coș'}
                </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-100 dark:border-white/5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Disponibilitate</span>
                {(() => {
                  const status = product?.stock_status || 'in_stoc';
                  let label = 'În Stoc';
                  let color = 'text-emerald-500';
                  let dotColor = 'bg-emerald-500';

                  if (status === 'stoc_online') {
                    label = 'Stoc Online (3-5 zile)';
                    color = 'text-blue-500';
                    dotColor = 'bg-blue-500';
                  } else if (status === 'stoc_epuizat') {
                    label = 'Stoc Epuizat';
                    color = 'text-rose-500';
                    dotColor = 'bg-rose-500';
                  } else if (status === 'precomanda') {
                    label = 'Precomandă';
                    color = 'text-amber-500';
                    dotColor = 'bg-amber-500';
                  }

                  return (
                    <span className={`text-xs ${color} font-bold flex items-center gap-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
                      {label}
                    </span>
                  );
                })()}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Brand Autorizat</span>
                <span className="text-xs text-gray-900 dark:text-gray-100 font-bold">{product?.brand || 'Alma Decor Premium'}</span>
              </div>
            </div>
          </div>
        </div>

      {/* Tabs Section */}
      <section className="bg-white dark:bg-gray-900/50 py-24 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ProductTabs tabs={tabs} />
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-xl font-bold italic serif tracking-tight text-gray-900 dark:text-white">Produse similare</h2>
              <div className="h-1 w-12 bg-brand-yellow mt-4 rounded-full" />
            </div>
            <Link to="/magazin" className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-brand-yellow transition-colors">Vezi tot →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </div>
      </section>
      </div>
    );
  } catch (err) {
    console.error("Render Error:", err);
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-2xl font-bold text-red-500">A apărut o eroare la afișarea produsului.</h1>
        <pre className="mt-4 text-xs text-gray-500">{String(err)}</pre>
        <Link to="/magazin" className="mt-8 text-brand-yellow font-bold hover:underline block">Înapoi la Magazin</Link>
      </div>
    );
  }
};

export default ProductDetails;
