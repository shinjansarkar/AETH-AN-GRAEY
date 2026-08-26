import { getSupabaseAdmin } from '@/lib/supabase-server';
import AdminDashboard from '../AdminDashboard';

export const revalidate = 0; // Disable caching

export default async function AdminInventoryPage() {
  const supabase = getSupabaseAdmin();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: categoryData, error: catError } = await supabase
    .from('categories')
    .select('name')
    .order('created_at', { ascending: true });

  const validProducts = products || [];
  const dbCategories = categoryData ? categoryData.map(c => c.name) : [];

  
  // Calculate stats
  const total = validProducts.length;
  const inStock = validProducts.filter(p => p.stock_status === 'In Stock').length;
  const categories = new Set(validProducts.map(p => p.category)).size;

  return (
    <AdminDashboard 
      products={validProducts} 
      stats={{ total, inStock, categories }} 
      dbCategories={dbCategories}
    />
  );
}
