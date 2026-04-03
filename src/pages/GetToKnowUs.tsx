import { motion } from "motion/react";
import { Heart, Coffee, Star, Users } from "lucide-react";

export default function GetToKnowUs() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream text-charcoal min-h-screen pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            Philosophy
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
            Get to Know <span className="italic font-light text-mocha">Us</span>
          </h1>
          <p className="text-charcoal/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
            We are more than a bakery; we are a community of passionate individuals dedicated to creating memorable experiences.
          </p>
        </motion.div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            {
              icon: <Heart className="w-8 h-8 text-mocha" />,
              title: "Passion Driven",
              desc: "Everything we do is fueled by a genuine love for baking and hospitality."
            },
            {
              icon: <Star className="w-8 h-8 text-mocha" />,
              title: "Uncompromising Quality",
              desc: "We never cut corners when it comes to the ingredients we use."
            },
            {
              icon: <Coffee className="w-8 h-8 text-mocha" />,
              title: "Artisanal Approach",
              desc: "Handcrafted daily, ensuring each piece is unique and perfect."
            },
            {
              icon: <Users className="w-8 h-8 text-mocha" />,
              title: "Community First",
              desc: "Creating a welcoming space for everyone to gather and connect."
            }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="font-serif text-xl font-medium mb-4">{value.title}</h3>
              <p className="text-charcoal/60 font-light text-sm leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <div className="bg-charcoal text-cream rounded-[2rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
              alt="Background pattern"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-8">
                Meet the <span className="italic text-beige">Founders</span>
              </h2>
              <div className="space-y-6 text-cream/80 font-light text-lg leading-relaxed">
                <p>
                  IZ Patisserie was founded by a team of culinary enthusiasts who shared a vision of bringing world-class pastries to our local community.
                </p>
                <p>
                  With backgrounds spanning from traditional French culinary schools to modern specialty coffee roasteries, our founders combined their expertise to create a unique destination.
                </p>
                <p>
                  "We wanted to build a place where people could slow down, savor the moment, and enjoy the simple luxury of a perfectly crafted croissant and a beautiful cup of coffee."
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-12">
                <img
                  src="https://images.unsplash.com/photo-1583338917451-face2751d8d5?q=80&w=600&auto=format&fit=crop"
                  alt="Founder 1"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop"
                  alt="Founder 2"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
