import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0 bg-charcoal overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/Dg9tw8p_fn0?autoplay=1&mute=1&loop=1&playlist=Dg9tw8p_fn0&controls=0&showinfo=0&rel=0&playsinline=1&disablekb=1"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[177.77vw] min-w-[56.25vh] min-h-[100vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-[1.15]"
          title="Coffee pouring"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-6"
          >
            IZ PATISSERIE & CAFE, Dhaka
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.1] mb-8 text-balance"
          >
            Your Cozy Pastry <br className="hidden md:block" />
            <span className="italic font-light">& Coffee Escape</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link
              to="/menu"
              className="px-8 py-4 bg-cream text-charcoal text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-beige transition-colors duration-300 w-full sm:w-auto text-center"
            >
              View Menu
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-cream/60 text-xs uppercase tracking-widest mb-2">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-cream/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
