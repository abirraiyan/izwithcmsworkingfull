import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
];

export default function Gallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      id="gallery"
      className="py-24 md:py-40 bg-charcoal text-cream overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            Instagram
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-8">
            Life at{" "}
            <span className="italic font-light text-beige">IZ Patisserie</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/gallery"
              className="inline-block px-8 py-4 bg-cream text-charcoal text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-beige transition-colors duration-300"
            >
              View Full Gallery
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-transparent border border-cream/30 text-cream text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-cream hover:text-charcoal transition-colors duration-300"
            >
              Follow @izpatisserie
            </a>
          </div>
        </motion.div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-[800px] md:h-[1000px] overflow-hidden -mx-6 md:mx-0 px-6 md:px-0"
        >
          {/* Column 1 */}
          <motion.div
            style={{ y: y1 }}
            className="flex flex-col gap-6 md:gap-8 mt-12 md:mt-24"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src={images[0]}
                alt="Gallery 1"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src={images[1]}
                alt="Gallery 2"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            style={{ y: y2 }}
            className="flex flex-col gap-6 md:gap-8 -mt-24 md:-mt-48"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src={images[2]}
                alt="Gallery 3"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src={images[3]}
                alt="Gallery 4"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
          </motion.div>

          {/* Column 3 */}
          <motion.div
            style={{ y: y3 }}
            className="flex flex-col gap-6 md:gap-8 mt-0 md:mt-12 hidden md:flex"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src={images[4]}
                alt="Gallery 5"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src={images[5]}
                alt="Gallery 6"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
