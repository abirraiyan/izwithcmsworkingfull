import { motion } from "motion/react";
import { Phone, MapPin, Clock, Navigation } from "lucide-react";

export default function ReservationContact() {
  return (
    <section
      id="reservation"
      className="py-24 md:py-40 bg-charcoal text-cream relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 xl:gap-24">
          {/* Contact Info (Left Side) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
              Visit Us
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-8 leading-tight">
              Reserve your <br />
              <span className="italic font-light text-beige">Experience</span>
            </h2>
            <p className="text-cream/70 text-lg font-light mb-12">
              Weekend tables fill fast — reserve early to ensure your spot at
              our premier patisseries or drop by for a spontaneous treat.
            </p>
          </motion.div>

          {/* Branch Cards (Right Side) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8"
          >
            {/* Card 1: Gulshan */}
            <div className="bg-cream rounded-2xl p-6 xl:p-8 text-charcoal shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" 
                  alt="Gulshan Branch" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-xl xl:text-2xl font-bold mb-6">IZ Patisserie & Cafe – Gulshan</h3>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-mocha shrink-0 mt-0.5" />
                  <p className="text-charcoal/80 font-light text-sm">
                    House - 11/A, Apartment - 1/B, Road No. 48, Dhaka 1212
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-mocha shrink-0 mt-0.5" />
                  <p className="text-charcoal/80 font-light text-sm">
                    Monday – Sunday<br />8:00 AM – 11:00 PM
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-mocha shrink-0 mt-0.5" />
                  <p className="text-charcoal/80 font-light text-sm">
                    +880 123 456 7890
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=QCV6%2BHW+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-cream text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-mocha transition-colors duration-300 mt-auto"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>

            {/* Card 2: Mirpur */}
            <div className="bg-cream rounded-2xl p-6 xl:p-8 text-charcoal shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=800&auto=format&fit=crop" 
                  alt="Mirpur Branch" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif text-xl xl:text-2xl font-bold mb-6">IZ Patisserie & Cafe – Mirpur</h3>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-mocha shrink-0 mt-0.5" />
                  <p className="text-charcoal/80 font-light text-sm">
                    B.A, House #45 Rd No. 7, Dhaka 1216
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-mocha shrink-0 mt-0.5" />
                  <p className="text-charcoal/80 font-light text-sm">
                    Monday – Sunday<br />8:00 AM – 11:00 PM
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-mocha shrink-0 mt-0.5" />
                  <p className="text-charcoal/80 font-light text-sm">
                    +880 123 456 7890
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=R9G7%2BWQ+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-cream text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-mocha transition-colors duration-300 mt-auto"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
