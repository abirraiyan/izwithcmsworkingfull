export interface CloudinaryAsset {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: 'image' | 'video';
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djnv9soqm';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'iz-cafe';

/**
 * Base function to upload any file to Cloudinary with progress tracking and abort support.
 */
export function uploadFile(
  file: File,
  resourceType: 'image' | 'video' | 'auto' = 'auto',
  options?: UploadOptions
): Promise<CloudinaryAsset> {
  return new Promise((resolve, reject) => {
    let determinedType: 'image' | 'video' = 'image';
    if (resourceType === 'auto') {
      determinedType = file.type.startsWith('video/') ? 'video' : 'image';
    } else {
      determinedType = resourceType;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${determinedType}/upload`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    // Progress listener
    if (options?.onProgress && xhr.upload) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          options.onProgress?.(percent);
        }
      });
    }

    // Abort listener
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Upload aborted', 'AbortError'));
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url || data.url,
            publicId: data.public_id,
            width: data.width || 0,
            height: data.height || 0,
            format: data.format || file.name.split('.').pop() || '',
            bytes: data.bytes || file.size,
            resourceType: data.resource_type || determinedType,
          });
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload.'));
    };

    xhr.onabort = () => {
      reject(new DOMException('Upload aborted', 'AbortError'));
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    xhr.send(formData);
  });
}

/**
 * Uploads a single image to Cloudinary.
 */
export async function uploadImage(file: File, options?: UploadOptions): Promise<CloudinaryAsset> {
  return uploadFile(file, 'image', options);
}

/**
 * Uploads a single video to Cloudinary.
 */
export async function uploadVideo(file: File, options?: UploadOptions): Promise<CloudinaryAsset> {
  return uploadFile(file, 'video', options);
}

/**
 * Uploads multiple files in parallel.
 */
export async function uploadImages(files: File[], options?: UploadOptions): Promise<CloudinaryAsset[]> {
  // To avoid parallel calls stomping on onProgress, we split progress equally or report individual.
  // Here, we trigger parallel uploads and aggregate the responses.
  const promises = files.map((file) => uploadFile(file, 'auto', options));
  return Promise.all(promises);
}

/**
 * Verifies if a given string is a Cloudinary asset URL.
 */
export function isCloudinaryUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
}

/**
 * Verifies if a given string is a Supabase storage object URL.
 */
export function isSupabaseStorageUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.includes('/storage/v1/object/public/');
}

/**
 * Extracts the public ID from a Cloudinary URL (including directory path and excluding format extension).
 */
export function extractCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!isCloudinaryUrl(url) || !url) return null;

  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    // Grab everything after "/upload/"
    const path = url.substring(uploadIndex + 8);
    const parts = path.split('/');

    // Remove any transformation segments (e.g. w_500,f_auto,q_auto) and the version token (e.g. v162352525)
    const cleanParts = parts.filter((part) => {
      if (part.includes('_') || part.includes(',')) {
        if (/^v\d+$/.test(part)) return false; // Skip version tag (e.g. v12345)
        return false; // Skip transformation segment
      }
      if (/^v\d+$/.test(part)) return false; // Skip version tag
      return true;
    });

    const publicIdWithExt = cleanParts.join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    if (lastDotIndex === -1) return publicIdWithExt;

    return publicIdWithExt.substring(0, lastDotIndex);
  } catch (err) {
    console.error('Error extracting Cloudinary public ID:', err);
    return null;
  }
}

/**
 * Enhances a Cloudinary URL with auto-optimization format, auto-quality, dpr_auto, c_limit, and optional width.
 */
export function optimizeCloudinaryUrl(
  url: string,
  options?: { width?: number; height?: number }
): string {
  if (!isCloudinaryUrl(url)) return url;

  // Don't apply transformations to video files via this simple helper
  if (url.includes('/video/upload/')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);
  const parts = afterUpload.split('/');

  // Detect if parts[0] is already a transformation segment
  const firstSegment = parts[0];
  const isTransformation =
    firstSegment.includes(',') ||
    /^(w|h|f|q|c|r|e|b|co|dpr|a|fl|pg|o|l|u|p|t|x|y|z|dl|kw|kc)_/.test(firstSegment);

  // Core optimization filters required: f_auto, q_auto, dpr_auto, c_limit
  const transformList = ['f_auto', 'q_auto', 'dpr_auto', 'c_limit'];
  if (options?.width) {
    transformList.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformList.push(`h_${options.height}`);
  }

  const transformSegment = transformList.join(',');

  if (isTransformation) {
    parts[0] = transformSegment;
  } else {
    parts.unshift(transformSegment);
  }

  return beforeUpload + parts.join('/');
}

/**
 * Builds standard attributes (src, srcSet, sizes) for responsive images.
 */
export function buildResponsiveImage(
  url: string,
  widths = [320, 640, 768, 1024, 1200, 1600]
): { src: string; srcSet: string; sizes: string } {
  if (!isCloudinaryUrl(url)) {
    return { src: url, srcSet: '', sizes: '' };
  }

  const src = optimizeCloudinaryUrl(url, { width: 1024 });
  const srcSet = widths
    .map((w) => `${optimizeCloudinaryUrl(url, { width: w })} ${w}w`)
    .join(', ');
  const sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw';

  return { src, srcSet, sizes };
}
