/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing! Requests will fail.');
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

export const getImageUrl = (path: string, bucket = "menu-images") => {
  if (!path) return "/placeholder.jpg";

  if (path.startsWith("http")) return path;

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

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

export const uploadImage = async (file: File) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const userId = session.user.id;
  console.log('Starting upload to menu-images for user:', userId);
  const paths = [
    `${userId}/${fileName}`,
    `public/${fileName}`,
    fileName
  ];

  let lastError = null;

  for (const filePath of paths) {
    try {
      console.log(`Attempting upload to menu-images: ${filePath}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.warn(`Upload to ${filePath} failed:`, uploadError.message);
        lastError = uploadError;
        continue;
      }

      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('menu-images')
          .getPublicUrl(filePath);
        return publicUrl;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`All upload attempts failed: ${lastError?.message || 'Unknown error'}`);
};

export const getGalleryItems = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addGalleryItem = async (item: { title?: string; media_url: string; media_type: 'image' | 'video' }) => {
  const session = await getSession();
  console.log('Current session for gallery insert:', session);
  
  if (!session) {
    throw new Error('No active session found. Please log in.');
  }

  const payload = {
    title: item.title || null,
    media_url: item.media_url,
    media_type: item.media_type
  };

  console.log('Inserting gallery item:', payload);

  const { data, error } = await supabase
    .from('gallery')
    .insert([payload])
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

export const uploadGalleryMedia = async (file: File) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const userId = session.user.id;
  console.log('Starting upload to gallery-media for user:', userId);
  const paths = [
    `${userId}/${fileName}`,
    `public/${fileName}`,
    fileName
  ];

  let lastError = null;

  for (const filePath of paths) {
    try {
      console.log(`Attempting upload to gallery-media: ${filePath}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.warn(`Gallery upload to ${filePath} failed:`, uploadError.message);
        lastError = uploadError;
        continue;
      }

      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-media')
          .getPublicUrl(filePath);
        return publicUrl;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Gallery upload failed: ${lastError?.message || 'Unknown error'}`);
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

export const addLocation = async (locationData: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { tags, gallery, ...location } = locationData;
  const slug = location.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // 1. Insert location
  const { data: newLocation, error: locError } = await supabase
    .from('locations')
    .insert([{ ...location, slug }])
    .select()
    .single();

  if (locError) throw locError;

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

  return newLocation;
};

export const updateLocation = async (id: string, locationData: any) => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const { tags, gallery, ...location } = locationData;
  const slug = location.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // 1. Update location
  const { data: updatedLocation, error: locError } = await supabase
    .from('locations')
    .update({ ...location, slug })
    .eq('id', id)
    .select()
    .single();

  if (locError) throw locError;

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
};

export const uploadLocationMedia = async (file: File, locationId: string = 'temp') => {
  const session = await getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Custom path as requested: locations/{locationId}/{filename}
  const filePath = `locations/${locationId}/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('gallery-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('gallery-media')
    .getPublicUrl(filePath);
    
  return publicUrl;
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
