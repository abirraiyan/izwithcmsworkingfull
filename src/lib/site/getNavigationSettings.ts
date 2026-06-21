import { supabase } from '../supabase';
import { NavigationItem } from '../../types';

export const defaultNavigation: NavigationItem[] = [
  { id: 'home', name: 'Home', href: '/', enabled: true, highlighted: false, order: 0 },
  { id: 'our-story', name: 'Our Story', href: '/our-story', enabled: true, highlighted: false, order: 1 },
  { id: 'get-to-know-us', name: 'Get to Know Us', href: '/get-to-know-us', enabled: true, highlighted: false, order: 2 },
  { id: 'locations', name: 'Visit Us', href: '/locations', enabled: true, highlighted: false, order: 3 },
  { id: 'menu', name: 'Menu', href: '/menu', enabled: true, highlighted: false, order: 4 },
  { id: 'iz-grab', name: 'IZ Grab', href: 'https://grab.izcafe.com', enabled: true, highlighted: true, order: 5 },
  { id: 'contact', name: 'Contact', href: '/#reservation', enabled: true, highlighted: false, order: 6 },
];

export const getNavigationSettings = async (): Promise<NavigationItem[]> => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', 'navigation_settings')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 means Single row not found
        console.warn("Could not fetch navigation_settings:", error);
      }
      return defaultNavigation;
    }

    if (data && Array.isArray(data.value)) {
      // Sort items by their order
      const items = [...data.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return items;
    }

    return defaultNavigation;
  } catch (err) {
    console.warn("Failed to fetch navigation settings:", err);
    return defaultNavigation;
  }
};

export const updateNavigationSettings = async (items: NavigationItem[]) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No active session found. Please log in.');

  // Set orders based on current array index
  const orderedItems = items.map((item, index) => ({
    ...item,
    order: index
  }));

  const { error } = await supabase
    .from('site_content')
    .upsert({
      key: 'navigation_settings',
      value: orderedItems,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'key'
    });

  if (error) throw error;
};
