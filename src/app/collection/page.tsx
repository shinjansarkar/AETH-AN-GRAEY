import { getSupabaseAdmin } from '@/lib/supabase-server';
import CollectionClient, { Product } from '@/components/CollectionClient';

export const revalidate = 0; // Disable caching for now so we see updates immediately

export default async function CollectionPage() {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: categoryData, error: catError } = await supabase
    .from('categories')
    .select('name')
    .order('created_at', { ascending: true });

  const products: Product[] = data || [];
  const dbCategories = categoryData ? categoryData.map(c => c.name) : [];

  return <CollectionClient products={products} dbCategories={dbCategories} />;
}
