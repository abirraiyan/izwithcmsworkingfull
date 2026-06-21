import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { getFeaturedMenuItems } from "../lib/supabase";
import { getImageUrl } from "../lib/image";
import { MenuItem } from "../types";

export default function SignatureProducts() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFeaturedMenuItems(4);
        setProducts(data as any);
      } catch (error) {
        console.error("Error fetching signature products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="menu" className="py-24 md:py-32 bg-cream text-charcoal">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="h-12 w-64 bg-charcoal/10 rounded-lg animate-pulse mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-charcoal/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 md:py-32 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
              Signature{" "}
              <span className="italic font-light text-mocha">Creations</span>
            </h2>
            <p className="text-charcoal/70 max-w-md text-lg font-light">
              Crafted daily with premium ingredients, our signature items are
              the heart of IZ Patisserie.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link
              to="/menu"
              className="group flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-mocha hover:text-charcoal transition-colors"
            >
              View Full Menu
              <span className="block w-8 h-[1px] bg-mocha group-hover:bg-charcoal group-hover:w-12 transition-all duration-300" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-beige">
                <img
                  src={getImageUrl(product.image_url)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-serif text-xl font-medium leading-tight group-hover:text-mocha transition-colors">
                  {product.name}
                </h3>
                <span className="font-mono text-sm font-medium text-charcoal/60 whitespace-nowrap">
                  ৳ {product.price || 0}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
