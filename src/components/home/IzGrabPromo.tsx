import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface IzGrabPromoProps {
  url: string;
}

export default function IzGrabPromo({ url }: IzGrabPromoProps) {
  return (
    <section className="py-16 bg-cream text-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-[#1a1a1a] text-white border border-[#3a3a3a] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
          
          <div className="relative z-10 text-center lg:text-left space-y-4 max-w-xl">
            <span className="text-gold uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold block">
              IZ Delivery Ecosystem
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream leading-tight">
              Order Online via <span className="italic font-light text-gold block sm:inline">IZ Grab</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
              Indulge in our signature pastries, artisanal cakes, and premium coffee from the comfort of your home. Fast, secure, and fresh delivery across Dhaka.
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0 w-full lg:w-auto text-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold hover:bg-cream text-black font-bold tracking-widest uppercase rounded-full shadow-lg hover:scale-105 hover:shadow-gold/10 active:scale-95 transition-all duration-300 w-full sm:w-auto"
            >
              <ShoppingBag size={18} />
              <span>Order Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
