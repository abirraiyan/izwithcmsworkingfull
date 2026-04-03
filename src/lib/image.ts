export const getImageUrl = (path: string | null | undefined, bucket = "gallery-media") => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;

  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return "/placeholder.jpg";

  return `${url}/storage/v1/object/public/${bucket}/${path}`;
};
