import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect, ReactNode, Component, ErrorInfo } from "react";
import { useOurStory } from "../hooks/useOurStory";
import { Loader2, Store, Coffee, UtensilsCrossed, ChefHat, Croissant, Award, Sparkles, Heart, Compass, MapPin, Utensils } from "lucide-react";

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

const ElegantDivider = () => (
  <div className="flex items-center justify-center my-16 opacity-35 select-none">
    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold" />
    <div className="mx-4 text-gold">✦</div>
    <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold" />
  </div>
);

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

  // Update SEO metadata
  useEffect(() => {
    document.title = "Our Story | IZ Pâtisserie & Café";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = "Discover the story, journey, and vision behind IZ Pâtisserie & Café. From Pallabi, Mirpur to multiple locations across Dhaka, explore our commitment to Caffeine & Kindness, refined pastries, crafted coffee, and heartfelt hospitality.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", descriptionContent);
      document.head.appendChild(metaDescription);
    }
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
  const gallery = content?.gallery?.sort((a,b)=>a.sort_order - b.sort_order) || [];
  const founder = content?.founder || {};

  // Helper to disable animations on mobile
  const anim = (props: any) => isMobile ? {} : props;

  const milestones: {
    id: string;
    title: string;
    description: string;
    icon: any;
    image: string;
    srcSet?: string;
    sizes?: string;
  }[] = [
    {
      id: "01",
      title: "Pallabi, Mirpur",
      description: "What began in Pallabi laid the foundation of IZ Pâtisserie & Café. Built on care, precision, and genuine hospitality, this location established the values that continue to define the brand today.",
      icon: Store,
      image: "/images/pallabi-mirpur-768.jpg",
      srcSet: "/images/pallabi-mirpur-400.jpg 400w, /images/pallabi-mirpur-768.jpg 768w",
      sizes: "(max-width: 768px) 100vw, 50vw"
    },
    {
      id: "02",
      title: "Gulshan 2",
      description: "As IZ grew, the Gulshan 2 location brought the brand experience to a new audience while preserving the warmth, quality, and consistency that made the original café beloved.",
      icon: Coffee,
      image: "/images/gulshan2-800.jpg",
      srcSet: "/images/gulshan2-400.jpg 400w, /images/gulshan2-800.jpg 800w, /images/gulshan2-1024.jpg 1024w",
      sizes: "(max-width: 768px) 100vw, 50vw"
    },
    {
      id: "03",
      title: "Dhanmondi 27",
      description: "The opening of Dhanmondi 27 marked another step in the journey, creating a refined yet welcoming environment where community, craftsmanship, and hospitality come together.",
      icon: UtensilsCrossed,
      image: "/images/dhanmondi27-800.jpg",
      srcSet: "/images/dhanmondi27-400.jpg 400w, /images/dhanmondi27-800.jpg 800w, /images/dhanmondi27-1024.jpg 1024w",
      sizes: "(max-width: 768px) 100vw, 50vw"
    },
    {
      id: "04",
      title: "Central Kitchen",
      description: "Today, all locations are united through a central kitchen that ensures consistency, quality, and operational excellence across every pastry, beverage, and dish.",
      icon: ChefHat,
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "05",
      title: "Future Growth",
      description: "With new locations on the horizon, IZ continues to expand while remaining rooted in its founding promise: delivering experiences guided by Caffeine & Kindness.",
      icon: Croissant,
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const approachPillars = [
    {
      title: "Thoughtful Craftsmanship",
      description: "At IZ Pâtisserie & Café, our approach is rooted in thoughtful craftsmanship, genuine hospitality, and everyday quality. We believe a café should be more than a place to eat or drink; it should be a space where people feel welcomed, cared for, and comfortable returning to.",
      icon: Utensils
    },
    {
      title: "Caffeine & Kindness",
      description: "From carefully prepared coffee and pastry to comforting food and warm service, every detail is guided by our signature spirit of Caffeine & Kindness. We take pride in creating experiences that feel approachable yet refined, where quality, consistency, and human connection remain at the heart of what we do.",
      icon: Heart
    },
    {
      title: "Conscious Connection",
      description: "With a growing focus on sustainability and conscious practices, we remain committed to creating experiences that balance quality, consistency, and meaningful human connection.",
      icon: Compass
    }
  ];

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

      {/* Narrative Section (Our Story Content) */}
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
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-charcoal">
              Our <span className="italic text-mocha">Story</span>
            </h2>
            
            {/* Opener / Introduction */}
            <div className="relative border-l-4 border-gold pl-6 py-2 my-8 italic font-serif text-2xl text-charcoal/90 leading-relaxed bg-beige/10 rounded-r-2xl">
              "The nickname that was given to us by the locals of Mirpur is ‘Friendly Neighbourhood Café.’"
            </div>

            {/* Body Copy */}
            <div className="space-y-6 text-charcoal/80 font-light text-lg leading-relaxed">
              <p>
                From its beginnings in Pallabi, Mirpur, IZ Pâtisserie & Café was built on a simple idea: to create a place where quality meets comfort, and every visit feels personal.
              </p>
              <p>
                From carefully crafted pastries to comforting food and coffee served with heart, every detail is designed to elevate everyday moments.
              </p>
              <p>
                Guided by our signature spirit of Caffeine & Kindness, IZ continues to grow as a space where warmth, taste, and genuine connection come together, making it a café people don’t just visit, but return to.
              </p>
            </div>
          </motion.div>

          <motion.div
            {...anim({
              initial: { opacity: 0, scale: 0.95 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
            })}
            className="relative pr-8 pb-8 md:pr-12 md:pb-12"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-charcoal/5 group bg-mocha/20">
              <img
                src={journey.side_image || "/images/brand-story-1.jpg"}
                alt="Interior of IZ Patisserie with brand logo"
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
            </div>
            <motion.div
              {...anim({
                initial: { opacity: 0, y: 50 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.4, duration: 1 }
              })}
              className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-2/3 aspect-square rounded-3xl overflow-hidden border-8 border-cream shadow-xl hidden md:block"
            >
              <img
                src="/images/brand-story-2.jpg"
                alt="Cozy counter seating and window view of IZ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Hook Line callout */}
        <motion.div
          {...anim({
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.8, delay: 0.2 }
          })}
          className="mt-20 p-8 md:p-12 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-gold/15 shadow-sm text-center relative overflow-hidden group max-w-4xl mx-auto"
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <Heart className="w-6 h-6 text-gold mx-auto mb-4 animate-pulse" />
          <p className="font-serif text-2xl md:text-3xl text-charcoal leading-relaxed italic max-w-3xl mx-auto">
            "Serving crafted coffee, refined pastry, and heartfelt hospitality made for your everyday moments."
          </p>
        </motion.div>
      </section>

      <ElegantDivider />

      {/* Journey Timeline Section */}
      <section className="py-24 md:py-32 bg-beige/10 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <motion.div
            {...anim({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            })}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
              Our Milestones
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
              The Journey of <span className="italic text-mocha">IZ</span>
            </h2>
            <p className="text-charcoal/70 font-light text-lg leading-relaxed">
              From Pallabi, Mirpur to Gulshan 2 and Dhanmondi 27, IZ Pâtisserie & Café has evolved into three distinct destinations connected by one philosophy, one central kitchen, and one commitment to excellence.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Center Spine */}
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-[2px] bg-[#C6A75E]/35 -translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">
              {milestones.map((milestone, idx) => {
                const IconComponent = milestone.icon;
                return (
                  <div 
                    key={milestone.id} 
                    className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Card container */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? "md:pr-[56px]" : "md:pl-[56px]"}`}>
                      <motion.div
                        {...anim({
                          initial: { opacity: 0, x: isMobile ? 30 : (idx % 2 === 1 ? 50 : -50) },
                          whileInView: { opacity: 1, x: 0 },
                          viewport: { once: true, margin: "-100px" },
                          transition: { duration: 0.8, ease: "easeOut" }
                        })}
                        className="bg-white rounded-[24px] p-7 md:p-10 shadow-sm border border-charcoal/5 hover:border-gold/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 bg-cream/30">
                          <img
                            src={milestone.image}
                            srcSet={milestone.srcSet}
                            sizes={milestone.sizes}
                            alt={milestone.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 bg-gold text-cream text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                            Milestone {milestone.id}
                          </div>
                        </div>
                        <h3 className="font-serif text-2xl text-charcoal mb-3 group-hover:text-mocha transition-colors">
                          {milestone.title}
                        </h3>
                        <p className="text-charcoal/70 font-light text-sm md:text-base leading-relaxed">
                          {milestone.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Timeline Spine Node */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-white border-2 border-[#C6A75E] shadow-sm">
                      <IconComponent size={18} className="text-[#C6A75E]" strokeWidth={1.5} />
                    </div>

                    {/* Empty spacer side */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </section>

      <ElegantDivider />

      {/* Section 3: Our Approach */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          {...anim({
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.8 }
          })}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
            Our Method
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
            Our <span className="italic text-mocha">Approach</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {approachPillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={idx}
                {...anim({
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: idx * 0.2, duration: 0.8 }
                })}
                className="bg-white/40 backdrop-blur-sm border border-gold/10 hover:border-gold/30 rounded-3xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 text-gold">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal mb-4">
                  {pillar.title}
                </h3>
                <p className="text-charcoal/70 font-light leading-relaxed text-base flex-grow">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Inline Gallery Section */}
      {gallery.length > 0 && (
        <>
          <ElegantDivider />
          <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
                Gallery
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
                Moments at <span className="italic text-mocha">IZ</span>
              </h2>
            </div>
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
        </>
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

