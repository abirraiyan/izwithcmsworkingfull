import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect, ReactNode, Component, ErrorInfo } from "react";
import { Link } from "react-router-dom";
import { Heart, Coffee, Compass, Sparkles, ArrowRight, Utensils, ChevronDown } from "lucide-react";

// Error Boundary for page robustness
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
    console.error("GetToKnowUs ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex flex-col justify-center items-center text-charcoal">
          <h2 className="text-2xl font-serif mb-4">Content Unavailable</h2>
          <p>We are having trouble loading this page. Please refresh.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function GetToKnowUsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Update SEO metadata
  useEffect(() => {
    document.title = "Get to Know Us | IZ Pâtisserie & Café";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = "Get to know the philosophy, people, and values of IZ Pâtisserie & Café. Discover our journey, crafted products, and the luxury brand experience behind our friendly neighborhood cafes in Dhaka.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", descriptionContent);
      document.head.appendChild(metaDescription);
    }
  }, []);

  // Scroll animations setup
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0.2]);

  // Framer Motion helper for responsive animations
  const anim = (props: any) => props;

  // Values card data
  const values = [
    {
      title: "Refined Craftsmanship",
      description: "We believe in pure ingredients, hand-rolled processes, and the pursuit of culinary perfection. Every single pastry and espresso represents a dedication to timeless artisan craft.",
      icon: Utensils,
    },
    {
      title: "Everyday Kindness",
      description: "True hospitality is quiet, thoughtful, and personal. We focus on genuine connections and everyday care that makes your routine feel special.",
      icon: Heart,
    },
    {
      title: "Conscious Spaces",
      description: "We design calming, beautiful sanctuaries that let you slow down, breathe, and gather. Our cafes are architectural expressions of simple luxury.",
      icon: Compass,
    }
  ];

  // People Behind IZ data (Storytelling format)
  const teamStories: {
    label: string;
    role: string;
    title: string;
    story: string;
    image: string;
    srcSet?: string;
    sizes?: string;
    quote: string;
  }[] = [
    {
      label: "Crafted Daily",
      role: "The Pâtissiers",
      title: "Mastering the Fold",
      story: "Before the first light touches Dhaka, our pastry kitchen is already filled with the aroma of warming ovens. Here, pastry-making is treated as a precise, meditative science. Guided by traditional French methods, our pâtissiers dedicate their mornings to the details: folding premium cultured butter into cold dough, monitoring fermentation timings to the minute, and hand-shaping each layers-thin pastry. The result is a selection of croissants and pastries that shatter delicately at the first bite, revealing a perfect honeycomb structure inside.",
      image: "/images/mastering-fold-576.jpg",
      srcSet: "/images/mastering-fold-400.jpg 400w, /images/mastering-fold-576.jpg 576w",
      sizes: "(max-width: 768px) 100vw, 50vw",
      quote: "Quality isn't accidental. It's the daily repetition of doing small things perfectly."
    },
    {
      label: "Brewed with Precision",
      role: "The Baristas",
      title: "Extracting Character",
      story: "For our baristas, a cup of coffee is a canvas of sensory experience. Behind the bar, they operate as both scientists and sensory artists. Every morning, they calibrate the espresso machines, adjusting grind sizes, water temperatures, and pressure profiles to highlight the unique regional tasting notes of our single-origin beans. From weighing dose to measuring extraction yield with clinical precision, they ensure that every pour-over and flat white reveals the natural floral, fruity, or chocolatey notes of the coffee's origin.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
      quote: "We don't just serve coffee; we highlight the hard work of the growers who harvested it."
    },
    {
      label: "Hospitality First",
      role: "The Curators",
      title: "Sustaining the Welcome",
      story: "At the heart of the IZ experience is our curation team—the faces who set the peaceful, welcoming tone of our sanctuaries. Understanding that a great café is defined by its human warmth, our curators focus on the quiet details of hospitality. They greet our regulars by name, arrange our visual spaces to foster calmness, and manage the daily flow so that each guest can find a moment of peace. They are the guardians of our signature promise: combining Caffeine & Kindness in every interaction.",
      image: "/images/sustaining-welcome-800.jpg",
      srcSet: "/images/sustaining-welcome-400.jpg 400w, /images/sustaining-welcome-800.jpg 800w, /images/sustaining-welcome-1024.jpg 1024w",
      sizes: "(max-width: 768px) 100vw, 50vw",
      quote: "True luxury is feeling entirely at home, even in the middle of a busy city."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-charcoal min-h-screen relative overflow-hidden font-sans">
      {/* 1. Cinematic Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-charcoal">
        <motion.div 
          style={{ y: heroBgY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 scale-[1.05]"
        >
          <img
            src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2000&auto=format&fit=crop"
            alt="Cinematic luxury cafe scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-6 block">
              Behind the Crafted Spaces
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-tight mb-8">
              Get to <span className="italic font-light text-beige">Know Us</span>
            </h1>
            <p className="text-cream/80 text-sm md:text-base font-light tracking-wide max-w-lg leading-relaxed">
              We are more than a coffee shop; we are curators of daily sanctuary.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer pointer-events-none"
        >
          <span className="text-cream/50 text-[10px] uppercase tracking-[0.25em] mb-2 font-medium">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={20} strokeWidth={1.5} className="text-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Our Philosophy Section */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            {...anim({
              initial: { opacity: 0, x: -30 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            })}
            className="space-y-6"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold block">
              Our Philosophy
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1] tracking-tight">
              Savoring the <br />
              <span className="italic text-mocha font-light">Unrushed Moments</span>
            </h2>
            <div className="w-20 h-[2px] bg-gold my-6" />
            <p className="text-charcoal/80 font-light text-base md:text-lg leading-relaxed">
              We believe coffee and pastries are more than commodities; they are pauses in a busy world. Each cup of coffee is dialed in to highlight its distinct terroir, and every pastry is shaped by hand using traditional, slow fermentation.
            </p>
            <p className="text-charcoal/70 font-light text-sm md:text-base leading-relaxed">
              Our mission is to cultivate welcoming spaces that encourage visual harmony, quiet focus, and honest hospitality. We bring refined global craftsmanship into Dhaka's daily rhythm.
            </p>
          </motion.div>

          <motion.div
            {...anim({
              initial: { opacity: 0, scale: 0.96, y: 20 },
              whileInView: { opacity: 1, scale: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            })}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border border-charcoal/5 group"
          >
            <img
              src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=1200&auto=format&fit=crop"
              alt="Artisanal Warm Coffee Setup"
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* 3. The People Behind IZ - Premium Editorial Hero Section */}
      <section 
        className="w-full h-[380px] md:h-[500px] lg:h-[600px] relative flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-charcoal mb-24 md:mb-32 team-hero-bg"
      >
        <style dangerouslySetInnerHTML={{__html: `
          .team-hero-bg {
            background-image: url('/images/team-hero.jpg');
            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;
          }
          @media (min-width: 768px) {
            .team-hero-bg {
              background-position: center;
            }
          }
        `}} />

        {/* Mobile Gradient Overlay (65% to 55%) */}
        <div 
          className="absolute inset-0 z-0 md:hidden" 
          style={{
            background: "linear-gradient(rgba(20,20,20,.65), rgba(20,20,20,.55))"
          }}
        />

        {/* Desktop/Tablet Gradient Overlay (55% to 45%) */}
        <div 
          className="absolute inset-0 z-0 hidden md:block" 
          style={{
            background: "linear-gradient(rgba(20,20,20,.55), rgba(20,20,20,.45))"
          }}
        />

        {/* Centered Content */}
        <div className="relative z-10 max-w-4xl mx-auto py-10 md:py-20 flex flex-col items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-[#C6A75E] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">
              CRAFT & COMMUNITY
            </span>
            <h2 className="font-serif text-[38px] md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              The People <span className="italic text-[#C6A75E] font-light">Behind IZ</span>
            </h2>
            <p className="text-white/90 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed">
              Meet the specialists whose dedication, craftsmanship and hospitality create the IZ experience every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3b. Stories Stack Section */}
      <section className="pb-32 md:pb-48 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Stories Stack */}
          <div className="space-y-40 md:space-y-56">
            {teamStories.map((story, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx}
                  className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Image Side */}
                  <motion.div
                    {...anim({
                      initial: { opacity: 0, x: isEven ? -40 : 40, y: 20 },
                      whileInView: { opacity: 1, x: 0, y: 0 },
                      viewport: { once: true },
                      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="w-full lg:w-[50%] relative"
                  >
                    {/* Warm color grading via sepia & tone filter */}
                    <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-charcoal/5 relative bg-mocha/10 group">
                      <img
                        src={story.image}
                        srcSet={story.srcSet}
                        sizes={story.sizes}
                        alt={story.role}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105 filter sepia-[15%] contrast-[1.02] brightness-[0.98]"
                        loading="lazy"
                      />
                      {/* Subtle elegant gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                    {/* Editorial background shadow decoration */}
                    <div 
                      className="absolute -inset-4 rounded-[3rem] bg-[#FAF8F5]/10 border border-gold/10 -z-10 pointer-events-none scale-[0.98]" 
                    />
                  </motion.div>

                  {/* Text Side */}
                  <motion.div
                    {...anim({
                      initial: { opacity: 0, x: isEven ? 40 : -40, y: 20 },
                      whileInView: { opacity: 1, x: 0, y: 0 },
                      viewport: { once: true },
                      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
                    })}
                    className="w-full lg:w-[50%] space-y-8 flex flex-col justify-center"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold">
                          {story.label}
                        </span>
                        <div className="h-[1px] w-8 bg-gold/30" />
                        <span className="text-charcoal/50 text-xs font-light uppercase tracking-wider">
                          {story.role}
                        </span>
                      </div>
                      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-normal tracking-tight leading-tight">
                        {story.title}
                      </h3>
                    </div>

                    <p className="text-charcoal/80 font-light text-base md:text-lg leading-relaxed">
                      {story.story}
                    </p>

                    {/* Pull Quote */}
                    <div className="border-l-2 border-gold/40 pl-6 py-1 italic font-serif text-charcoal/60 text-lg md:text-xl">
                      "{story.quote}"
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Our Values Section (Three Premium Cards) */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          {...anim({
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.8 }
          })}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
            Core Values
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal">
            What We <span className="italic text-mocha font-light">Live By</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {values.map((val, idx) => {
            const IconComponent = val.icon;
            return (
              <motion.div
                key={idx}
                {...anim({
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: idx * 0.15, duration: 0.8 }
                })}
                className="bg-white border border-[#c6a75e]/15 hover:border-[#c6a75e]/40 rounded-[2rem] p-8 md:p-10 shadow-soft hover:shadow-lg hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center group h-full"
              >
                <div className="w-16 h-16 bg-[#FAF8F5] border border-[#c6a75e]/25 text-[#c6a75e] group-hover:bg-[#c6a75e] group-hover:text-cream rounded-full flex items-center justify-center mb-6 transition-all duration-300">
                  <IconComponent size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-4 text-charcoal">
                  {val.title}
                </h3>
                <p className="text-charcoal/70 font-light text-sm leading-relaxed flex-grow">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 7. Signature Brand Quote Section */}
      <section ref={quoteRef} className="py-24 bg-charcoal text-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(200,168,107,0.12), transparent 60%)"
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            {...anim({
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            })}
            className="flex flex-col items-center gap-6"
          >
            <Sparkles size={24} strokeWidth={1.5} className="text-gold animate-pulse" />
            <blockquote className="font-serif text-2xl md:text-4xl text-cream leading-relaxed italic max-w-3xl">
              "A café is not just a place to buy coffee; it is a cultural sanctuary where time slows down and connection begins."
            </blockquote>
            <div className="h-[1px] w-24 bg-gold/50 my-2" />
            <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold">
              The Shared Table at IZ
            </span>
          </motion.div>
        </div>
      </section>

      {/* 8. Visit Us Call to Action */}
      <section className="relative py-32 overflow-hidden bg-cream/40 border-t border-cream">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop"
            alt="Warm premium Cafe space"
            className="w-full h-full object-cover opacity-10 blur-[1px]"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 flex flex-col items-center">
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold block">
            Visit Our Spaces
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal max-w-2xl leading-tight">
            Step Into the <br />
            <span className="italic text-mocha font-light">IZ Sanctuary</span>
          </h2>
          <p className="text-charcoal/70 text-base md:text-lg font-light max-w-lg leading-relaxed">
            Find your nearest neighborhood cafe in Dhaka. Explore our distinct spatial aesthetics, crafted menus, and warm hospitality.
          </p>
          <div className="pt-4 w-full flex justify-center">
            <Link
              to="/locations"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold hover:bg-[#6f4e37] text-white font-semibold tracking-widest uppercase rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto text-sm"
            >
              <span>Explore Locations</span>
              <ArrowRight size={20} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GetToKnowUs() {
  return (
    <ErrorBoundary>
      <GetToKnowUsContent />
    </ErrorBoundary>
  );
}
