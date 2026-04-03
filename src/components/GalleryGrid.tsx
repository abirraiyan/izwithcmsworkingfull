import { Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';
import MediaPreview from './MediaPreview';

interface GalleryGridProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function GalleryGrid({ items, onDelete, loading = false }: GalleryGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-[#d4af37]" size={40} />
        <p className="text-gray-400">Loading gallery items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl">
        <p className="text-gray-400">No gallery items found. Start by uploading one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative aspect-square bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all hover:shadow-xl hover:shadow-black/40"
          >
            <MediaPreview 
              url={item.media_url} 
              type={item.media_type} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              showPlayIcon={item.media_type === 'video'}
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              {item.title && (
                <p className="text-white font-bold mb-4 line-clamp-2">{item.title}</p>
              )}
              <button
                onClick={() => onDelete(item.id)}
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all transform hover:scale-110 shadow-lg shadow-red-500/20"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#d4af37] text-[10px] font-bold rounded-full border border-[#d4af37]/30 uppercase tracking-widest">
                {item.media_type}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
