import { supabase } from '../supabase';
import { OurStoryContent } from '../../types';

export const getOurStoryContent = async (): Promise<OurStoryContent | null> => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', 'our_story')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn("Could not fetch our_story content:", error);
    }

    if (!data || !data.value) return null;

    return data.value as OurStoryContent;
  } catch (err) {
    console.warn("Failed to fetch our story content:", err);
    return null;
  }
};

export const updateOurStoryContent = async (payload: OurStoryContent) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: existing } = await supabase
    .from('site_content')
    .select('key')
    .eq('key', 'our_story')
    .maybeSingle();

  const payloadData = {
    key: 'our_story',
    value: payload,
    updated_at: new Date().toISOString()
  };

  let error;
  if (existing) {
    const { error: err } = await supabase
      .from('site_content')
      .update(payloadData)
      .eq('key', 'our_story');
    error = err;
  } else {
    const { error: err } = await supabase
      .from('site_content')
      .insert([payloadData]);
    error = err;
  }

  if (error) throw error;
};
