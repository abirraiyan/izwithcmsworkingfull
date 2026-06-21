import { motion, useScroll, useTransform } from "motion/react";
import { Heart, Coffee, Star, Users, Sparkles, ChefHat, Loader2 } from "lucide-react";
import { useGetToKnowUs } from "../hooks/useGetToKnowUs";
import { useState, useEffect, ReactNode, Component, ErrorInfo, useRef } from "react";

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

function IconRenderer({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'heart': return <Heart className={className} />;
    case 'star': return <Star className={className} />;
    case 'coffee': return <Coffee className={className} />;
    case 'users': return <Users className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'chef': return <ChefHat className={className} />;
    default: return <Heart className={className} />;
  }
}

function MediaAssetRenderer({ asset, fallbackSrc, className, alt }: { asset: any; fallbackSrc: string; className: string; alt: string }) {
  if (asset?.type === 'video') {
    return (
      <video
        src={asset.url}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }
  return (
    <img
      src={asset?.url || fallbackSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}

function GetToKnowUsContent() {
  const { content, loading } = useGetToKnowUs();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!mounted || !content) {
    return null;
  }

  const { settings, founders, philosophy } = content;

  const anim = (props: any) => (!mounted || isMobile || !settings?.enableAnimation) ? {} : props;

  return (
    <motion.main
      {...anim({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 }
      })}
      className="text-charcoal min-h-screen pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
      style={{ backgroundColor: settings?.background || '#FAF8F5' }}
    >
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header / Philosophy Section */}
        {philosophy?.enabled !== false && (
          <>
            <motion.div
              {...anim({
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              })}
              className="text-center mb-24"
            >
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
                {philosophy?.badge || "Philosophy"}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
                {philosophy?.titleNormal || "Get to Know"} <span className="italic font-light text-mocha">{philosophy?.titleAccent || "Us"}</span>
              </h1>
              <p className="text-charcoal/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
                {philosophy?.subtitle || "We are more than a bakery; we are a community of passionate individuals dedicated to creating memorable experiences."}
              </p>
            </motion.div>

            {/* Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
              {(philosophy?.cards || []).sort((a,b)=>a.order - b.order).map((value: any, idx: number) => (
                <motion.div
                  key={value.id || idx}
                  {...anim({
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: idx * 0.1, duration: 0.8 }
                  })}
                  className={`bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 flex flex-col items-center text-center ${value.hoverEffect === 'lift' ? 'hover:-translate-y-2 hover:shadow-lg' : value.hoverEffect === 'scale' ? 'hover:scale-105 hover:shadow-lg' : value.hoverEffect === 'glow' ? 'hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'hover:shadow-md'}`}
                >
                  <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center mb-6" style={{ color: value.accentColor || '#C8A86B' }}>
                    <IconRenderer name={value.icon} className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-4">{value.title}</h3>
                  <p className="text-charcoal/60 font-light text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Team Section */}
        {founders?.enabled !== false && (
          <div className="bg-charcoal text-cream rounded-[2rem] p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none" style={{ opacity: (founders?.backgroundOverlayOpacity ?? 10) / 100 }}>
               <MediaAssetRenderer
                asset={founders?.backgroundMedia}
                fallbackSrc="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
                alt="Background pattern"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                {...anim({
                  initial: { opacity: 0, x: -30 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.8 }
                })}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-8">
                  {founders?.heading ? (
                    <>
                      {founders.heading.split(' ').slice(0, -1).join(' ')} <span className="italic text-beige">{founders.heading.split(' ').slice(-1)}</span>
                    </>
                  ) : (
                    <>Meet the <span className="italic text-beige">Founders</span></>
                  )}
                </h2>
                <div className="space-y-6 text-cream/80 font-light text-lg leading-relaxed">
                  {founders?.paragraph1 && <p>{founders.paragraph1}</p>}
                  {founders?.paragraph2 && <p>{founders.paragraph2}</p>}
                  
                  {(!founders?.paragraph1 && !founders?.paragraph2) && (
                    <>
                      <p>IZ Patisserie was founded by a team of culinary enthusiasts who shared a vision of bringing world-class pastries to our local community.</p>
                      <p>With backgrounds spanning from traditional French culinary schools to modern specialty coffee roasteries, our founders combined their expertise to create a unique destination.</p>
                    </>
                  )}
                  
                  <p className="italic text-beige border-l-2 border-beige pl-4 mt-6">
                    "{founders?.quote || "We wanted to build a place where people could slow down, savor the moment, and enjoy the simple luxury of a perfectly crafted croissant and a beautiful cup of coffee."}"
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                {...anim({
                  initial: { opacity: 0, scale: 0.95 },
                  whileInView: { opacity: 1, scale: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.8 }
                })}
                className="grid grid-cols-2 gap-6"
              >
                <div className={`aspect-[3/4] overflow-hidden mt-12 ${founders?.imageLeftShape === 'circle' ? 'rounded-full' : founders?.imageLeftShape === 'organic' ? 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]' : 'rounded-2xl'}`}>
                  <MediaAssetRenderer
                    asset={founders?.imageLeft}
                    fallbackSrc="https://images.unsplash.com/photo-1583338917451-face2751d8d5?q=80&w=600&auto=format&fit=crop"
                    alt="Founder Left"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className={`aspect-[3/4] overflow-hidden ${founders?.imageRightShape === 'circle' ? 'rounded-full' : founders?.imageRightShape === 'organic' ? 'rounded-[70%_30%_30%_70%/70%_70%_30%_30%]' : 'rounded-2xl'}`}>
                  <MediaAssetRenderer
                    asset={founders?.imageRight}
                    fallbackSrc="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop"
                    alt="Founder Right"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </section>
    </motion.main>
  );
}

export default function GetToKnowUs() {
  return (
    <ErrorBoundary>
      <GetToKnowUsContent />
    </ErrorBoundary>
  );
}
