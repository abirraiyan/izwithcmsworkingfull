import { supabase } from '../supabase';
import { GetToKnowUsContent } from '../../types/getToKnowUs';

const GET_TO_KNOW_US_KEY = 'get_to_know_us';

const DEFAULT_CONTENT: GetToKnowUsContent = {
  settings: {
    background: '#FAF8F5', // cream
    enableAnimation: true,
    animationIntensity: 'medium',
  },
  founders: {
    enabled: true,
    backgroundMedia: null,
    backgroundOverlayOpacity: 10,
    heading: 'Meet the Founders',
    paragraph1: '',
    paragraph2: '',
    quote: '',
    imageLeft: null,
    imageRight: null,
    imageLeftShape: 'organic',
    imageRightShape: 'organic',
    imageAnimation: 'fade',
  },
  philosophy: {
    enabled: true,
    badge: 'Philosophy',
    titleNormal: 'Get to Know',
    titleAccent: 'Us',
    subtitle: 'We are more than a bakery; we are a community of passionate individuals dedicated to creating memorable experiences.',
    cards: [],
  }
};

export async function getGetToKnowUsContent(): Promise<GetToKnowUsContent> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', GET_TO_KNOW_US_KEY)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found, return default
        return DEFAULT_CONTENT;
      }
      throw error;
    }

    if (!data?.value) {
      return DEFAULT_CONTENT;
    }

    // Merge with defaults to ensure all fields exist
    return {
      settings: { ...DEFAULT_CONTENT.settings, ...data.value.settings },
      founders: { ...DEFAULT_CONTENT.founders, ...data.value.founders },
      philosophy: { 
        ...DEFAULT_CONTENT.philosophy, 
        ...data.value.philosophy,
        cards: data.value.philosophy?.cards || []
      }
    };
  } catch (error) {
    console.error('Error fetching Get To Know Us content:', error);
    return DEFAULT_CONTENT;
  }
}

export async function updateGetToKnowUsContent(content: GetToKnowUsContent): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      {
        key: GET_TO_KNOW_US_KEY,
        value: content,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'key' }
    );

  if (error) {
    console.error('Error updating Get To Know Us content:', error);
    throw error;
  }
}
