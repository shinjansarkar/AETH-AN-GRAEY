'use server';

import { getSupabaseAdmin } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin();

    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock_status = formData.get('stock_status') as string;
    const count = parseInt(formData.get('count') as string, 10);
    const description = formData.get('description') as string;
    const file = formData.get('image') as File | null;

    if (!name || !category || isNaN(price)) {
      return { error: 'Name, category, and valid price are required' };
    }

    let image_url = null;

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return { error: 'Failed to upload image' };
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          category,
          price,
          stock_status,
          count: isNaN(count) ? 0 : count,
          description,
          image_url,
        },
      ])
      .select();

    if (error) {
      console.error('DB Insert Error:', error);
      return { error: 'Failed to insert product into database' };
    }

    revalidatePath('/collection');
    revalidatePath('/admin');
    revalidatePath('/admin/inventory');
    
    return { success: true, product: data[0] };
  } catch (error: any) {
    console.error('Action Error:', error);
    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin();
    const name = formData.get('name') as string;

    if (!name || !name.trim()) {
      return { error: 'Category name is required' };
    }

    const { error } = await supabase
      .from('categories')
      .insert([{ name: name.trim() }]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { error: 'Category already exists' };
      }
      return { error: 'Failed to create category' };
    }

    revalidatePath('/collection');
    revalidatePath('/admin/inventory');

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function deleteCategory(name: string) {
  try {
    const supabase = getSupabaseAdmin();

    if (!name || !name.trim()) {
      return { error: 'Category name is required' };
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', name);

    if (error) {
      return { error: 'Failed to delete category' };
    }

    revalidatePath('/collection');
    revalidatePath('/admin/inventory');

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function deleteProduct(id: string, imageUrl: string | null) {
  try {
    const supabase = getSupabaseAdmin();

    // 1. Delete image from storage if it exists
    if (imageUrl) {
      // Extract file path from public URL
      // https://<project>.supabase.co/storage/v1/object/public/product-images/category/filename.jpg
      const urlParts = imageUrl.split('/product-images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove([filePath]);
          
        if (storageError) {
          console.error('Storage Delete Error:', storageError);
        }
      }
    }

    // 2. Delete record from DB
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (dbError) {
      return { error: 'Failed to delete product from database' };
    }

    revalidatePath('/collection');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred' };
  }
}
