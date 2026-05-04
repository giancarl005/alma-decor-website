import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { API_BASE, DOMAIN } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/blog.php`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    
    if (data.status === 'success' && data.data && data.data.length > 0) {
      return data.data.map((post: any) => ({ slug: post.slug }));
    }
    
    // Daca nu sunt articole, returnam un slug de test ca sa nu crape build-ul
    return [{ slug: 'articol-test' }];
  } catch (error) {
    console.error('Build error on blog params:', error);
    return [{ slug: 'articol-test' }];
  }
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/blog.php?slug=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'success' ? data.data : null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Articol Blog - Alma Decor' };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    // Daca e slug-ul de test, aratam un mesaj placeholder
    if (slug === 'articol-test') {
      return <div className="pt-40 text-center">Modul Blog este pregătit. Adaugă articole din panoul de administrare.</div>;
    }
    notFound();
  }

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE}${path}`;
  };

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-[#0F1115] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="text-brand-yellow font-bold uppercase tracking-widest text-xs mb-8 inline-block">← Înapoi la Jurnal</Link>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">{post.title}</h1>
        
        {post.featured_image && (
          <img 
            src={getFullImageUrl(post.featured_image)} 
            alt={post.title} 
            className="w-full h-[500px] object-cover rounded-3xl mb-12 shadow-2xl"
          />
        )}

        <div 
          className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
