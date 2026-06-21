import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useGallery } from "../../hooks/useGallery";

export default function HomeGallery() {
  const { gallery, loading } = useGallery();

  if (loading) {
    return (
      <section className="py-24 md:py-40 bg-charcoal text-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Skeleton Loader */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="w-full bg-white/5 rounded-[24px] animate-pulse" 
                style={{ height: `${Math.floor(Math.random() * (500 - 300 + 1) + 300)}px` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!gallery?.length) return null;

  return (
    <section id="gallery" className="relative py-24 md:py-40 bg-charcoal text-cream overflow-hidden">
      {/* Optional Radial Gradient Background for luxury cinematic feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4">
            Follow our journey
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-cream">
            @izpatisseriecafe
          </h2>
        </motion.div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {gallery?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 80, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: (index % 3) * 0.1 // Stagger based on column index approximation
              }}
              className="relative overflow-hidden rounded-[24px] md:rounded-[32px] break-inside-avoid group cursor-pointer"
            >
              {item.media_type === 'video' ? (
                <video
                  src={item.media_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto object-cover transition-all duration-[600ms] group-hover:scale-[1.03] group-hover:brightness-110"
                />
              ) : (
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  src={item.media_url}
                  alt={item.title || 'Gallery'}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:brightness-110"
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Link
            to="/gallery"
            className="inline-block px-12 py-4 border border-gold text-gold text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-gold hover:text-charcoal transition-colors duration-300"
          >
            View Full Gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
