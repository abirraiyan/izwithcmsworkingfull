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
  is_featured?: boolean;
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
  section?: string;
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
  phone_number?: string;
  working_hours?: string;
  reservation_link?: string;
  is_published?: boolean;
  sort_order?: number;
  opening_hours?: string;
  reservation_phone?: string;
  corporate_email?: string;
  directions_url?: string;
  reservation_url?: string;
  about_title?: string;
  about_content?: string;
  updated_at?: string;
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

export interface SiteContent {
  hero_video_url?: string;
  hero_poster_url?: string;
  hero_badge?: string;
  hero_title_line_1?: string;
  hero_title_line_2?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  hero_enabled?: string; // Stored as string 'true' or 'false'
  story_heading?: string;
  story_highlight?: string;
  story_paragraph_1?: string;
  story_paragraph_2?: string;
  founder_name?: string;
  founder_role?: string;
  founder_avatar?: string;
  updated_at?: string;
}

export interface OurStoryPhilosophyCard {
  id: string;
  title: string;
  description: string;
  image: string;
  sort_order: number;
}

export interface OurStoryGalleryImage {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface OurStoryContent {
  hero?: {
    enabled: boolean;
    badge_text: string;
    title: string;
    hero_image: string;
    overlay_opacity: number;
  };
  journey?: {
    enabled: boolean;
    title: string;
    highlighted_word: string;
    paragraph_1: string;
    paragraph_2: string;
    paragraph_3: string;
    side_image: string;
  };
  philosophy?: {
    enabled: boolean;
    title: string;
    subtitle: string;
    cards: OurStoryPhilosophyCard[];
  };
  gallery?: OurStoryGalleryImage[];
  founder?: {
    enabled: boolean;
    founder_name: string;
    founder_title: string;
    founder_photo: string;
    founder_story: string;
  };
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  enabled: boolean;
  highlighted: boolean;
  order: number;
}

