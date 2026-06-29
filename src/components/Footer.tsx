import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { getNavigationSettings } from "../lib/site/getNavigationSettings";

export default function Footer() {
  const [izGrabUrl, setIzGrabUrl] = useState("https://grab.izcafe.com");

  useEffect(() => {
    const loadNav = async () => {
      try {
        const data = await getNavigationSettings();
        const grabItem = data.find(item => item.id === 'iz-grab');
        if (grabItem?.href) {
          setIzGrabUrl(grabItem.href);
        }
      } catch (err) {
        console.warn("Failed to load footer nav url:", err);
      }
    };
    loadNav();
  }, []);

  return (
    <footer className="bg-charcoal text-cream py-16 border-t border-cream/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Brand & Copyright */}
          <div className="text-left">
            <Link
              to="/"
              className="flex items-center font-serif text-3xl tracking-wider font-semibold text-cream mb-4"
            >
              <img
                src="/logo-icon.png"
                alt="IZ Patisserie & Cafe Logo"
                className="h-9 w-auto logo-white"
              />
            </Link>
            <div className="space-y-2">
              <p className="text-cream/50 text-xs font-light uppercase tracking-widest">
                &copy; {new Date().getFullYear()} IZ Patisserie & Cafe. All rights
                reserved.
              </p>
              <p className="text-cream/50 text-xs font-light uppercase tracking-widest">
                Email:
              </p>
              <p className="text-cream/30 text-[10px] font-medium uppercase tracking-[0.2em]">
                Built by <a href="https://xceptionist.com/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors duration-300">Xceptionist</a>
              </p>
            </div>
          </div>

          {/* Social & Delivery Links */}
          <div className="flex flex-wrap gap-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-gold transition-all duration-300 text-[11px] tracking-[0.3em] uppercase font-bold"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-gold transition-all duration-300 text-[11px] tracking-[0.3em] uppercase font-bold"
            >
              Facebook
            </a>
            <a
              href={izGrabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c6a75e] hover:text-white transition-all duration-300 text-[11px] tracking-[0.3em] uppercase font-bold border-b border-[#c6a75e]/30 pb-0.5 hover:border-white"
            >
              <span className="brand-script normal-case tracking-normal">IZ Grab</span> Delivery
            </a>
          </div>
        </div>

        {/* Subtle Admin Link */}
        <Link
          to="/admin"
          className="absolute bottom-6 right-6 text-cream/10 hover:text-gold hover:scale-110 transition-all duration-500 group"
          aria-label="Admin Dashboard"
        >
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>
      </div>
    </footer>
  );
}

