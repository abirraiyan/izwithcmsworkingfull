import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { getSpecialsItems, getImageUrl } from "../lib/supabase";
import { MenuItem } from "../types";

export default function SpecialsCarousel() {
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
        const data = await getSpecialsItems();
        setItems(data as MenuItem[]);
      } catch (err) {
        console.error("Error fetching specials:", err);
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
      const scrollAmount = 300;
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
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-mocha" size={40} />
      </div>
    );
  }

  // Hide section if no items
  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white text-charcoal overflow-hidden border-y border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4">
            <Sparkles size={14} />
            <span>Exclusive</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal italic font-light">
            Our <span className="text-mocha">Specials</span>
          </h2>
        </motion.div>

        <div className="hidden md:flex gap-4">
          <button
            onClick={() => scroll("left")}
            disabled={!showLeftArrow}
            className={`p-3 rounded-full border border-charcoal/10 transition-all ${
              showLeftArrow 
                ? "bg-cream text-charcoal hover:bg-mocha hover:text-white" 
                : "opacity-20 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!showRightArrow}
            className={`p-3 rounded-full border border-charcoal/10 transition-all ${
              showRightArrow 
                ? "bg-cream text-charcoal hover:bg-mocha hover:text-white" 
                : "opacity-20 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex gap-6 overflow-x-auto no-scrollbar px-6 md:px-12 snap-x snap-mandatory cursor-grab active:cursor-grabbing pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="snap-start min-w-[260px] md:min-w-[320px] lg:min-w-[380px] flex-shrink-0"
            >
              <div className="group relative aspect-[5/4] rounded-2xl overflow-hidden bg-beige shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500">
                <img
                  src={getImageUrl(item.image_url, "menu-images")}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <Link
                      to="/menu"
                      className="bg-cream/90 backdrop-blur-sm text-charcoal px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2 self-start hover:bg-gold hover:text-white transition-colors"
                    >
                      View in Menu
                      <ArrowRight size={14} />
                    </Link>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl text-charcoal group-hover:text-mocha transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-charcoal/40 text-sm font-light uppercase tracking-widest mt-1">
                    Signature Special
                  </p>
                </div>
                <span className="font-mono text-mocha font-medium">
                   ৳{item.price?.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
          
          {/* Last Card: Explore More */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="snap-start min-w-[260px] md:min-w-[320px] lg:min-w-[380px] flex-shrink-0 pr-6 md:pr-12"
          >
            <Link 
              to="/menu"
              className="flex flex-col items-center justify-center h-full aspect-[5/4] rounded-2xl bg-cream border border-charcoal/5 hover:bg-mocha hover:text-white transition-all group/more"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover/more:scale-110 transition-transform">
                <ArrowRight className="text-mocha" size={20} />
              </div>
              <span className="font-serif text-xl">Explore Special Menu</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
