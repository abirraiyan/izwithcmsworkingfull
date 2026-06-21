import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GalleryItem } from '../types';

export const useGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .eq("media_type", "image")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching gallery:", error);
          return;
        }

        if (mounted && data) {
          setGallery(data as GalleryItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGallery();

    return () => {
      mounted = false;
    };
  }, []);

  return { gallery, loading };
};
