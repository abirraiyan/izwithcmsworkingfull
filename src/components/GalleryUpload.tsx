import { useState } from 'react';
import { addGalleryItem } from '../lib/supabase';
import UniversalUploader from './admin/UniversalUploader';
import toast from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';

interface GalleryUploadProps {
  onSuccess: () => void;
}

export default function GalleryUpload({ onSuccess }: GalleryUploadProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!mediaUrl) {
      toast.error('Please upload media first.');
      return;
    }

    try {
      setSaving(true);
      const isVideo = mediaUrl.match(/\.(mp4|webm|mov)$/i) !== null || mediaUrl.includes('/video/upload/');

      await addGalleryItem({
        title: title.trim() || undefined,
        media_url: mediaUrl,
        media_type: isVideo ? 'video' : 'image',
      });

      toast.success('Media added to gallery');
      setMediaUrl(null);
      setTitle('');
      onSuccess();
    } catch (error: any) {
      console.error('Gallery save error:', error);
      toast.error(error.message || 'Error saving media to gallery');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#d4af37]">Upload New Gallery Media</h3>
      </div>

      <div className="space-y-4">
        <UniversalUploader
          label="Gallery Image or Video"
          value={mediaUrl}
          onChange={(url) => setMediaUrl(url as string)}
          accept="image/*,video/*"
        />

        {mediaUrl && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                placeholder="Enter a title for this media..."
                disabled={saving}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} />
                  Add to Gallery
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
