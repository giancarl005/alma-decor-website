import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const API_BASE = 'http://127.0.0.1/Alma%20Decor%20Website';
const DOMAIN = 'https://almadecor.ro';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/blog.php?slug=${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'success' ? data.data : null;
  } catch (error) {
    console.error('Fetch post error:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/blog.php`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success') return [];
    
    return data.data.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Articol Negăsit - Alma Decor' };
  }

  const title = post.meta_title || `${post.title} | Alma Decor`;
  const description = post.meta_description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author],
      images: post.featured_image ? [`${DOMAIN}/${post.featured_image.startsWith('/') ? post.featured_image.slice(1) : post.featured_image}`] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const path = url.startsWith('/') ? url : `/${url}`;
    
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return `http://127.0.0.1/Alma%20Decor%20Website${path}`;
    }
    return path;
  };

  // Generate Schema.org JSON-LD
  const schemaOrg: any = {
    "@context": "https://schema.org",
    "@type": post.schema_type || "Article",
    "headline": post.title,
    "image": [getFullImageUrl(post.featured_image)],
    "datePublished": new Date(post.created_at).toISOString(),
    "dateModified": new Date(post.updated_at || post.created_at).toISOString(),
    "author": [{
        "@type": "Person",
        "name": post.author,
      }],
    "publisher": {
      "@type": "Organization",
      "name": "Alma Decor",
      "logo": {
        "@type": "ImageObject",
        "url": "https://almadecor.ro/logo.png"
      }
    }
  };

  // Add FAQ Schema if present
  let faqSchema = null;
  if (post.faq_json && post.faq_json.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.faq_json.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Extract headings for Table of Contents
  const headings: { level: string, text: string, id: string }[] = [];
  let parsedContent = post.content || '';
  
  if (parsedContent) {
    // Basic regex to find h2 and h3
    const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    let counter = 0;
    while ((match = regex.exec(parsedContent)) !== null) {
      const level = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim(); // Remove nested HTML
      const id = `heading-${counter++}`;
      headings.push({ level, text, id });
      
      // Inject ID into the HTML string
      const fullTag = match[0];
      const newTag = fullTag.replace(/<h[23]/i, `<h${level} id="${id}"`);
      parsedContent = parsedContent.replace(fullTag, newTag);
    }
  }

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-[#0F1115] font-sans transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 1. Immersive Hero Section */}
      <header className="relative w-full h-[70vh] min-h-[500px] flex flex-col justify-center overflow-hidden bg-gray-900 pt-20 pb-32">
        {/* Background Image */}
        {post.featured_image ? (
          <img 
            src={getFullImageUrl(post.featured_image)} 
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center space-y-8">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-[11px] font-bold text-white/70 hover:text-white uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Înapoi la Jurnal
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-4xl mx-auto drop-shadow-xl">
            {post.title}
          </h1>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] font-bold text-white uppercase tracking-widest pt-4">
             <div className="bg-brand-yellow text-gray-900 px-4 py-1.5 rounded-full shadow-lg">
                {post.category || 'DESIGN INTERIOR'}
             </div>
             
             <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-yellow">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {post.author}
             </div>

             <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-yellow">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Timp de citire {post.reading_time || 1} min
             </div>
          </div>
          
        </div>
      </header>

      {/* 2. Overlapping Content Area */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 -mt-32 pb-24">
        <div className="bg-white dark:bg-[#15181E] rounded-t-[2.5rem] shadow-2xl p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar: TOC */}
          <aside className="w-full lg:w-[300px] flex-shrink-0">
             <div className="sticky top-32">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-6 border-b-2 border-brand-yellow/30 pb-4 inline-block">
                  Cuprins
                </h3>
                {headings.length > 0 ? (
                  <ul className="space-y-4">
                    {headings.map((h, idx) => (
                      <li key={idx} className={h.level === '3' ? 'pl-4' : ''}>
                        <a 
                          href={`#${h.id}`} 
                          className="text-[13px] text-gray-500 hover:text-brand-yellow dark:text-gray-400 font-medium leading-snug block transition-colors"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">Niciun subtitlu disponibil.</p>
                )}
             </div>
          </aside>

          {/* Right Main Content */}
          <div className="w-full flex-1 max-w-[1000px]">
            {post.excerpt && (
              <div className="border-l-4 border-brand-yellow pl-6 mb-12">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            <div 
              className="text-base md:text-lg text-[#333333] dark:text-gray-300 leading-[1.8] font-light prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-yellow prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-xl max-w-none font-sans mb-16"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />

            {/* Author Profile Box */}
            {(post.author_description || post.author_image) && (
              <div className="bg-white dark:bg-white/[0.02] rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 border-l-4 border-l-brand-yellow overflow-hidden mt-16 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Author Avatar */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={getFullImageUrl(post.author_image) || 'https://via.placeholder.com/150'} 
                    alt={post.author} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-[#15181E] shadow-md"
                  />
                  {post.author_is_verified === 1 && (
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white dark:border-[#15181E]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Author Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">Autor Articol</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{post.author}</h3>
                    {post.author_is_verified === 1 && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                        Verified Expert
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                    {post.author_description}
                  </p>
                  
                  {/* Stats Row */}
                  {(post.author_stat_1_label || post.author_stat_2_label || post.author_stat_3_label) && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4 border-t border-gray-100 dark:border-white/10">
                      {post.author_stat_1_label && (
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{post.author_stat_1_label}</p>
                          <p className="text-sm font-bold text-brand-yellow">{post.author_stat_1_value}</p>
                        </div>
                      )}
                      {post.author_stat_2_label && (
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{post.author_stat_2_label}</p>
                          <p className="text-sm font-bold text-brand-yellow">{post.author_stat_2_value}</p>
                        </div>
                      )}
                      {post.author_stat_3_label && (
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{post.author_stat_3_label}</p>
                          <p className="text-sm font-bold text-brand-yellow">{post.author_stat_3_value}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

        {/* FAQ Section */}
        {post.faq_json && post.faq_json.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-100 dark:border-white/5">
            <h3 className="text-2xl md:text-3xl font-bold italic serif tracking-tight text-gray-900 dark:text-white mb-10 text-center">
              Întrebări <span className="text-brand-yellow not-italic">Frecvente</span>
            </h3>
            
            <div className="space-y-6">
              {post.faq_json.map((faq: any, idx: number) => (
                <div key={idx} className="bg-gray-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex gap-4">
                    <span className="text-brand-yellow font-serif italic">Q.</span>
                    {faq.question}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed flex gap-4">
                    <span className="text-gray-300 dark:text-white/10 font-serif italic font-bold">A.</span>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
    </article>
  );
}
