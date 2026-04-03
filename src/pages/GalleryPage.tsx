import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Loader2 } from "lucide-react";
import { getGalleryItems } from "../lib/supabase";
import { GalleryItem } from "../types";
import MediaPreview from "../components/MediaPreview";

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGalleryItems();
        console.log("Gallery Items Fetched:", data);
        setItems(data);
      } catch (err: any) {
        console.error("Failed to fetch gallery items", err);
        setError(err.message || "Failed to load gallery items");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream text-charcoal min-h-screen pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            Visuals
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
            Our <span className="italic font-light text-mocha">Gallery</span>
          </h1>
          <p className="text-charcoal/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
            A glimpse into the daily life, creations, and ambiance of IZ Patisserie.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-mocha" size={40} />
            <p className="text-mocha/60">Loading visuals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-mocha text-white rounded-full text-sm hover:bg-mocha/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl bg-beige"
                onClick={() => setSelectedItem(item)}
              >
                <MediaPreview 
                  url={item.media_url} 
                  type={item.media_type} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  showPlayIcon={item.media_type === 'video'}
                />
                <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  {item.title && (
                    <p className="text-white font-serif italic text-lg">{item.title}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-charcoal/50">No visuals available yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-6 right-6 text-cream/70 hover:text-cream transition-colors p-2 z-10"
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-full max-h-full relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.media_type === 'video' ? (
                <video
                  src={selectedItem.media_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title || "Enlarged view"}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              )}
              {selectedItem.title && (
                <p className="text-cream mt-6 text-xl font-serif italic">{selectedItem.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
