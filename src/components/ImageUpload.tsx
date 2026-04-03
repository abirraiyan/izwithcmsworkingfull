import { useState, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadImage } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const publicUrl = await uploadImage(file);
      onUpload(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast.error(error.message || 'Error uploading image');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">Menu Item Image</label>
      
      <div className="relative">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-video rounded-xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a]"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-[#3a3a3a] bg-[#2a2a2a] hover:bg-[#333] hover:border-[#d4af37] transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-3 rounded-full bg-[#3a3a3a] group-hover:bg-[#d4af37]/10 transition-colors mb-3">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#d4af37]" />
                </div>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </motion.label>
          )}
        </AnimatePresence>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4af37]"></div>
          </div>
        )}
      </div>
    </div>
  );
}
