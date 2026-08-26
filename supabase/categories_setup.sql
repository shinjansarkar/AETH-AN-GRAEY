-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories"
  ON public.categories FOR SELECT USING (true);

-- Insert default categories
INSERT INTO public.categories (name) VALUES 
('Sneakers'),
('Signature Oxford'),
('Signature Monk Strap'),
('Signature Chelsea Boot'),
('Signature Balmoral Boot')
ON CONFLICT (name) DO NOTHING;
