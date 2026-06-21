import { supabase } from "../supabase";
import { Location } from "../../types";

// In-memory cache to prevent duplicate requests
let locationsCache: Location[] | null = null;
let fetchPromise: Promise<Location[]> | null = null;

export const clearLocationsCache = () => {
  locationsCache = null;
  fetchPromise = null;
};

export const getPublishedLocations = async (forceRefresh = false): Promise<Location[]> => {
  if (forceRefresh) {
    locationsCache = null;
  }
  
  if (locationsCache) return locationsCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      locationsCache = data as Location[];
      return locationsCache;
    } catch (err: any) {
      console.error("Error fetching published locations:", err);
      
      // Graceful fallback if the user hasn't run the SQL migration yet
      if (err?.message?.includes("is_published") || err?.message?.includes("column")) {
        console.warn("Schema missing is_published. Falling back to all locations.");
        const { data: fallbackData } = await supabase
          .from("locations")
          .select("*")
          .order("created_at", { ascending: true });
        
        locationsCache = (fallbackData as Location[]) || [];
        return locationsCache;
      }
      
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};
