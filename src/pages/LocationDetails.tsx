import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Share2, 
  ExternalLink,
  Loader2,
  Calendar
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { getImageUrl } from "../lib/image";
import { Location } from "../types";
import toast from "react-hot-toast";

export default function LocationDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLocation() {
      if (!slug) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("locations")
          .select(`
            *,
            location_tags(*),
            location_gallery(*)
          `)
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setLocation(data);
      } catch (err: any) {
        console.error("Error fetching location details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: location?.name,
        text: `Check out ${location?.name} at IZ Pâtisserie & Café`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex flex-col items-center justify-center pt-20">
        <Loader2 className="animate-spin text-gold" size={48} />
        <p className="mt-4 text-charcoal/40 font-light italic">Opening our doors for you...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-medium mb-6">{error || "Location not found"}</p>
        <button
          onClick={() => navigate("/locations")}
          className="px-8 py-3 bg-charcoal text-white rounded-full text-sm hover:bg-mocha transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Locations
        </button>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f5f0]"
    >
      {/* Navigation Layer */}
      <div className="fixed top-24 left-6 md:left-12 z-40">
        <Link
          to="/locations"
          className="group flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full border border-charcoal/5 shadow-soft hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft size={18} className="text-charcoal group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal">Back</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={getImageUrl(location.cover_image, "gallery-media")}
            alt={location.name}
            className="w-full h-full object-cover lg:object-center"
            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-[#f8f5f0]/20 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {location.location_tags?.map(tag => (
                <span 
                  key={tag.id}
                  className="bg-gold text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-charcoal leading-tight mb-4">
              {location.name}
            </h1>
            <div className="flex items-center gap-2 text-charcoal/80 text-lg md:text-xl font-light">
              <MapPin size={24} className="text-gold" />
              <span>{location.address}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details & Info Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-12"
          >
            <div className="prose prose-xl prose-charcoal">
              <h2 className="font-serif text-4xl text-charcoal mb-8 italic">
                {location.about_title || "About the Space"}
              </h2>
              <p className="text-charcoal/70 leading-relaxed font-light text-xl whitespace-pre-wrap">
                {location.about_content || location.description || "Discover a sanctuary where the hustle of the city fades away, and every cup of coffee tells a story of craftsmanship and care."}
              </p>
            </div>

            {/* Local Gallery Grid */}
            {location.location_gallery && location.location_gallery.length > 0 && (
              <div className="space-y-8">
                <h3 className="font-serif text-3xl text-charcoal italic">The Gallery</h3>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {location.location_gallery.map((img, idx) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="aspect-[4/5] overflow-hidden rounded-3xl group"
                    >
                      <img
                        src={getImageUrl(img.image_url, "gallery-media")}
                        alt={`${location.name} Gallery ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar / Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-[3rem] p-10 shadow-soft lg:sticky lg:top-32 space-y-12">
              <div>
                <h3 className="font-serif text-3xl text-charcoal italic mb-8">Details</h3>
                <div className="space-y-8">
                  
                  {(location.opening_hours || location.working_hours) && (
                    <div className="flex gap-4">
                      <div className="p-4 bg-[#f8f5f0] rounded-2xl text-gold">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Trading Hours</p>
                        <p className="text-charcoal text-lg font-medium whitespace-pre-wrap">
                          {location.opening_hours || location.working_hours}
                        </p>
                      </div>
                    </div>
                  )}

                  {(location.reservation_phone || location.phone_number) && (
                    <div className="flex gap-4">
                      <div className="p-4 bg-[#f8f5f0] rounded-2xl text-gold">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Reservations</p>
                        <p className="text-charcoal text-lg font-medium">
                          {location.reservation_phone || location.phone_number}
                        </p>
                      </div>
                    </div>
                  )}

                  {location.corporate_email && (
                    <div className="flex gap-4">
                      <div className="p-4 bg-[#f8f5f0] rounded-2xl text-gold">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Corporate Booking</p>
                        <a href={`mailto:${location.corporate_email}`} className="text-charcoal text-lg font-medium hover:text-gold transition-colors">
                          {location.corporate_email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-10 border-t border-charcoal/5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#f8f5f0] text-charcoal rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gold hover:text-white transition-all shadow-sm"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  <a 
                    href={location.directions_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name} ${location.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-charcoal text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-mocha transition-all shadow-lg"
                  >
                    <ExternalLink size={16} />
                    Directions
                  </a>
                </div>
                
                {(location.reservation_url || location.reservation_link) && (
                  <a 
                    href={location.reservation_url || location.reservation_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gold text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#c4a030] transition-all shadow-lg"
                  >
                    Book a Table
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
