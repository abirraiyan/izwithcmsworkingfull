import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Video, FileImage, Image as ImageIcon } from 'lucide-react';
import { uploadMedia } from '../../lib/supabase';
import toast from 'react-hot-toast';

export interface MediaAsset {
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
}

interface MediaUploaderProps {
  currentMedia?: string | MediaAsset | null; // Supports old string URLs or new MediaAsset objects
  onUploadSuccess: (asset: MediaAsset) => void;
  onRemove: () => void;
  folder?: string;
  label?: string;
  accept?: string;
}

export default function MediaUploader({ 
  currentMedia, 
  onUploadSuccess, 
  onRemove,
  folder = 'media',
  label = 'Upload Media',
  accept = 'image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime,video/mov,video/mpeg'
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize current media to MediaAsset if it's a string
  const normalizedMedia: MediaAsset | null = typeof currentMedia === 'string' 
    ? { 
        url: currentMedia, 
        type: currentMedia.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
        mimeType: ''
      }
    : currentMedia || null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const extractMetadata = (file: File): Promise<Partial<MediaAsset>> => {
    return new Promise((resolve) => {
      const isVideo = file.type.startsWith('video/');
      const objectUrl = URL.createObjectURL(file);

      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
          });
          URL.revokeObjectURL(objectUrl);
        };
        video.onerror = () => resolve({});
        video.src = objectUrl;
      } else {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            duration: null,
          });
          URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => resolve({});
        img.src = objectUrl;
      }
    });
  };

  const processFile = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast.error('Unsupported file format');
      return;
    }

    // Size limits: Images -> 20MB, Videos -> 200MB
    const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      toast.error('Image exceeds 20MB limit');
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      toast.error('Video exceeds 200MB limit');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(10);
      
      const metadata = await extractMetadata(file);
      setProgress(25);

      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 90));
      }, 500);

      const url = await uploadMedia(file, folder);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully`);
      
      onUploadSuccess({
        url,
        type: isVideo ? 'video' : 'image',
        mimeType: file.type,
        ...metadata
      });
      
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      
      {normalizedMedia?.url ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#3a3a3a] bg-[#1a1a1a] group">
          {normalizedMedia.type === 'video' ? (
            <video 
              src={normalizedMedia.url} 
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              className="w-full max-h-[300px] object-cover"
            />
          ) : (
            <img 
              src={normalizedMedia.url} 
              alt="Preview" 
              className="w-full max-h-[300px] object-cover"
            />
          )}
          
          <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#c4a030] shadow-lg"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-600 shadow-lg"
            >
              Remove
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full h-48 
            border-2 border-dashed rounded-2xl transition-all cursor-pointer
            ${isDragging 
              ? 'border-[#d4af37] bg-[#d4af37]/10' 
              : 'border-[#3a3a3a] bg-[#2a2a2a] hover:border-gray-500 hover:bg-[#3a3a3a]/50'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-4" />
              <p className="text-sm font-medium text-white mb-2">Uploading...</p>
              <div className="w-48 h-2 bg-black rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#d4af37] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <div className="flex gap-4 mb-3">
                <ImageIcon className="w-10 h-10 text-gray-500" />
                <Video className="w-10 h-10 text-gray-500" />
              </div>
              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold text-[#d4af37]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs uppercase tracking-widest text-gray-500 text-center px-4">
                Images up to 20MB (JPEG, PNG, WEBP, GIF)<br/>
                Videos up to 200MB (MP4, WEBM, MOV)
              </p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
