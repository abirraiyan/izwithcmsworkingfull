import { motion } from "motion/react";
import { useState, useEffect, ReactNode, Component, ErrorInfo } from "react";
import { 
  Phone, 
  Mail, 
  Globe, 
  CalendarDays, 
  Briefcase, 
  Handshake, 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  Heart, 
  Instagram, 
  Facebook, 
  Linkedin,
  Sparkles,
  ArrowRight
} from "lucide-react";

// Error Boundary for page stability
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
    console.error("Contact ErrorBoundary caught an error", error, errorInfo);
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

// Custom Premium WhatsApp Icon
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Custom TikTok SVG Icon
const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.85-.52-4.03-1.38-.28-.2-.53-.43-.77-.68v6.52c.04 3.09-1.57 6.13-4.41 7.42-2.83 1.34-6.42.92-8.8-1.12-2.45-2.07-3.23-5.6-1.89-8.54 1.3-2.92 4.54-4.71 7.74-4.32V11.1c-1.67-.18-3.43.34-4.59 1.59-1.22 1.27-1.42 3.32-.48 4.79.91 1.46 2.74 2.19 4.43 1.83 1.58-.3 2.73-1.68 2.73-3.29V.02z"/>
  </svg>
);

function ContactContent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update SEO metadata
  useEffect(() => {
    document.title = "Contact Us | Customer Care | IZ Pâtisserie & Café";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = "Get in touch with IZ Pâtisserie & Café. Access our Customer Care Center via WhatsApp, make table reservations, ask questions, or find branch details and directions in Dhaka.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", descriptionContent);
      document.head.appendChild(metaDescription);
    }
  }, []);

  const anim = (props: any) => isMobile ? {} : props;

  // Configuration
  const WHATSAPP_NUMBER = "8801329731723";
  const DEFAULT_PREFILLED_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20need%20assistance.`;

  // Support categories mapping to customized WhatsApp text
  const helpCategories = [
    {
      title: "Complaints",
      description: "Help us improve. If something wasn't right with your pastry, coffee, or service, we'll fix it.",
      icon: AlertTriangle,
      messageText: "Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20have%20feedback/complaint%20regarding%20my%20recent%20visit."
    },
    {
      title: "Feedback",
      description: "Tell us what you loved. We love hearing about your favorite treats and memorable team members.",
      icon: Heart,
      messageText: "Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20would%20love%20to%20share%20some%20positive%20feedback!"
    },
    {
      title: "Reservations",
      description: "Book your next visit. Secure a beautiful table for brunch, afternoon tea, or special celebrations.",
      icon: CalendarDays,
      messageText: "Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20would%20like%20to%20make%20a%20table%20reservation."
    },
    {
      title: "Corporate Orders",
      description: "Large catering and corporate orders. Refined treats and customized menus for office events and gifts.",
      icon: Briefcase,
      messageText: "Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20want%20to%20inquire%20about%20corporate/catering%20orders."
    },
    {
      title: "Partnerships",
      description: "Collaborations, media, and marketing inquiries. Connect with our curation team.",
      icon: Handshake,
      messageText: "Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20am%20interested%20in%20a%20collaboration%20or%20business%20partnership."
    },
    {
      title: "General Questions",
      description: "Curious about our ingredients, bakeries, or menu items? We are always happy to help.",
      icon: HelpCircle,
      messageText: "Hello%20IZ%20P%C3%A2tisserie%20%26%20Caf%C3%A9,%20I%20have%20a%20general%20question."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-charcoal min-h-screen relative overflow-hidden font-sans pb-16">
      
      {/* SECTION 1 — EDITORIAL HERO */}
      <section className="relative pt-32 pb-32 md:pt-40 md:pb-40 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            CUSTOMER CARE
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight mb-8">
            We're Here to <span className="italic font-light text-mocha">Help</span>
          </h1>
          <p className="text-charcoal/70 text-sm md:text-base font-light tracking-wide max-w-lg leading-relaxed">
            Whether you have feedback, a complaint, a question, or simply want to connect, our team is ready to assist you.
          </p>
        </motion.div>
      </section>

      {/* OPTIONAL DIVIDER */}
      <div className="flex items-center justify-center max-w-7xl mx-auto px-6 md:px-12 opacity-20 select-none mb-16">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-gold" />
        <div className="mx-4 text-gold text-xs">✦</div>
        <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-gold" />
      </div>

      {/* SECTION 2 — CUSTOMER SUPPORT */}
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
              Customer Care
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight">
              Your Experience <br />
              <span className="italic text-mocha font-light">Matters to Us</span>
            </h2>
            <div className="w-20 h-[2px] bg-gold my-6" />
            <p className="text-charcoal/80 font-light text-base md:text-lg leading-relaxed">
              If something wasn't right during your visit, we'd love the opportunity to make it right.
            </p>
            <p className="text-charcoal/60 font-light text-sm md:text-base leading-relaxed">
              For quick support, complaints, or feedback, simply message us on WhatsApp. Our customer success curators monitor threads to assist you as rapidly as possible.
            </p>
          </motion.div>

          <motion.div
            {...anim({
              initial: { opacity: 0, scale: 0.96 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            })}
            className="bg-white border border-[#c6a75e]/20 rounded-[2.5rem] p-8 md:p-12 shadow-soft hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Background design accents */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
              <WhatsAppIcon className="w-10 h-10" />
            </div>
            
            <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
              Chat with Customer Support
            </h3>
            <p className="text-charcoal/50 text-sm font-light max-w-sm mb-8">
              Our support team typically replies within business hours. Drop us a text and we will review immediately.
            </p>
            
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold tracking-widest uppercase rounded-full shadow-md transition-all duration-300 w-full sm:w-auto"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — HOW CAN WE HELP? */}
      <section className="py-24 md:py-32 bg-cream/30 border-t border-cream/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
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
              Inquiry Categories
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">
              How Can We <span className="italic text-mocha font-light">Help?</span>
            </h2>
            <p className="text-charcoal/60 font-light mt-4 text-base">
              Select a category below to start a conversation directly via WhatsApp.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {helpCategories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <motion.div
                  key={idx}
                  {...anim({
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-100px" },
                    transition: { delay: idx * 0.1, duration: 0.8 }
                  })}
                  className="bg-white border border-[#c6a75e]/15 hover:border-[#c6a75e]/40 rounded-[2rem] p-8 shadow-soft hover:shadow-lg transition-all duration-500 flex flex-col group h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#c6a75e]/25 text-[#c6a75e] flex items-center justify-center mb-6 group-hover:bg-[#c6a75e] group-hover:text-cream transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl mb-3 text-charcoal">
                    {cat.title}
                  </h3>
                  <p className="text-charcoal/60 font-light text-sm leading-relaxed mb-8 flex-grow">
                    {cat.description}
                  </p>
                  <div className="pt-4 border-t border-charcoal/5 flex items-center justify-between">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${cat.messageText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mocha group-hover:text-gold transition-colors duration-300"
                    >
                      <span>Contact Us</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* SECTION 5 — BUSINESS HOURS */}
      <section className="py-24 bg-cream/30 border-t border-b border-cream/80">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            {...anim({
              initial: { opacity: 0, scale: 0.97 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            })}
            className="bg-white border border-[#c6a75e]/20 rounded-[2.5rem] p-8 md:p-12 shadow-soft text-center space-y-6"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">
              Operational Schedule
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              Business Hours
            </h2>
            <div className="w-16 h-[1px] bg-gold/50 mx-auto my-2" />
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex justify-between items-center text-sm md:text-base border-b border-charcoal/5 pb-2">
                <span className="font-medium text-charcoal">Monday – Sunday</span>
                <span className="font-mono text-mocha font-semibold">08:00 AM – 11:30 PM</span>
              </div>
              <div className="text-xs text-charcoal/40 font-light italic leading-relaxed pt-2">
                * Note: Opening and closing schedules may vary slightly on national holidays. Live updates are posted on our Instagram/Facebook pages.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — FOLLOW US */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          {...anim({
            initial: { opacity: 0, y: 15 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.8 }
          })}
          className="space-y-8 flex flex-col items-center"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">
            Social Sanctuary
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            Follow Our Journey
          </h2>
          
          <div className="flex gap-6 justify-center pt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-[#c6a75e]/20 text-[#c6a75e] hover:bg-[#c6a75e] hover:text-cream rounded-full flex items-center justify-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-[#c6a75e]/20 text-[#c6a75e] hover:bg-[#c6a75e] hover:text-cream rounded-full flex items-center justify-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-[#c6a75e]/20 text-[#c6a75e] hover:bg-[#c6a75e] hover:text-cream rounded-full flex items-center justify-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-[#c6a75e]/20 text-[#c6a75e] hover:bg-[#c6a75e] hover:text-cream rounded-full flex items-center justify-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* SECTION 7 — CONTACT DETAILS */}
      <section className="py-24 bg-charcoal text-cream relative">
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Phone className="w-4 h-4" />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">Call Support</h4>
              <p className="font-mono text-sm font-semibold">+880 13 2973 1723</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <WhatsAppIcon className="w-4 h-4" />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">WhatsApp Direct</h4>
              <p className="font-mono text-sm font-semibold">+880 13 2973 1723</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">Email Inbox</h4>
              <p className="text-sm font-medium">support@izcafe.com</p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">Website</h4>
              <p className="text-sm font-medium">www.izcafe.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CUSTOMER PROMISE */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          {...anim({
            initial: { opacity: 0, y: 15 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.8 }
          })}
          className="flex flex-col items-center gap-6"
        >
          <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          <blockquote className="font-serif text-2xl md:text-3xl text-charcoal leading-relaxed italic max-w-2xl">
            "We believe every conversation is an opportunity to serve with Caffeine and Kindness."
          </blockquote>
          <div className="h-[1px] w-20 bg-gold/50 my-1" />
          <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-bold">
            The Customer Success Promise
          </span>
        </motion.div>
      </section>

      {/* SECTION 9 — FLOATING WHATSAPP BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-[9990]"
      >
        <a
          href={DEFAULT_PREFILLED_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:shadow-[0_8px_30px_rgba(34,197,94,0.6)] hover:scale-108 active:scale-95 transition-all duration-300 group"
          title="Chat on WhatsApp"
        >
          <WhatsAppIcon className="w-8 h-8 group-hover:rotate-6 transition-transform" />
        </a>
      </motion.div>

    </div>
  );
}

export default function Contact() {
  return (
    <ErrorBoundary>
      <ContactContent />
    </ErrorBoundary>
  );
}
