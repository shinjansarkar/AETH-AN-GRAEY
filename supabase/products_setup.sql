-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  stock_status text NOT NULL DEFAULT 'In Stock',
  count integer,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (we will allow all access for now since admin has no auth, but good practice to enable)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create policy to allow service role full access (this is default anyway, but good to be explicit if using anon key later)
-- Note: Service role bypasses RLS, so we don't strictly need insert/update/delete policies for it.

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

-- Service role handles uploads, so no public insert policy needed.
