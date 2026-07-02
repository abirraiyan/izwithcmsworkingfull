import { supabase } from '../supabase';
import { SiteContent, GalleryItem } from '../../types';

export const getHomeContent = async (): Promise<SiteContent> => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', 'home_hero')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn("Could not fetch site_content:", error);
    }

    const hero = data?.value || {};

    // Map JSON fields back to our flat SiteContent interface
    return {
      hero_enabled: hero.enabled?.toString() || 'false',
      hero_video_url: hero.video_url || '',
      hero_poster_url: hero.poster_url || '',
      hero_badge: hero.badge_text || '',
      hero_title_line_1: hero.title_line_1 || '',
      hero_title_line_2: hero.title_line_2 || '',
      hero_cta_text: hero.cta_text || '',
      hero_cta_link: hero.cta_link || '',
      updated_at: data?.updated_at || ''
    };
  } catch (err) {
    console.warn("Failed to fetch home content:", err);
    return {};
  }
};

export const updateHomeContent = async (payload: Partial<SiteContent>) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: existing } = await supabase
    .from('site_content')
    .select('key')
    .eq('key', 'home_hero')
    .maybeSingle();

  const payloadData = {
    key: 'home_hero',
    value: {
      enabled: payload.hero_enabled === 'true',
      video_url: payload.hero_video_url,
      poster_url: payload.hero_poster_url,
      badge_text: payload.hero_badge,
      title_line_1: payload.hero_title_line_1,
      title_line_2: payload.hero_title_line_2,
      cta_text: payload.hero_cta_text,
      cta_link: payload.hero_cta_link
    },
    updated_at: new Date().toISOString()
  };

  let error;
  if (existing) {
    const { error: err } = await supabase
      .from('site_content')
      .update(payloadData)
      .eq('key', 'home_hero');
    error = err;
  } else {
    const { error: err } = await supabase
      .from('site_content')
      .insert([payloadData]);
    error = err;
  }

  if (error) throw error;
};

export const getHomeGallery = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('media_type', 'image')
      .order('created_at', { ascending: false });
    
    if (error) return [];
    
    return data?.map(item => ({
      id: item.id,
      media_url: item.media_url,
      media_type: item.media_type,
      title: item.title,
      is_featured: item.is_featured
    })) || [];
  } catch (err) {
    return [];
  }
};
