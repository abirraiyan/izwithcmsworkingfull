import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGalleryItems, supabase } from '../../lib/supabase';
import { GalleryItem } from '../../types';
import GalleryUpload from '../../components/GalleryUpload';
import GalleryGrid from '../../components/GalleryGrid';
import toast from 'react-hot-toast';

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setItems(data);
    } catch (error: any) {
      toast.error('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // refresh UI
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Item deleted');
    } catch (err: any) {
      console.error("Delete failed:", err.message);
      alert("Delete failed");
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#d4af37]">Gallery Management</h1>
          <p className="text-gray-400">Manage your cafe's visual story</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#d4af37]/20"
        >
          <Plus size={20} className={`transition-transform duration-300 ${isUploadOpen ? 'rotate-45' : ''}`} />
          {isUploadOpen ? 'Close Upload' : 'Upload New Media'}
        </button>
      </div>

      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl mx-auto">
              <GalleryUpload onSuccess={() => {
                fetchData();
                setIsUploadOpen(false);
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-gray-400">
          <ImageIcon size={20} />
          <span className="font-medium">{items.length} Items in Gallery</span>
        </div>
        
        <GalleryGrid 
          items={items} 
          onDelete={handleDelete} 
          loading={loading} 
        />
      </div>
    </div>
  );
}
