import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Video, Image as ImageIcon, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadFile, CloudinaryAsset } from '../../lib/cloudinary';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export interface UniversalUploaderProps {
  value?: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
  folder?: string;
}

interface UploadTask {
  id: string;
  name: string;
  file: File;
  progress: number;
  controller: AbortController;
  error?: string;
}

// 10 MB limit for images, 100 MB limit for videos
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const ALLOWED_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
const ALLOWED_VIDEO_EXTS = ['mp4', 'webm', 'mov'];

export default function UniversalUploader({
  value,
  onChange,
  multiple = false,
  label = 'Media Asset',
  accept = 'image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime',
  folder = 'media'
}: UniversalUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);

  // Normalize value to string[] for internal rendering
  const items: string[] = Array.isArray(value)
    ? value
    : value
    ? [value]
    : [];

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      tasks.forEach((t) => t.controller.abort());
    };
  }, []);

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
    const files = Array.from(e.dataTransfer.files || []) as File[];
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const validateFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isImage = file.type.startsWith('image/') || ALLOWED_IMAGE_EXTS.includes(ext);
    const isVideo = file.type.startsWith('video/') || ALLOWED_VIDEO_EXTS.includes(ext);

    if (!isImage && !isVideo) {
      toast.error(`Invalid format for "${file.name}". Allowed: ${[...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS].join(', ')}`);
      return false;
    }

    if (isImage && !ALLOWED_IMAGE_EXTS.includes(ext)) {
      toast.error(`"${file.name}" extension is not supported for images.`);
      return false;
    }

    if (isVideo && !ALLOWED_VIDEO_EXTS.includes(ext)) {
      toast.error(`"${file.name}" extension is not supported for videos.`);
      return false;
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      toast.error(`"${file.name}" exceeds the 10 MB limit for images.`);
      return false;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      toast.error(`"${file.name}" exceeds the 100 MB limit for videos.`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: File[]) => {
    // Check session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Unauthorized: Only authenticated admins can upload files.');
      return;
    }

    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;

    // In single mode, replace files/tasks or restrict count
    const filesToUpload = multiple ? validFiles : [validFiles[0]];

    filesToUpload.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const task: UploadTask = {
        id,
        name: file.name,
        file,
        progress: 0,
        controller: new AbortController()
      };

      setTasks((prev) => [...prev, task]);
      startUpload(task);
    });
  };

  const startUpload = async (task: UploadTask) => {
    try {
      const asset: CloudinaryAsset = await uploadFile(
        task.file,
        'auto',
        {
          signal: task.controller.signal,
          onProgress: (p) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, progress: p } : t))
            );
          }
        }
      );

      // Successfully uploaded
      setTasks((prev) => prev.filter((t) => t.id !== task.id));

      if (replaceIndexRef.current !== null) {
        // Replacing an existing index
        const idx = replaceIndexRef.current;
        replaceIndexRef.current = null;
        const nextItems = [...items];
        nextItems[idx] = asset.url;
        onChange(multiple ? nextItems : asset.url);
        toast.success('Media replaced successfully');
      } else {
        // Appending / setting value
        if (multiple) {
          onChange([...items, asset.url]);
        } else {
          onChange(asset.url);
        }
        toast.success(`"${task.name}" uploaded successfully`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Upload was aborted, silently clean up task
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        toast.error('Upload cancelled');
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, error: err.message || 'Upload failed' } : t
          )
        );
        toast.error(err.message || `Failed to upload "${task.name}"`);
      }
    }
  };

  const handleRetry = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextTask = {
            ...t,
            progress: 0,
            error: undefined,
            controller: new AbortController()
          };
          // Start upload immediately
          startUpload(nextTask);
          return nextTask;
        }
        return t;
      })
    );
  };

  const handleCancel = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.controller.abort();
    }
  };

  const handleRemoveItem = (index: number) => {
    if (multiple) {
      const nextItems = items.filter((_, idx) => idx !== index);
      onChange(nextItems.length > 0 ? nextItems : null);
    } else {
      onChange(null);
    }
  };

  const handleReplaceItem = (index: number) => {
    replaceIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const isVideoUrl = (url: string): boolean => {
    return url.match(/\.(mp4|webm|mov)$/i) !== null || url.includes('/video/upload/');
  };

  return (
    <div className="w-full space-y-4">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
          {label}
        </label>
      )}

      {/* Previews Grid */}
      {items.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence initial={false}>
            {items.map((url, idx) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl overflow-hidden border border-[#3a3a3a] bg-[#1a1a1a] group aspect-video"
              >
                {isVideoUrl(url) ? (
                  <video
                    src={url}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.jpg";
                    }}
                  />
                )}

                <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    onClick={() => handleReplaceItem(idx)}
                    className="px-3 py-1.5 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#c4a030] shadow-lg transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-red-600 shadow-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Tasks Progress Panel */}
      {tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-white"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{task.name}</p>
                {task.error ? (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-1 font-semibold">
                    <AlertTriangle size={12} /> {task.error}
                  </p>
                ) : (
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-2 bg-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d4af37] transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-bold w-8 text-right">
                      {task.progress}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {task.error ? (
                  <button
                    type="button"
                    onClick={() => handleRetry(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase rounded-lg transition-colors"
                  >
                    <RotateCcw size={12} /> Retry
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleCancel(task.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold uppercase rounded-lg transition-colors border border-[#3a3a3a]"
                >
                  <X size={12} /> {task.error ? 'Dismiss' : 'Cancel'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {(multiple || items.length === 0) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            replaceIndexRef.current = null;
            fileInputRef.current?.click();
          }}
          className={`
            relative flex flex-col items-center justify-center w-full h-44
            border-2 border-dashed rounded-2xl transition-all cursor-pointer select-none
            ${isDragging
              ? 'border-[#d4af37] bg-[#d4af37]/5'
              : 'border-[#3a3a3a] bg-[#1a1a1a] hover:border-gray-500 hover:bg-[#202020]'
            }
          `}
        >
          <div className="flex flex-col items-center text-gray-400 px-6 text-center">
            <div className="p-3 bg-[#2a2a2a] rounded-full text-gray-500 mb-3 border border-[#3a3a3a]">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#d4af37]" />
            </div>
            <p className="mb-1 text-sm text-gray-300">
              <span className="font-semibold text-[#d4af37]">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Images up to 10 MB • Videos up to 100 MB
            </p>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
    </div>
  );
}
