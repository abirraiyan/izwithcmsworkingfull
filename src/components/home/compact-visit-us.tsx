import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { getImageUrl } from "../../lib/image";
import { Location } from "../../types";

interface CompactVisitUsProps {
  locations: Location[];
  loading?: boolean;
}

export default function CompactVisitUs({ locations, loading = false }: CompactVisitUsProps) {
  const featured = locations.slice(0, 3);
  const hasMore = locations.length > 3;

  return (
    <section
      id="reservation"
      className="py-[90px] bg-charcoal text-cream relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-16">
        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-12 xl:gap-16 items-start">
          
          {/* Left Side (Content) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center xl:sticky xl:top-32"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
              Visit Us
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-6 leading-tight">
              Reserve your <br />
              <span className="italic font-light text-beige">Experience</span>
            </h2>
            <p className="text-cream/70 text-lg font-light mb-8">
              Weekend tables fill fast — reserve early to ensure your spot at
              our premier patisseries or drop by for a spontaneous treat.
            </p>
            {hasMore && (
              <Link 
                to="/locations"
                className="inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase hover:text-white transition-colors w-fit"
              >
                View all locations &rarr;
              </Link>
            )}
          </motion.div>

          {/* Right Side (Cards) */}
          <div className="w-full overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-[380px]">
                <Loader2 className="animate-spin text-gold" size={32} />
              </div>
            ) : featured.length === 0 ? (
              <div className="flex items-center justify-center h-[380px]">
                <p className="text-cream/60 font-serif text-2xl italic">New branches coming soon.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex xl:grid xl:grid-cols-3 gap-[20px] overflow-x-auto xl:overflow-x-visible pb-8 xl:pb-0 hide-scrollbar snap-x snap-mandatory"
              >
                {featured.map((loc) => (
                  <Link 
                    key={loc.id}
                    to={`/locations/${loc.slug}`}
                    className="group shrink-0 snap-center w-[85vw] sm:w-[320px] xl:w-full h-[380px] bg-[#F8F4EE] rounded-[24px] p-[18px] text-charcoal shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-[180px] aspect-[16/10] rounded-[18px] overflow-hidden mb-5 relative shrink-0">
                        <img 
                          src={getImageUrl(loc.cover_image, "gallery-media")} 
                          alt={loc.name} 
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      </div>
                      
                      <h3 className="font-serif text-[22px] leading-snug font-semibold mb-3 text-charcoal group-hover:text-mocha transition-colors line-clamp-1">
                        {loc.name}
                      </h3>
                      
                      <div className="space-y-1.5">
                        <p className="text-charcoal/70 font-medium text-[13px] leading-relaxed line-clamp-2">
                          {loc.address}
                        </p>
                        <p className="text-charcoal/60 font-medium text-[12px]">
                          {loc.working_hours || "8 AM – 11 PM"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-charcoal/5 mt-auto">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-mocha group-hover:text-charcoal transition-colors">
                        Visit &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
