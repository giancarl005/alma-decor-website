import React, { Suspense } from 'react';
import Link from 'next/link';
import ProductGridClient from '@/components/shop/ProductGridClient';
import { notFound } from 'next/navigation';

const API_BASE = 'https://almadecor.ro';

async function getCategory(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/categorii.php`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success') {
      return data.data.find((c: any) => c.slug === slug);
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/categorii.php`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success') return [];
    
    return data.data.map((category: any) => ({
      category: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categorii.php`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (error) {
    return [];
  }
}



const getFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return path;
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params;
  
  const category = await getCategory(categorySlug);
  if (!category) {
    notFound();
  }

  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Category Header Section */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
            {/* Category Image / Banner */}
            <div className="w-full lg:w-1/3 aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 group">
                {(() => {
                    const imgPath = (category.image && category.image.length > 3) 
                        ? category.image 
                        : category.representative_image;
                    
                    if (imgPath) {
                        return (
                            <img 
                                src={getFullImageUrl(imgPath)} 
                                alt={category.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        );
                    }
                    return (
                        <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                            <span className="text-4xl font-bold text-gray-200 dark:text-gray-800">{category.name[0]}</span>
                        </div>
                    );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Category Info */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <Link href="/" className="hover:text-brand-yellow transition-colors">Acasă</Link>
                    <span>/</span>
                    <Link href="/magazin" className="hover:text-brand-yellow transition-colors">Magazin</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">{category.name}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold italic serif text-gray-900 dark:text-white tracking-tighter">
                    {category.name} <span className="text-brand-yellow not-italic font-bold">.</span>
                </h1>

                <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-brand-yellow rounded-full opacity-50" />
                    {category.description_top ? (
                        <div 
                            className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl prose dark:prose-invert prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: category.description_top }}
                        />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl italic">
                            {category.description || (() => {
                                const name = category.name.toLowerCase();
                                if (name.includes('plinte')) {
                                    return `${category.name} sunt elemente esențiale pentru finisarea estetică a spațiilor interioare, oferind o trecere fluidă între perete și pardoseală. Acestea maschează rosturile de dilatație și protejează peretele de lovituri sau umiditate, fiind ideale pentru orice tip de amenajare modernă sau clasică.`;
                                }
                                if (name.includes('cornișe') || name.includes('cornise')) {
                                    return `${category.name} asigură o trecere elegantă între perete și plafon, adăugând profunzime și rafinament încăperii. Sunt soluția perfectă pentru a ascunde micile imperfecțiuni de la îmbinări sau pentru a crea scafe de lumină spectaculoase cu ajutorul benzilor LED.`;
                                }
                                if (name.includes('ancadramente')) {
                                    return `${category.name} sunt utilizate pentru a pune în valoare ferestrele și ușile, oferind un contur arhitectural distinctiv. Fabricate din materiale rezistente, acestea conferă fațadei sau interiorului un caracter nobil și o estetică echilibrată.`;
                                }
                                if (name.includes('panouri') || name.includes('riflaje')) {
                                    return `${category.name} reprezintă o soluție modernă pentru placarea pereților, adăugând textură și un accent vizual puternic. Pe lângă rolul estetic, acestea pot îmbunătăți acustica spațiului și oferă o durabilitate ridicată în timp.`;
                                }
                                if (name.includes('rozete')) {
                                    return `${category.name} sunt elemente decorative centrale pentru tavan, menite să completeze designul corpurilor de iluminat. Acestea aduc un plus de eleganță și transformă orice lustră într-un punct focal rafinat al încăperii.`;
                                }
                                return `Descoperă selecția noastră de ${category.name.toLowerCase()} premium, create special pentru a aduce un plus de stil și durabilitate proiectului tău. Fiecare produs este ales pentru a satisface cele mai înalte standarde de design interior și funcționalitate.`;
                            })()}
                        </p>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Subcategories Visual Row - Centered & Slider on overflow */}
        {categories.filter((c: any) => Number(c.parent_id) === Number(category.id)).length > 0 && (
          <div className="mb-12 pb-8 border-b border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="flex overflow-x-auto gap-8 md:gap-12 pb-4 no-scrollbar snap-x snap-mandatory lg:justify-center">
              {categories.filter((c: any) => Number(c.parent_id) === Number(category.id)).map((child: any) => (
                <Link 
                  key={child.id}
                  href={`/magazin/${child.slug}`}
                  className="group flex flex-col items-center gap-4 text-center min-w-[100px] md:min-w-[120px] snap-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center transition-all duration-500 group-hover:border-brand-yellow group-hover:scale-110 overflow-hidden relative shadow-sm group-hover:shadow-xl group-hover:shadow-brand-yellow/10">
                    {child.image || child.representative_image ? (
                        <img src={getFullImageUrl(child.image || child.representative_image)} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/10">
                            <span className="text-2xl font-bold text-gray-400">{child.name[0]}</span>
                        </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest group-hover:text-brand-yellow transition-all duration-300 max-w-[100px] md:max-w-[120px]">
                    {child.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-white/5 pb-2">
                Categorii
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/magazin" 
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-yellow transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-brand-yellow transition-all group-hover:w-3"></span>
                    Toate Produsele
                  </Link>
                </li>
                {categories.filter((c: any) => !c.parent_id || Number(c.parent_id) === 0).map((parent: any) => (
                  <React.Fragment key={parent.id}>
                    <li>
                      <Link 
                        href={`/magazin/${parent.slug}`} 
                        className={`text-sm font-bold flex items-center gap-2 group ${categorySlug === parent.slug ? 'text-brand-yellow' : 'text-gray-800 dark:text-gray-200 hover:text-brand-yellow transition-colors'}`}
                      >
                        {categorySlug === parent.slug && <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>}
                        {categorySlug !== parent.slug && <span className="w-0 h-px bg-brand-yellow transition-all group-hover:w-3"></span>}
                        {parent.name}
                      </Link>
                    </li>
                    {/* Subcategories */}
                    {categories.filter((c: any) => Number(c.parent_id) === Number(parent.id)).map((child: any) => (
                      <li key={child.id} className="pl-4">
                        <Link 
                          href={`/magazin/${child.slug}`} 
                          className={`text-sm font-medium flex items-center gap-2 group ${categorySlug === child.slug ? 'text-brand-yellow' : 'text-gray-500 dark:text-gray-400 hover:text-brand-yellow transition-colors'}`}
                        >
                          <span className={`w-2 h-px transition-all ${categorySlug === child.slug ? 'bg-brand-yellow' : 'bg-gray-200 dark:bg-white/10 group-hover:bg-brand-yellow'}`}></span>
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-white/5 pb-2">
                Preț (RON)
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Sub 200 RON', min: '0', max: '200' },
                  { label: '200 - 500 RON', min: '200', max: '500' },
                  { label: 'Peste 500 RON', min: '500', max: '10000' }
                ].map((range) => (
                  <li key={range.label}>
                    <Link 
                      href={`/magazin/${categorySlug}?min_price=${range.min}&max_price=${range.max}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-4 h-4 rounded border border-gray-200 dark:border-white/10 transition-colors" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-brand-yellow transition-colors">{range.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid Container */}
          <div className="flex-1">
            <Suspense fallback={<div className="animate-pulse bg-gray-100 h-96 rounded-3xl" />}>
              <ProductGridClient categorySlug={categorySlug} initialLimit={30} />
            </Suspense>

            {/* Bottom Description Section */}
            {category.description_bottom && (
                <div className="mt-24 pt-16 border-t border-gray-100 dark:border-white/5">
                    <div 
                        className="max-w-4xl mx-auto prose dark:prose-invert prose-img:rounded-3xl prose-headings:italic prose-headings:serif prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: category.description_bottom }}
                    />
                </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
