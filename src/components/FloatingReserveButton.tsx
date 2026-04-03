import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FloatingReserveButton() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Hide on admin routes
  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <Link
            to="/#reservation"
            className="flex items-center gap-2.5 bg-mocha text-cream px-5 py-3 rounded-full shadow-2xl shadow-charcoal/20 border border-cream/10 backdrop-blur-md group transition-all duration-300"
          >
            <div className="bg-gold p-1.5 rounded-full text-black group-hover:rotate-12 transition-transform duration-300">
              <Calendar size={15} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
              Reserve
            </span>
            
            {/* Subtle gloss effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
