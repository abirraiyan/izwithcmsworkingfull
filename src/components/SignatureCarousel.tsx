import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { getFeaturedMenuItems, getImageUrl } from "../lib/supabase";
import { MenuItem } from "../types";

export default function SignatureCarousel() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Drag to scroll logic
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getFeaturedMenuItems(8);
        setItems(data as MenuItem[]);
      } catch (err) {
        console.error("Error fetching featured items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mouse drag events
  const onMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-mocha" size={40} />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-cream text-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
            Limited Series
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
            Signature <span className="italic font-light text-mocha">Creations</span>
          </h2>
        </motion.div>

        <div className="hidden md:flex gap-4">
          <button
            onClick={() => scroll("left")}
            disabled={!showLeftArrow}
            className={`p-4 rounded-full border border-charcoal/10 transition-all ${
              showLeftArrow 
                ? "bg-white text-charcoal shadow-md hover:bg-charcoal hover:text-cream" 
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!showRightArrow}
            className={`p-4 rounded-full border border-charcoal/10 transition-all ${
              showRightArrow 
                ? "bg-white text-charcoal shadow-md hover:bg-charcoal hover:text-cream" 
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex gap-6 overflow-x-auto no-scrollbar px-6 md:px-12 snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="snap-start min-w-[280px] md:min-w-[360px] lg:min-w-[420px] flex-shrink-0"
            >
              <div className="group/card relative aspect-[4/5] rounded-3xl overflow-hidden bg-beige mb-6 shadow-soft hover:shadow-xl transition-all duration-500">
                <img
                  src={getImageUrl(item.image_url, "menu-images")}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
                
                {/* Overlay for price/badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="flex justify-between items-center text-white">
                    <span className="font-mono text-lg">৳{item.price?.toFixed(2)}</span>
                    <Link
                      to="/menu"
                      className="bg-gold text-white p-3 rounded-full hover:bg-white hover:text-charcoal transition-all"
                    >
                      <ArrowRight size={20} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>

                {/* Bestseller Badge (Logic can be added later) */}
                {index === 0 && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-mocha text-cream text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Bestseller
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-charcoal text-cream text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    New Arrival
                  </div>
                )}
              </div>

              <div className="px-4">
                <h3 className="font-serif text-2xl text-charcoal mb-2 group-hover/card:text-mocha transition-colors">
                  {item.name}
                </h3>
                <p className="text-charcoal/50 text-sm font-light line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
          
          {/* View Menu Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="snap-start min-w-[280px] md:min-w-[360px] lg:min-w-[420px] flex-shrink-0 pr-6 md:pr-12"
          >
            <Link 
              to="/menu"
              className="flex flex-col items-center justify-center h-full aspect-[4/5] rounded-3xl border-2 border-dashed border-charcoal/10 bg-white/50 hover:bg-white hover:border-gold transition-all group/view-all"
            >
              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-4 group-hover/more:scale-110 transition-transform">
                <ArrowRight className="text-mocha" size={22} strokeWidth={1.5} />
              </div>
              <span className="font-serif text-2xl text-charcoal">View Full Menu</span>
              <p className="text-charcoal/40 text-sm mt-2">Explore our entire collection</p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
