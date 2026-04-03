import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function BrandStory() {
  return (
    <section
      id="story"
      className="py-24 md:py-40 bg-beige text-charcoal relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-mocha/20">
              <img
                src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=1200&auto=format&fit=crop"
                alt="Interior of IZ Patisserie"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute -bottom-10 -right-10 w-2/3 aspect-square rounded-2xl overflow-hidden border-8 border-beige hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop"
                alt="Latte art close up"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
                Our Story
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-8 leading-tight">
                Where the bustle of Dhaka fades into the aroma of IZ.{" "}
                <span className="italic font-light text-mocha">Dhaka.</span>
              </h2>
              <div className="space-y-6 text-charcoal/80 font-light text-lg leading-relaxed">
                <p>
                 We started small, fueled by a single vision: to turn "everyday" into "extraordinary." We spent countless hours sourcing the finest beans and perfecting the delicate crumb of our pastries. But more importantly, we focused on the atmosphere. We wanted a space where a student could find focus, a family could find joy, and a stranger could find a smile.
                </p>
                <p>
                  In the bustling streets of Pallabi, Mirpur, there was a missing piece—a place that didn't just serve people, but welcomed them. IZ Pâtisserie & Café was born from the idea that a neighborhood deserves a sanctuary where the air is heavy with the scent of roasted beans and the warmth of fresh pastry.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1 }}
                className="mt-12 pt-12 border-t border-charcoal/10"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-mocha/20">
                    <img
                      src="https://images.unsplash.com/photo-1583338917451-face2751d8d5?q=80&w=400&auto=format&fit=crop"
                      alt="Head Baker"
                      className="w-full h-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-xl text-charcoal">
                      Ibrahim Z.
                    </p>
                    <p className="text-sm tracking-widest uppercase text-charcoal/60 font-semibold">
                      Founder & Head Baker
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    to="/our-story"
                    className="group flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-mocha hover:text-charcoal transition-colors"
                  >
                    Read Our Full Story
                    <span className="block w-8 h-[1px] bg-mocha group-hover:bg-charcoal group-hover:w-12 transition-all duration-300" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
