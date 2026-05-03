import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

const MOCK_POSTS = [
  {
    id: 1,
    title: '5 Tendințe în Designul Interior pentru 2026',
    slug: 'tendinte-design-interior-2026',
    category: 'Sfaturi Design',
    date: '15 Aprilie 2026',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
    content: `
      <p>Designul interior în 2026 se concentrează pe sustenabilitate, texturi naturale și integrarea tehnologiei într-un mod discret. Iată cele mai importante tendințe pe care trebuie să le urmărești.</p>
      
      <h2>1. Sustenabilitatea ca prioritate</h2>
      <p>Materialele reciclate și mobilierul eco-friendly nu mai sunt doar o opțiune, ci o necesitate. Clienții caută produse cu amprentă redusă de carbon, cum ar fi <a href="/produs/parchet-stejar-auriu">parchetul din surse certificate</a> sau tapetul realizat din materiale biodegradabile.</p>
      
      <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop" alt="Sustainable design" style="border-radius: 1rem; margin: 2rem 0;" />

      <h2>2. Culori de Pământ</h2>
      <p>Nuanțele de teracotă, salvie și ocru vor domina paletele cromatice, oferind o senzație de calm și conectare cu natura. Aceste culori funcționează perfect cu <a href="/produs/profile-decorative-wains">profilele decorative minimaliste</a>.</p>
      
      <blockquote>"Designul nu este doar despre cum arată, ci despre cum te face să te simți în spațiul tău."</blockquote>

      <h2>3. Texturi Mixte</h2>
      <p>Combinația de lemn brut, metal șlefuit și textile bogate precum catifeaua creează profunzime vizuală și confort tactil.</p>
    `
  },
  { id: 2, title: 'Cum alegi parchetul potrivit pentru încălzirea în pardoseală', slug: 'alegere-parchet-incalzire-pardoseala', category: 'Ghiduri', date: '10 Aprilie 2026', image: 'https://images.unsplash.com/photo-1581850518616-bcb8186c39ed?q=80&w=2000&auto=format&fit=crop', content: '<p>Încălzirea în pardoseală este o soluție din ce în ce mai populară...</p>' },
  { id: 3, title: 'Profilele decorative: secretul unui finisaj de lux', slug: 'profile-decorative-finisaj-lux', category: 'Materiale', date: '05 Aprilie 2026', image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2000&auto=format&fit=crop', content: '<p>Detaliile fac diferența într-o amenajare premium...</p>' },
];

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = MOCK_POSTS.find(p => p.slug === slug);

  // Extracție automată a produselor din link-urile textului
  const extractedProductSlugs = useMemo(() => {
    if (!post) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const links = doc.querySelectorAll('a');
    const slugs = Array.from(links)
      .map(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('/produs/')) {
          return href.split('/produs/')[1];
        }
        return null;
      })
      .filter(Boolean);
    
    return Array.from(new Set(slugs)).join(',');
  }, [post]);

  if (!post) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-2xl font-bold">Articolul nu a fost găsit.</h1>
        <Link to="/blog" className="mt-4 text-brand-yellow font-bold hover:underline block">Înapoi la Blog</Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-20 bg-white dark:bg-brand-dark transition-colors duration-500">
      {/* Header Articol */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <Link to="/blog" className="text-brand-yellow font-black text-xs uppercase tracking-[0.3em] mb-6 block hover:opacity-70 transition-opacity">
          &larr; ÎNAPOI LA BLOG
        </Link>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6 inline-block">
          {post.category}
        </span>
        <h1 className="text-4xl lg:text-6xl font-bold italic serif tracking-tighter text-gray-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Alma Decor</span>
          <span>•</span>
          <span className="text-[10px] uppercase tracking-widest">{post.date}</span>
        </div>
      </div>

      {/* Imagine Principală */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Conținut Articol */}
      <div className="max-w-3xl mx-auto px-6">
        <div 
          className="prose prose-lg dark:prose-invert prose-yellow max-w-none 
            prose-headings:font-bold prose-headings:italic prose-headings:serif prose-headings:tracking-tighter 
            prose-blockquote:border-brand-yellow prose-blockquote:bg-gray-50 
            dark:prose-blockquote:bg-gray-900/50 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
            prose-a:text-brand-yellow prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share & Footer */}
        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
             <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-yellow transition-colors group">
                <svg className="w-5 h-5 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
             </button>
             <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-yellow transition-colors group">
                <svg className="w-5 h-5 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.324v-21.35c0-.732-.593-1.325-1.323-1.325z"/></svg>
             </button>
          </div>
          {extractedProductSlugs && (
            <Link 
              to={`/magazin?sluguri=${extractedProductSlugs}`} 
              className="bg-brand-yellow text-gray-900 font-bold px-10 py-4 rounded-xl hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-lg"
            >
              VEZI PRODUSELE DIN ARTICOL
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
