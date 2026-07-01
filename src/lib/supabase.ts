/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { clearLocationsCache } from './locations/getLocations';

const isDevelopment = import.meta.env.DEV;
const isBrowser = typeof window !== 'undefined';
const supabaseUrl = (isBrowser && isDevelopment)
  ? `${window.location.origin}/supabase-proxy`
  : (import.meta.env.VITE_SUPABASE_URL || 'https://cxbsldaoodddbqbfjqch.supabase.co');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Deployment Debugging (Masked for Security)
if (import.meta.env.PROD) {
  console.log("SUPABASE CONFIG CHECK:", {
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPrefix: supabaseUrl?.substring(0, 8),
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing! Check Vercel environment variables.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

import { getImageUrl } from './image';
export { getImageUrl };

// Auth Helper
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Database Helper Functions
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

// Helper to generate slug
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const addCategory = async (name: string, parentId?: string | null) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { data, error } = await supabase
    .from('categories')
    .insert([{ 
      name,
      slug: generateSlug(name),
      parent_id: parentId || null
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, name: string, parentId?: string | null) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { data, error } = await supabase
    .from('categories')
    .update({ 
      name,
      slug: generateSlug(name),
      parent_id: parentId || null
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const getMenuItems = async (onlyAvailable: boolean = false) => {
  let query = supabase
    .from('menu_items')
    .select(`
      id,
      name,
      image_url,
      price,
      category_id,
      description,
      is_available,
      categories ( id, name ),
      item_modifiers (
        id,
        modifiers (
          id,
          name,
          price
        )
      )
    `);

  if (onlyAvailable) {
    query = query.eq('is_available', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  console.log("MENU DATA:", data);
  console.log("ERROR:", error);

  if (error) throw error;

  // Format the data to include variants
  return data.map((item: any) => ({
    ...item,
    variants: item.item_modifiers?.map((im: any) => im.modifiers).filter(Boolean) || []
  }));
};

export const getFeaturedMenuItems = async (limit: number = 8) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      id,
      name,
      image_url,
      price,
      is_available,
      is_featured,
      description
    `)
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getSpecialsItems = async (limit: number = 10) => {
  // 1. Get the category ID for SPECIALS
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', 'SPECIALS')
    .single();

  if (catError || !category) return [];

  // 2. Get the items
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      id,
      name,
      image_url,
      price,
      is_available,
      description
    `)
    .eq('category_id', category.id)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const addMenuItem = async (itemData: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { sizes, ...item } = itemData;

  const basePrice = sizes && sizes.length > 0 ? Number(sizes[0].price) : 0;

  const payload = {
    ...item,
    price: item.price !== undefined ? item.price : basePrice,
    slug: generateSlug(item.name)
  };

  // 1. Insert item
  const { data: newItem, error: itemError } = await supabase
    .from('menu_items')
    .insert([payload])
    .select()
    .single();

  if (itemError) throw itemError;

  // 2. Insert sizes
  if (sizes && sizes.length > 0) {
    for (const size of sizes) {
      if (!size.name || !size.price) continue;

      const { data: modifier, error: modError } = await supabase
        .from('modifiers')
        .insert([{
          name: size.name,
          price: Number(size.price)
        }])
        .select()
        .single();

      if (modError) throw modError;

      const { error: linkError } = await supabase
        .from('item_modifiers')
        .insert([{
          item_id: newItem.id,
          modifier_id: modifier.id
        }]);

      if (linkError) throw linkError;
    }
  }

  return newItem;
};

export const updateMenuItem = async (id: string, itemData: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { sizes, ...item } = itemData;

  const basePrice = sizes && sizes.length > 0 ? Number(sizes[0].price) : 0;

  const payload = {
    ...item,
    price: item.price !== undefined ? item.price : basePrice,
    slug: generateSlug(item.name)
  };

  // 1. Update item
  const { data: updatedItem, error: itemError } = await supabase
    .from('menu_items')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (itemError) throw itemError;

  // 2. Update sizes (simple approach: delete and re-add)
  // First, get existing modifier IDs to potentially clean them up
  const { data: existingLinks } = await supabase
    .from('item_modifiers')
    .select('modifier_id')
    .eq('item_id', id);

  // Delete existing links
  await supabase
    .from('item_modifiers')
    .delete()
    .eq('item_id', id);

  // Delete old modifiers if they were specific to this item
  if (existingLinks && existingLinks.length > 0) {
    const modIds = existingLinks.map(l => l.modifier_id);
    await supabase
      .from('modifiers')
      .delete()
      .in('id', modIds);
  }

  // Add new sizes
  if (sizes && sizes.length > 0) {
    for (const size of sizes) {
      if (!size.name || !size.price) continue;

      const { data: modifier, error: modError } = await supabase
        .from('modifiers')
        .insert([{
          name: size.name,
          price: Number(size.price)
        }])
        .select()
        .single();

      if (modError) throw modError;

      await supabase
        .from('item_modifiers')
        .insert([{
          item_id: id,
          modifier_id: modifier.id
        }]);
    }
  }

  return updatedItem;
};

export const deleteMenuItem = async (id: string) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  // 1. Get existing modifier IDs to potentially clean them up
  const { data: existingLinks } = await supabase
    .from('item_modifiers')
    .select('modifier_id')
    .eq('item_id', id);

  // 2. Delete existing links
  await supabase
    .from('item_modifiers')
    .delete()
    .eq('item_id', id);

  // 3. Delete old modifiers if they were specific to this item
  if (existingLinks && existingLinks.length > 0) {
    const modIds = existingLinks.map(l => l.modifier_id);
    await supabase
      .from('modifiers')
      .delete()
      .in('id', modIds);
  }

  // 4. Delete the menu item itself
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
};



export const getGalleryItems = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addGalleryItem = async (item: { title?: string; media_url: string; media_type: 'image' | 'video'; is_featured?: boolean }) => {
  const session = await getSession();
  console.log('Current session for gallery insert:', session);
  
  if (!session) {
    throw new Error('No active session found. Please log in.');
  }

  const { data, error } = await supabase
    .from('gallery')
    .insert([{
      title: item.title || null,
      media_url: item.media_url,
      media_type: item.media_type,
      is_featured: item.is_featured || false
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Gallery insert error:', error);
    throw error;
  }
  
  console.log('Gallery insert success:', data);
  return data;
};

export const deleteGalleryItem = async (id: string) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  if (error) throw error;
};



// Locations Management
export const getLocations = async () => {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      location_tags(*),
      location_gallery(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

import { cleanLocationPayload } from './db/cleanLocationPayload';

export const addLocation = async (locationData: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const cleanPayload = await cleanLocationPayload(locationData);
  const { tags, gallery, ...location } = cleanPayload;
  const slug = location.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // 1. Insert location
  const { data: newLocation, error: locError } = await supabase
    .from('locations')
    .insert([{ ...location, slug }])
    .select()
    .single();

  if (locError) {
    if (locError.message.includes('column')) {
      throw new Error("Database schema needs migration. Run sync.");
    }
    throw locError;
  }

  // 2. Insert tags
  if (tags && tags.length > 0) {
    const tagPayloads = tags.map((tag: string) => ({
      location_id: newLocation.id,
      label: tag // Using label to match previous guest-side implementation
    }));
    const { error: tagError } = await supabase.from('location_tags').insert(tagPayloads);
    if (tagError) throw tagError;
  }

  // 3. Insert gallery images
  if (gallery && gallery.length > 0) {
    const galleryPayloads = gallery.map((url: string) => ({
      location_id: newLocation.id,
      image_url: url
    }));
    const { error: galleryError } = await supabase.from('location_gallery').insert(galleryPayloads);
    if (galleryError) throw galleryError;
  }

  clearLocationsCache();
  return newLocation;
};

export const updateLocation = async (id: string, locationData: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const cleanPayload = await cleanLocationPayload(locationData);
  const { tags, gallery, ...location } = cleanPayload;
  const slug = location.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // 1. Update location
  const { data: updatedLocation, error: locError } = await supabase
    .from('locations')
    .update({ ...location, slug })
    .eq('id', id)
    .select()
    .single();

  if (locError) {
    if (locError.message.includes('column')) {
      throw new Error("Database schema needs migration. Run sync.");
    }
    throw locError;
  }

  // 2. Update tags (delete and re-add)
  await supabase.from('location_tags').delete().eq('location_id', id);
  if (tags && tags.length > 0) {
    const tagPayloads = tags.map((tag: string) => ({
      location_id: id,
      label: tag
    }));
    await supabase.from('location_tags').insert(tagPayloads);
  }

  // 3. Update gallery (delete and re-add)
  await supabase.from('location_gallery').delete().eq('location_id', id);
  if (gallery && gallery.length > 0) {
    const galleryPayloads = gallery.map((url: string) => ({
      location_id: id,
      image_url: url
    }));
    await supabase.from('location_gallery').insert(galleryPayloads);
  }

  clearLocationsCache();
  return updatedLocation;
};

export const deleteLocation = async (id: string) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);
  if (error) throw error;
  clearLocationsCache();
};



// Testimonials Management
export const getTestimonials = async (onlyFeatured: boolean = false, limit: number = 3) => {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (onlyFeatured) {
    query = query.eq('is_featured', true).limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const addTestimonial = async (testimonial: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTestimonial = async (id: string, testimonial: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTestimonial = async (id: string) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
