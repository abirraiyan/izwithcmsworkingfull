import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect, ReactNode, Component, ErrorInfo } from "react";
import { useOurStory } from "../hooks/useOurStory";
import { Loader2 } from "lucide-react";

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  public state = { hasError: false };
  public props: { children: ReactNode };

  constructor(props: {children: ReactNode}) {
    super(props);
    this.props = props;
  }
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("OurStory ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex flex-col justify-center items-center text-charcoal">
          <h2 className="text-2xl font-serif mb-4">Content Unavailable</h2>
          <p>We are having trouble loading our story. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function OurStoryContent() {
  const { content, loading } = useOurStory();
  const founderRef = useRef<HTMLDivElement | null>(null);
  
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollConfig = mounted && founderRef.current
    ? {
        target: founderRef,
        offset: ["start end", "end start"] as any
      }
    : undefined;

  const { scrollYProgress } = useScroll(scrollConfig);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);
  
  // Safe default for image parallax
  const y = mounted && !isMobile ? yParallax : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!mounted) {
    return null; // Wait for hydration before rendering animations
  }

  // Safe defaults if CMS is empty
  const hero = content?.hero || {};
  const journey = content?.journey || {};
  const philosophy = content?.philosophy || { cards: [] };
  const gallery = content?.gallery?.sort((a,b)=>a.sort_order - b.sort_order) || [];
  const founder = content?.founder || {};

  // Helper to disable animations on mobile
  const anim = (props: any) => isMobile ? {} : props;

  return (
    <motion.main
      {...anim({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 }
      })}
      className="bg-cream text-charcoal min-h-screen pt-24"
    >
      {/* Hero Section */}
      {hero.enabled !== false && (
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={hero.hero_image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop"}
              alt="Our Story Hero"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div 
              className="absolute inset-0 bg-charcoal" 
              style={{ opacity: (hero.overlay_opacity ?? 40) / 100 }}
            />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.span
              {...anim({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.2, duration: 0.8 }
              })}
              className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block"
            >
              {hero.badge_text || "Since 2020"}
            </motion.span>
            <motion.h1
              {...anim({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.4, duration: 0.8 }
              })}
              className="font-serif text-5xl md:text-7xl text-cream mb-6"
            >
              {hero.title ? (
                <>
                  {hero.title.split(' ')[0]} <span className="italic font-light">{hero.title.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                <>Our <span className="italic font-light">Story</span></>
              )}
            </motion.h1>
          </div>
        </section>
      )}

      {/* Narrative Section (Journey) */}
      {journey.enabled !== false && (
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              {...anim({
                initial: { opacity: 0, x: -30 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.8 }
              })}
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-8">
                {journey.title || "A Journey of"} <span className="italic text-mocha">{journey.highlighted_word || "Passion"}</span>
              </h2>
              <div className="space-y-6 text-charcoal/80 font-light text-lg leading-relaxed">
                {journey.paragraph_1 && <p>{journey.paragraph_1}</p>}
                {journey.paragraph_2 && <p>{journey.paragraph_2}</p>}
                {journey.paragraph_3 && <p>{journey.paragraph_3}</p>}
                
                {/* Fallback text if totally empty */}
                {!journey.paragraph_1 && !journey.paragraph_2 && !journey.paragraph_3 && (
                  <p>Our journey began with a single vision to create a place people feel drawn back to.</p>
                )}
              </div>
            </motion.div>
            <motion.div
              {...anim({
                initial: { opacity: 0, scale: 0.95 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true },
                transition: { duration: 0.8 }
              })}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <img
                src={journey.side_image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop"}
                alt="Narrative Image"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Craftsmanship Section (Philosophy) */}
      {philosophy.enabled !== false && (
        <section className="py-24 md:py-32 bg-charcoal text-cream">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              {...anim({
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.8 }
              })}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                {philosophy.title || "The Art of"} <span className="italic text-beige">{philosophy.subtitle || "Baking"}</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {(philosophy.cards || []).map((item: any, idx: number) => (
                <motion.div
                  key={item.id || idx}
                  {...anim({
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: idx * 0.2, duration: 0.8 }
                  })}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-8 border-4 border-mocha/30">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-serif text-2xl mb-4">{item.title}</h3>
                  <p className="text-cream/70 font-light leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
              
              {/* Fallback if no cards */}
              {(!philosophy.cards || philosophy.cards.length === 0) && (
                <p className="text-center col-span-full text-cream/50">No philosophy items added yet.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Inline Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {gallery.map((img: any, idx: number) => (
              <motion.div
                key={img.id || idx}
                {...anim({
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.5, delay: (idx % 3) * 0.1 }
                })}
                className="relative overflow-hidden rounded-xl break-inside-avoid group"
              >
                <img 
                  src={img.image_url} 
                  alt={img.caption || 'Gallery Image'} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-cream text-sm">{img.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Premium Circular Founder Showcase */}
      {founder.enabled !== false && (
        <section ref={founderRef} className="relative py-32 md:py-48 bg-cream text-charcoal border-t border-charcoal/10 overflow-hidden">
          {/* Subtle floating glow background */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: "radial-gradient(circle at 30% 50%, rgba(200,168,107,0.18), transparent 70%)"
            }}
          />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
              
              {/* Left: Circular Image Wrapper */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <motion.div 
                  {...anim({
                    initial: { opacity: 0, scale: 0.92, y: 40 },
                    whileInView: { opacity: 1, scale: 1, y: 0 },
                    viewport: { once: true, margin: "-100px" },
                    transition: { duration: 1.1, ease: "easeOut" }
                  })}
                  className="relative group w-[320px] h-[320px] md:w-[560px] md:h-[560px] rounded-full shadow-2xl border-[3px] border-[#C8A86B]/40 overflow-hidden"
                >
                  <motion.img 
                    style={{ y }}
                    src={founder.founder_photo || "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop"} 
                    alt={founder.founder_name || "Founder"} 
                    className="w-full h-[120%] object-cover -mt-[10%] transition-transform duration-[900ms] ease-out group-hover:scale-105 group-hover:rotate-1"
                  />
                </motion.div>
              </div>
              
              {/* Right: Content */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <motion.h2 
                  {...anim({
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.8 }
                  })}
                  className="font-serif text-[clamp(44px,5vw,72px)] leading-tight mb-4 text-charcoal"
                >
                  {founder.founder_name || "Founder Name"}
                </motion.h2>
                
                <motion.p 
                  {...anim({
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.8, delay: 0.2 }
                  })}
                  className="text-[#C8A86B] uppercase tracking-[0.25em] text-sm md:text-base font-bold mb-12"
                >
                  {founder.founder_title || "Founder & Head Chef"}
                </motion.p>
                
                <motion.div
                  {...anim({
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.8, delay: 0.4 }
                  })}
                  className="relative"
                >
                  <motion.div 
                    {...anim({
                      initial: { width: 0 },
                      whileInView: { width: 60 },
                      viewport: { once: true },
                      transition: { duration: 1, delay: 0.6 }
                    })}
                    className="absolute -top-6 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 h-[2px] bg-[#C8A86B]"
                  />
                  <blockquote className="text-charcoal/80 font-light text-xl md:text-2xl leading-relaxed italic">
                    {founder.founder_story ? (
                      <p>"{founder.founder_story}"</p>
                    ) : (
                      <p>"Baking is not just about following recipes; it is about pouring your heart into every fold of dough."</p>
                    )}
                  </blockquote>
                </motion.div>
              </div>
              
            </div>
          </div>
        </section>
      )}
    </motion.main>
  );
}

export default function OurStory() {
  return (
    <ErrorBoundary>
      <OurStoryContent />
    </ErrorBoundary>
  );
}
