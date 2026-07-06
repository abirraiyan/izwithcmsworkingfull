import { motion } from "motion/react";
import { useState, useEffect, ReactNode, Component, ErrorInfo } from "react";
import { 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Briefcase, 
  Handshake, 
  HelpCircle, 
  MessageSquare, 
  MessageCircle,
  AlertTriangle, 
  Heart, 
  Instagram, 
  Facebook, 
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
      icon: Calendar,
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
              <MessageCircle size={32} strokeWidth={1.5} />
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
              <MessageCircle size={20} strokeWidth={1.5} />
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
                    <IconComponent size={24} strokeWidth={1.5} />
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
              href="https://www.instagram.com/izpatisserieandcafe/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-[#c6a75e]/20 text-[#c6a75e] hover:bg-[#c6a75e] hover:text-cream rounded-full flex items-center justify-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={22} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.facebook.com/IZPatisserieandCafe"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white border border-[#c6a75e]/20 text-[#c6a75e] hover:bg-[#c6a75e] hover:text-cream rounded-full flex items-center justify-center shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook size={22} strokeWidth={1.5} />
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
                <Phone size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">Call Support</h4>
              <p className="font-mono text-sm font-semibold">+880 13 2973 1723</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <MessageCircle size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">WhatsApp Direct</h4>
              <p className="font-mono text-sm font-semibold">+880 13 2973 1723</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-cream/40 font-bold">Email Inbox</h4>
              <p className="text-sm font-medium">info@iz.cafe</p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/10 text-gold rounded-full flex items-center justify-center mx-auto md:mx-0">
                <Globe size={20} strokeWidth={1.5} />
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
          <MessageCircle size={24} strokeWidth={1.5} className="group-hover:rotate-6 transition-transform" />
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
