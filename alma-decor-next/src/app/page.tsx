import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductCard from '@/components/shop/ProductCard';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import { API_BASE } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Alma Decor - Magazin Online de Design Interior și Exterior',
  description: 'Descoperă colecția exclusivistă Alma Decor. Materiale premium, parchet, profile decorative și tapet pentru proiecte de design interior fără compromis.',
};

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/produse.php?limit=4`, { 
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return data.status === 'success' ? (data.data || []) : [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categorii.php`);
    if (!res.ok) return [];
    const data = await res.json();
    // Return exactly 4 active categories for one row
    return data.status === 'success' ? (data.data || []).slice(0, 4) : [];
  } catch (error) {
    return [];
  }
}

const processSteps = [
  { title: 'Consultanță', description: 'Discutăm viziunea, nevoile și bugetul tău pentru a stabili direcția proiectului.' },
  { title: 'Planificare', description: 'Realizăm măsurători precise și creăm un plan detaliat al spațiului.' },
  { title: 'Selecție Produse', description: 'Te ghidăm în showroom pentru a alege materialele perfecte.' },
  { title: 'Ofertare', description: 'Îți prezentăm o ofertă de preț transparentă și completă.' },
  { title: 'Montaj', description: 'Echipa noastră instalează totul impecabil, cu atenție la detalii.' },
];

const testimonials = [
  {
    name: 'Andreea P.',
    role: 'Proprietar Apartament',
    quote: 'Colaborarea cu Alma Decor a fost o experiență excepțională. Echipa a dat dovadă de profesionalism, creativitate și o atenție incredibilă la detalii. Au transformat apartamentul nostru într-un cămin de vis.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Mihai Ionescu',
    role: 'Arhitect Partener',
    quote: 'Lucrez cu Alma Decor de câțiva ani pe diverse proiecte și sunt mereu impresionat de calitatea produselor și de promptitudinea echipei. Sunt un partener de încredere pe care te poți baza.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Elena D.',
    role: 'Manager Restaurant',
    quote: 'Am apelat la Alma Decor pentru amenajarea restaurantului nostru și rezultatul a depășit toate așteptările. Au înțeles perfect conceptul și au venit cu soluții inovatoare.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'David Popescu',
    role: 'Dezvoltator Imobiliar',
    quote: 'Calitatea materialelor de la Alma Decor este de neegalat. Am folosit parchetul și profilele decorative în cel mai recent proiect rezidențial și clienții sunt absolut încântați.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Laura Stan',
    role: 'Proprietar Casă',
    quote: 'Am fost complet nehotărâtă în privința draperiilor. Consultantul de la Alma Decor a avut o răbdare infinită și m-a ajutat să aleg soluția perfectă.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Bogdan Marinescu',
    role: 'Antreprenor',
    quote: 'Pentru biroul nostru nou, am vrut ceva modern și de impact. Tapetul ales de la Alma Decor a devenit piesa centrală a spațiului de recepție. Montajul a fost rapid și impecabil.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const realCategories = await getCategories();

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115]">
      {/* Hero Section - Full Bleed for Transparent Header */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <Image 
          src="/homepage_hero_luxury_1777581946342.png" 
          alt="Alma Decor Luxury Living"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold italic serif text-white tracking-tighter leading-tight mb-8 animate-slide-up">
              Design <br /> Fără Compromis <span className="text-brand-yellow not-italic">.</span>
            </h1>
            <p className="text-xl text-gray-200 font-medium mb-12 max-w-xl leading-relaxed animate-slide-up delay-100">
              Elevăm spațiile prin materiale premium și o viziune artistică desăvârșită. Descoperă colecția noastră exclusivistă.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 animate-slide-up delay-200">
              <Link href="/magazin" className="bg-brand-yellow text-gray-900 font-black py-5 px-10 rounded-xl hover:bg-white transition-all text-sm tracking-widest text-center shadow-2xl shadow-brand-yellow/20">
                EXPLOREAZĂ COLECȚIA
              </Link>
              <Link href="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-black py-5 px-10 rounded-xl hover:bg-white hover:text-gray-900 transition-all text-sm tracking-widest text-center">
                PROIECT PERSONALIZAT
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
          <div className="w-px h-16 bg-white" />
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Colecții</h2>
              <h3 className="text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">Categorii Premium</h3>
            </div>
            <Link href="/magazin" className="text-sm font-bold text-gray-400 hover:text-brand-yellow transition-colors tracking-widest flex items-center gap-2">
              VEZI TOT CATALOGUL <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {realCategories.map((cat: any, i: number) => {
              const catImage = cat.image 
                ? (cat.image.startsWith('http') ? cat.image : `${API_BASE}/${cat.image.replace(/^\//, '')}`)
                : `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format,compress&fit=crop`;
              
              return (
                <Link key={i} href={`/magazin/${cat.slug}`} className="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-white/5">
                  <Image 
                    src={catImage} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h4 className="text-2xl font-bold text-white tracking-tight">{cat.name}</h4>
                    <p className="text-brand-yellow text-[10px] font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Deschide Categoria</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">De Ce Alma Decor</h2>
                <h3 className="text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter leading-none">Excelență în <br /> Fiecare Detaliu</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Calitate Premium</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Materiale selectate de la cele mai renumite branduri internaționale.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Montaj Rapid</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Echipe proprii de specialiști care garantează o execuție impecabilă.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format,compress&fit=crop" alt="Premium Design" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-yellow p-12 rounded-[2rem] shadow-xl hidden xl:block">
                <p className="text-6xl font-bold italic serif tracking-tighter text-gray-900">20+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Ani de Experiență</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Experiență</h2>
            <h3 className="text-5xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">Procesul Nostru</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {processSteps.map((step, i) => (
              <div key={i} className="relative space-y-6 group">
                <div className="text-6xl font-black italic text-gray-100 dark:text-white/[0.03] absolute -top-8 -left-4 group-hover:text-brand-yellow/10 transition-colors">0{i+1}</div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{step.title}</h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-[11px] font-bold text-brand-yellow uppercase tracking-[0.4em]">Magazin</h2>
              <h3 className="text-5xl font-bold italic serif text-white tracking-tighter">Produse de Top</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-white/40 italic font-medium">Se încarcă noutățile...</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Showroom CTA */}
      <section className="py-32 bg-brand-yellow text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-6xl md:text-8xl font-bold italic serif tracking-tighter leading-none">
                Vino să ne <br /> Cunoști <span className="text-white not-italic">.</span>
              </h2>
              <div className="space-y-6">
                <p className="text-xl font-bold uppercase tracking-widest flex items-center gap-4">
                  <span className="w-12 h-px bg-gray-900" />
                  Showroom București
                </p>
                <p className="text-lg font-medium leading-relaxed opacity-80">
                  Experimentează calitatea materialelor noastre în lumina naturală. Consultanții noștri te așteaptă cu mostre și soluții personalizate.
                </p>
              </div>
              <Link href="/contact" className="inline-block bg-gray-900 text-white font-black py-6 px-12 rounded-2xl hover:bg-white hover:text-gray-900 transition-all text-sm tracking-[0.2em]">
                PROGRAMEAZĂ O VIZITĂ
              </Link>
            </div>

            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1920&auto=format,compress&fit=crop" alt="Alma Decor Showroom" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
