export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  created_at: string;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category_id: string;
  created_at: string;
  price?: number; // Keep as optional for legacy data
  is_available?: boolean;
  variants?: Modifier[];
  categories?: {
    name: string;
  };
}

export interface GalleryItem {
  id: string;
  title?: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface LocationTag {
  id: string;
  location_id: string;
  label: string;
}

export interface LocationGallery {
  id: string;
  location_id: string;
  image_url: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  description: string;
  cover_image: string;
  created_at: string;
  location_tags: LocationTag[];
  location_gallery: LocationGallery[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  is_featured: boolean;
  created_at: string;
}
