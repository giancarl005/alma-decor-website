import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/shop/ProductDetailsClient';

const API_BASE = 'http://127.0.0.1/Alma%20Decor%20Website';

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/produse.php?slug=${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.status === 'success') {
      const product = data.data;
      
      // Parse specs if string
      if (typeof product.specs === 'string') {
        try {
          product.specs = JSON.parse(product.specs);
        } catch (e) {
          product.specs = [];
        }
      }
      
      product.specs = Array.isArray(product.specs) ? product.specs : [];
      product.variations = Array.isArray(product.variations) ? product.variations : [];
      return product;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/produse.php?limit=2000`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success') return [];
    
    return data.data.map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for products:', error);
    return [];
  }
}

async function getSimilarProducts(categorySlug: string) {
  if (!categorySlug) return [];
  try {
    const res = await fetch(`${API_BASE}/api/produse.php?categorie=${categorySlug}&limit=5`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (error) {
    console.error('Fetch similar products error:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Produs Negăsit - Alma Decor',
    };
  }

  return {
    title: `${product.name} - Alma Decor`,
    description: product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160),
      images: [product.primary_image],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category_slug);
  const filteredSimilar = similarProducts.filter((p: any) => p.id !== product.id).slice(0, 4);

  return (
    <ProductDetailsClient 
      product={product} 
      similarProducts={filteredSimilar} 
    />
  );
}
