import { motion } from "motion/react";

export default function OurStory() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream text-charcoal min-h-screen pt-24"
    >
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop"
            alt="Bakery background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block"
          >
            Since 2020
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-cream mb-6"
          >
            Our <span className="italic font-light">Story</span>
          </motion.h1>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-8">
              A Journey of <span className="italic text-mocha">Passion</span>
            </h2>
            <div className="space-y-6 text-charcoal/80 font-light text-lg leading-relaxed">
              <p>
                In Pallabi, Mirpur, the journey of <strong>IZ Pâtisserie & Café</strong> began with a single vision to create more than just a café, but a place people feel drawn back to.
              </p>
              <p>
                What started as a humble beginning quickly became the foundation for something deeper: a space built on quality, warmth, and thoughtful hospitality. A place where comfort meets connection, and everyday indulgence feels effortless.
              </p>
              <p>
                From carefully crafted coffee to refined pastries and heartfelt service, every experience at IZ is designed with intention. As we continue to grow, we remain rooted in what matters most: our signature promise of Caffeine & Kindness.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop"
              alt="Baker preparing dough"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 md:py-32 bg-charcoal text-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              The Art of <span className="italic text-beige">Baking</span>
            </h2>
            <p className="max-w-2xl mx-auto text-cream/70 font-light text-lg">
              We believe that true luxury lies in the uncompromising quality of ingredients and the meticulous attention to detail in our process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Premium Ingredients",
                desc: "Sourced globally and locally, we use only the finest butter, flour, and chocolate to create our signature flavors.",
                img: "https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "Time-Honored Techniques",
                desc: "Our pastries undergo a rigorous lamination process, taking up to 72 hours to achieve the perfect flaky texture.",
                img: "https://images.unsplash.com/photo-1586195831800-24b0ce09f744?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "Baked Fresh Daily",
                desc: "We bake in small batches throughout the day to ensure you always experience our creations at their absolute best.",
                img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-full aspect-square rounded-full overflow-hidden mb-8 border-4 border-mocha/30">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-serif text-2xl mb-4">{item.title}</h3>
                <p className="text-cream/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
