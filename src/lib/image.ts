import { optimizeCloudinaryUrl, isCloudinaryUrl } from './cloudinary';

const SIZE_MAP = {
  hero: 1600,
  gallery: 900,
  products: 500,
  logo: 300,
};

export type ImageSizePreset = keyof typeof SIZE_MAP | number;

/**
 * Consolidates image URL generation. Detects Cloudinary URLs to apply auto-optimizations and responsive sizing,
 * and maintains backward compatibility for absolute/relative Supabase Storage URLs.
 */
export const getImageUrl = (
  path: string | null | undefined,
  bucket = "gallery-media",
  size?: ImageSizePreset
): string => {
  if (!path) return "/placeholder.jpg";

  // Check if this is a Cloudinary hosted asset
  if (isCloudinaryUrl(path)) {
    let width: number | undefined;
    if (typeof size === 'number') {
      width = size;
    } else if (size && size in SIZE_MAP) {
      width = SIZE_MAP[size as keyof typeof SIZE_MAP];
    }
    return optimizeCloudinaryUrl(path, { width });
  }

  // Already a full external URL (like legacy Supabase public URLs)
  if (path.startsWith("http")) return path;

  // Relative Supabase path (legacy fallback)
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return "/placeholder.jpg";

  return `${url}/storage/v1/object/public/${bucket}/${path}`;
};
