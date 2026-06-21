import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getImageUrl } from "../lib/image";
import { Location } from "../types";

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("locations")
          .select(`
            *,
            location_tags(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLocations(data || []);
      } catch (err: any) {
        console.error("Error fetching locations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f5f0] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block"
          >
            Our Spaces
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl text-charcoal mb-6"
          >
            Visit <span className="italic font-light text-mocha">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/60 text-lg max-w-2xl mx-auto font-light"
          >
            Discover our curated spaces designed for comfort, connection, and the finest caffeine experiences.
          </motion.p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-gold" size={40} />
            <p className="text-charcoal/40 font-light italic">Finding our doors for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-charcoal/5">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-charcoal text-white rounded-full text-sm hover:bg-mocha transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-charcoal/5">
            <p className="text-charcoal/40 italic text-xl">No locations available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {locations.map((loc, idx) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/locations/${loc.slug}`} className="group block">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 border border-charcoal/5">
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={getImageUrl(loc.cover_image, "gallery-media")}
                        alt={loc.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      
                      {/* Tags */}
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        {loc.location_tags?.map(tag => (
                          <span 
                            key={tag.id}
                            className="bg-white/90 backdrop-blur-md text-charcoal text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm"
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="font-serif text-2xl text-charcoal group-hover:text-mocha transition-colors">
                          {loc.name}
                        </h2>
                        <div className="p-2 bg-[#f8f5f0] rounded-full group-hover:bg-gold group-hover:text-white transition-all duration-300">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 text-charcoal/50 mb-6">
                        <MapPin size={16} className="shrink-0 mt-1" />
                        <p className="text-sm font-light leading-relaxed">{loc.address}</p>
                      </div>

                      <div className="pt-6 border-t border-charcoal/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Explorer</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30">View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
