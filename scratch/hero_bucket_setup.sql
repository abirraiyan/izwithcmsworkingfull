-- Create the hero-media bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-media', 'hero-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the hero-media bucket
CREATE POLICY "Public Read Access for hero-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'hero-media');

-- Allow authenticated users to upload to the hero-media bucket
CREATE POLICY "Authenticated users can upload to hero-media" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'hero-media' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads in hero-media
CREATE POLICY "Authenticated users can update hero-media" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'hero-media' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete from hero-media
CREATE POLICY "Authenticated users can delete from hero-media" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'hero-media' 
  AND auth.role() = 'authenticated'
);
