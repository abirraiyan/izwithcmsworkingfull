import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Loader2, FileVideo } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { uploadGalleryMedia, addGalleryItem } from '../lib/supabase';
import toast from 'react-hot-toast';

interface GalleryUploadProps {
  onSuccess: () => void;
}

export default function GalleryUpload({ onSuccess }: GalleryUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size too large (max 10MB)');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      // 1. Upload to storage
      const mediaUrl = await uploadGalleryMedia(file);
      console.log('Media URL obtained:', mediaUrl);
      
      const mediaType = file.type.startsWith('image') ? 'image' : 'video';

      // 2. Insert into database
      await addGalleryItem({
        title: title.trim() || undefined,
        media_url: mediaUrl,
        media_type: mediaType,
      });

      toast.success('Media uploaded successfully');
      setFile(null);
      setPreview(null);
      setTitle('');
      onSuccess();
    } catch (error: any) {
      console.error('Upload process failed:', error);
      toast.error(error.message || 'Error uploading media');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#d4af37]">Upload New Media</h3>
        {file && (
          <button
            onClick={clearFile}
            className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-[#3a3a3a] bg-[#2a2a2a] hover:bg-[#333] hover:border-[#d4af37] transition-all cursor-pointer group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-3 rounded-full bg-[#3a3a3a] group-hover:bg-[#d4af37]/10 transition-colors mb-3">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#d4af37]" />
            </div>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Images or Videos (MAX. 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a]">
            {file.type.startsWith('image') ? (
              <img
                src={preview!}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <FileVideo size={48} className="mb-2" />
                <p className="text-sm">{file.name}</p>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="animate-spin text-[#d4af37]" size={32} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all"
              placeholder="Enter a title for this media..."
              disabled={uploading}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Upload size={20} />
                Upload to Gallery
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
