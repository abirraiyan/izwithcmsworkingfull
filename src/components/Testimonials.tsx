import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, animate, useMotionValue } from "motion/react";
import { getTestimonials } from "../lib/supabase";
import { Testimonial } from "../types";
import { Loader2, Quote } from "lucide-react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        // Fetch up to 5 featured testimonials
        const data = await getTestimonials(true, 5);
        setTestimonials(data || []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0 || loading || isPaused) return;

    const controls = animate(x, -2000, {
      type: "tween",
      duration: 25,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });

    return controls.stop;
  }, [testimonials, loading, isPaused, x]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  // Duplicate the array for a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 md:py-32 bg-cream text-charcoal border-t border-charcoal/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            Guest Experiences
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
            Words from our{" "}
            <span className="italic font-light text-mocha">Community</span>
          </h2>
        </motion.div>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Faded Edges Mask */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-cream to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-cream to-transparent z-20 pointer-events-none" />

        <motion.div 
          style={{ x }}
          className="flex gap-8 whitespace-nowrap py-4 px-4"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${index}`}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block w-[350px] md:w-[450px] bg-white p-10 rounded-[2.5rem] shadow-soft border border-charcoal/5 whitespace-normal flex-shrink-0"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                    <Quote className="text-gold rotate-180" size={24} />
                  </div>
                  <p className="text-charcoal/80 font-light text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-charcoal font-bold">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] tracking-widest uppercase text-gold font-bold mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
