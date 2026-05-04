import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/shop/ProductDetailsClient';

import { query } from '@/lib/db';
import { DOMAIN } from '@/lib/api';

async function getProduct(slug: string) {
  try {
    // 1. Preluăm produsul și categoria
    const products = await query<any[]>(
      `SELECT p.*, c.slug as category_slug, c.name as category_name 
       FROM produse p 
       LEFT JOIN categorii c ON p.category_id = c.id 
       WHERE p.slug = ? AND p.is_active = 1`,
      [slug]
    );
    
    if (!products || products.length === 0) return null;
    const product = products[0];

    // 2. Preluăm variațiile
    product.variations = await query<any[]>(
      "SELECT * FROM produs_variatii WHERE product_id = ? AND is_active = 1 ORDER BY sort_order ASC",
      [product.id]
    );

    // 3. Preluăm specificațiile (campuri custom)
    const customFields = await query<any[]>(
      "SELECT field_name, field_value FROM produs_campuri_custom WHERE product_id = ? ORDER BY sort_order ASC",
      [product.id]
    );
    
    // Transformăm în formatul așteptat de componentă
    product.specs = customFields.map(f => ({ 
      label: f.field_name, 
      value: f.field_value 
    }));

    // 4. Preluăm imaginile suplimentare
    product.images = await query<any[]>(
      "SELECT url FROM produs_imagini WHERE product_id = ? ORDER BY sort_order ASC",
      [product.id]
    );

    return product;
  } catch (error) {
    console.error('DB Product error:', error);
    return null;
  }
}

async function getSimilarProducts(categoryId: number, currentProductId: number) {
  try {
    const products = await query<any[]>(
      "SELECT * FROM produse WHERE category_id = ? AND id != ? AND is_active = 1 LIMIT 4",
      [categoryId, currentProductId]
    );
    return products || [];
  } catch (error) {
    console.error('DB Similar products error:', error);
    return [];
  }
}

export async function generateStaticParams() {
  return []; // Dezactivăm pre-generarea statică pentru a fi 100% dinamic
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
      images: product.primary_image ? [`${DOMAIN}/${product.primary_image.startsWith('/') ? product.primary_image.slice(1) : product.primary_image}`] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category_id, product.id);
  const filteredSimilar = similarProducts.slice(0, 4);

  return (
    <ProductDetailsClient 
      product={product} 
      similarProducts={filteredSimilar} 
    />
  );
}
