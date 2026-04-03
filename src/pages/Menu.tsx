import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getMenuItems, getCategories, getImageUrl } from "../lib/supabase";
import { Category, MenuItem } from "../types";

export default function Menu() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching menu data...");
        const [itemsData, categoriesData] = await Promise.all([
          getMenuItems(true),
          getCategories()
        ]);
        
        // These logs were requested specifically
        console.log("MENU DATA:", itemsData);
        console.log("Categories Fetched:", categoriesData.length, categoriesData);
        
        setMenuItems(itemsData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.log("ERROR:", err);
        console.error("Failed to fetch menu", err);
        setError(err.message || "Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const mainCategories = useMemo(() => {
    return categories.filter(c => !c.parent_id);
  }, [categories]);

  const subcategories = useMemo(() => {
    return categories.filter(c => c.parent_id);
  }, [categories]);

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return mainCategories.find(c => c.id === selectedCategoryId);
  }, [selectedCategoryId, mainCategories]);

  const activeSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter(s => s.parent_id === selectedCategory.id);
  }, [selectedCategory, subcategories]);

  const parentItems = useMemo(() => {
    if (!selectedCategory) return [];
    return menuItems.filter(item => item.category_id === selectedCategory.id);
  }, [selectedCategory, menuItems]);

  console.log("Selected Category ID:", selectedCategoryId);
  console.log("Active Subcategories:", activeSubcategories.length);
  console.log("Parent Items:", parentItems.length);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:pt-40 md:pb-32 bg-cream text-charcoal min-h-screen"
    >
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
            The <span className="italic font-light text-mocha">Menu</span>
          </h1>
          <p className="text-charcoal/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Artisanal pastries and specialty coffee crafted daily.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16">
          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`text-sm tracking-widest uppercase transition-colors duration-300 relative pb-2 ${
              selectedCategoryId === "all"
                ? "text-mocha font-semibold"
                : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            All
            {selectedCategoryId === "all" && (
              <motion.div
                layoutId="menuActiveTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`text-sm tracking-widest uppercase transition-colors duration-300 relative pb-2 ${
                selectedCategoryId === category.id
                  ? "text-mocha font-semibold"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {category.name}
              {selectedCategoryId === category.id && (
                <motion.div
                  layoutId="menuActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Menu Items Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mocha"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-mocha text-white rounded-full text-sm hover:bg-mocha/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-24"
              >
                {selectedCategoryId === "all" ? (
                  menuItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                      {menuItems.map((item, index) => (
                        <div key={item.id}>
                          <MenuItemCard item={item} index={index} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-charcoal/40 italic">No menu items found.</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-24">
                    {/* Items directly in the parent category */}
                    {parentItems.length > 0 && (
                      <div className="space-y-10">
                        <div className="flex items-center gap-6">
                          <h2 className="font-serif text-3xl md:text-4xl text-mocha italic font-light">
                            General
                          </h2>
                          <div className="h-[1px] flex-1 bg-charcoal/10" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                          {parentItems.map((item, index) => (
                            <div key={item.id}>
                              <MenuItemCard item={item} index={index} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items in subcategories */}
                    {activeSubcategories.length > 0 ? (
                      activeSubcategories.map((sub) => {
                        const subItems = menuItems.filter(item => item.category_id === sub.id);
                        if (subItems.length === 0) return null;
                        
                        return (
                          <div key={sub.id} className="space-y-10">
                            <div className="flex items-center gap-6">
                              <h2 className="font-serif text-3xl md:text-4xl text-mocha italic font-light">
                                {sub.name}
                              </h2>
                              <div className="h-[1px] flex-1 bg-charcoal/10" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                              {subItems.map((item, index) => (
                                <div key={item.id}>
                                  <MenuItemCard item={item} index={index} />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      parentItems.length === 0 && (
                        <div className="text-center py-20">
                          <p className="text-charcoal/40 italic">No items found for this category.</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </motion.main>
  );
}

function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  console.log("IMAGE URL:", getImageUrl(item.image_url, "menu-images"));
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-beige shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img
          src={getImageUrl(item.image_url, "menu-images")}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>
      
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="font-serif text-lg font-medium text-charcoal group-hover:text-mocha transition-colors line-clamp-1">
          {item.name}
        </h3>
        
        <div className="mt-2 space-y-1">
          {item.variants && item.variants.length > 0 ? (
            item.variants.map((v) => (
              <p key={v.id} className="font-mono text-xs font-medium text-mocha">
                {v.name} — ৳{v.price.toFixed(2)}
              </p>
            ))
          ) : (
            <p className="font-mono text-sm font-medium text-mocha">
              ৳{item.price?.toFixed(2) || '0.00'}
            </p>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-charcoal/50 font-light line-clamp-2 leading-relaxed mt-2">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
